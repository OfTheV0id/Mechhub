import React from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { Annotation } from "../../../../types/message";

interface AnnotationDetailProps {
    annotation: Annotation;
    index: number;
}

export const AnnotationDetail: React.FC<AnnotationDetailProps> = ({
    annotation,
    index,
}) => (
    <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-2 mb-2">
            {annotation.type === "correct" ? (
                <CheckCircle2 size={18} className="text-green-500" />
            ) : (
                <AlertCircle size={18} className="text-red-500" />
            )}
            <span className="font-bold text-sm text-slate-700">
                步骤 {index + 1}:{" "}
                {annotation.type === "correct" ? "正确" : "发现问题"}
            </span>
        </div>
        <p className="text-sm text-slate-500 leading-relaxed">
            {annotation.comment}
        </p>
    </div>
);
