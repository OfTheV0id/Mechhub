import { useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import {
    useChats,
    useDeleteChat,
    useRenameChat,
} from "../queries/useChatQueries";
import { ChatMode, DeleteChatResult } from "../types/chat";

export const useChatSessions = (session: Session | null) => {
    const {
        data: chatSessions = [],
        isLoading,
        isFetching,
    } = useChats(!!session);
    const isLoadingSessions = isLoading || isFetching;
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
            const message =
                error instanceof Error ? error.message : String(error ?? "");
            const isNetworkOrCorsError =
                message.includes("Failed to fetch") ||
                message.includes("NetworkError") ||
                message.includes("CORS");
            toast.error(
                isNetworkOrCorsError
                    ? "重命名失败：网络或跨域异常（CORS）。请刷新后重试。"
                    : "重命名失败，请稍后重试。",
            );
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
