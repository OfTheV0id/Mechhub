import { AICompletionRequest, AICompletionResponse } from "./types";
import { supabase } from "../../lib/supabase";

export class AIService {
    static async getResponse(
        request: AICompletionRequest,
    ): Promise<AICompletionResponse> {
        const { messages, mode, fileAttachments } = request;

        const apiMessages = messages.map((m) => {
            if (
                m.role === "user" &&
                (m.imageUrl || (m.imageUrls && m.imageUrls.length > 0) || (m.fileAttachments && m.fileAttachments.length > 0))
            ) {
                let textContent = m.content || " ";

                // Append file content to message text
                if (m.fileAttachments && m.fileAttachments.length > 0) {
                    const fileContents = m.fileAttachments.map((file) => {
                        const language = file.language || "text";
                        return `\n\n**File: ${file.filename}**\n\`\`\`${language}\n${file.content}\n\`\`\``;
                    }).join("");
                    textContent += fileContents;
                }

                const contentParts: any[] = [
                    { type: "text", text: textContent },
                ];

                // Handle multiple images if present
                if (m.imageUrls && m.imageUrls.length > 0) {
                    m.imageUrls.forEach((url) => {
                        contentParts.push({
                            type: "image_url",
                            image_url: { url },
                        });
                    });
                } else if (m.imageUrl) {
                    // Fallback to single image legacy field
                    contentParts.push({
                        type: "image_url",
                        image_url: { url: m.imageUrl },
                    });
                }

                return {
                    role: m.role,
                    content: contentParts,
                };
            }

            // Handle messages with only file attachments (no images)
            if (m.role === "user" && m.fileAttachments && m.fileAttachments.length > 0) {
                let textContent = m.content || " ";
                const fileContents = m.fileAttachments.map((file) => {
                    const language = file.language || "text";
                    return `\n\n**File: ${file.filename}**\n\`\`\`${language}\n${file.content}\n\`\`\``;
                }).join("");
                textContent += fileContents;

                return {
                    role: m.role,
                    content: textContent,
                };
            }

            return {
                role: m.role,
                content: m.content,
            };
        });

        let systemPrompt =
            "你是一个精通理论力学的AI助教。你的目标是引导学生思考，而不是直接给出答案。";

        if (mode === "correct") {
            systemPrompt =
                "你是一个严格的作业批改助手。用户会上传作业图片。请仔细分析图片中的解题过程，指出任何错误，给出评分（0-100），并提供详细的反馈。";
        }

        const payloadMessages = [
            { role: "system", content: systemPrompt },
            ...apiMessages,
        ];

        const { data, error } = await supabase.functions.invoke(
            "chat-response",
            {
                body: { messages: payloadMessages },
            },
        );

        if (error) {
            console.error("AI Service Error:", error);
            throw new Error("AI 服务暂时不可用，请稍后再试。");
        }

        return {
            content: data.reply || "AI 没有返回内容。",
        };
    }
}
