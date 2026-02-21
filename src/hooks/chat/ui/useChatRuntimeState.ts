import { useEffect, useMemo, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSessionQuery } from "../../auth/public";
import { createChatMessagingUseCases } from "../interface/chatMessagingUseCases";
import { chatInterface } from "../interface/chatInterface";
import {
    useGenerateTitleMutation,
    useSaveChatMutation,
} from "../queries/useChatQueries";
import { useChatMessagingState } from "./useChatMessagingState";

interface UseChatRuntimeStateParams {
    currentSessionId: string | null;
    setCurrentSessionId: (id: string | null) => void;
}

export const useChatRuntimeState = ({
    currentSessionId,
    setCurrentSessionId,
}: UseChatRuntimeStateParams) => {
    const queryClient = useQueryClient();
    const { data: session } = useSessionQuery();
    const viewerUserId = session?.user.id ?? null;
    const saveChatMutation = useSaveChatMutation();
    const generateTitleMutation = useGenerateTitleMutation();
    const currentSessionIdRef = useRef<string | null>(null);

    const chatMessagingUseCases = useMemo(() => {
        const cache = chatInterface.createChatCachePort(
            queryClient,
            viewerUserId,
        );

        return createChatMessagingUseCases({
            cache,
            aiGateway: chatInterface.aiGateway,
        });
    }, [queryClient, viewerUserId]);

    useEffect(() => {
        currentSessionIdRef.current = currentSessionId;
    }, [currentSessionId]);

    const { typingSessionIds, handleSendMessage, handleStopGeneration } =
        useChatMessagingState({
            currentSessionId,
            currentSessionIdRef,
            setCurrentSessionId,
            chatMessagingUseCases,
            saveChat: (payload) => saveChatMutation.mutateAsync(payload),
            generateTitle: (messages) =>
                generateTitleMutation.mutateAsync(messages),
        });

    return {
        isTyping: !!currentSessionId && typingSessionIds.has(currentSessionId),
        handleSendMessage,
        handleStopGeneration,
    };
};

