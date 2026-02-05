import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Message } from "../../../types/message";

const NOTIFICATION_SOUND_URL =
    "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3";

interface UseMessageListProps {
    messages: Message[];
    isTyping: boolean;
    messagesEndRef: React.RefObject<HTMLDivElement | null>;
    sessionId: string | null;
}

export const useMessageList = ({
    messages,
    isTyping,
    messagesEndRef,
    sessionId,
}: UseMessageListProps) => {
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const prevSessionIdRef = useRef<string | null>(null);
    const prevIsTypingRef = useRef(isTyping);
    const toastIdRef = useRef<string | number | null>(null);

    // Force scroll to bottom when switching to a different session
    useEffect(() => {
        if (sessionId && sessionId !== prevSessionIdRef.current) {
            prevSessionIdRef.current = sessionId;
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

    // Auto-scroll to bottom when height changes (only if at bottom)
    useEffect(() => {
        const scrollContainer = contentRef.current?.parentElement;
        const contentEl = contentRef.current;
        if (!scrollContainer || !contentEl) return;

        const observer = new ResizeObserver(() => {
            const isAtBottom =
                scrollContainer.scrollHeight -
                    scrollContainer.scrollTop -
                    scrollContainer.clientHeight <
                300;

            if (isAtBottom && messagesEndRef.current) {
                messagesEndRef.current.scrollIntoView({
                    behavior: "auto",
                    block: "nearest",
                });
            }
        });

        observer.observe(contentEl);
        return () => observer.disconnect();
    }, [messages, messagesEndRef]);

    // Sound effect
    const playNotificationSound = () => {
        try {
            const audio = new Audio(NOTIFICATION_SOUND_URL);
            audio.volume = 0.3;
            audio.play().catch((e) => console.log("Audio play failed", e));
        } catch (e) {
            console.error("Audio error", e);
        }
    };

    // Check scroll position and dismiss toast
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.currentTarget;
        const isAtBottom =
            target.scrollHeight - target.scrollTop - target.clientHeight < 70;

        if (isAtBottom && toastIdRef.current !== null) {
            toast.dismiss(toastIdRef.current);
            toastIdRef.current = null;
        }
    };

    // Detect generation finish
    useEffect(() => {
        const wasTyping = prevIsTypingRef.current;
        const isNowTyping = isTyping;
        prevIsTypingRef.current = isNowTyping;

        if (wasTyping && !isNowTyping) {
            const scrollContainer = contentRef.current?.parentElement;
            if (!scrollContainer) return;

            const isAtBottom =
                scrollContainer.scrollHeight -
                    scrollContainer.scrollTop -
                    scrollContainer.clientHeight <
                300;

            if (!isAtBottom) {
                toastIdRef.current = toast.success("有新消息", {
                    action: {
                        label: "查看",
                        onClick: () => {
                            messagesEndRef.current?.scrollIntoView({
                                behavior: "smooth",
                                block: "end",
                            });
                        },
                    },
                    actionButtonStyle: {
                        background: "transparent",
                        color: "inherit",
                        border: "none",
                        padding: 0,
                    },
                });
                playNotificationSound();
            }
        }
    }, [isTyping, messagesEndRef]);

    const openPreview = (url: string) => setPreviewImage(url);
    const closePreview = () => setPreviewImage(null);

    return {
        contentRef,
        previewImage,
        openPreview,
        closePreview,
        handleScroll,
    };
};
