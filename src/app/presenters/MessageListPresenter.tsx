import { useMessageListUiState } from "@hooks";
import { MessageListView } from "@views/chat/parts/MessageListView";
import type { Message } from "@views/chat/types";
import { TextMessagePresenter } from "./TextMessagePresenter";
import { ImageGradingPanelPresenter } from "./ImageGradingPanelPresenter";
import { GradingResultPresenter } from "./GradingResultPresenter";

interface MessageListPresenterProps {
    messages: Message[];
    isTyping: boolean;
    sessionId: string | null;
}

export const MessageListPresenter = ({
    messages,
    isTyping,
    sessionId,
}: MessageListPresenterProps) => {
    const {
        contentRef,
        messagesEndRef,
        previewImage,
        openPreview,
        closePreview,
        handleScroll,
        autoOpenThinkingMessageId,
    } = useMessageListUiState({
        messages,
        isTyping,
        sessionId,
    });

    const isThinkingModel = (model?: string) =>
        typeof model === "string" && model.includes("thinking");

    const items = messages.map((msg, index) => {
        const isLastMessage = index === messages.length - 1;
        const isGenerating = isTyping && isLastMessage && msg.role === "assistant";
        const shouldAutoOpenThinking =
            msg.id === autoOpenThinkingMessageId &&
            msg.role === "assistant" &&
            msg.mode === "study";

        if (msg.gradingResult) {
            return (
                <div key={msg.id} className="w-full">
                    <GradingResultPresenter
                        gradingResult={msg.gradingResult}
                        reply={msg.text}
                        reasoning={msg.reasoning}
                        showThinking={isThinkingModel(msg.model)}
                        renderImagePanel={(image) => (
                            <ImageGradingPanelPresenter imageGrading={image} />
                        )}
                    />
                </div>
            );
        }

        return (
            <div key={msg.id} className="w-full">
                <TextMessagePresenter
                    role={msg.role}
                    text={msg.text}
                    reasoning={msg.reasoning}
                    showThinking={
                        msg.role === "assistant" && isThinkingModel(msg.model)
                    }
                    autoOpenThinking={shouldAutoOpenThinking}
                    autoScrollThinking={shouldAutoOpenThinking}
                    imageUrls={msg.imageUrls}
                    fileAttachments={msg.fileAttachments}
                    onImageClick={openPreview}
                    isGenerating={isGenerating}
                />
            </div>
        );
    });

    return (
        <MessageListView
            items={items}
            contentRef={contentRef}
            messagesEndRef={messagesEndRef}
            onScroll={handleScroll}
            previewImage={previewImage}
            onClosePreview={closePreview}
        />
    );
};

