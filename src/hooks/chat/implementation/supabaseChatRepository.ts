import type { ChatRepositoryInterface } from "../interface/chatRepositoryInterface";
import { SupabaseChatService } from "./supabaseChatService";

export const createSupabaseChatRepository = (): ChatRepositoryInterface => ({
    fetchChats: () => SupabaseChatService.fetchChats(),
    saveChat: (id, messages, title) =>
        SupabaseChatService.saveChat(id, messages, title),
    updateChatTitle: (id, newTitle) =>
        SupabaseChatService.updateChatTitle(id, newTitle),
    deleteChat: (id) => SupabaseChatService.deleteChat(id),
});

