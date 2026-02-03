import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChatService } from "../../../services/ChatService";
import { Message } from "../../../types/message";
import { AIService } from "../../../services/ai/AIService";
import {
    removeChatSession,
    updateChatTitle,
    upsertSavedChatSession,
} from "../lib/chatCache";

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
            upsertSavedChatSession(queryClient, savedChat);
        },
    });
};

export const useDeleteChat = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ChatService.deleteChat,
        onSuccess: (_, deletedId) => {
            removeChatSession(queryClient, deletedId);
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
            updateChatTitle(queryClient, id, newTitle);
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
