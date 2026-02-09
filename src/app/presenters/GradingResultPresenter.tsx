import type { ReactNode } from "react";
import { useGradingResultUiState } from "@hooks";
import { GradingResultView } from "@views/chat/message/GradingResultView";
import type {
    GradingResult,
    ImageGradingResult,
} from "@views/chat/types";

interface GradingResultPresenterProps {
    gradingResult: GradingResult;
    reply?: string;
    reasoning?: string;
    showThinking?: boolean;
    renderImagePanel?: (image: ImageGradingResult) => ReactNode;
}

export const GradingResultPresenter = ({
    gradingResult,
    reply,
    reasoning,
    showThinking = false,
    renderImagePanel,
}: GradingResultPresenterProps) => {
    const images = gradingResult.imageGradingResult || [];
    const {
        currentImageIndex,
        showAnalysis,
        thinkingOpen,
        handlePrevImage,
        handleNextImage,
        handleToggleAnalysis,
        handleToggleThinking,
    } = useGradingResultUiState(images);

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
