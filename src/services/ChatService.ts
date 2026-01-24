import { Message } from "../types/message";
import { ChatSession } from "../types/session";
import { projectId } from "../config/supabase";

export class ChatService {
    static async fetchChats(token: string): Promise<ChatSession[]> {
        const response = await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-5abdc916/chats`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );

        if (!response.ok) {
            throw new Error("Failed to fetch chats");
        }

        const data = await response.json();
        return data.chats || [];
    }

    static async saveChat(
        token: string,
        id: string | null,
        msgs: Message[],
        title?: string,
    ): Promise<ChatSession> {
        const generatedTitle =
            title ||
            (msgs.length > 0 ? msgs[0].content.slice(0, 20) : "新对话");

        const response = await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-5abdc916/chats`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    id: id,
                    title: generatedTitle,
                    messages: msgs,
                }),
            },
        );

        if (!response.ok) {
            throw new Error("Failed to save chat");
        }

        return response.json();
    }

    static async deleteChat(token: string, id: string): Promise<void> {
        const response = await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-5abdc916/chats/${id}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );

        if (!response.ok) {
            throw new Error("Failed to delete chat");
        }
    }

    static async getAIResponse(
        messages: Message[],
        mode: "study" | "boss",
        image?: File,
    ): Promise<Message> {
        // Stimulate latency
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Mock Logic
        if (image || mode === "boss") {
            return {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                type: "grading",
                content: "批改完成。请查看下方的详细分析。",
                imageUrl:
                    "https://images.unsplash.com/photo-1727522974735-44251dfe61b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaHlzaWNzJTIwZGlhZ3JhbSUyMG1lY2hhbmljcyUyMHNrZXRjaGVzfGVufDF8fHx8MTc2ODc5NTc0OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                score: 85,
                annotations: [
                    {
                        id: "a1",
                        x: 35,
                        y: 30,
                        width: 25,
                        height: 15,
                        comment: "初速度的推导是正确的。",
                        type: "correct",
                    },
                    {
                        id: "a2",
                        x: 50,
                        y: 60,
                        width: 30,
                        height: 20,
                        comment:
                            "最后的计算有一个算术错误，请重新检查你的乘法。",
                        type: "incorrect",
                    },
                    {
                        id: "a3",
                        x: 10,
                        y: 70,
                        width: 30,
                        height: 25,
                        comment: "你在受力图中遗漏了摩擦力矢量。",
                        type: "info",
                    },
                ],
            };
        }

        return {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            type: "text",
            content:
                "单摆运动是简谐运动的一个经典例子。对于小角度摆动，周期 T 大约等于 2π√(L/g)，其中 L 是摆长，g 是重力加速度。你想和我一起推导这个公式吗？",
        };
    }
}
