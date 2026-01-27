import { useState } from "react";
import { Message, FileAttachment } from "../../../types/message";
import { supabase } from "../../../lib/supabase";
import { toast } from "sonner";

export const useChatInterface = (
    onSendMessage: (text: string, imageUrls?: string[], fileAttachments?: FileAttachment[]) => void,
    mode: "study" | "correct",
    setMode: (mode: "study" | "correct") => void,
) => {
    const [inputText, setInputText] = useState("");

    const handleSubmit = (e: React.FormEvent, imageUrls?: string[], fileAttachments?: FileAttachment[]) => {
        e.preventDefault();
        console.log(
            "[useChatInterface] handleSubmit imageUrls:",
            imageUrls,
            "fileAttachments:",
            fileAttachments,
        );
        if (inputText.trim() || (imageUrls && imageUrls.length > 0) || (fileAttachments && fileAttachments.length > 0)) {
            // Auto switch to correct mode if attachments are present and not already in correct mode
            if ((imageUrls && imageUrls.length > 0 || fileAttachments && fileAttachments.length > 0) && mode !== "correct") {
                setMode("correct");
            }
            onSendMessage(inputText, imageUrls, fileAttachments);
            setInputText("");
        }
    };

    // Deprecated: Internal file handling in UnifiedInputBar
    const handleImageUpload = (file?: File) => {
        console.warn("handleImageUpload deprecated");
    };

    return {
        inputText,
        setInputText,
        handleSubmit,
        handleMockImageUpload: handleImageUpload,
    };
};
