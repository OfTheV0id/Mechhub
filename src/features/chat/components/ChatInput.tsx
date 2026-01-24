import React from "react";
import { motion } from "motion/react";
import { Send, Image as ImageIcon, GraduationCap, Shield } from "lucide-react";

interface ChatInputProps {
    inputText: string;
    setInputText: (text: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    mode: "study" | "boss";
    setMode: (mode: "study" | "boss") => void;
    onUpload: () => void;
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
        <div className="p-6 md:px-20 bg-white/80 backdrop-blur-sm border-t border-slate-100 sticky bottom-0 z-20">
            {/* Suggestion / Input Wrapper */}
            <form
                onSubmit={onSubmit}
                className="max-w-4xl mx-auto flex items-center gap-2 bg-slate-50 hover:bg-slate-100 transition-colors rounded-[32px] p-2 pr-2 border border-slate-200 focus-within:border-slate-300 focus-within:ring-4 focus-within:ring-slate-100 shadow-sm"
            >
                {/* Integrated Mode Switcher */}
                <div className="flex bg-white/80 relative p-1 rounded-[24px] border border-slate-200 mr-1 flex-shrink-0">
                    {/* Active Pill Background */}
                    <motion.div
                        className="absolute top-1 bottom-1 bg-slate-900 rounded-[20px] shadow-sm z-0"
                        layoutId="activeModeInput"
                        initial={false}
                        animate={{
                            left: mode === "study" ? "4px" : "calc(50% + 2px)",
                            width: "calc(50% - 6px)",
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 30,
                        }}
                    />

                    <button
                        type="button"
                        onClick={() => setMode("study")}
                        className={`relative z-10 flex items-center justify-center gap-2 px-4 py-2 rounded-[20px] text-xs font-bold transition-colors w-[100px] ${
                            mode === "study"
                                ? "text-white"
                                : "text-slate-500 hover:text-slate-700"
                        }`}
                    >
                        <GraduationCap size={14} />
                        提问
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode("boss")}
                        className={`relative z-10 flex items-center justify-center gap-2 px-4 py-2 rounded-[20px] text-xs font-bold transition-colors w-[100px] ${
                            mode === "boss"
                                ? "text-white"
                                : "text-slate-500 hover:text-slate-700"
                        }`}
                    >
                        <Shield size={14} />
                        批改
                    </button>
                </div>

                <div className="h-8 w-[1px] bg-slate-200 mx-1"></div>

                <button
                    type="button"
                    onClick={onUpload}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:bg-white hover:text-slate-900 transition-all border border-transparent hover:border-slate-200 hover:shadow-sm"
                    title="上传作业"
                >
                    <ImageIcon size={20} />
                </button>

                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={
                        mode === "boss"
                            ? "传入你的过程进行批改..."
                            : "有问题尽管问..."
                    }
                    className="flex-1 bg-transparent border-none outline-none py-3 px-2 text-slate-700 placeholder:text-slate-400 text-lg min-w-0"
                />

                <button
                    type="submit"
                    disabled={!inputText.trim() && !isTyping}
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-900 text-white disabled:bg-slate-200 disabled:text-slate-400 transition-all hover:scale-105 shadow-md hover:shadow-lg flex-shrink-0"
                >
                    <Send size={18} />
                </button>
            </form>
            <div className="text-center mt-3 text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                MechHub AI - 你的理论力学智能助手
            </div>
        </div>
    );
};
