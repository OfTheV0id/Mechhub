import { MutableRefObject } from "react";
import { QueryClient } from "@tanstack/react-query";
import { AIService } from "../../../services/ai/AIService";
import { Message, SubmitMessage } from "../../../types/message";
import { ChatSession } from "../../../types/session";
import {
    findChatById,
    prependChatSession,
    removeChatSession,
    setChatTitleGenerating,
    updateChatMessages,
    updateChatTitle,
} from "../lib/chatCache";
import { ChatMode } from "../types/chat";
import { useChatGenerationState } from "./useChatGenerationState";

interface UseChatMessagingParams {
    chatMode: ChatMode;
    currentSessionId: string | null;
    currentSessionIdRef: MutableRefObject<string | null>;
    setCurrentSessionId: (id: string | null) => void;
    queryClient: QueryClient;
    saveChat: (payload: {
        id: string;
        messages: Message[];
        title: string;
    }) => Promise<unknown>;
    generateTitle: (messages: Message[]) => Promise<string>;
}

export const useChatMessaging = ({
    chatMode,
    currentSessionId,
    currentSessionIdRef,
    setCurrentSessionId,
    queryClient,
    saveChat,
    generateTitle,
}: UseChatMessagingParams) => {
    const {
        typingSessionIds,
        setSessionTyping,
        registerAbortController,
        getAbortController,
        canSubmit,
        markSubmitting,
        resetSubmissionState,
        clearNewChatSubmitting,
    } = useChatGenerationState();

    const isMessageEmpty = ({
        text,
        imageUrls,
        fileAttachments,
    }: SubmitMessage) => {
        return (
            !text.trim() &&
            (!imageUrls || imageUrls.length === 0) &&
            (!fileAttachments || fileAttachments.length === 0)
        );
    };

    const createUserMessage = (submitMessage: SubmitMessage): Message => ({
        ...submitMessage,
        id: Date.now().toString(),
        role: "user",
        type: "text",
        createdAt: new Date().toISOString(),
    });

    const prepareActiveSession = (newMessage: Message, text: string) => {
        const chatTitle = text.slice(0, 15) || "新对话";
        const isNewChat = !currentSessionId;

        if (isNewChat) {
            const tempId = crypto.randomUUID();
            const newSession: ChatSession = {
                id: tempId,
                title: chatTitle,
                messages: [newMessage],
                updatedAt: Date.now(),
                isGeneratingTitle: true,
            };

            setCurrentSessionId(tempId);
            prependChatSession(queryClient, newSession);
            setSessionTyping(tempId, true);

            return {
                activeId: tempId,
                isNewChat: true,
                chatTitle,
            };
        }

        updateChatMessages(queryClient, currentSessionId, (msgs) => [
            ...msgs,
            newMessage,
        ]);
        setSessionTyping(currentSessionId, true);

        return {
            activeId: currentSessionId,
            isNewChat: false,
            chatTitle,
        };
    };

    const runStudyMessage = async (
        activeId: string,
        submitMessage: SubmitMessage,
        signal?: AbortSignal,
    ): Promise<Message> => {
        const streamingMessageId = (Date.now() + 1).toString();
        const streamingMessage: Message = {
            id: streamingMessageId,
            role: "assistant",
            type: "text",
            text: "",
            createdAt: new Date().toISOString(),
        };

        updateChatMessages(queryClient, activeId, (msgs) => [
            ...msgs,
            streamingMessage,
        ]);

        let streamedContent = "";
        const currentSession = findChatById(queryClient, activeId);
        const currentMessagesWithUser =
            currentSession?.messages?.filter(
                (message) => message.id !== streamingMessage.id,
            ) || [];

        const response = await AIService.getResponseStream(
            {
                messages: currentMessagesWithUser,
                mode: "study",
                imageUrls: submitMessage.imageUrls,
                fileAttachments: submitMessage.fileAttachments,
            },
            (chunk) => {
                streamedContent += chunk;
                updateChatMessages(queryClient, activeId, (msgs) =>
                    msgs.map((message) =>
                        message.id === streamingMessageId
                            ? { ...message, text: streamedContent }
                            : message,
                    ),
                );
            },
            signal,
        );

        return {
            id: streamingMessageId,
            role: "assistant",
            type: "text",
            text: response.text,
            createdAt: new Date().toISOString(),
        };
    };

    const runCorrectMessage = async (
        activeId: string,
        submitMessage: SubmitMessage,
    ): Promise<Message> => {
        const processingMessageId = (Date.now() + 1).toString();
        const processingMessage: Message = {
            id: processingMessageId,
            role: "assistant",
            type: "text",
            text: "",
            createdAt: new Date().toISOString(),
        };

        updateChatMessages(queryClient, activeId, (msgs) => [
            ...msgs,
            processingMessage,
        ]);

        const currentSession = findChatById(queryClient, activeId);
        const currentMessagesWithUser = currentSession?.messages || [];

        const response = await AIService.getResponse({
            messages: currentMessagesWithUser,
            mode: "correct",
            imageUrls: submitMessage.imageUrls,
            fileAttachments: submitMessage.fileAttachments,
        });

        return {
            id: processingMessageId,
            role: "assistant",
            type: response.gradingResult ? "grading" : "text",
            text: response.text,
            gradingResult: response.gradingResult,
            createdAt: new Date().toISOString(),
        };
    };

    const applyAssistantMessage = (
        activeId: string,
        mode: ChatMode,
        aiResponse: Message,
    ) => {
        updateChatMessages(queryClient, activeId, (msgs) => {
            const hasPendingMessage = msgs.some(
                (message) => message.id === aiResponse.id,
            );

            if (mode === "study" || hasPendingMessage) {
                return msgs.map((message) =>
                    message.id === aiResponse.id ? aiResponse : message,
                );
            }

            return [...msgs, aiResponse];
        });
    };

    const persistSession = async (activeId: string, title: string) => {
        const finalSession = findChatById(queryClient, activeId);
        const finalMessages = finalSession?.messages || [];

        await saveChat({
            id: activeId,
            messages: finalMessages,
            title: finalSession?.title || title,
        });

        return finalMessages;
    };

    const generateAndPersistTitle = async (
        activeId: string,
        finalMessages: Message[],
    ) => {
        setChatTitleGenerating(queryClient, activeId, true);
        try {
            const aiGeneratedTitle = await generateTitle(finalMessages);
            updateChatTitle(queryClient, activeId, aiGeneratedTitle);

            await saveChat({
                id: activeId,
                messages: finalMessages,
                title: aiGeneratedTitle,
            });
        } catch (titleError) {
            console.error("Failed to generate AI title:", titleError);
        } finally {
            setChatTitleGenerating(queryClient, activeId, false);
        }
    };

    const handleStopGeneration = () => {
        const sessionId = currentSessionIdRef.current;
        if (!sessionId) return;

        const controller = getAbortController(sessionId);
        if (controller) {
            controller.abort();
            resetSubmissionState(sessionId, false);
            clearNewChatSubmitting();
        }
    };

    const handleSendMessage = async (
        submitMessage: SubmitMessage,
        switchToChatView?: () => void,
    ) => {
        const { text } = submitMessage;
        if (isMessageEmpty(submitMessage)) return;

        if (!canSubmit(currentSessionId, !currentSessionId)) return;
        if (switchToChatView) switchToChatView();

        const mode = chatMode;
        const newMessage = createUserMessage(submitMessage);
        const { activeId, isNewChat, chatTitle } = prepareActiveSession(
            newMessage,
            text,
        );

        if (!canSubmit(activeId, isNewChat)) return;
        markSubmitting(activeId, isNewChat);

        try {
            const controller = new AbortController();
            registerAbortController(activeId, controller);
            const aiResponse =
                mode === "study"
                    ? await runStudyMessage(
                          activeId,
                          submitMessage,
                          controller.signal,
                      )
                    : await runCorrectMessage(activeId, submitMessage);

            applyAssistantMessage(activeId, mode, aiResponse);
            resetSubmissionState(activeId, isNewChat);

            const finalMessages = await persistSession(activeId, chatTitle);
            if (isNewChat) {
                await generateAndPersistTitle(activeId, finalMessages);
            }
        } catch (error) {
            console.error("AI response failed", error);

            if (isNewChat) {
                removeChatSession(queryClient, activeId);
                setCurrentSessionId(null);
            }

            resetSubmissionState(activeId, isNewChat);
        }
    };

    return {
        typingSessionIds,
        handleSendMessage,
        handleStopGeneration,
    };
};
