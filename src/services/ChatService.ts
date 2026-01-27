import { Message } from "../types/message";
import { ChatSession } from "../types/session";
import { supabase } from "../lib/supabase";

export class ChatService {
    static async fetchChats(): Promise<ChatSession[]> {
        // We rely on RLS to filter chats for the current user.
        const { data, error } = await supabase
            .from("chats")
            .select("*")
            .order("updated_at", { ascending: false });

        if (error) {
            console.error("Error fetching chats:", error);
            throw new Error(error.message);
        }

        return (data || []).map((chat: any) => ({
            id: chat.id,
            title: chat.title,
            messages: chat.messages,
            updatedAt: new Date(chat.updated_at).getTime(),
        }));
    }

    static async saveChat(
        id: string | null,
        msgs: Message[],
        title?: string,
    ): Promise<ChatSession> {
        const generatedTitle =
            title ||
            (msgs.length > 0 ? msgs[0].content.slice(0, 20) : "新对话");

        // Get current user to ensure we save with correct user_id
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        // If it's a new chat (id is null), generate a UUID.
        // If it's an existing chat, use the passed id.
        const chatId = id || crypto.randomUUID();
        const now = new Date().toISOString();

        const chatData = {
            id: chatId,
            user_id: user.id,
            title: generatedTitle,
            messages: msgs,
            updated_at: now,
        };

        const { data, error } = await supabase
            .from("chats")
            .upsert(chatData)
            .select()
            .single();

        if (error) {
            console.error("Error saving chat:", error);
            throw new Error(error.message);
        }

        return {
            id: data.id,
            title: data.title,
            messages: data.messages,
            updatedAt: new Date(data.updated_at).getTime(),
        };
    }

    static async deleteChat(id: string): Promise<void> {
        const { error } = await supabase.from("chats").delete().eq("id", id);

        if (error) {
            console.error("Error deleting chat:", error);
            throw new Error(error.message);
        }
    }
}
