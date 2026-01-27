import React, { useState } from "react";
import { User, CheckCircle2, AlertCircle, X, ZoomIn, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Message, Annotation, FileAttachment } from "../../../types/message";
import { AIAvatar } from "../../../components";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

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
    const [previewImage, setPreviewImage] = useState<string | null>(null);

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
                            imageUrl={msg.imageUrl}
                            imageUrls={msg.imageUrls}
                            fileAttachments={msg.fileAttachments}
                            onImageClick={(url) => setPreviewImage(url)}
                        />
                    ) : (
                        <GradingMessage
                            imageUrl={msg.imageUrl}
                            annotations={msg.annotations}
                            score={msg.score}
                            onImageClick={(url) => setPreviewImage(url)}
                        />
                    )}
                </div>
            ))}

            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} className="h-4" />

            {/* Image Preview Modal */}
            <AnimatePresence>
                {previewImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
                        onClick={() => setPreviewImage(null)}
                    >
                        {/* Close button fixed to top-right of screen */}
                        <button
                            onClick={() => setPreviewImage(null)}
                            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors z-50 rounded-full hover:bg-white/10"
                        >
                            <X size={32} />
                        </button>

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative max-w-full max-h-full flex items-center justify-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={previewImage}
                                alt="Full preview"
                                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Sub-components for better readability

import { MarkdownRenderer } from "../../../components/MarkdownRenderer";

const TextMessage = ({
    role,
    content,
    userName,
    userAvatar,
    imageUrl,
    imageUrls,
    fileAttachments,
    onImageClick,
}: {
    role: "user" | "assistant";
    content: string;
    userName: string;
    userAvatar?: string;
    imageUrl?: string;
    imageUrls?: string[];
    fileAttachments?: FileAttachment[];
    onImageClick: (url: string) => void;
}) => {
    // Collect all valid images into a single array
    const displayImages =
        imageUrls && imageUrls.length > 0
            ? imageUrls
            : imageUrl
              ? [imageUrl]
              : [];

    return (
        <div
            className={`flex gap-4 ${role === "user" ? "flex-row-reverse" : ""}`}
        >
            {role === "assistant" && <AIAvatar isThinking={false} />}

            <div
                className={`flex flex-col gap-1 max-w-[90%] ${role === "user" ? "items-end" : "items-start"}`}
            >
                {displayImages.length > 0 && (
                    <div
                        className={`mb-2 flex flex-wrap gap-2 ${role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        {displayImages.map((url, idx) => (
                            <div
                                key={idx}
                                className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm cursor-zoom-in group transition-transform hover:scale-[1.02]"
                                onClick={() => onImageClick(url)}
                                style={{ width: "120px", height: "120px" }} // Fixed thumbnail size
                            >
                                <img
                                    src={url}
                                    alt={`Attachment ${idx + 1}`}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                    <ZoomIn
                                        className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md"
                                        size={20}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div
                    className={`text-base leading-relaxed p-4 rounded-2xl shadow-sm overflow-hidden ${
                        role === "user"
                            ? "bg-slate-900 text-white rounded-2xl rounded-tr-sm"
                            : "bg-white border border-slate-100 text-slate-700 rounded-tl-none"
                    }`}
                >
                    {role === "user" ? (
                        content
                    ) : (
                        <MarkdownRenderer content={content} />
                    )}
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
};

const GradingMessage = ({
    imageUrl,
    annotations,
    score,
    onImageClick,
}: {
    imageUrl?: string;
    annotations?: Annotation[];
    score?: number;
    onImageClick?: (url: string) => void;
}) => (
    <div className="w-full">
        <div className="flex items-center gap-2 mb-4">
            <AIAvatar isThinking={false} size={32} iconSize={16} />
            <span className="font-bold text-slate-800">批改结果</span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-8">
            <div
                className="flex-1 relative rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 min-h-[400px] cursor-zoom-in"
                onClick={() => imageUrl && onImageClick?.(imageUrl)}
            >
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
