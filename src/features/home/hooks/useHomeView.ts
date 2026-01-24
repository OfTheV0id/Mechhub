import { useState } from "react";

export const useHomeView = (
    onStartChat: (message?: string) => void,
    mode: "study" | "boss" = "study",
    setMode: (mode: "study" | "boss") => void = () => {},
) => {
    const [inputValue, setInputValue] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim()) {
            onStartChat(inputValue);
        }
    };

    const handleMockImageUpload = () => {
        if (mode !== "boss") setMode("boss");
        onStartChat("请帮我批改这道静力学习题");
    };

    return {
        inputValue,
        setInputValue,
        handleSubmit,
        handleMockImageUpload,
    };
};
