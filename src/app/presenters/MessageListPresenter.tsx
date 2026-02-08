import React from "react";
import { useMessageListUiState } from "../../hooks";
import { MessageListView } from "../../views/chat/parts/MessageListView";
import { GradingResultView } from "../../views/chat/message/GradingResultView";
import type { Message } from "../../views/chat/types";
import { TextMessagePresenter } from "./TextMessagePresenter";
import { ImageGradingPanelPresenter } from "./ImageGradingPanelPresenter";

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
    const messagesEndRef = React.useRef<HTMLDivElement | null>(null);
    const { contentRef, previewImage, openPreview, closePreview, handleScroll } =
        useMessageListUiState({
            messages,
            isTyping,
            sessionId,
            messagesEndRef,
        });

    const isThinkingModel = (model?: string) =>
        typeof model === "string" && model.includes("thinking");

    const items = messages.map((msg, index) => {
        const isLastMessage = index === messages.length - 1;
        const isGenerating = isTyping && isLastMessage && msg.role === "assistant";

        if (msg.gradingResult) {
            return (
                <div key={msg.id} className="w-full">
                    <GradingResultView
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
