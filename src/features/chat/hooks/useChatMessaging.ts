import { MutableRefObject, useRef, useState } from "react";
import { QueryClient } from "@tanstack/react-query";
import { AIService } from "../../../services/ai/AIService";
import { Message, SubmitMessage } from "../../../types/message";
import { ChatSession } from "../../../types/session";
import {
    findChatById,
    prependChatSession,
    removeChatSession,
    updateChatMessages,
    updateChatTitle,
} from "../lib/chatCache";
import { ChatMode } from "../types/chat";

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
    const [isTyping, setIsTyping] = useState(false);
    const [generatingSessionId, setGeneratingSessionId] = useState<
        string | null
    >(null);

    const abortControllerRef = useRef<AbortController | null>(null);
    const isSubmittingRef = useRef(false);

    const resetSubmissionState = () => {
        setIsTyping(false);
        setGeneratingSessionId(null);
        abortControllerRef.current = null;
        isSubmittingRef.current = false;
    };

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
            };

            setCurrentSessionId(tempId);
            prependChatSession(queryClient, newSession);
            setGeneratingSessionId(tempId);

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
        setGeneratingSessionId(currentSessionId);

        return {
            activeId: currentSessionId,
            isNewChat: false,
            chatTitle,
        };
    };

    const runStudyMessage = async (
        activeId: string,
        submitMessage: SubmitMessage,
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
                if (activeId === currentSessionIdRef.current) {
                    updateChatMessages(queryClient, activeId, (msgs) =>
                        msgs.map((message) =>
                            message.id === streamingMessageId
                                ? { ...message, content: streamedContent }
                                : message,
                        ),
                    );
                }
            },
            abortControllerRef.current?.signal,
        );

        return {
            id: streamingMessageId,
            role: "assistant",
            type: "text",
            text: response.content,
            content: response.content,
            createdAt: new Date().toISOString(),
        };
    };

    const runCorrectMessage = async (
        activeId: string,
        submitMessage: SubmitMessage,
    ): Promise<Message> => {
        const currentSession = findChatById(queryClient, activeId);
        const currentMessagesWithUser = currentSession?.messages || [];

        const response = await AIService.getResponse({
            messages: currentMessagesWithUser,
            mode: "correct",
            imageUrls: submitMessage.imageUrls,
            fileAttachments: submitMessage.fileAttachments,
        });

        return {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            type: response.gradingResult ? "grading" : "text",
            text: response.content,
            content: response.content,
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
            if (mode === "study") {
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
        }
    };

    const handleStopGeneration = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            resetSubmissionState();
        }
    };

    const handleSendMessage = async (
        submitMessage: SubmitMessage,
        switchToChatView?: () => void,
    ) => {
        const { text } = submitMessage;
        if (isMessageEmpty(submitMessage)) return;

        if (isSubmittingRef.current) return;
        if (switchToChatView) switchToChatView();

        isSubmittingRef.current = true;
        setIsTyping(true);

        const mode = chatMode;
        const newMessage = createUserMessage(submitMessage);
        const { activeId, isNewChat, chatTitle } = prepareActiveSession(
            newMessage,
            text,
        );

        try {
            abortControllerRef.current = new AbortController();
            const aiResponse =
                mode === "study"
                    ? await runStudyMessage(activeId, submitMessage)
                    : await runCorrectMessage(activeId, submitMessage);

            applyAssistantMessage(activeId, mode, aiResponse);
            resetSubmissionState();

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

            resetSubmissionState();
        }
    };

    return {
        isTyping,
        generatingSessionId,
        handleSendMessage,
        handleStopGeneration,
    };
};
