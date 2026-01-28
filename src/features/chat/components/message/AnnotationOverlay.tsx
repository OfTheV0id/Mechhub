import React from "react";
import { Annotation } from "../../../../types/message";

interface AnnotationOverlayProps {
    annotation: Annotation;
}

export const AnnotationOverlay: React.FC<AnnotationOverlayProps> = ({
    annotation,
}) => (
    <div
        className="absolute border-2 bg-white/10 backdrop-blur-sm rounded-lg flex items-start justify-end p-2 cursor-pointer hover:bg-white/20 transition-colors group"
        style={{
            left: `${annotation.x}%`,
            top: `${annotation.y}%`,
            width: `${annotation.width}%`,
            height: `${annotation.height}%`,
            borderColor:
                annotation.type === "correct"
                    ? "#22C55E"
                    : annotation.type === "incorrect"
                      ? "#EF4444"
                      : "#3B82F6",
        }}
    >
        <div
            className={`px-2 py-1 rounded text-xs font-bold text-white shadow-sm ${
                annotation.type === "correct"
                    ? "bg-green-500"
                    : annotation.type === "incorrect"
                      ? "bg-red-500"
                      : "bg-blue-500"
            }`}
        >
            {annotation.type === "correct"
                ? "正确"
                : annotation.type === "incorrect"
                  ? "错误"
                  : "建议"}
        </div>
    </div>
);
