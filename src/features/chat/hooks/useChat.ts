import { useState, useRef, useEffect } from "react";
import type { Session } from "@supabase/supabase-js";
import { Message, SubmitMessage } from "../../../types/message";
import { AIService } from "../../../services/ai/AIService";
import {
    useChats,
    useSaveChat,
    useDeleteChat,
    useRenameChat,
    useGenerateTitle,
    chatKeys,
} from "./useChatQueries";
import { useQueryClient } from "@tanstack/react-query";
import { ChatSession } from "../../../types/session";

export const useChat = (session: Session | null) => {
    // Queries & Mutations
    const queryClient = useQueryClient();
    const { data: chatSessions = [], isLoading: isLoadingSessions } =
        useChats();
    const saveChatMutation = useSaveChat();
    const deleteChatMutation = useDeleteChat();
    const renameChatMutation = useRenameChat();
    const generateTitleMutation = useGenerateTitle();

    // Local UI State
    const [isTyping, setIsTyping] = useState(false);
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(
        null,
    );
    const [chatMode, setChatMode] = useState<"study" | "correct">("study");
    const [generatingSessionId, setGeneratingSessionId] = useState<
        string | null
    >(null);

    // Refs
    const abortControllerRef = useRef<AbortController | null>(null);
    const currentSessionIdRef = useRef<string | null>(null);
    const isSubmittingRef = useRef(false);

    useEffect(() => {
        currentSessionIdRef.current = currentSessionId;
    }, [currentSessionId]);

    // Derived State
    // We derive messages directly from the query cache for the current session.
    // If currentSessionId is null (New Chat), messages are empty by default.
    const activeSession = chatSessions.find((c) => c.id === currentSessionId);
    const messages = activeSession?.messages || [];

    // Helper to update messages in cache
    const updateCacheMessages = (
        sessionId: string,
        updater: (msgs: Message[]) => Message[],
    ) => {
        queryClient.setQueryData<ChatSession[]>(chatKeys.lists(), (old) => {
            if (!old) return [];
            return old.map((session) => {
                if (session.id === sessionId) {
                    return {
                        ...session,
                        messages: updater(session.messages || []),
                        updatedAt: Date.now(),
                    };
                }
                return session;
            });
        });
    };

    // Derived actions
    const handleSelectSession = (id: string) => {
        const session = chatSessions.find((c) => c.id === id);
        if (session) {
            setCurrentSessionId(id);
            return true;
        }
        return false;
    };

    const handleStartNewQuest = () => {
        setCurrentSessionId(null);
        setChatMode("study");
    };

    const deleteChatSession = async (id: string) => {
        if (!session) return { success: false, wasCurrentSession: false };
        try {
            await deleteChatMutation.mutateAsync(id);
            const wasCurrentSession = currentSessionId === id;
            if (wasCurrentSession) {
                handleStartNewQuest();
            }
            return { success: true, wasCurrentSession };
        } catch (error) {
            console.error("Failed to delete chat", error);
            return { success: false, wasCurrentSession: false };
        }
    };

    const handleRenameSession = async (id: string, newTitle: string) => {
        try {
            await renameChatMutation.mutateAsync({ id, newTitle });
            return true;
        } catch (error) {
            console.error("Failed to rename chat", error);
            return false;
        }
    };

    const handleStopGeneration = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
            setIsTyping(false);
            setGeneratingSessionId(null);
            isSubmittingRef.current = false;
        }
    };

    const handleSendMessage = async (
        submitMessage: SubmitMessage,
        switchToChatView?: () => void,
    ) => {
        const { text, imageUrls, fileAttachments } = submitMessage;
        if (
            !text.trim() &&
            (!imageUrls || imageUrls.length === 0) &&
            (!fileAttachments || fileAttachments.length === 0)
        )
            return;

        // Prevent duplicate submissions
        if (isSubmittingRef.current) return;
        // handle whether to switch to chatview
        if (switchToChatView) switchToChatView();

        isSubmittingRef.current = true;
        setIsTyping(true);

        const newMessage: Message = {
            ...submitMessage,
            id: Date.now().toString(),
            role: "user",
            type: "text",
            createdAt: new Date().toISOString(),
        };

        // Generate temporary title for new chat
        let chatTitle = text.slice(0, 15) || "新对话";
        let activeId = currentSessionId;
        const isNewChat = !activeId;

        // Optimistically update or create session
        if (isNewChat) {
            const tempId = crypto.randomUUID(); // Temporary ID for optimistic UI
            activeId = tempId;
            setCurrentSessionId(tempId);

            const newSession: ChatSession = {
                id: tempId,
                title: chatTitle,
                messages: [newMessage],
                updatedAt: Date.now(),
            };

            // Prepend new session to cache
            queryClient.setQueryData<ChatSession[]>(chatKeys.lists(), (old) => {
                return [newSession, ...(old || [])];
            });
        } else {
            // Append message to existing session
            updateCacheMessages(activeId!, (msgs) => [...msgs, newMessage]);
        }

        // Set generating ID
        if (activeId) {
            setGeneratingSessionId(activeId);
        }

        try {
            // Create new AbortController
            abortControllerRef.current = new AbortController();
            let aiResponse: Message;

            // Use streaming for study mode, non-streaming for correct mode
            if (chatMode === "study") {
                // Create a temporary streaming message
                const streamingMessageId = (Date.now() + 1).toString();
                const streamingMessage: Message = {
                    id: streamingMessageId,
                    role: "assistant",
                    type: "text",
                    text: "",
                    createdAt: new Date().toISOString(),
                };

                // Add streaming placeholder to cache
                updateCacheMessages(activeId!, (msgs) => [
                    ...msgs,
                    streamingMessage,
                ]);

                let streamedContent = "";

                const currentSession = queryClient
                    .getQueryData<ChatSession[]>(chatKeys.lists())
                    ?.find((s) => s.id === activeId);
                const currentMessagesWithUser =
                    currentSession?.messages?.filter(
                        (m) => m.id !== streamingMessage.id,
                    ) || [];

                const response = await AIService.getResponseStream(
                    {
                        messages: currentMessagesWithUser,
                        mode: chatMode,
                        imageUrls,
                        fileAttachments,
                    },
                    (chunk) => {
                        // Update streaming message content in cache
                        streamedContent += chunk;
                        if (activeId === currentSessionIdRef.current) {
                            updateCacheMessages(activeId!, (msgs) => {
                                return msgs.map((m) =>
                                    m.id === streamingMessageId
                                        ? { ...m, content: streamedContent }
                                        : m,
                                );
                            });
                        }
                    },
                    abortControllerRef.current.signal,
                );

                aiResponse = {
                    id: streamingMessageId,
                    role: "assistant",
                    type: "text",
                    content: response.content,
                    createdAt: new Date().toISOString(),
                };
            } else {
                // Use non-streaming for correct mode
                const currentSession = queryClient
                    .getQueryData<ChatSession[]>(chatKeys.lists())
                    ?.find((s) => s.id === activeId);

                const currentMessagesWithUser = currentSession?.messages || [];

                const response = await AIService.getResponse({
                    messages: currentMessagesWithUser,
                    mode: chatMode,
                    imageUrls,
                    fileAttachments,
                });

                aiResponse = {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    type: response.gradingResult ? "grading" : "text",
                    content: response.content,
                    gradingResult: response.gradingResult,
                    createdAt: new Date().toISOString(),
                };
            }

            setIsTyping(false);
            setGeneratingSessionId(null);
            abortControllerRef.current = null;
            isSubmittingRef.current = false;

            // Update with final response
            updateCacheMessages(activeId!, (msgs) => {
                if (chatMode === "study") {
                    return msgs.map((m) =>
                        m.id === aiResponse.id ? aiResponse : m,
                    );
                } else {
                    return [...msgs, aiResponse];
                }
            });

            // --- PERSISTENCE ---
            const finalSession = queryClient
                .getQueryData<ChatSession[]>(chatKeys.lists())
                ?.find((s) => s.id === activeId);
            const finalMessages = finalSession?.messages || [];

            await saveChatMutation.mutateAsync({
                id: activeId!,
                messages: finalMessages,
                title: finalSession?.title || chatTitle,
            });

            // Generate AI title for new chats
            if (isNewChat) {
                try {
                    const aiGeneratedTitle =
                        await generateTitleMutation.mutateAsync(finalMessages);

                    // Update title in cache
                    updateCacheMessages(activeId!, (msgs) => msgs);
                    queryClient.setQueryData<ChatSession[]>(
                        chatKeys.lists(),
                        (old) => {
                            return (
                                old?.map((s) =>
                                    s.id === activeId
                                        ? { ...s, title: aiGeneratedTitle }
                                        : s,
                                ) || []
                            );
                        },
                    );

                    // Save title to DB
                    await saveChatMutation.mutateAsync({
                        id: activeId!,
                        messages: finalMessages,
                        title: aiGeneratedTitle,
                    });
                } catch (titleError) {
                    console.error("Failed to generate AI title:", titleError);
                }
            }
        } catch (error) {
            console.error("AI response failed", error);

            // If new chat failed, remove the temp session
            if (isNewChat && activeId) {
                queryClient.setQueryData<ChatSession[]>(
                    chatKeys.lists(),
                    (old) => {
                        return old?.filter((s) => s.id !== activeId) || [];
                    },
                );
                setCurrentSessionId(null);
            }

            setIsTyping(false);
            setGeneratingSessionId(null);
            abortControllerRef.current = null;
            isSubmittingRef.current = false;
        }
    };

    return {
        messages,
        isTyping: isTyping && currentSessionId === generatingSessionId,
        chatSessions,
        currentSessionId,
        chatMode,
        setChatMode,
        deleteChatSession,
        handleSelectSession,
        handleStartNewQuest,
        handleSendMessage,
        handleRenameSession,
        handleStopGeneration,
        isLoadingSessions,
        fetchChatSessions: async () => {}, // No-op
    };
};
