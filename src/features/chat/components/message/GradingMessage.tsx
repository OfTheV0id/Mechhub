import React from "react";
import { Annotation } from "../../../../types/message";
import { AIAvatar } from "../../../../components";
import { AnnotationOverlay } from "./AnnotationOverlay";
import { AnnotationDetail } from "./AnnotationDetail";

interface GradingMessageProps {
    imageUrl?: string;
    annotations?: Annotation[];
    score?: number;
    onImageClick?: (url: string) => void;
}

export const GradingMessage: React.FC<GradingMessageProps> = ({
    imageUrl,
    annotations,
    score,
    onImageClick,
}) => (
    <div className="w-full">
        <div className="flex items-center gap-2 mb-4">
            <AIAvatar isThinking={false} size={32} iconSize={16} />
            <span className="font-bold text-slate-800">批改结果</span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-8">
            <div
                className="flex-1 relative rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 min-h-[400px] cursor-zoom-in"
                onClick={() => imageUrl && onImageClick?.(imageUrl)}
            >
                <img
                    src={imageUrl}
                    alt="Homework"
                    className="w-full h-full object-contain"
                />
                {annotations?.map((ann) => (
                    <AnnotationOverlay key={ann.id} annotation={ann} />
                ))}
            </div>

            <div className="w-full lg:w-80 flex flex-col gap-4">
                <h4 className="font-bold text-lg text-slate-800">
                    AI 反馈详情
                </h4>
                <div className="space-y-4">
                    {annotations?.map((ann, idx) => (
                        <AnnotationDetail
                            key={ann.id}
                            annotation={ann}
                            index={idx}
                        />
                    ))}
                </div>
                <div className="mt-auto pt-4 border-t border-slate-100">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                        总分
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-slate-900">
                            {score}
                        </span>
                        <span className="text-slate-400">/ 100</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
);
