import React from "react";
import { GradingStep } from "../../../../types/message";
import { CheckCircle, XCircle, Lightbulb } from "lucide-react";

interface StepFeedbackListProps {
    steps: GradingStep[];
    activeStepIndex: number | null;
    onStepClick: (index: number) => void;
}

export const StepFeedbackList: React.FC<StepFeedbackListProps> = ({
    steps,
    activeStepIndex,
    onStepClick,
}) => {
    return (
        <div className="p-4">
            <h4 className="font-bold text-lg text-slate-800 mb-4">
                步骤批改详情
            </h4>
            <div className="space-y-3">
                {steps.map((step, idx) => (
                    <div
                        key={step.stepNumber}
                        onClick={() => onStepClick(idx)}
                        className={`p-3 rounded-xl cursor-pointer transition-all ${
                            activeStepIndex === idx
                                ? step.isCorrect
                                    ? "bg-green-50 border-2 border-green-200"
                                    : "bg-red-50 border-2 border-red-200"
                                : "bg-slate-50 border-2 border-transparent hover:border-slate-200"
                        }`}
                    >
                        {/* Step Header */}
                        <div className="flex items-center gap-2 mb-2">
                            {step.isCorrect ? (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : (
                                <XCircle className="w-5 h-5 text-red-500" />
                            )}
                            <span className="font-semibold text-slate-800">
                                步骤 {step.stepNumber}: {step.stepTitle}
                            </span>
                        </div>

                        {/* Comment */}
                        <p className="text-sm text-slate-600 ml-7 mb-2">
                            {step.comment}
                        </p>

                        {/* Suggestion (if present and incorrect) */}
                        {!step.isCorrect && step.suggestion && (
                            <div className="ml-7 flex items-start gap-2 p-2 bg-amber-50 rounded-lg">
                                <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-amber-700">
                                    {step.suggestion}
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
