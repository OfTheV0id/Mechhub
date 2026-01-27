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
    userName: string;
    userAvatar?: string;
    imageUrl?: string;
    imageUrls?: string[];
    fileAttachments?: FileAttachment[];
    onImageClick: (url: string) => void;
}

export const TextMessage: React.FC<TextMessageProps> = ({
    role,
    content,
    userName,
    userAvatar,
    imageUrl,
    imageUrls,
    fileAttachments,
    onImageClick,
}) => {
    const [isCopied, setIsCopied] = useState(false);

    // Collect all valid images into a single array
    const displayImages =
        imageUrls && imageUrls.length > 0
            ? imageUrls
            : imageUrl
              ? [imageUrl]
              : [];

    const handleCopyText = async () => {
        try {
            await navigator.clipboard.writeText(content);
            setIsCopied(true);
            toast.success("已复制到剪贴板");
            setTimeout(() => setIsCopied(false), 2000);
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
                    <div className="flex items-start gap-2 group">
                        <div
                            className={`text-base leading-relaxed p-4 rounded-2xl shadow-sm overflow-hidden flex-1 ${
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
                        <button
                            onClick={handleCopyText}
                            className={`p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100 shrink-0 ${
                                role === "user"
                                    ? "hover:bg-slate-700 text-slate-400 hover:text-white"
                                    : "hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                            }`}
                            title="复制文本"
                        >
                            {isCopied ? (
                                <Check size={18} className="text-green-500" />
                            ) : (
                                <Copy size={18} />
                            )}
                        </button>
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
