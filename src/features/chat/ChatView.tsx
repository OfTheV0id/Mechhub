import React, { useRef } from "react";
import { ChatInput } from "./components/ChatInput";
import { MessageList } from "./components/MessageList";
import { Message, SubmitMessage } from "../../types/message";
import { useChatInput } from "./hooks/useChatInput";
import { ChatMode } from "./types/chat";

export type { Message };

interface ChatInterfaceProps {
    messages: Message[];
    onSendMessage: (submitMessage: SubmitMessage) => void;
    onStop?: () => void;
    isTyping: boolean;
    mode: ChatMode;
    setMode: (mode: ChatMode) => void;
    sessionId: string | null;
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
        useChatInput(onSendMessage);

    const lastMessage = messages[messages.length - 1];
    const hasGradingResult = lastMessage?.gradingResult !== undefined;
    const isGradingMode = mode === "correct" && hasGradingResult;

    return (
        <div className="absolute inset-0 z-0 flex flex-col bg-white">
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
