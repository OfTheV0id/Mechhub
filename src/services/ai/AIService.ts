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
                (m.imageUrl ||
                    (m.imageUrls && m.imageUrls.length > 0) ||
                    (m.fileAttachments && m.fileAttachments.length > 0))
            ) {
                let textContent = m.content || " ";

                // Append file content to message text
                if (m.fileAttachments && m.fileAttachments.length > 0) {
                    const fileContents = m.fileAttachments
                        .map((file) => {
                            const language = file.language || "text";
                            return `\n\n**File: ${file.filename}**\n\`\`\`${language}\n${file.content}\n\`\`\``;
                        })
                        .join("");
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
            if (
                m.role === "user" &&
                m.fileAttachments &&
                m.fileAttachments.length > 0
            ) {
                let textContent = m.content || " ";
                const fileContents = m.fileAttachments
                    .map((file) => {
                        const language = file.language || "text";
                        return `\n\n**File: ${file.filename}**\n\`\`\`${language}\n${file.content}\n\`\`\``;
                    })
                    .join("");
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

        // Get image URLs from the latest user message for grading mode
        const latestUserMessage = messages
            .filter((m) => m.role === "user")
            .pop();
        const userImageUrls =
            latestUserMessage?.imageUrls ||
            (latestUserMessage?.imageUrl ? [latestUserMessage.imageUrl] : []);

        if (mode === "correct") {
            systemPrompt = `你是一个严格的作业批改助手。用户上传了${userImageUrls.length}张作业图片。

请仔细分析每张图片中的解题过程，按照以下JSON格式返回批改结果（只返回JSON，不要其他内容）：

{
  "overallScore": 85,
  "summary": "整体解题思路正确，但在第二步计算中有小错误",
  "images": [
    {
      "imageUrl": "对应的图片URL",
      "score": 85,
      "steps": [
        {
          "stepNumber": 1,
          "stepTitle": "受力分析",
          "isCorrect": true,
          "comment": "力的分析正确，方向和大小都标注清楚",
          "suggestion": null,
          "bbox": { "x": 10, "y": 20, "width": 30, "height": 25 }
        },
        {
          "stepNumber": 2,
          "stepTitle": "力矩计算",
          "isCorrect": false,
          "comment": "力矩的符号方向错误",
          "suggestion": "力矩应该根据右手定则判断正负",
          "bbox": { "x": 15, "y": 50, "width": 40, "height": 30 }
        }
      ]
    }
  ]
}

注意：
1. bbox的x, y, width, height都是百分比(0-100)，表示在图片上的相对位置
2. 每个步骤都必须指定bbox来标注该步骤在图片上的位置
3. 图片顺序与用户上传顺序一致`;
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

        const aiReply = data.reply || "AI 没有返回内容。";

        // For grading mode, try to parse JSON response
        if (mode === "correct") {
            try {
                // Extract JSON from response (in case there's extra text)
                const jsonMatch = aiReply.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const gradingResult = JSON.parse(jsonMatch[0]);
                    // Inject actual imageUrls into the result
                    if (gradingResult.images && userImageUrls.length > 0) {
                        gradingResult.images.forEach(
                            (img: any, idx: number) => {
                                if (idx < userImageUrls.length) {
                                    img.imageUrl = userImageUrls[idx];
                                }
                            },
                        );
                    }
                    return {
                        content: aiReply,
                        gradingResult,
                    };
                }
            } catch (parseError) {
                console.error("Failed to parse grading JSON:", parseError);
                // Fall back to text response
            }
        }

        return {
            content: aiReply,
        };
    }
}
