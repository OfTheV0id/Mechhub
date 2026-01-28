import React, { useState } from "react";
import { GradingResult } from "../../../../types/message";
import { AIAvatar } from "../../../../components";
import { ImageGradingPanel } from "./ImageGradingPanel";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface GradingResultViewProps {
    gradingResult: GradingResult;
    onImageClick?: (url: string) => void;
}

export const GradingResultView: React.FC<GradingResultViewProps> = ({
    gradingResult,
    onImageClick,
}) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const hasMultipleImages = gradingResult.images.length > 1;

    const goToPrev = () => {
        setCurrentImageIndex((prev) =>
            prev > 0 ? prev - 1 : gradingResult.images.length - 1,
        );
    };

    const goToNext = () => {
        setCurrentImageIndex((prev) =>
            prev < gradingResult.images.length - 1 ? prev + 1 : 0,
        );
    };

    return (
        <div className="w-full">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <AIAvatar isThinking={false} size={32} iconSize={16} />
                <span className="font-bold text-slate-800">批改结果</span>
            </div>

            {/* Summary Card */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl p-6 mb-4 text-white">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-slate-300">
                        总体评分
                    </span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold">
                            {gradingResult.overallScore}
                        </span>
                        <span className="text-slate-400">/ 100</span>
                    </div>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                    {gradingResult.summary}
                </p>
            </div>

            {/* Image Navigation (if multiple) */}
            {hasMultipleImages && (
                <div className="flex items-center justify-center gap-4 mb-4">
                    <button
                        onClick={goToPrev}
                        className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <span className="text-sm text-slate-600">
                        图片 {currentImageIndex + 1} /{" "}
                        {gradingResult.images.length}
                    </span>
                    <button
                        onClick={goToNext}
                        className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}

            {/* Current Image Grading Panel */}
            {gradingResult.images[currentImageIndex] && (
                <ImageGradingPanel
                    imageGrading={gradingResult.images[currentImageIndex]}
                    onImageClick={onImageClick}
                />
            )}
        </div>
    );
};
