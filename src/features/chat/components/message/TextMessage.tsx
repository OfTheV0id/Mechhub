import React, { useState } from "react";
import { ZoomIn, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { FileAttachment } from "../../../../types/message";
import { AIAvatar } from "../../../../components";
import { MarkdownRenderer } from "../../../../components/MarkdownRenderer";
import { FileAttachmentPreview } from "./FileAttachmentPreview";

interface TextMessageProps {
    role: "user" | "assistant";
    content: string;
    imageUrls?: string[];
    fileAttachments?: FileAttachment[];
    onImageClick: (url: string) => void;
}

export const TextMessage: React.FC<TextMessageProps> = ({
    role,
    content,

    imageUrls,
    fileAttachments,
    onImageClick,
}) => {
    const [isCopied, setIsCopied] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);

    // Collect all valid images into a single array
    const displayImages = imageUrls && imageUrls.length > 0 ? imageUrls : [];

    const handleCopyText = async () => {
        try {
            await navigator.clipboard.writeText(content);
            setIsCopied(true);
            setShowFeedback(true);
            toast.success("已复制到剪贴板");

            // Reset button state after animation
            setTimeout(() => {
                setShowFeedback(false);
                setIsCopied(false);
            }, 2000);
        } catch (error) {
            toast.error("复制失败");
        }
    };

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

                {/* File Attachments */}
                {fileAttachments && fileAttachments.length > 0 && (
                    <div className="mb-2 space-y-2">
                        {fileAttachments.map((file) => (
                            <FileAttachmentPreview
                                key={file.filename}
                                file={file}
                                role={role}
                            />
                        ))}
                    </div>
                )}

                {/* Only show message bubble if there is text content */}
                {content && content.trim() && (
                    <div className="group flex flex-col gap-2">
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

                        {/* Toolbar with copy button positioned below bubble */}
                        <div
                            className={`flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                                role === "user" ? "justify-end" : "justify-start"
                            }`}
                        >
                            <button
                                onClick={handleCopyText}
                                className={`px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center gap-1.5 text-xs font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                    role === "user"
                                        ? `${
                                              isCopied
                                                  ? "bg-slate-800 text-green-400"
                                                  : "bg-slate-950/0 text-slate-400 hover:bg-slate-800/50 hover:text-white"
                                          } focus:ring-slate-600 focus:ring-offset-slate-900`
                                        : `${
                                              isCopied
                                                  ? "bg-slate-100/50 text-green-600"
                                                  : "bg-white/0 text-slate-400 hover:bg-slate-50 hover:text-slate-700"
                                          } focus:ring-slate-300 focus:ring-offset-white`
                                }`}
                                aria-label={
                                    isCopied ? "已复制到剪贴板" : "复制文本内容"
                                }
                                title={isCopied ? "已复制到剪贴板" : "复制文本"}
                                aria-pressed={isCopied}
                            >
                                {isCopied ? (
                                    <>
                                        <Check size={14} />
                                        <span>已复制</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy size={14} />
                                        <span>复制</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
                {/* Math Formula Example (Static for now) */}
                {content && content.includes("period formula") && (
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
