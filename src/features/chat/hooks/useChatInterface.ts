import { useState } from "react";
import { Message } from "../../../types/message";
import { supabase } from "../../../lib/supabase";
import { toast } from "sonner";

export const useChatInterface = (
    onSendMessage: (text: string, imageUrls?: string[]) => void,
    mode: "study" | "correct",
    setMode: (mode: "study" | "correct") => void,
) => {
    const [inputText, setInputText] = useState("");

    const handleSubmit = (e: React.FormEvent, attachments?: string[]) => {
        e.preventDefault();
        console.log(
            "[useChatInterface] handleSubmit attachments:",
            attachments,
        );
        if (inputText.trim() || (attachments && attachments.length > 0)) {
            // Auto switch to correct mode if images are present and not already in correct mode
            if (attachments && attachments.length > 0 && mode !== "correct") {
                setMode("correct");
            }
            onSendMessage(inputText, attachments);
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
