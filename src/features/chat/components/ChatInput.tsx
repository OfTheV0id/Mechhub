import React from "react";
import { UnifiedInputBar } from "../../../components";

interface ChatInputProps {
    inputText: string;
    setInputText: (text: string) => void;
    onSubmit: (e: React.FormEvent, attachments?: string[]) => void;
    mode: "study" | "correct";
    setMode: (mode: "study" | "correct") => void;
    onUpload: (file?: File) => void;
    isTyping: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
    inputText,
    setInputText,
    onSubmit,
    mode,
    setMode,
    onUpload,
    isTyping,
}) => {
    return (
        <div className="p-4 bg-white/80 backdrop-blur-sm border-t border-slate-100 sticky bottom-0 z-20 w-full">
            <div className="w-full px-4 md:px-8">
                <UnifiedInputBar
                    inputValue={inputText}
                    onInputChange={setInputText}
                    onSubmit={onSubmit}
                    mode={mode}
                    setMode={setMode}
                    onUpload={onUpload}
                    isTyping={isTyping}
                />
                <div className="text-center mt-3 text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                    AI can make mistakes.
                </div>
            </div>
        </div>
    );
};
