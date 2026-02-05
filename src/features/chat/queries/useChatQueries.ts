import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChatService } from "../../../services/ChatService";
import { Message } from "../../../types/message";
import { ChatSession } from "../../../types/session";
import { AIService } from "../../../services/ai/AIService";
import {
    mergeChatSessions,
    removeChatSession,
    updateChatTitle,
    upsertSavedChatSession,
} from "../lib/chatCache";

export const chatKeys = {
    all: ["chats"] as const,
    lists: () => [...chatKeys.all, "list"] as const,
    detail: (id: string) => [...chatKeys.all, "detail", id] as const,
};

export const useChats = (enabled = true) => {
    const queryClient = useQueryClient();

    return useQuery({
        queryKey: chatKeys.lists(),
        queryFn: ChatService.fetchChats,
        enabled,
        select: (remoteChats) =>
            mergeChatSessions(
                queryClient.getQueryData<ChatSession[]>(chatKeys.lists()) || [],
                remoteChats || [],
            ),
    });
};

export const useSaveChat = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            messages,
            title,
        }: {
            id: string | null;
            messages: Message[];
            title: string;
        }) => {
            return ChatService.saveChat(id, messages, title);
        },
        onSuccess: async (savedChat) => {
            upsertSavedChatSession(queryClient, savedChat);
            await queryClient.invalidateQueries({
                queryKey: chatKeys.lists(),
                refetchType: "inactive",
            });
        },
    });
};

export const useDeleteChat = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ChatService.deleteChat,
        onSuccess: async (_, deletedId) => {
            removeChatSession(queryClient, deletedId);
            await queryClient.invalidateQueries({
                queryKey: chatKeys.lists(),
            });
        },
    });
};

export const useRenameChat = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            newTitle,
        }: {
            id: string;
            newTitle: string;
        }) => {
            return ChatService.updateChatTitle(id, newTitle);
        },
        onSuccess: async (_, { id, newTitle }) => {
            updateChatTitle(queryClient, id, newTitle);
            await queryClient.invalidateQueries({
                queryKey: chatKeys.lists(),
            });
        },
    });
};

export const useGenerateTitle = () => {
    return useMutation({
        mutationFn: async (messages: Message[]) => {
            return AIService.generateTitle(messages);
        },
    });
};
