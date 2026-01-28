import React from "react";
import { GradingStep } from "../../../../types/message";
import { CheckCircle, XCircle } from "lucide-react";

interface StepAnnotationBoxProps {
    step: GradingStep;
    isActive: boolean;
    onClick: (e: React.MouseEvent) => void;
}

export const StepAnnotationBox: React.FC<StepAnnotationBoxProps> = ({
    step,
    isActive,
    onClick,
}) => {
    const boxColor = step.isCorrect
        ? "border-green-500 bg-green-500/10"
        : "border-red-500 bg-red-500/10";

    const activeColor = step.isCorrect
        ? "border-green-500 bg-green-500/30"
        : "border-red-500 bg-red-500/30";

    return (
        <div
            onClick={onClick}
            className={`absolute border-2 rounded-lg cursor-pointer transition-all ${
                isActive ? activeColor : boxColor
            } hover:${activeColor}`}
            style={{
                left: `${step.bbox.x}%`,
                top: `${step.bbox.y}%`,
                width: `${step.bbox.width}%`,
                height: `${step.bbox.height}%`,
            }}
        >
            {/* Step Number Badge */}
            <div
                className={`absolute -top-3 -left-3 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md ${
                    step.isCorrect ? "bg-green-500" : "bg-red-500"
                }`}
            >
                {step.stepNumber}
            </div>

            {/* Step Title (shown when active) */}
            {isActive && (
                <div
                    className={`absolute -bottom-8 left-0 px-2 py-1 rounded text-xs font-medium text-white whitespace-nowrap shadow-md ${
                        step.isCorrect ? "bg-green-600" : "bg-red-600"
                    }`}
                >
                    {step.isCorrect ? (
                        <CheckCircle className="inline w-3 h-3 mr-1" />
                    ) : (
                        <XCircle className="inline w-3 h-3 mr-1" />
                    )}
                    {step.stepTitle}
                </div>
            )}
        </div>
    );
};
