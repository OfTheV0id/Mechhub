import { useState } from "react";
import { ChatSession } from "../../types/session";
import { Message } from "../../types/message";
import { ChatService } from "../../services/ChatService";

const INITIAL_MESSAGES: Message[] = [];

export const useChatSession = (supabase: any, userSession: any) => {
    const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
    const [isTyping, setIsTyping] = useState(false);
    const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(
        null,
    );
    const [chatMode, setChatMode] = useState<"study" | "boss">("study");

    const fetchChatSessions = async () => {
        if (!userSession) return;
        try {
            const chats = await ChatService.fetchChats(
                userSession.access_token,
            );
            setChatSessions(chats);
        } catch (error) {
            console.error("Failed to fetch chats", error);
        }
    };

    const saveChatSession = async (
        id: string | null,
        msgs: Message[],
        title?: string,
    ) => {
        if (!userSession) return id;
        try {
            const savedChat = await ChatService.saveChat(
                userSession.access_token,
                id,
                msgs,
                title,
            );

            setChatSessions((prev) => {
                const filtered = prev.filter((c) => c.id !== savedChat.id);
                return [savedChat, ...filtered].sort(
                    (a, b) => (b.updatedAt || 0) - (a.updatedAt || 0),
                );
            });

            if (!id) {
                setCurrentSessionId(savedChat.id);
            }
            return savedChat.id;
        } catch (error) {
            console.error("Failed to save chat", error);
        }
        return id;
    };

    const deleteChatSession = async (id: string) => {
        if (!userSession) return false;
        try {
            await ChatService.deleteChat(userSession.access_token, id);
            setChatSessions((prev) => prev.filter((c) => c.id !== id));
            if (currentSessionId === id) {
                handleStartNewQuest();
            }
            return true;
        } catch (error) {
            console.error("Failed to delete chat", error);
        }
        return false;
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

    const handleSendMessage = async (
        text: string,
        image?: File,
        switchToChatView?: () => void,
    ) => {
        if (switchToChatView) switchToChatView();

        const newMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            type: "text",
            content: text,
        };

        const updatedMessages = [...messages, newMessage];
        setMessages(updatedMessages);
        setIsTyping(true);

        const activeId = await saveChatSession(
            currentSessionId,
            updatedMessages,
        );

        if (!currentSessionId && activeId) {
            setCurrentSessionId(activeId);
        }

        try {
            const aiResponse = await ChatService.getAIResponse(
                updatedMessages,
                chatMode,
                image,
            );
            setIsTyping(false);

            const finalMessages = [...updatedMessages, aiResponse];
            setMessages(finalMessages);
            saveChatSession(activeId || currentSessionId, finalMessages);
        } catch (error) {
            console.error("AI response failed", error);
            setIsTyping(false);
        }
    };

    return {
        messages,
        isTyping,
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
    };
};
