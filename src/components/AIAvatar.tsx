import React from "react";
import { motion } from "motion/react";
import { Settings } from "lucide-react";

interface AIAvatarProps {
    className?: string;
    isThinking?: boolean;
    size?: number;
    iconSize?: number;
}

export const AIAvatar = ({
    className,
    isThinking = false,
    size = 40,
    iconSize = 20,
}: AIAvatarProps) => {
    return (
        <div
            className={`flex items-center justify-center ${className}`}
            style={{ width: size, height: size }}
        >
            <motion.div
                animate={isThinking ? { rotate: 360 } : { rotate: 0 }}
                transition={
                    isThinking
                        ? {
                              duration: 4,
                              repeat: Infinity,
                              ease: "linear",
                          }
                        : { duration: 0 }
                }
            >
                <Settings size={iconSize} className="text-black" />
            </motion.div>
        </div>
    );
};
