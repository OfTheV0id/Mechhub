import { useState } from "react";

export const useHomeView = (
    onStartChat: (message?: string) => void,
    mode: "study" | "correct" = "study",
    setMode: (mode: "study" | "correct") => void = () => {},
) => {
    const [inputValue, setInputValue] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim()) {
            onStartChat(inputValue);
        }
    };

    const handleMockImageUpload = () => {
        if (mode !== "correct") setMode("correct");
        onStartChat("请帮我批改这道静力学习题");
    };

    return {
        inputValue,
        setInputValue,
        handleSubmit,
        handleMockImageUpload,
    };
};
