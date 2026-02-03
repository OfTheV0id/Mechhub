import { useState } from "react";
import type { Session } from "@supabase/supabase-js";
import {
    useChats,
    useDeleteChat,
    useRenameChat,
} from "../queries/useChatQueries";
import { ChatMode, DeleteChatResult } from "../types/chat";

export const useChatSessions = (session: Session | null) => {
    const { data: chatSessions = [], isLoading: isLoadingSessions } =
        useChats();
    const deleteChatMutation = useDeleteChat();
    const renameChatMutation = useRenameChat();

    const [currentSessionId, setCurrentSessionId] = useState<string | null>(
        null,
    );
    const [chatMode, setChatMode] = useState<ChatMode>("study");

    const activeSession = chatSessions.find(
        (chat) => chat.id === currentSessionId,
    );
    const messages = activeSession?.messages || [];

    const handleSelectSession = (id: string) => {
        const exists = chatSessions.some((chat) => chat.id === id);
        if (!exists) return false;

        setCurrentSessionId(id);
        return true;
    };

    const handleStartNewQuest = () => {
        setCurrentSessionId(null);
        setChatMode("study");
    };

    const deleteChatSession = async (id: string): Promise<DeleteChatResult> => {
        if (!session) return { success: false, wasCurrentSession: false };

        try {
            await deleteChatMutation.mutateAsync(id);
            const wasCurrentSession = currentSessionId === id;
            if (wasCurrentSession) handleStartNewQuest();
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

    return {
        chatSessions,
        isLoadingSessions,
        currentSessionId,
        setCurrentSessionId,
        chatMode,
        setChatMode,
        messages,
        handleSelectSession,
        handleStartNewQuest,
        deleteChatSession,
        handleRenameSession,
    };
};
