import React from "react";
import { motion } from "motion/react";
import { UnifiedInputBar, AIAvatar } from "../../components";

interface HomeViewProps {
    onStartChat: (message?: string) => void;
    mode?: "study" | "correct";
    setMode?: (mode: "study" | "correct") => void;
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

import { useHomeView } from "./hooks/useHomeView";

export const HomeView: React.FC<HomeViewProps> = ({
    onStartChat,
    mode = "study",
    setMode = () => {},
    userName = "同学",
}) => {
    const { inputValue, setInputValue, handleSubmit, handleMockImageUpload } =
        useHomeView(onStartChat, mode, setMode);

    return (
        <div className="flex-1 h-full flex flex-col items-center justify-center p-8 bg-white relative">
            <div className="max-w-6xl w-full flex flex-col items-start p-[0px] mt-[0px] mr-[0px] mb-[0px] ml-[50px]">
                {/* Top Greeting Row */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center gap-3 mb-4"
                >
                    <AIAvatar isThinking={true} />
                    {/* Greeting */}
                    <span className="text-2xl font-semibold text-slate-900 font-sans m-[0px]">
                        Hi, {userName}
                    </span>
                </motion.div>

                <div className="w-[90%] max-w-5xl">
                    <h1
                        className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-3 tracking-tight leading-tight min-h-[1.2em]"
                        style={{ fontFamily: "Courier New, monospace" }}
                    >
                        <TypewriterText
                            text="Where should we start?"
                            delay={0.3}
                        />
                    </h1>

                    {/* Bottom Search Bar */}
                    <div className="w-full relative">
                        <UnifiedInputBar
                            inputValue={inputValue}
                            onInputChange={setInputValue}
                            onSubmit={handleSubmit}
                            mode={mode}
                            setMode={setMode}
                            onUpload={handleMockImageUpload}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
