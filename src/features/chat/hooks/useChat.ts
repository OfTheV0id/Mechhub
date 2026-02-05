import { useEffect, useRef } from "react";
import type { Session } from "@supabase/supabase-js";
import { useGenerateTitle, useSaveChat } from "../queries/useChatQueries";
import { useQueryClient } from "@tanstack/react-query";
import { useChatMessaging } from "./useChatMessaging";
import { useChatSessions } from "./useChatSessions";

export const useChat = (session: Session | null) => {
    const queryClient = useQueryClient();
    const saveChatMutation = useSaveChat();
    const generateTitleMutation = useGenerateTitle();

    const {
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
    } = useChatSessions(session);

    const currentSessionIdRef = useRef<string | null>(null);

    useEffect(() => {
        currentSessionIdRef.current = currentSessionId;
    }, [currentSessionId]);

    const {
        typingSessionIds,
        handleSendMessage,
        handleStopGeneration,
    } = useChatMessaging({
        chatMode,
        currentSessionId,
        currentSessionIdRef,
        setCurrentSessionId,
        queryClient,
        saveChat: (payload) => saveChatMutation.mutateAsync(payload),
        generateTitle: (messages) =>
            generateTitleMutation.mutateAsync(messages),
    });

    return {
        messages,
        isTyping:
            !!currentSessionId && typingSessionIds.has(currentSessionId),
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
    };
};
