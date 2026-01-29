import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    ArrowRight,
    GraduationCap,
    CheckCircle,
    Paperclip,
    X,
    Loader2,
    FileText,
    Square,
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
    onSubmit: (
        e: React.FormEvent,
        imageUrls?: string[],
        fileAttachments?: FileAttachment[],
    ) => void;
    mode: "study" | "correct";
    setMode: (mode: "study" | "correct") => void;

    placeholder?: string;
    isTyping?: boolean;
    onStop?: () => void;
}

const SUPPORTED_TEXT_FILE_EXTENSIONS = [
    ".txt",
    ".py",
    ".js",
    ".java",
    ".cpp",
    ".c",
    ".go",
    ".rs",
    ".rb",
    ".php",
    ".ts",
    ".tsx",
    ".jsx",
    ".sql",
    ".html",
    ".css",
    ".json",
    ".yaml",
    ".yml",
    ".xml",
    ".md",
    ".markdown",
    ".sh",
    ".bash",
    ".jsx",
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
    onStop,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imageAttachments, setImageAttachments] = useState<ImageAttachment[]>(
        [],
    );
    const [fileAttachments, setFileAttachments] = useState<FileAttachment[]>(
        [],
    );

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
                        toast.error(
                            `图片上传失败: ${error.message || "未知错误"}`,
                        );
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

                        setFileAttachments((prev) => [
                            ...prev,
                            newFileAttachment,
                        ]);
                        console.log(
                            `[UnifiedInputBar] Read text file: ${file.name}`,
                        );
                    } catch (error: any) {
                        console.error(
                            "[UnifiedInputBar] Failed to read file:",
                            error,
                        );
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
        setFileAttachments((prev) =>
            prev.filter((a) => a.filename !== filename),
        );
    };

    const handleSubmitInternal = (e: React.FormEvent) => {
        e.preventDefault();

        // Wait for uploads to complete
        if (imageAttachments.some((a) => a.uploading)) {
            toast.warning("请等待图片上传完成");
            return;
        }

        const imageUrls = imageAttachments
            .map((a) => a.publicUrl)
            .filter((url): url is string => !!url);

        // Validate: grading mode requires at least one image
        if (mode === "correct" && imageUrls.length === 0) {
            toast.warning("批改模式需要至少上传一张照片");
            return;
        }

        console.log("[UnifiedInputBar] Submitting imageUrls:", imageUrls);
        console.log(
            "[UnifiedInputBar] Submitting fileAttachments:",
            fileAttachments,
        );

        if (
            inputValue.trim() ||
            imageUrls.length > 0 ||
            fileAttachments.length > 0
        ) {
            onSubmit(
                e,
                imageUrls.length > 0 ? imageUrls : undefined,
                fileAttachments.length > 0 ? fileAttachments : undefined,
            );
            setImageAttachments([]); // Clear attachments after send
            setFileAttachments([]);
        }
    };

    const isUploading = imageAttachments.some((a) => a.uploading);
    const showStopButton = isTyping && !!onStop;

    return (
        <form onSubmit={handleSubmitInternal} className="w-full relative">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*,.txt,.py,.js,.java,.cpp,.c,.go,.rs,.rb,.php,.ts,.tsx,.jsx,.sql,.html,.css,.json,.yaml,.yml,.xml,.md,.markdown,.sh,.bash"
                multiple
                onChange={handleFileChange}
            />

            {/* Attachments Preview Area */}
            <AnimatePresence>
                {(imageAttachments.length > 0 ||
                    fileAttachments.length > 0) && (
                    <div className="flex gap-2 mb-2 px-2 overflow-x-auto pb-2">
                        {/* Image Attachments */}
                        {imageAttachments.map((att) => (
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
                                        onClick={() =>
                                            removeImageAttachment(att.id)
                                        }
                                        className="absolute top-1 right-1 bg-white text-slate-700 rounded-full p-1 shadow-sm border border-slate-200 hover:bg-slate-100 transition-colors z-10"
                                    >
                                        <X size={14} />
                                    </button>
                                )}
                            </motion.div>
                        ))}

                        {/* File Attachments */}
                        {fileAttachments.map((att) => (
                            <motion.div
                                key={att.filename}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="relative px-3 py-2 rounded-lg bg-slate-100 border border-slate-200 shadow-sm shrink-0 group flex items-center gap-2"
                            >
                                <FileText
                                    size={14}
                                    className="text-slate-600"
                                />
                                <span className="text-xs text-slate-700 truncate max-w-[80px]">
                                    {att.filename}
                                </span>
                                <button
                                    type="button"
                                    onClick={() =>
                                        removeFileAttachment(att.filename)
                                    }
                                    className="ml-1 text-slate-400 hover:text-slate-600 opacity-100 transition-opacity p-0.5 hover:bg-slate-200 rounded"
                                >
                                    <X size={14} />
                                </button>
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

                <textarea
                    ref={(el) => {
                        // ref for auto-height
                        if (el) {
                            el.style.height = "auto"; // Reset height to calculate scrollHeight
                            el.style.height =
                                Math.min(el.scrollHeight, 200) + "px"; // Set height up to 200px
                        }
                    }}
                    value={inputValue}
                    onChange={(e) => onInputChange(e.target.value)}
                    placeholder={
                        placeholder ||
                        (mode === "correct" ? "上传你的解答." : "提出你的疑问.")
                    }
                    rows={1}
                    className="flex-1 bg-transparent border-none outline-none py-3 px-2 text-slate-700 placeholder:text-slate-400 text-lg min-w-0 resize-none max-h-[200px] overflow-y-auto self-center"
                    onKeyDown={(e) => {
                        // Check if IME is composing
                        if (e.nativeEvent.isComposing) return;

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
                    title="上传文件（图片或文本）"
                >
                    <Paperclip size={20} />
                </button>

                <button
                    type="button"
                    onClick={(e) => {
                        if (showStopButton && onStop) {
                            onStop();
                        } else {
                            handleSubmitInternal(e);
                        }
                    }}
                    disabled={
                        !showStopButton &&
                        ((!inputValue.trim() &&
                            imageAttachments.length === 0 &&
                            fileAttachments.length === 0) ||
                            isUploading ||
                            isTyping)
                    }
                    className={`p-3 rounded-full transition-all shadow-md ml-1 flex items-center justify-center ${
                        showStopButton
                            ? "bg-red-500 hover:bg-red-600 text-white"
                            : "bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    }`}
                    title={showStopButton ? "停止生成" : "发送消息"}
                >
                    {isUploading ? (
                        <Loader2 size={20} className="animate-spin" />
                    ) : showStopButton ? (
                        <Square size={16} fill="currentColor" />
                    ) : (
                        <ArrowRight size={20} />
                    )}
                </button>
            </div>
        </form>
    );
};
