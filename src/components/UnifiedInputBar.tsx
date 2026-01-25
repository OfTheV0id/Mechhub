import React from "react";
import { motion } from "motion/react";
import {
    ArrowRight,
    GraduationCap,
    CheckCircle,
    ImagePlus,
} from "lucide-react";

interface UnifiedInputBarProps {
    inputValue: string;
    onInputChange: (value: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    mode: "study" | "correct";
    setMode: (mode: "study" | "correct") => void;
    onUpload: () => void;
    placeholder?: string;
    isTyping?: boolean; // For Chat interface loading state
}

export const UnifiedInputBar: React.FC<UnifiedInputBarProps> = ({
    inputValue,
    onInputChange,
    onSubmit,
    mode,
    setMode,
    onUpload,
    placeholder,
    isTyping = false,
}) => {
    return (
        <form onSubmit={onSubmit} className="w-full relative">
            <div className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 transition-colors rounded-[32px] p-2 pr-2 border border-slate-200 focus-within:border-slate-300 focus-within:ring-4 focus-within:ring-slate-100 shadow-sm">
                {/* Integrated Mode Switcher */}
                <div className="flex bg-white/80 relative p-1 rounded-[24px] border border-slate-200 mr-1 flex-shrink-0">
                    {/* Active Pill Background */}
                    <motion.div
                        className="absolute top-1 bottom-1 bg-slate-900 rounded-[20px] shadow-sm z-0"
                        layoutId="activeModeInputUnified"
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
                        onClick={() => setMode("correct")}
                        className={`relative z-10 flex items-center justify-center gap-2 px-4 py-2 rounded-[20px] text-xs font-bold transition-colors w-[100px] ${
                            mode === "correct"
                                ? "text-white"
                                : "text-slate-500 hover:text-slate-700"
                        }`}
                    >
                        <CheckCircle size={14} />
                        批改
                    </button>
                </div>

                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => onInputChange(e.target.value)}
                    placeholder={
                        placeholder ||
                        (mode === "correct" ? "上传你的解答." : "提出你的疑问.")
                    }
                    className="flex-1 bg-transparent border-none outline-none py-3 px-2 text-slate-700 placeholder:text-slate-400 text-lg min-w-0"
                />

                <button
                    type="button"
                    onClick={onUpload}
                    className="p-3 rounded-full hover:bg-slate-200 text-slate-400 transition-colors"
                >
                    <ImagePlus size={20} />
                </button>

                <button
                    type="submit"
                    disabled={!inputValue.trim() && !isTyping}
                    className="p-3 rounded-full bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md ml-1"
                >
                    <ArrowRight size={20} />
                </button>
            </div>
        </form>
    );
};
