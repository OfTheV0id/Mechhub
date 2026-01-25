import React, { useRef, useEffect } from "react";
import { ChatInput } from "./components/ChatInput";
import { MessageList } from "./components/MessageList";
import { Message } from "../../types/message";
import { useChatInterface } from "./hooks/useChatInterface";

export type { Message };

interface ChatInterfaceProps {
    messages: Message[];
    onSendMessage: (text: string, image?: File) => void;
    isTyping: boolean;
    onOpenSubmission: () => void;
    mode: "study" | "boss";
    setMode: (mode: "study" | "boss") => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
    messages,
    onSendMessage,
    isTyping,
    onOpenSubmission,
    mode,
    setMode,
}) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { inputText, setInputText, handleSubmit, handleMockImageUpload } =
        useChatInterface(onSendMessage, mode, setMode);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    return (
        <div className="flex-1 flex flex-col h-full bg-white relative">
            <MessageList
                messages={messages}
                isTyping={isTyping}
                messagesEndRef={messagesEndRef}
            />
            <ChatInput
                inputText={inputText}
                setInputText={setInputText}
                onSubmit={handleSubmit}
                mode={mode}
                setMode={setMode}
                onUpload={handleMockImageUpload}
                isTyping={isTyping}
            />
        </div>
    );
};
