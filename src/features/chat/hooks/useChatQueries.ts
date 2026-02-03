import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChatService } from "../../../services/ChatService";
import { ChatSession } from "../../../types/session";
import { Message } from "../../../types/message";
import { AIService } from "../../../services/ai/AIService";

export const chatKeys = {
    all: ["chats"] as const,
    lists: () => [...chatKeys.all, "list"] as const,
    detail: (id: string) => [...chatKeys.all, "detail", id] as const,
};

export const useChats = () => {
    return useQuery({
        queryKey: chatKeys.lists(),
        queryFn: ChatService.fetchChats,
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
        onSuccess: (savedChat) => {
            queryClient.setQueryData<ChatSession[]>(chatKeys.lists(), (old) => {
                if (!old) return [savedChat];
                const filtered = old.filter((c) => c.id !== savedChat.id);
                return [savedChat, ...filtered].sort(
                    (a, b) => (b.updatedAt || 0) - (a.updatedAt || 0),
                );
            });
        },
    });
};

export const useDeleteChat = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ChatService.deleteChat,
        onSuccess: (_, deletedId) => {
            queryClient.setQueryData<ChatSession[]>(
                chatKeys.lists(),
                (old) => old?.filter((c) => c.id !== deletedId) || [],
            );
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
        onSuccess: (_, { id, newTitle }) => {
            queryClient.setQueryData<ChatSession[]>(
                chatKeys.lists(),
                (old) =>
                    old?.map((c) =>
                        c.id === id ? { ...c, title: newTitle } : c,
                    ) || [],
            );
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
