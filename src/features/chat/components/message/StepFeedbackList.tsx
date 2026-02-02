import React from "react";
import { GradingStep } from "../../../../types/message";
import { motion } from "motion/react";
import { CheckCircle2, XCircle, Lightbulb } from "lucide-react";

interface StepFeedbackListProps {
    steps: GradingStep[];
    activeStepIndex: number | null;
    onSelectStep: (index: number) => void;
    stepRefs: React.MutableRefObject<Map<number, HTMLDivElement>>;
}

export const StepFeedbackList: React.FC<StepFeedbackListProps> = ({
    steps,
    activeStepIndex,
    onSelectStep,
    stepRefs,
}) => {
    return (
        <div className="p-6 bg-slate-50">
            <h4 className="font-bold text-lg text-slate-800 mb-5">
                AI Feedback Breakdown
            </h4>

            <div className="space-y-4">
                {steps.map((step, idx) => (
                    <motion.div
                        key={step.stepNumber}
                        ref={(el) => {
                            if (el) stepRefs.current.set(idx, el);
                        }}
                        onClick={() => onSelectStep(idx)}
                        animate={{
                            scale: activeStepIndex === idx ? 1.02 : 1,
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                        }}
                        className={`bg-white rounded-xl p-4 cursor-pointer border-2 transition-colors ${
                            activeStepIndex === idx
                                ? "border-slate-800 shadow-lg"
                                : "border-transparent hover:border-slate-200"
                        }`}
                    >
                        {/* 标题行 */}
                        <div className="flex items-center gap-2 mb-2">
                            {step.isCorrect ? (
                                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                            ) : (
                                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                            )}
                            <span className="font-bold text-slate-800">
                                Step {step.stepNumber}: {step.stepTitle}
                            </span>
                        </div>

                        {/* 评语 */}
                        <p className="text-sm text-slate-600 leading-relaxed pl-7">
                            {step.comment}
                        </p>

                        {/* 建议（如果有） */}
                        {step.suggestion && (
                            <div className="mt-3 ml-7 flex items-start gap-2 p-3 bg-amber-50 rounded-lg border border-amber-100">
                                <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-amber-700 leading-relaxed">
                                    {step.suggestion}
                                </p>
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
