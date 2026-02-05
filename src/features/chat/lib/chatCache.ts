import { QueryClient } from "@tanstack/react-query";
import { Message } from "../../../types/message";
import { ChatSession } from "../../../types/session";
import { chatKeys } from "../queries/useChatQueries";

const getChatList = (queryClient: QueryClient): ChatSession[] =>
    queryClient.getQueryData<ChatSession[]>(chatKeys.lists()) || [];

export const findChatById = (
    queryClient: QueryClient,
    sessionId: string,
): ChatSession | undefined => {
    return getChatList(queryClient).find((session) => session.id === sessionId);
};

export const prependChatSession = (
    queryClient: QueryClient,
    session: ChatSession,
) => {
    queryClient.setQueryData<ChatSession[]>(chatKeys.lists(), (old) => [
        session,
        ...(old || []),
    ]);
};

export const removeChatSession = (
    queryClient: QueryClient,
    sessionId: string,
) => {
    queryClient.setQueryData<ChatSession[]>(
        chatKeys.lists(),
        (old) => old?.filter((session) => session.id !== sessionId) || [],
    );
};

export const upsertSavedChatSession = (
    queryClient: QueryClient,
    savedChat: ChatSession,
) => {
    queryClient.setQueryData<ChatSession[]>(chatKeys.lists(), (old) => {
        if (!old) return [savedChat];

        const filtered = old.filter((session) => session.id !== savedChat.id);
        return [savedChat, ...filtered].sort(
            (a, b) => (b.updatedAt || 0) - (a.updatedAt || 0),
        );
    });
};

export const updateChatTitle = (
    queryClient: QueryClient,
    sessionId: string,
    title: string,
) => {
    queryClient.setQueryData<ChatSession[]>(
        chatKeys.lists(),
        (old) =>
            old?.map((session) =>
                session.id === sessionId ? { ...session, title } : session,
            ) || [],
    );
};

export const setChatTitleGenerating = (
    queryClient: QueryClient,
    sessionId: string,
    isGeneratingTitle: boolean,
) => {
    queryClient.setQueryData<ChatSession[]>(
        chatKeys.lists(),
        (old) =>
            old?.map((session) =>
                session.id === sessionId
                    ? { ...session, isGeneratingTitle }
                    : session,
            ) || [],
    );
};

export const updateChatMessages = (
    queryClient: QueryClient,
    sessionId: string,
    updater: (messages: Message[]) => Message[],
) => {
    queryClient.setQueryData<ChatSession[]>(chatKeys.lists(), (old) => {
        if (!old) return [];

        return old.map((session) => {
            if (session.id !== sessionId) return session;

            return {
                ...session,
                messages: updater(session.messages || []),
                updatedAt: Date.now(),
            };
        });
    });
};
