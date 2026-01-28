import React, { useState } from "react";
import { Message } from "../../../types/message";
import {
    TextMessage,
    GradingMessage,
    GradingResultView,
    TypingIndicator,
    ImagePreviewModal,
} from "./message";

interface MessageListProps {
    messages: Message[];
    isTyping: boolean;
    messagesEndRef: React.RefObject<HTMLDivElement | null>;
    userName?: string;
    userAvatar?: string;
}

export const MessageList: React.FC<MessageListProps> = ({
    messages,
    isTyping,
    messagesEndRef,
    userName = "你",
    userAvatar,
}) => {
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const renderMessage = (msg: Message) => {
        // Check for structured grading result first
        if (msg.gradingResult) {
            return (
                <GradingResultView
                    gradingResult={msg.gradingResult}
                    onImageClick={(url) => setPreviewImage(url)}
                />
            );
        }

        // Legacy grading message type
        if (msg.type === "grading") {
            return (
                <GradingMessage
                    imageUrl={msg.imageUrl}
                    annotations={msg.annotations}
                    score={msg.score}
                    onImageClick={(url) => setPreviewImage(url)}
                />
            );
        }

        // Default text message
        return (
            <TextMessage
                role={msg.role}
                content={msg.content}
                userName={userName}
                userAvatar={userAvatar}
                imageUrl={msg.imageUrl}
                imageUrls={msg.imageUrls}
                fileAttachments={msg.fileAttachments}
                onImageClick={(url) => setPreviewImage(url)}
            />
        );
    };

    return (
        <div className="flex-1 overflow-y-auto px-4 md:px-20 py-8 space-y-8 scroll-smooth">
            {messages.map((msg) => (
                <div key={msg.id} className="w-full">
                    {renderMessage(msg)}
                </div>
            ))}

            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} className="h-4" />

            <ImagePreviewModal
                previewImage={previewImage}
                onClose={() => setPreviewImage(null)}
            />
        </div>
    );
};
