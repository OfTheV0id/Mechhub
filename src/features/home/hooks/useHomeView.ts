import { useState } from "react";
import { FileAttachment } from "../../../types/message";

export const useHomeView = (
    onStartChat: (message?: string, imageUrls?: string[], fileAttachments?: FileAttachment[]) => void,
    mode: "study" | "correct" = "study",
    setMode: (mode: "study" | "correct") => void = () => {},
) => {
    const [inputValue, setInputValue] = useState("");

    const handleSubmit = (e: React.FormEvent, imageUrls?: string[], fileAttachments?: FileAttachment[]) => {
        e.preventDefault();
        const hasText = !!inputValue.trim();
        const hasImages = imageUrls && imageUrls.length > 0;
        const hasFiles = fileAttachments && fileAttachments.length > 0;

        if (hasText || hasImages || hasFiles) {
            onStartChat(inputValue, imageUrls, fileAttachments);
        }
    };

    const handleMockImageUpload = (file?: File) => {
        // This seems to be a legacy/mock handler.
        // Real upload is handled by UnifiedInputBar which calls onSubmit with plain URLs.
        // Keeping it for interface compatibility if UnifiedInputBar calls it on button click.
        if (mode !== "correct") setMode("correct");
        // For now, it just starts chat with a preset message?
        // If UnifiedInputBar handles upload, this might just be a trigger.
        // onStartChat("请帮我批改这道静力学习题");
    };

    return {
        inputValue,
        setInputValue,
        handleSubmit,
        handleMockImageUpload,
    };
};
