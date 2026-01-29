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
        }
        setIsTyping(false);
        setGeneratingSessionId(null);
    };

    const handleSendMessage = async (
        text: string,
        imageUrls?: string[],
        switchToChatView?: () => void,
        fileAttachments?: FileAttachment[],
    ) => {
        console.log("[useChatSession] handleSendMessage received:", {
            text,
            imageUrls,
            fileAttachments,
        });
        if (switchToChatView) switchToChatView();

        const newMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            type: "text",
            content: text,
            imageUrls: imageUrls,
            fileAttachments: fileAttachments,
        };

        const updatedMessages = [...messages, newMessage];
        setMessages(updatedMessages);
        setIsTyping(true);

        // Generate temporary title for new chat
        let chatTitle = text.slice(0, 15) || "新对话";
        const isNewChat = !currentSessionId;

        const activeId = await saveChatSession(
            currentSessionId,
            updatedMessages,
            chatTitle,
        );

        // Set generating ID
        if (activeId) {
            setGeneratingSessionId(activeId);
            if (!currentSessionId) setCurrentSessionId(activeId);
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

            const response = await AIService.getResponse({
                messages: updatedMessages,
                mode: chatMode,
                imageUrls,
                fileAttachments,
            });

            const aiResponse: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                type: response.gradingResult ? "grading" : "text",
                content: response.content,
                gradingResult: response.gradingResult,
            };

            setIsTyping(false);
            setGeneratingSessionId(null);
            abortControllerRef.current = null;

            const finalMessages = [...updatedMessages, aiResponse];

            // Only update messages if we are still on the same session
            if (activeId === currentSessionIdRef.current) {
                setMessages(finalMessages);
            }

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
                    (c) => c.id === (activeId || activeId), // activeId is reliable here
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
