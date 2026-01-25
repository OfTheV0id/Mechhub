import { useState } from "react";
import { Message } from "../../../types/message";

export const useChatInterface = (
    onSendMessage: (text: string, image?: File) => void,
    mode: "study" | "correct",
    setMode: (mode: "study" | "correct") => void,
) => {
    const [inputText, setInputText] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputText.trim()) {
            onSendMessage(inputText);
            setInputText("");
        }
    };

    const handleMockImageUpload = () => {
        if (mode !== "correct") setMode("correct");
        onSendMessage("请帮我批改这道静力学习题", new File([""], "mock.jpg"));
    };

    return {
        inputText,
        setInputText,
        handleSubmit,
        handleMockImageUpload,
    };
};
