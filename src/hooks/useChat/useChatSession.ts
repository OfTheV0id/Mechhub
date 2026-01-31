import { useState, useRef, useEffect } from "react";
import type { Session } from "@supabase/supabase-js";
import { ChatSession } from "../../types/session";
import { Message, FileAttachment } from "../../types/message";
import { ChatService } from "../../services/ChatService";
import { AIService } from "../../services/ai/AIService";

const INITIAL_MESSAGES: Message[] = [];

export const useChatSession = (session: Session | null) => {
    const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
    const [isTyping, setIsTyping] = useState(false);
    const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(
        null,
    );
    const [chatMode, setChatMode] = useState<"study" | "correct">("study");
    const [generatingSessionId, setGeneratingSessionId] = useState<
        string | null
    >(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    const currentSessionIdRef = useRef<string | null>(null);
    const isSubmittingRef = useRef(false);

    useEffect(() => {
        currentSessionIdRef.current = currentSessionId;
    }, [currentSessionId]);

    const fetchChatSessions = async () => {
        if (!session) return;
        try {
            const chats = await ChatService.fetchChats();
            setChatSessions(chats);
        } catch (error) {
            console.error("Failed to fetch chats", error);
        }
    };

    const saveChatSession = async (
        id: string | null,
        msgs: Message[],
        title: string,
    ) => {
        if (!session) return id;
        try {
            const savedChat = await ChatService.saveChat(id, msgs, title);

            setChatSessions((prev) => {
                const filtered = prev.filter((c) => c.id !== savedChat.id);
                return [savedChat, ...filtered].sort(
                    (a, b) => (b.updatedAt || 0) - (a.updatedAt || 0),
                );
            });

            if (!id && !currentSessionId) {
                // If it was a new chat and we haven't switched away, update current ID
                // Note: logic handled in handleSendMessage better, but safe here too
            }
            return savedChat.id;
        } catch (error) {
            console.error("Failed to save chat", error);
        }
        return id;
    };

    const deleteChatSession = async (id: string) => {
        if (!session) return { success: false, wasCurrentSession: false };
        try {
            await ChatService.deleteChat(id);
            const wasCurrentSession = currentSessionId === id;
            setChatSessions((prev) => prev.filter((c) => c.id !== id));
            if (wasCurrentSession) {
                handleStartNewQuest();
            }
            return { success: true, wasCurrentSession };
        } catch (error) {
            console.error("Failed to delete chat", error);
        }
        return { success: false, wasCurrentSession: false };
    };

    const handleSelectSession = (id: string) => {
        const session = chatSessions.find((c) => c.id === id);
        if (session) {
            setCurrentSessionId(id);
            setMessages(session.messages || []);
            return true;
        }
        return false;
    };

    const handleStartNewQuest = () => {
        setMessages([]);
        setCurrentSessionId(null);
        setChatMode("study");
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
        text: string,
        imageUrls?: string[],
        switchToChatView?: () => void,
        fileAttachments?: FileAttachment[],
    ) => {
        if (
            !text.trim() &&
            (!imageUrls || imageUrls.length === 0) &&
            (!fileAttachments || fileAttachments.length === 0)
        )
            return;

        // Prevent duplicate submissions
        if (isSubmittingRef.current) return;

        console.log("[useChatSession] handleSendMessage received:", {
            text,
            imageUrls,
            fileAttachments,
        });

        if (switchToChatView) switchToChatView();

        isSubmittingRef.current = true;
        setIsTyping(true);

        const newMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            type: "text",
            content: text,
            imageUrls: imageUrls,
            fileAttachments: fileAttachments,
            createdAt: new Date().toISOString(),
        };

        // Update messages with functional update
        setMessages((prev) => [...prev, newMessage]);

        // Generate temporary title for new chat
        let chatTitle = text.slice(0, 15) || "新对话";

        let activeId = currentSessionId;
        const isNewChat = !activeId;

        if (isNewChat) {
            // If it's a new chat, save it to get an ID
            activeId = await saveChatSession(
                null,
                [newMessage], // Only the first message for initial save
                chatTitle,
            );
            if (activeId) {
                setCurrentSessionId(activeId);
            } else {
                console.error("Failed to get activeId for new chat.");
                setIsTyping(false);
                isSubmittingRef.current = false;
                return;
            }
        } else {
            // For existing chats, save the new user message
            if (activeId) {
                const existingChat = chatSessions.find(
                    (c) => c.id === activeId,
                );
                const currentTitle = existingChat?.title || chatTitle;

                await saveChatSession(
                    activeId,
                    [...messages, newMessage],
                    currentTitle,
                );
            }
        }

        // Set generating ID
        if (activeId) {
            setGeneratingSessionId(activeId);
        }

        // Set title generating status for new chats
        if (isNewChat && activeId) {
            setChatSessions((prev) =>
                prev.map((chat) =>
                    chat.id === activeId
                        ? { ...chat, isGeneratingTitle: true }
                        : chat,
                ),
            );
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
                    content: "",
                    createdAt: new Date().toISOString(),
                };

                // Add streaming message to display using functional update
                setMessages((prev) => [...prev, streamingMessage]);

                let streamedContent = "";

                // We need to pass the updated messages to the API
                const currentMessagesWithUser = [...messages, newMessage];

                const response = await AIService.getResponseStream(
                    {
                        messages: currentMessagesWithUser,
                        mode: chatMode,
                        imageUrls,
                        fileAttachments,
                    },
                    (chunk) => {
                        // Update streaming message content
                        streamedContent += chunk;
                        if (activeId === currentSessionIdRef.current) {
                            setMessages((prevMessages) => {
                                // Find the index of the streaming message
                                const index = prevMessages.findIndex(
                                    (m) => m.id === streamingMessageId,
                                );
                                if (index !== -1) {
                                    const newMessages = [...prevMessages];
                                    newMessages[index] = {
                                        ...newMessages[index],
                                        content: streamedContent,
                                    };
                                    return newMessages;
                                }
                                return prevMessages;
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
                const currentMessagesWithUser = [...messages, newMessage];
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

            // Update with final response using functional update
            if (activeId === currentSessionIdRef.current) {
                setMessages((prev) => {
                    if (chatMode === "study") {
                        // For streaming, replace the placeholder
                        return prev.map((m) =>
                            m.id === aiResponse.id ? aiResponse : m,
                        );
                    } else {
                        // For non-streaming, append
                        return [...prev, aiResponse];
                    }
                });
            }

            // Define finalMessages here for use in title generation
            const finalMessages = [...messages, newMessage, aiResponse];

            // Generate AI title for new chats
            if (isNewChat) {
                try {
                    const aiGeneratedTitle =
                        await AIService.generateTitle(finalMessages);

                    await saveChatSession(
                        activeId || currentSessionId,
                        finalMessages,
                        aiGeneratedTitle,
                    );

                    // Clear generating title status
                    setChatSessions((prev) =>
                        prev.map((chat) =>
                            chat.id === (activeId || currentSessionId)
                                ? { ...chat, isGeneratingTitle: false }
                                : chat,
                        ),
                    );
                } catch (titleError) {
                    console.error("Failed to generate AI title:", titleError);
                    // Save with temporary title if AI generation fails
                    await saveChatSession(
                        activeId || currentSessionId,
                        finalMessages,
                        chatTitle,
                    );

                    // Clear generating title status on error
                    setChatSessions((prev) =>
                        prev.map((chat) =>
                            chat.id === (activeId || currentSessionId)
                                ? { ...chat, isGeneratingTitle: false }
                                : chat,
                        ),
                    );
                }
            } else {
                // Preserve existing title for ongoing chats
                const existingChat = chatSessions.find(
                    (c) => c.id === (activeId || currentSessionId),
                );
                await saveChatSession(
                    activeId || currentSessionId,
                    finalMessages,
                    existingChat?.title || chatTitle,
                );
            }
        } catch (error) {
            console.error("AI response failed", error);
            setIsTyping(false);
            setGeneratingSessionId(null);
            abortControllerRef.current = null;
            isSubmittingRef.current = false;
        }
    };

    const handleRenameSession = async (id: string, newTitle: string) => {
        try {
            await ChatService.updateChatTitle(id, newTitle);

            // Update local state
            setChatSessions((prev) =>
                prev.map((chat) =>
                    chat.id === id ? { ...chat, title: newTitle } : chat,
                ),
            );

            return true;
        } catch (error) {
            console.error("Failed to rename chat", error);
            return false;
        }
    };

    return {
        messages,
        isTyping: isTyping && currentSessionId === generatingSessionId,
        chatSessions,
        currentSessionId,
        chatMode,
        setChatMode,
        fetchChatSessions,
        saveChatSession,
        deleteChatSession,
        handleSelectSession,
        handleStartNewQuest,
        handleSendMessage,
        handleRenameSession,
        handleStopGeneration,
    };
};
