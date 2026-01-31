import React, { useRef, useEffect } from "react";
import { ChatInput } from "./components/ChatInput";
import { MessageList } from "./components/MessageList";
import { Message, FileAttachment } from "../../types/message";
import { UserProfile } from "../../types/user";
import { useChatInterface } from "./hooks/useChatInterface";

export type { Message };

interface ChatInterfaceProps {
    messages: Message[];
    onSendMessage: (
        text: string,
        imageUrls?: string[],
        fileAttachments?: FileAttachment[],
    ) => void;
    onStop?: () => void;
    isTyping: boolean;

    mode: "study" | "correct";
    setMode: (mode: "study" | "correct") => void;
    user?: UserProfile;
    sessionId?: string | null; // For detecting session switches
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
    messages,
    onSendMessage,
    onStop,
    isTyping,
    mode,
    setMode,
    user,
    sessionId,
}) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { inputText, setInputText, handleSubmit } = useChatInterface(
        onSendMessage,
        mode,
        setMode,
    );

    // Scroll handling is now delegated to MessageList's ResizeObserver
    // to correctly handle dynamic content (KaTeX, Images) resizing.

    return (
        <div className="absolute inset-0 flex flex-col bg-white z-0">
            <MessageList
                messages={messages}
                isTyping={isTyping}
                messagesEndRef={messagesEndRef}
                userName={user?.name}
                userAvatar={user?.avatar}
                sessionId={sessionId}
            />

            <ChatInput
                inputText={inputText}
                setInputText={setInputText}
                onSubmit={handleSubmit}
                mode={mode}
                setMode={setMode}
                isTyping={isTyping}
                onStop={onStop}
            />
        </div>
    );
};
