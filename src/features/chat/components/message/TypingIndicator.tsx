import React from "react";
import { motion } from "motion/react";
import { AIAvatar } from "../../../../components";

export const TypingIndicator: React.FC = () => (
    <div className="w-full flex gap-6">
        <AIAvatar isThinking={true} />
        <div className="flex items-center gap-2 py-3 bg-white px-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm">
            {[0, 0.2, 0.4].map((delay, i) => (
                <motion.div
                    key={i}
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay }}
                    className="w-1.5 h-1.5 bg-slate-500 rounded-full"
                />
            ))}
        </div>
    </div>
);
