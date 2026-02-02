import React from "react";
import { Message } from "../../../types/message";
import { TextMessage, GradingResultView, ImagePreviewModal } from "./message";
import { useMessageList } from "../hooks/useMessageList";

interface MessageListProps {
    messages: Message[];
    isTyping: boolean;
    messagesEndRef: React.RefObject<HTMLDivElement | null>;
    sessionId: string | null;
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

        if (msg.gradingResult) {
            return <GradingResultView gradingResult={msg.gradingResult} />;
        }
        return (
            <TextMessage
                role={msg.role}
                content={msg.content}
                imageUrls={msg.imageUrls}
                fileAttachments={msg.fileAttachments}
                onImageClick={openPreview}
                isGenerating={isGenerating}
            />
        );
    };

    return (
        <div
            className="flex-1 overflow-y-auto px-4 md:px-20 py-8 space-y-8 min-h-0 overflow-x-hidden"
            style={{ overflowAnchor: "none" }}
            onScroll={handleScroll}
        >
            <div ref={contentRef} className="space-y-8">
                {messages.map((msg, index) => (
                    <div key={msg.id} className="w-full">
                        {renderMessage(msg, index)}
                    </div>
                ))}
            </div>

            <div ref={messagesEndRef} className="h-4" />

            <ImagePreviewModal
                previewImage={previewImage}
                onClose={closePreview}
            />
        </div>
    );
};
