import { useState } from "react";
import { Message, FileAttachment } from "../../../types/message";

export const useChatInterface = (
    onSendMessage: (
        text: string,
        imageUrls?: string[],
        fileAttachments?: FileAttachment[],
    ) => void,
    mode: "study" | "correct",
    setMode: (mode: "study" | "correct") => void,
) => {
    const [inputText, setInputText] = useState("");

    const handleSubmit = (
        e: React.FormEvent,
        imageUrls?: string[],
        fileAttachments?: FileAttachment[],
    ) => {
        e.preventDefault();
        console.log(
            "[useChatInterface] handleSubmit imageUrls:",
            imageUrls,
            "fileAttachments:",
            fileAttachments,
        );
        if (
            inputText.trim() ||
            (imageUrls && imageUrls.length > 0) ||
            (fileAttachments && fileAttachments.length > 0)
        ) {
            onSendMessage(inputText, imageUrls, fileAttachments);
            setInputText("");
        }
    };

    return {
        inputText,
        setInputText,
        handleSubmit,
    };
};
