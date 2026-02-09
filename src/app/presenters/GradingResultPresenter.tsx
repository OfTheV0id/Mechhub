import React from "react";
import { GradingResultView } from "../../views/chat/message/GradingResultView";
import type {
    GradingResult,
    ImageGradingResult,
} from "../../views/chat/types";

interface GradingResultPresenterProps {
    gradingResult: GradingResult;
    reply?: string;
    reasoning?: string;
    showThinking?: boolean;
    renderImagePanel?: (image: ImageGradingResult) => React.ReactNode;
}

export const GradingResultPresenter = ({
    gradingResult,
    reply,
    reasoning,
    showThinking = false,
    renderImagePanel,
}: GradingResultPresenterProps) => {
    const images = gradingResult.imageGradingResult || [];
    const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
    const [showAnalysis, setShowAnalysis] = React.useState(false);
    const [thinkingOpen, setThinkingOpen] = React.useState(true);

    const handlePrevImage = () => {
        setCurrentImageIndex((prev) => {
            if (images.length === 0) return prev;
            return prev > 0 ? prev - 1 : images.length - 1;
        });
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prev) => {
            if (images.length === 0) return prev;
            return prev < images.length - 1 ? prev + 1 : 0;
        });
    };

    const handleToggleAnalysis = () => {
        setShowAnalysis((prev) => {
            const next = !prev;
            if (next) {
                setThinkingOpen(true);
            }
            return next;
        });
    };

    const handleToggleThinking = () => {
        setThinkingOpen((prev) => !prev);
    };

    return (
        <GradingResultView
            gradingResult={gradingResult}
            reply={reply}
            reasoning={reasoning}
            showThinking={showThinking}
            renderImagePanel={renderImagePanel}
            currentImageIndex={currentImageIndex}
            onPrevImage={handlePrevImage}
            onNextImage={handleNextImage}
            showAnalysis={showAnalysis}
            onToggleAnalysis={handleToggleAnalysis}
            thinkingOpen={thinkingOpen}
            onToggleThinking={handleToggleThinking}
        />
    );
};
