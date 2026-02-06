import { FormEvent, useState } from "react";
import { FileAttachment, SubmitMessage } from "../../../types/message";

type SendMessageFn = (submitMessage: SubmitMessage) => void;

export const useChatInput = (onSendMessage: SendMessageFn) => {
    const [inputText, setInputText] = useState("");

    const handleSubmit = (
        e: FormEvent,
        imageUrls?: string[],
        fileAttachments?: FileAttachment[],
        model?: string,
    ) => {
        e.preventDefault();
        onSendMessage({
            text: inputText,
            imageUrls,
            fileAttachments,
            model,
        });
        setInputText("");
    };

    return {
        inputText,
        setInputText,
        handleSubmit,
    };
};
