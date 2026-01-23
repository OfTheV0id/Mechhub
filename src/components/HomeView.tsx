import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
    ArrowRight,
    GraduationCap,
    Shield,
    Image as ImageIcon,
    Settings,
} from "lucide-react";

interface HomeViewProps {
    onStartChat: (message?: string) => void;
    mode?: "study" | "boss";
    setMode?: (mode: "study" | "boss") => void;
    userName?: string;
}

const TypewriterText = ({
    text,
    delay = 0,
}: {
    text: string;
    delay?: number;
}) => {
    const letters = text.split("");

    return (
        <span className="inline-block text-left no-underline p-[0px]">
            {letters.map((letter, i) => (
                <motion.span
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                        duration: 0.1,
                        delay: delay + i * 0.05,
                        ease: "easeOut",
                    }}
                >
                    {letter}
                </motion.span>
            ))}
        </span>
    );
};

export const HomeView: React.FC<HomeViewProps> = ({
    onStartChat,
    mode = "study",
    setMode = () => {},
    userName = "同学",
}) => {
    const [inputValue, setInputValue] = React.useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim()) {
            onStartChat(inputValue);
        }
    };

    const handleMockImageUpload = () => {
        if (mode !== "boss") setMode("boss");
        // We can simulate an image upload by starting chat with a specific message that triggers image logic in parent
        onStartChat("请帮我批改这道静力学习题");
    };

    return (
        <div className="flex-1 h-full flex flex-col items-center justify-center p-8 bg-white relative">
            <div className="max-w-4xl w-full flex flex-col items-start p-[0px] mt-[0px] mr-[0px] mb-[0px] ml-[50px]">
                {/* Top Greeting Row */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center gap-3 mb-4"
                >
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100">
                        {/* Spinning Black Gear */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                        >
                            <Settings size={20} className="text-black" />
                        </motion.div>
                    </div>
                    {/* Greeting */}
                    <span className="text-2xl font-semibold text-slate-900 font-sans m-[0px]">
                        Hi, {userName}
                    </span>
                </motion.div>

                {/* Big Typewriter Heading */}
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-2 tracking-tight font-['Abhaya_Libre'] leading-tight h-[1.2em]">
                    <TypewriterText text="Where should we start?" delay={0.3} />
                </h1>

                {/* Bottom Search Bar */}
                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-2xl relative"
                >
                    <div className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 transition-colors rounded-[32px] p-2 pr-2 border border-slate-200 focus-within:border-slate-300 focus-within:ring-4 focus-within:ring-slate-100 shadow-sm p-[8px]">
                        {/* Integrated Mode Switcher */}
                        <div className="flex bg-white/80 relative p-1 rounded-[24px] border border-slate-200 mr-1 flex-shrink-0">
                            {/* Active Pill Background */}
                            <motion.div
                                className="absolute top-1 bottom-1 bg-slate-900 rounded-[20px] shadow-sm z-0"
                                layoutId="activeModeInputHome"
                                initial={false}
                                animate={{
                                    left:
                                        mode === "study"
                                            ? "4px"
                                            : "calc(50% + 2px)",
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
                            onClick={handleMockImageUpload}
                            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:bg-white hover:text-slate-900 transition-all border border-transparent hover:border-slate-200 hover:shadow-sm"
                            title="上传作业"
                        >
                            <ImageIcon size={20} />
                        </button>

                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder={
                                mode === "boss"
                                    ? "传入你的过程进行批改..."
                                    : "问问你的 AI 学习搭档..."
                            }
                            className="flex-1 bg-transparent border-none outline-none py-3 px-2 text-slate-700 placeholder:text-slate-400 text-lg min-w-0"
                        />

                        <button
                            type="submit"
                            disabled={!inputValue.trim()}
                            className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-900 text-white disabled:bg-slate-200 disabled:text-slate-400 transition-all hover:scale-105 shadow-md hover:shadow-lg flex-shrink-0"
                        >
                            <ArrowRight size={20} />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

interface ActionCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    buttonText: string;
    onClick: () => void;
}
