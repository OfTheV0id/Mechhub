import React, { useState } from "react";
import { GradingResult } from "../../../../types/message";
import { AIAvatar } from "../../../../components";
import { ImageGradingPanel } from "./ImageGradingPanel";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface GradingResultViewProps {
    gradingResult: GradingResult;
}

export const GradingResultView: React.FC<GradingResultViewProps> = ({
    gradingResult,
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
            {/* Prominent Header with Enhanced Styling */}
            <div className="flex items-center gap-3 mb-6">
                <AIAvatar isThinking={false} size={40} iconSize={20} />
                <div className="flex-1">
                    <h2 className="text-2xl font-bold text-slate-900">批改结果</h2>
                    <p className="text-xs text-slate-500 mt-1">详细的作业批改报告</p>
                </div>
            </div>

            {/* Enhanced Summary Card with Better Visual Hierarchy */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 mb-8 shadow-lg border-2 border-blue-200">
                <div className="flex items-start gap-3 mb-4">
                    <div className="flex-shrink-0 w-1 h-10 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full" />
                    <div className="flex-1">
                        <h3 className="text-sm font-semibold text-blue-700 uppercase tracking-wider mb-3">总体评价</h3>
                        <p className="text-base leading-relaxed text-slate-800">
                            {gradingResult.summary}
                        </p>
                    </div>
                </div>
            </div>

            {/* Image Navigation Section */}
            {hasMultipleImages && (
                <div className="flex items-center justify-center gap-6 mb-8 px-4 py-3 bg-slate-50 rounded-2xl">
                    <button
                        onClick={goToPrev}
                        className="p-3 rounded-full bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all text-slate-700"
                        aria-label="上一张"
                    >
                        <ChevronLeft size={20} strokeWidth={2} />
                    </button>
                    <span className="text-base font-semibold text-slate-700 min-w-max">
                        图片 {currentImageIndex + 1} / {images.length}
                    </span>
                    <button
                        onClick={goToNext}
                        className="p-3 rounded-full bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all text-slate-700"
                        aria-label="下一张"
                    >
                        <ChevronRight size={20} strokeWidth={2} />
                    </button>
                </div>
            )}

            {/* Current Image Grading Panel */}
            {currentImage ? (
                <div className="mb-2">
                    <ImageGradingPanel imageGrading={currentImage} />
                </div>
            ) : (
                <div className="bg-slate-100 rounded-2xl p-12 text-center text-slate-500 border border-slate-200">
                    <p className="font-semibold">未找到图片数据</p>
                    <p className="text-xs mt-2">
                        images: {JSON.stringify(images)}
                    </p>
                </div>
            )}
        </div>
    );
};
