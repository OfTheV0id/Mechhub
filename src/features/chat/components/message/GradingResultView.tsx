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

    // Debug logging
    console.log("[GradingResultView] gradingResult:", gradingResult);
    console.log(
        "[GradingResultView] images:",
        gradingResult.imageGradingResult,
    );

    const images = gradingResult.imageGradingResult || [];
    const hasMultipleImages = images.length > 1;
    const currentImage = images[currentImageIndex];

    const goToPrev = () => {
        setCurrentImageIndex((prev) =>
            prev > 0 ? prev - 1 : images.length - 1,
        );
    };

    const goToNext = () => {
        setCurrentImageIndex((prev) =>
            prev < images.length - 1 ? prev + 1 : 0,
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
                        图片 {currentImageIndex + 1} / {images.length}
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
            {currentImage ? (
                <ImageGradingPanel
                    imageGrading={currentImage}
                    onImageClick={onImageClick}
                />
            ) : (
                <div className="bg-slate-100 rounded-2xl p-8 text-center text-slate-500">
                    <p>未找到图片数据</p>
                    <p className="text-xs mt-2">
                        images: {JSON.stringify(images)}
                    </p>
                </div>
            )}
        </div>
    );
};
