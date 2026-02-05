import React from "react";
import { Message } from "../../../types/message";
import { TextMessage, GradingResultView, ImagePreviewModal } from "./message";
import { useMessageList } from "../hooks/useMessageList";

interface MessageListProps {
    messages: Message[];
    isTyping: boolean;
    messagesEndRef: React.RefObject<HTMLDivElement | null>;
    sessionId: string | null;
    isGradingMode?: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({
    messages,
    isTyping,
    messagesEndRef,
    sessionId,
}) => {
    const {
        contentRef,
        previewImage,
        openPreview,
        closePreview,
        handleScroll,
    } = useMessageList({ messages, isTyping, messagesEndRef, sessionId });

    const renderMessage = (msg: Message, index: number) => {
        const isLastMessage = index === messages.length - 1;
        const isGenerating =
            isTyping && isLastMessage && msg.role === "assistant";
        const showGeneratingLabel =
            isGenerating &&
            msg.type === "text" &&
            (!msg.text || msg.text.length === 0);

        if (msg.gradingResult) {
            return <GradingResultView gradingResult={msg.gradingResult} />;
        }
        return (
            <TextMessage
                role={msg.role}
                text={msg.text}
                imageUrls={msg.imageUrls}
                fileAttachments={msg.fileAttachments}
                onImageClick={openPreview}
                isGenerating={isGenerating}
                showGeneratingLabel={showGeneratingLabel}
            />
        );
    };

    return (
        <div
            className="flex-1 overflow-y-auto px-20 py-8 overflow-x-hidden bg-surface-muted"
            style={{ overflowAnchor: "none" }}
            onScroll={handleScroll}
        >
            <div ref={contentRef} className="space-y-6">
                {/* Main Messages */}
                {messages.map((msg, index) => {
                    return (
                        <div key={msg.id} className="w-full">
                            {renderMessage(msg, index)}
                        </div>
                    );
                })}
            </div>

            <div ref={messagesEndRef} className="h-4" />

            <ImagePreviewModal
                previewImage={previewImage}
                onClose={closePreview}
            />
        </div>
    );
};
