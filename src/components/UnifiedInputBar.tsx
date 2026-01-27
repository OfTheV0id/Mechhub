import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    ArrowRight,
    GraduationCap,
    CheckCircle,
    ImagePlus,
    X,
    Loader2,
    FileText,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";
import { FileAttachment } from "../types/message";

interface ImageAttachment {
    id: string;
    file: File;
    previewUrl: string;
    uploading: boolean;
    publicUrl?: string; // Set after successful upload
}

interface UnifiedInputBarProps {
    inputValue: string;
    onInputChange: (value: string) => void;
    onSubmit: (e: React.FormEvent, imageUrls?: string[], fileAttachments?: FileAttachment[]) => void;
    mode: "study" | "correct";
    setMode: (mode: "study" | "correct") => void;
    onUpload?: (file?: File) => void;
    placeholder?: string;
    isTyping?: boolean;
}

const SUPPORTED_TEXT_FILE_EXTENSIONS = [
    ".txt", ".py", ".js", ".java", ".cpp", ".c", ".go", ".rs", ".rb", ".php",
    ".ts", ".tsx", ".jsx", ".sql", ".html", ".css", ".json", ".yaml", ".yml",
    ".xml", ".md", ".markdown", ".sh", ".bash", ".jsx"
];

const LANGUAGE_MAP: { [key: string]: string } = {
    ".py": "python",
    ".js": "javascript",
    ".jsx": "javascript",
    ".ts": "typescript",
    ".tsx": "typescript",
    ".java": "java",
    ".cpp": "cpp",
    ".c": "c",
    ".go": "go",
    ".rs": "rust",
    ".rb": "ruby",
    ".php": "php",
    ".sql": "sql",
    ".html": "html",
    ".css": "css",
    ".json": "json",
    ".yaml": "yaml",
    ".yml": "yaml",
    ".xml": "xml",
    ".md": "markdown",
    ".markdown": "markdown",
    ".sh": "bash",
    ".bash": "bash",
};

export const UnifiedInputBar: React.FC<UnifiedInputBarProps> = ({
    inputValue,
    onInputChange,
    onSubmit,
    mode,
    setMode,
    placeholder,
    isTyping = false,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imageAttachments, setImageAttachments] = useState<ImageAttachment[]>([]);
    const [fileAttachments, setFileAttachments] = useState<FileAttachment[]>([]);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const isTextFile = (filename: string): boolean => {
        const extension = "." + filename.split(".").pop()?.toLowerCase();
        return SUPPORTED_TEXT_FILE_EXTENSIONS.includes(extension);
    };

    const getLanguageFromFilename = (filename: string): string | undefined => {
        const extension = "." + filename.split(".").pop()?.toLowerCase();
        return LANGUAGE_MAP[extension];
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);

            // Separate files into images and text files
            const imagesToUpload: ImageAttachment[] = [];
            const textsToRead: File[] = [];

            for (const file of newFiles) {
                if (file.type.startsWith("image/")) {
                    imagesToUpload.push({
                        id: Math.random().toString(36).substr(2, 9),
                        file,
                        previewUrl: URL.createObjectURL(file),
                        uploading: true,
                    });
                } else if (isTextFile(file.name)) {
                    textsToRead.push(file);
                } else {
                    toast.error(`不支持的文件类型: ${file.name}`);
                }
            }

            // Add image attachments to state and upload them
            if (imagesToUpload.length > 0) {
                setImageAttachments((prev) => [...prev, ...imagesToUpload]);

                // Upload images
                for (const att of imagesToUpload) {
                    try {
                        const fileExt = att.file.name.split(".").pop();
                        const sanitizedFileName = `${Date.now()}_${Math.random().toString(36).substr(2, 5)}.${fileExt}`;

                        console.log(
                            `[UnifiedInputBar] Uploading image ${sanitizedFileName}, type: ${att.file.type}`,
                        );

                        const { error: uploadError } = await supabase.storage
                            .from("chat-images")
                            .upload(sanitizedFileName, att.file, {
                                contentType: att.file.type,
                                upsert: false,
                            });

                        if (uploadError) {
                            console.error(
                                "[UnifiedInputBar] Supabase Upload Error:",
                                uploadError,
                            );
                            throw uploadError;
                        }

                        const {
                            data: { publicUrl },
                        } = supabase.storage
                            .from("chat-images")
                            .getPublicUrl(sanitizedFileName);

                        setImageAttachments((prev) =>
                            prev.map((p) =>
                                p.id === att.id
                                    ? { ...p, uploading: false, publicUrl }
                                    : p,
                            ),
                        );
                    } catch (error: any) {
                        console.error(
                            "[UnifiedInputBar] Image upload failed:",
                            error,
                        );
                        toast.error(`图片上传失败: ${error.message || "未知错误"}`);
                        setImageAttachments((prev) =>
                            prev.filter((p) => p.id !== att.id),
                        );
                    }
                }
            }

            // Read text files
            if (textsToRead.length > 0) {
                for (const file of textsToRead) {
                    try {
                        const content = await file.text();
                        const language = getLanguageFromFilename(file.name);

                        const newFileAttachment: FileAttachment = {
                            filename: file.name,
                            content,
                            language,
                        };

                        setFileAttachments((prev) => [...prev, newFileAttachment]);
                        console.log(`[UnifiedInputBar] Read text file: ${file.name}`);
                    } catch (error: any) {
                        console.error("[UnifiedInputBar] Failed to read file:", error);
                        toast.error(`读取文件失败: ${file.name}`);
                    }
                }
            }

            // Clear input so same file can be selected again if needed
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const removeImageAttachment = (id: string) => {
        setImageAttachments((prev) => prev.filter((a) => a.id !== id));
    };

    const removeFileAttachment = (filename: string) => {
        setFileAttachments((prev) => prev.filter((a) => a.filename !== filename));
    };

    const handleSubmitInternal = (e: React.FormEvent) => {
        e.preventDefault();

        // Wait for uploads? Actually we should disable send if uploading.
        if (imageAttachments.some((a) => a.uploading)) {
            toast.warning("请等待图片上传完成");
            return;
        }

        const imageUrls = imageAttachments
            .map((a) => a.publicUrl)
            .filter((url): url is string => !!url);

        console.log("[UnifiedInputBar] Submitting imageUrls:", imageUrls);
        console.log("[UnifiedInputBar] Submitting fileAttachments:", fileAttachments);

        if (inputValue.trim() || imageUrls.length > 0 || fileAttachments.length > 0) {
            onSubmit(e, imageUrls.length > 0 ? imageUrls : undefined, fileAttachments.length > 0 ? fileAttachments : undefined);
            setImageAttachments([]); // Clear attachments after send
            setFileAttachments([]);
        }
    };

    const isUploading = imageAttachments.some((a) => a.uploading);

    return (
        <form onSubmit={handleSubmitInternal} className="w-full relative">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                multiple // Support multiple files
                onChange={handleFileChange}
            />

            {/* Attachments Preview Area */}
            <AnimatePresence>
                {attachments.length > 0 && (
                    <div className="flex gap-2 mb-2 px-2 overflow-x-auto pb-2">
                        {attachments.map((att) => (
                            <motion.div
                                key={att.id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-200 shadow-sm shrink-0 group"
                            >
                                <img
                                    src={att.previewUrl}
                                    alt="preview"
                                    className="w-full h-full object-cover"
                                />
                                {att.uploading && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                        <Loader2 className="animate-spin text-white w-5 h-5" />
                                    </div>
                                )}
                                {!att.uploading && (
                                    <button
                                        type="button"
                                        onClick={() => removeAttachment(att.id)}
                                        className="absolute top-0.5 right-0.5 bg-black/50 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={12} />
                                    </button>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}
            </AnimatePresence>

            <div className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 transition-colors rounded-[32px] p-2 pr-2 border border-slate-200 focus-within:border-slate-300 focus-within:ring-4 focus-within:ring-slate-100 shadow-sm">
                {/* Integrated Mode Switcher */}
                <div className="flex bg-white/80 relative p-1 rounded-[24px] border border-slate-200 mr-1 flex-shrink-0">
                    <motion.div
                        className="absolute top-1 bottom-1 bg-slate-900 rounded-[20px] shadow-sm z-0"
                        layoutId="activeModeInputUnified"
                        initial={false}
                        animate={{
                            left: mode === "study" ? "4px" : "calc(50% + 2px)",
                            width: "calc(50% - 6px)",
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 30,
                        }}
                    />

                    <button
                        type="button"
                        onClick={() => setMode("study")}
                        className={`relative z-10 flex items-center justify-center gap-2 px-4 py-2 rounded-[20px] text-xs font-bold transition-colors w-[100px] ${
                            mode === "study"
                                ? "text-white"
                                : "text-slate-500 hover:text-slate-700"
                        }`}
                    >
                        <GraduationCap size={14} />
                        提问
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode("correct")}
                        className={`relative z-10 flex items-center justify-center gap-2 px-4 py-2 rounded-[20px] text-xs font-bold transition-colors w-[100px] ${
                            mode === "correct"
                                ? "text-white"
                                : "text-slate-500 hover:text-slate-700"
                        }`}
                    >
                        <CheckCircle size={14} />
                        批改
                    </button>
                </div>

                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => onInputChange(e.target.value)}
                    placeholder={
                        placeholder ||
                        (mode === "correct" ? "上传你的解答." : "提出你的疑问.")
                    }
                    className="flex-1 bg-transparent border-none outline-none py-3 px-2 text-slate-700 placeholder:text-slate-400 text-lg min-w-0"
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmitInternal(e);
                        }
                    }}
                />

                <button
                    type="button"
                    onClick={handleUploadClick}
                    className="p-3 rounded-full hover:bg-slate-200 text-slate-400 transition-colors"
                >
                    <ImagePlus size={20} />
                </button>

                <button
                    type="button"
                    onClick={(e) => handleSubmitInternal(e)}
                    disabled={
                        (!inputValue.trim() && attachments.length === 0) ||
                        isUploading ||
                        isTyping
                    }
                    className="p-3 rounded-full bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md ml-1"
                >
                    {isUploading ? (
                        <Loader2 size={20} className="animate-spin" />
                    ) : (
                        <ArrowRight size={20} />
                    )}
                </button>
            </div>
        </form>
    );
};
