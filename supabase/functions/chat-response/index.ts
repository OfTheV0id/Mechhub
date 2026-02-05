import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const DASHSCOPE_API_KEY = "sk-520f369d11174a9cacfd4327ff22d46e";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    // 1. Handle CORS preflight requests
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        // 2. Supabase Auth Validation
        const authHeader = req.headers.get("Authorization");
        if (!authHeader) {
            throw new Error("Missing Authorization header");
        }

        const supabaseClient = createClient(
            Deno.env.get("SUPABASE_URL") ?? "",
            Deno.env.get("SUPABASE_ANON_KEY") ?? "",
            { global: { headers: { Authorization: authHeader } } },
        );

        const {
            data: { user },
            error: authError,
        } = await supabaseClient.auth.getUser();

        if (authError || !user) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // 3. Process Request
        const { messages, stream = false } = await req.json();

        // Inject LaTeX formatting instruction for normal chat responses.
        // Skip this in strict JSON tasks (e.g. grading result), otherwise
        // backslashes in LaTeX can break JSON parsing on the client side.
        const latexFormattingInstruction = {
            role: "system",
            content: `CRITICAL FORMATTING RULE: 你必须将所有数学公式和 LaTeX 命令用正确的分隔符包裹:
- 行内公式：使用单个 $ 包围，例如 $E = mc^2$、$\\frac{1}{2}$
- 独立公式块：使用双 $$ 包围
- 所有 LaTeX 命令（如 \\frac{}{}、\\sqrt{}、\\sum、\\int 等）都必须在 $ 或 $$ 内
- 不要输出未包裹的裸 LaTeX 命令`,
        };

        const isStrictJsonTask = messages.some(
            (m: any) =>
                m?.role === "system" &&
                typeof m?.content === "string" &&
                (m.content.includes("只返回JSON") ||
                    m.content.includes("只返回标题文本")),
        );
        const gradingJsonFormattingInstruction = {
            role: "system",
            content: `CRITICAL JSON FORMATTING RULE (批改模式):
- 输出必须是严格 JSON（不要 markdown 代码块、不要额外说明）
- 在 JSON 字符串中，凡是数学公式都必须用 $...$ 包裹
- 不要输出未包裹的裸 LaTeX 命令
- 如果使用反斜杠 LaTeX 命令（如 \\frac、\\sqrt），请确保符合 JSON 字符串转义规范`,
        };
        const finalMessages = isStrictJsonTask
            ? [gradingJsonFormattingInstruction, ...messages]
            : [latexFormattingInstruction, ...messages];

        const response = await fetch(
            "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${DASHSCOPE_API_KEY}`,
                },
                body: JSON.stringify({
                    model: "qwen3-vl-plus",
                    messages: finalMessages,
                    stream: stream,
                }),
            },
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error("DashScope API Error:", errorText);
            throw new Error(
                `DashScope API error: ${response.status} ${errorText}`,
            );
        }

        // Handle streaming response
        if (stream) {
            const encoder = new TextEncoder();
            const readable = new ReadableStream({
                async start(controller) {
                    try {
                        const reader = response.body?.getReader();
                        if (!reader) {
                            throw new Error("No response body");
                        }

                        const decoder = new TextDecoder();
                        let buffer = "";

                        while (true) {
                            const { done, value } = await reader.read();
                            if (done) break;

                            buffer += decoder.decode(value, { stream: true });
                            const lines = buffer.split("\n");
                            buffer = lines.pop() || "";

                            for (const line of lines) {
                                const trimmed = line.trim();
                                if (!trimmed || trimmed === "data: [DONE]") {
                                    continue;
                                }

                                if (trimmed.startsWith("data: ")) {
                                    try {
                                        const jsonStr = trimmed.slice(6);
                                        const data = JSON.parse(jsonStr);
                                        const content =
                                            data.choices[0]?.delta?.content;

                                        if (content) {
                                            controller.enqueue(
                                                encoder.encode(
                                                    `data: ${JSON.stringify({ content })}\n\n`,
                                                ),
                                            );
                                        }
                                    } catch (e) {
                                        console.error(
                                            "Error parsing SSE data:",
                                            e,
                                        );
                                    }
                                }
                            }
                        }

                        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                        controller.close();
                    } catch (error) {
                        controller.error(error);
                    }
                },
            });

            return new Response(readable, {
                headers: {
                    ...corsHeaders,
                    "Content-Type": "text/event-stream",
                    "Cache-Control": "no-cache",
                    Connection: "keep-alive",
                },
            });
        }

        // Handle non-streaming response
        const data = await response.json();
        const reply = data.choices[0].message.content;

        return new Response(JSON.stringify({ reply }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    } catch (error) {
        const status = error.message.includes("Unauthorized") ? 401 : 500;
        return new Response(JSON.stringify({ error: error.message }), {
            status: status,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
