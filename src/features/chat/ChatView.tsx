import React, { useRef } from "react";
import { ChatInput } from "./components/ChatInput";
import { MessageList } from "./components/MessageList";
import { Message, FileAttachment } from "../../types/message";
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
    sessionId: string | null; // For detecting session switches
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
    messages,
    onSendMessage,
    onStop,
    isTyping,
    mode,
    setMode,
    sessionId,
}) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { inputText, setInputText, handleSubmit } =
        useChatInterface(onSendMessage);

    // Detect grading mode: check if last message has gradingResult and mode is "correct"
    const lastMessage = messages[messages.length - 1];
    const hasGradingResult = lastMessage?.gradingResult !== undefined;
    const isGradingMode = mode === "correct" && hasGradingResult;

    return (
        <div className="absolute inset-0 flex flex-col bg-white z-0">
            <MessageList
                messages={messages}
                isTyping={isTyping}
                messagesEndRef={messagesEndRef}
                sessionId={sessionId}
                isGradingMode={isGradingMode}
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
