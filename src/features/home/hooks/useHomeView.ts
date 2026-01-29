import { useState } from "react";
import { FileAttachment } from "../../../types/message";

export const useHomeView = (
    onStartChat: (
        message?: string,
        imageUrls?: string[],
        fileAttachments?: FileAttachment[],
    ) => void,
    mode: "study" | "correct" = "study",
    setMode: (mode: "study" | "correct") => void = () => {},
) => {
    const [inputValue, setInputValue] = useState("");

    const handleSubmit = (
        e: React.FormEvent,
        imageUrls?: string[],
        fileAttachments?: FileAttachment[],
    ) => {
        e.preventDefault();
        const hasText = !!inputValue.trim();
        const hasImages = imageUrls && imageUrls.length > 0;
        const hasFiles = fileAttachments && fileAttachments.length > 0;

        if (hasText || hasImages || hasFiles) {
            onStartChat(inputValue, imageUrls, fileAttachments);
        }
    };

    return {
        inputValue,
        setInputValue,
        handleSubmit,
    };
};
