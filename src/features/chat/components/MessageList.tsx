import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Message } from "../../../types/message";
import {
    TextMessage,
    GradingResultView,
    TypingIndicator,
    ImagePreviewModal,
} from "./message";

// You can replace this URL with any MP3 link you like!
// Recommended: Try https://www.soundjay.com/buttons/sounds/button-3.mp3 for a 'click' sound
const NOTIFICATION_SOUND_URL =
    "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3";

interface MessageListProps {
    messages: Message[];
    isTyping: boolean;
    messagesEndRef: React.RefObject<HTMLDivElement | null>;
    userName?: string;
    userAvatar?: string;
    sessionId?: string | null; // Track session switches
}

export const MessageList: React.FC<MessageListProps> = ({
    messages,
    isTyping,
    messagesEndRef,
    sessionId,
}) => {
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const prevSessionIdRef = useRef<string | null>(sessionId || null);

    // Force scroll to bottom when switching to a different session (entering a conversation)
    useEffect(() => {
        if (sessionId && sessionId !== prevSessionIdRef.current) {
            // Session switched - user clicked into a conversation
            prevSessionIdRef.current = sessionId;

            // Use setTimeout to ensure DOM has updated with new messages
            setTimeout(() => {
                if (messagesEndRef.current) {
                    messagesEndRef.current.scrollIntoView({
                        behavior: "auto",
                        block: "end",
                    });
                }
            }, 0);
        }
    }, [sessionId, messagesEndRef]);

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
                150; //  threshold - strieter to avoid fighting user scroll

            if (isAtBottom && messagesEndRef.current) {
                // User is at bottom: scroll to show new content
                messagesEndRef.current.scrollIntoView({
                    behavior: "auto",
                    block: "nearest",
                });
            }
            // If user is scrolled up, do nothing - let them read in peace
        });

        observer.observe(contentEl);

        return () => observer.disconnect();
    }, [messages]);

    const renderMessage = (msg: Message, index: number) => {
        const isLastMessage = index === messages.length - 1;
        const isGenerating =
            isTyping && isLastMessage && msg.role === "assistant";

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
                isGenerating={isGenerating}
            />
        );
    };

    const [showNewMessageToast, setShowNewMessageToast] = useState(false);
    const prevIsTypingRef = useRef(isTyping);

    // Sound effect
    const playNotificationSound = () => {
        try {
            // Simple "ding" sound
            const audio = new Audio(NOTIFICATION_SOUND_URL);
            audio.volume = 0.5;
            audio.play().catch((e) => console.log("Audio play failed", e));
        } catch (e) {
            console.error("Audio error", e);
        }
    };

    // Check scroll position and manage toast visibility
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.currentTarget;
        const isAtBottom =
            target.scrollHeight - target.scrollTop - target.clientHeight < 70;

        if (isAtBottom) {
            setShowNewMessageToast(false);
        }
    };

    // Detect generation finish
    useEffect(() => {
        const wasTyping = prevIsTypingRef.current;
        const isNowTyping = isTyping;
        prevIsTypingRef.current = isNowTyping;

        // If generation finished (true -> false)
        if (wasTyping && !isNowTyping) {
            const scrollContainer = contentRef.current?.parentElement;
            if (!scrollContainer) return;

            // Check if user is scrolled up
            const isAtBottom =
                scrollContainer.scrollHeight -
                    scrollContainer.scrollTop -
                    scrollContainer.clientHeight <
                70;

            if (!isAtBottom) {
                // User is looking at history -> Show notification
                setShowNewMessageToast(true);
                playNotificationSound();
            }
        }
    }, [isTyping]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        setShowNewMessageToast(false);
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

            {isTyping &&
                (!messages.length ||
                    messages[messages.length - 1].role !== "assistant") && (
                    <TypingIndicator />
                )}

            <AnimatePresence>
                {showNewMessageToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 30 }}
                        transition={{ duration: 0.2 }}
                        className="flex justify-center py-4 mb-4"
                    >
                        <button
                            onClick={scrollToBottom}
                            className="px-6 py-3 bg-slate-900 text-white text-sm font-semibold rounded-full shadow-lg hover:bg-slate-800 active:bg-slate-700 transition-colors cursor-pointer"
                        >
                            ⬇️ 新消息
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div ref={messagesEndRef} className="h-4" />

            <ImagePreviewModal
                previewImage={previewImage}
                onClose={() => setPreviewImage(null)}
            />
        </div>
    );
};
