import React, { useState } from "react";
import { ImageGradingResult, GradingStep } from "../../../../types/message";
import { StepAnnotationBox } from "./StepAnnotationBox";
import { StepFeedbackList } from "./StepFeedbackList";
import { ZoomIn } from "lucide-react";

interface ImageGradingPanelProps {
    imageGrading: ImageGradingResult;
    onImageClick?: (url: string) => void;
}

export const ImageGradingPanel: React.FC<ImageGradingPanelProps> = ({
    imageGrading,
    onImageClick,
}) => {
    const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex flex-col lg:flex-row">
                {/* Image with Annotations */}
                <div className="flex-1 relative bg-slate-50 min-h-[400px]">
                    <div
                        className="relative w-full h-full cursor-zoom-in group"
                        onClick={() => onImageClick?.(imageGrading.imageUrl)}
                    >
                        <img
                            src={imageGrading.imageUrl}
                            alt="作业图片"
                            className="w-full h-full object-contain"
                        />
                        {/* Overlay zoom icon */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                            <ZoomIn
                                className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg"
                                size={32}
                            />
                        </div>
                        {/* Step Annotation Boxes */}
                        {imageGrading.steps.map((step, idx) => (
                            <StepAnnotationBox
                                key={step.stepNumber}
                                step={step}
                                isActive={activeStepIndex === idx}
                                onClick={(e: React.MouseEvent) => {
                                    e.stopPropagation();
                                    setActiveStepIndex(
                                        activeStepIndex === idx ? null : idx,
                                    );
                                }}
                            />
                        ))}
                    </div>
                    {/* Image Score Badge */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-md">
                        <span className="text-sm font-bold text-slate-700">
                            {imageGrading.score}分
                        </span>
                    </div>
                </div>

                {/* Step Feedback Sidebar */}
                <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-slate-100">
                    <StepFeedbackList
                        steps={imageGrading.steps}
                        activeStepIndex={activeStepIndex}
                        onStepClick={(idx: number) =>
                            setActiveStepIndex(
                                activeStepIndex === idx ? null : idx,
                            )
                        }
                    />
                </div>
            </div>
        </div>
    );
};
