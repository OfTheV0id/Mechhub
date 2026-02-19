import React from "react";

interface ChatInputViewProps {
    inputBar: React.ReactNode;
}

export const ChatInputView = ({ inputBar }: ChatInputViewProps) => {
    return (
        <div className="z-20 w-full bg-[#f8fafc] p-4">
            {inputBar}
            <div className="text-center mt-3 text-[10px] font-['courier_new'] text-slate-400 uppercase tracking-widest font-bold">
                AI can make mistakes.
            </div>
        </div>
    );
};
