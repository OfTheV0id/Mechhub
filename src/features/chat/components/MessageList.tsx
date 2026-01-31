import React, { useState, useEffect, useRef } from "react";
import { Message } from "../../../types/message";
import {
    TextMessage,
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
}) => {
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when height changes (KaTeX rendering, images, etc.)
    // BUT only if user is already at the bottom
    useEffect(() => {
        const scrollContainer = contentRef.current?.parentElement;
        const contentEl = contentRef.current;
        if (!scrollContainer || !contentEl) return;

        const observer = new ResizeObserver(() => {
            // Check if user is currently scrolled to (or very near) the bottom
            const isAtBottom =
                scrollContainer.scrollHeight -
                    scrollContainer.scrollTop -
                    scrollContainer.clientHeight <
                100; // 100px threshold

            if (isAtBottom && messagesEndRef.current) {
                // User is at bottom: scroll to show new content
                messagesEndRef.current.scrollIntoView({ behavior: "auto" });
            }
            // If user is scrolled up, do nothing - let them read in peace
        });

        observer.observe(contentEl);

        return () => observer.disconnect();
    }, [messages]);

    const renderMessage = (msg: Message) => {
        if (msg.gradingResult) {
            return (
                <GradingResultView
                    gradingResult={msg.gradingResult}
                    onImageClick={(url) => setPreviewImage(url)}
                />
            );
        }
        return (
            <TextMessage
                role={msg.role}
                content={msg.content}
                imageUrls={msg.imageUrls}
                fileAttachments={msg.fileAttachments}
                onImageClick={(url) => setPreviewImage(url)}
            />
        );
    };

    return (
        <div
            className="flex-1 overflow-y-auto px-4 md:px-20 py-8 space-y-8 min-h-0 overflow-x-hidden"
            style={{ overflowAnchor: "none" }}
        >
            <div ref={contentRef} className="space-y-8">
                {messages.map((msg) => (
                    <div key={msg.id} className="w-full">
                        {renderMessage(msg)}
                    </div>
                ))}
            </div>

            {isTyping && <TypingIndicator />}

            <div ref={messagesEndRef} className="h-4" />

            <ImagePreviewModal
                previewImage={previewImage}
                onClose={() => setPreviewImage(null)}
            />
        </div>
    );
};
