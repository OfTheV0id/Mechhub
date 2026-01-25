import React from "react";
import { User, CheckCircle2, AlertCircle } from "lucide-react";
import { motion } from "motion/react";
import { Message, Annotation } from "../../../types/message";
import { AIAvatar } from "../../../components/AIAvatar";

interface MessageListProps {
    messages: Message[];
    isTyping: boolean;
    messagesEndRef: React.RefObject<HTMLDivElement | null>;
    userName?: string;
    userAvatar?: string;
}

export const MessageList: React.FC<MessageListProps> = ({
    messages,
    isTyping,
    messagesEndRef,
    userName = "你",
    userAvatar,
}) => {
    return (
        <div className="flex-1 overflow-y-auto px-4 md:px-20 py-8 space-y-8 scroll-smooth">
            {messages.map((msg) => (
                <div key={msg.id} className="w-full">
                    {msg.type === "text" ? (
                        <TextMessage
                            role={msg.role}
                            content={msg.content}
                            userName={userName}
                            userAvatar={userAvatar}
                        />
                    ) : (
                        <GradingMessage
                            imageUrl={msg.imageUrl}
                            annotations={msg.annotations}
                            score={msg.score}
                        />
                    )}
                </div>
            ))}

            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} className="h-4" />
        </div>
    );
};

// Sub-components for better readability

const TextMessage = ({
    role,
    content,
    userName,
    userAvatar,
}: {
    role: "user" | "assistant";
    content: string;
    userName: string;
    userAvatar?: string;
}) => (
    <div className={`flex gap-4 ${role === "user" ? "flex-row-reverse" : ""}`}>
        {role === "assistant" && <AIAvatar isThinking={false} />}

        <div
            className={`flex flex-col gap-1 max-w-[90%] ${role === "user" ? "items-end" : "items-start"}`}
        >
            <div
                className={`text-base leading-relaxed p-4 rounded-2xl shadow-sm ${
                    role === "user"
                        ? "bg-slate-900 text-white rounded-2xl"
                        : "bg-white border border-slate-100 text-slate-700 rounded-tl-none"
                }`}
            >
                {content}
            </div>
            {/* Math Formula Example (Static for now) */}
            {content.includes("period formula") && (
                <div className="my-2 p-6 bg-slate-50 rounded-xl flex justify-center border border-slate-100">
                    <span className="text-2xl font-serif italic">
                        T ≈ 2π√(L/g)
                    </span>
                </div>
            )}
        </div>
    </div>
);

const GradingMessage = ({
    imageUrl,
    annotations,
    score,
}: {
    imageUrl?: string;
    annotations?: Annotation[];
    score?: number;
}) => (
    <div className="w-full">
        <div className="flex items-center gap-2 mb-4">
            <AIAvatar isThinking={false} size={32} iconSize={16} />
            <span className="font-bold text-slate-800">批改结果</span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-8">
            <div className="flex-1 relative rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 min-h-[400px]">
                <img
                    src={imageUrl}
                    alt="Homework"
                    className="w-full h-full object-contain"
                />
                {annotations?.map((ann) => (
                    <AnnotationOverlay key={ann.id} annotation={ann} />
                ))}
            </div>

            <div className="w-full lg:w-80 flex flex-col gap-4">
                <h4 className="font-bold text-lg text-slate-800">
                    AI 反馈详情
                </h4>
                <div className="space-y-4">
                    {annotations?.map((ann, idx) => (
                        <AnnotationDetail
                            key={ann.id}
                            annotation={ann}
                            index={idx}
                        />
                    ))}
                </div>
                <div className="mt-auto pt-4 border-t border-slate-100">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                        总分
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-slate-900">
                            {score}
                        </span>
                        <span className="text-slate-400">/ 100</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const AnnotationOverlay = ({ annotation }: { annotation: Annotation }) => (
    <div
        className="absolute border-2 bg-white/10 backdrop-blur-sm rounded-lg flex items-start justify-end p-2 cursor-pointer hover:bg-white/20 transition-colors group"
        style={{
            left: `${annotation.x}%`,
            top: `${annotation.y}%`,
            width: `${annotation.width}%`,
            height: `${annotation.height}%`,
            borderColor:
                annotation.type === "correct"
                    ? "#22C55E"
                    : annotation.type === "incorrect"
                      ? "#EF4444"
                      : "#3B82F6",
        }}
    >
        <div
            className={`px-2 py-1 rounded text-xs font-bold text-white shadow-sm ${
                annotation.type === "correct"
                    ? "bg-green-500"
                    : annotation.type === "incorrect"
                      ? "bg-red-500"
                      : "bg-blue-500"
            }`}
        >
            {annotation.type === "correct"
                ? "正确"
                : annotation.type === "incorrect"
                  ? "错误"
                  : "建议"}
        </div>
    </div>
);

const AnnotationDetail = ({
    annotation,
    index,
}: {
    annotation: Annotation;
    index: number;
}) => (
    <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-2 mb-2">
            {annotation.type === "correct" ? (
                <CheckCircle2 size={18} className="text-green-500" />
            ) : (
                <AlertCircle size={18} className="text-red-500" />
            )}
            <span className="font-bold text-sm text-slate-700">
                步骤 {index + 1}:{" "}
                {annotation.type === "correct" ? "正确" : "发现问题"}
            </span>
        </div>
        <p className="text-sm text-slate-500 leading-relaxed">
            {annotation.comment}
        </p>
    </div>
);

const TypingIndicator = () => (
    <div className="w-full flex gap-6">
        <AIAvatar isThinking={true} />
        <div className="flex items-center gap-2 py-3 bg-white px-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm">
            {[0, 0.2, 0.4].map((delay, i) => (
                <motion.div
                    key={i}
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay }}
                    className="w-1.5 h-1.5 bg-slate-500 rounded-full"
                />
            ))}
        </div>
    </div>
);
