import React from "react";
import { GradingStep } from "../../../../types/message";
import { motion } from "motion/react";

interface StepAnnotationBoxProps {
    step: GradingStep;
    isActive: boolean;
    onSelect: () => void;
    isCompact?: boolean;
}

export const StepAnnotationBox: React.FC<StepAnnotationBoxProps> = ({
    step,
    isActive,
    onSelect,
    isCompact = false,
}) => {
    const labelText = step.isCorrect
        ? `Step ${step.stepNumber}: Correct`
        : `Step ${step.stepNumber}: ${step.stepTitle}`;

    // Colors
    const correctColor = "#22c55e"; // green-500
    const incorrectColor = "#ef4444"; // red-500
    const activeColor = "#1e293b"; // slate-800
    const baseColor = step.isCorrect ? correctColor : incorrectColor;

    return (
        <motion.div
            className="absolute cursor-pointer z-10"
            onClick={(e) => {
                e.stopPropagation(); // 阻止触发图片预览
                onSelect();
            }}
            animate={{ scale: isActive ? 1.02 : 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{
                left: `${step.bbox.x}%`,
                top: `${step.bbox.y}%`,
                width: `${step.bbox.width}%`,
                height: `${step.bbox.height}%`,
            }}
        >
            {/* 边框 */}
            <motion.div
                className="w-full h-full rounded-xl border-2"
                animate={{
                    borderColor: isActive ? activeColor : baseColor,
                    backgroundColor: isActive
                        ? `${activeColor}10` // 10% opacity
                        : `${baseColor}10`,
                    boxShadow: isActive
                        ? `0 0 0 4px ${activeColor}20` // 20% opacity
                        : "none",
                }}
                transition={{ duration: 0.2 }}
            />

            {/* 标签 - Compact模式下不显示 */}
            {!isCompact && (
                <motion.div
                    className="absolute left-1/2 -bottom-5 px-3 py-1.5 rounded-lg shadow-md whitespace-nowrap text-xs font-semibold z-10"
                    style={{ transform: "translateX(-50%)" }}
                    animate={{
                        backgroundColor: isActive ? activeColor : "#ffffff",
                        color: isActive ? "#ffffff" : "#475569",
                        borderColor: isActive ? activeColor : "#e2e8f0",
                    }}
                    transition={{ duration: 0.2 }}
                >
                    {labelText}
                </motion.div>
            )}
        </motion.div>
    );
};
