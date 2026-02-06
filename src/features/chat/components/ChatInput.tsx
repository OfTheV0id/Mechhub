import React from "react";
import { UnifiedInputBar } from "./UnifiedInputBar";
import { FileAttachment } from "../../../types/message";
import { ChatMode } from "../types/chat";

interface ChatInputProps {
    inputText: string;
    setInputText: (text: string) => void;
    onSubmit: (
        e: React.FormEvent,
        imageUrls?: string[],
        fileAttachments?: FileAttachment[],
        model?: string,
    ) => void;
    mode: ChatMode;
    setMode: (mode: ChatMode) => void;
    model: string;
    setModel: (model: string) => void;

    isTyping: boolean;
    onStop?: () => void;
}

export const ChatInput = ({
    inputText,
    setInputText,
    onSubmit,
    mode,
    setMode,
    model,
    setModel,

    isTyping,
    onStop,
}: ChatInputProps) => {
    return (
        <div className="z-20 w-full bg-fill-muted p-4">
            <UnifiedInputBar
                inputValue={inputText}
                onInputChange={setInputText}
                onSubmit={onSubmit}
                mode={mode}
                setMode={setMode}
                model={model}
                setModel={setModel}
                isTyping={isTyping}
                onStop={onStop}
            />
            <div className="text-center mt-3 text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                AI can make mistakes.
            </div>
        </div>
    );
};
