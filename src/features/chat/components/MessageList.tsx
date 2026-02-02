import React, { useEffect, useRef } from "react";
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
    isGradingMode = false,
}) => {
    const {
        contentRef,
        previewImage,
        openPreview,
        closePreview,
        handleScroll,
    } = useMessageList({ messages, isTyping, messagesEndRef, sessionId });

    const gradingResultRef = useRef<HTMLDivElement>(null);

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

    // Find the grading result message index for layout adjustment
    const gradingMessageIndex = messages.findIndex(msg => msg.gradingResult !== undefined);
    const shouldShowCollapsedHistory = isGradingMode && gradingMessageIndex > 0;

    // Scroll to grading result when it appears in grading mode
    useEffect(() => {
        if (isGradingMode && gradingResultRef.current && !isTyping) {
            // Delay slightly to allow DOM rendering
            const timer = setTimeout(() => {
                gradingResultRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [isGradingMode, isTyping, messages.length]);

    return (
        <div
            className={`flex-1 overflow-y-auto px-4 md:px-20 py-8 min-h-0 overflow-x-hidden ${
                isGradingMode ? "bg-gradient-to-b from-slate-50 to-white" : ""
            }`}
            style={{ overflowAnchor: "none" }}
            onScroll={handleScroll}
        >
            <div ref={contentRef} className={isGradingMode ? "space-y-6" : "space-y-8"}>
                {/* Collapsible History in Grading Mode */}
                {shouldShowCollapsedHistory && (
                    <details className="cursor-pointer">
                        <summary className="py-2 px-4 text-sm text-slate-500 hover:text-slate-700 select-none flex items-center gap-2">
                            <span>📝 查看对话历史</span>
                            <span className="text-xs">({gradingMessageIndex} 条消息)</span>
                        </summary>
                        <div className="space-y-6 mt-4 pl-4 border-l-2 border-slate-200">
                            {messages.slice(0, gradingMessageIndex).map((msg, index) => (
                                <div key={msg.id} className="w-full opacity-75">
                                    {renderMessage(msg, index)}
                                </div>
                            ))}
                        </div>
                    </details>
                )}

                {/* Main Messages */}
                {messages.map((msg, index) => {
                    // Skip already-rendered history in grading mode
                    if (shouldShowCollapsedHistory && index < gradingMessageIndex) {
                        return null;
                    }

                    const isGradingResult = msg.gradingResult !== undefined;
                    return (
                        <div
                            key={msg.id}
                            className={`w-full ${
                                isGradingMode && isGradingResult
                                    ? "bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
                                    : ""
                            }`}
                        >
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
