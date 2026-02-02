import React, { useRef } from "react";
import { ChatInput } from "./components/ChatInput";
import { MessageList } from "./components/MessageList";
import { Message, FileAttachment } from "../../types/message";
import { useChatInterface } from "./hooks/useChatInterface";
import { CheckCircle } from "lucide-react";
import { motion } from "motion/react";

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
            {/* Grading Mode Indicator Banner */}
            {isGradingMode && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-gradient-to-r from-amber-50 to-blue-50 border-b-2 border-amber-200 px-6 py-3 flex items-center gap-3"
                >
                    <CheckCircle size={20} className="text-blue-600 flex-shrink-0" />
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-900">批改模式</p>
                        <p className="text-xs text-slate-600">查看详细的作业批改报告</p>
                    </div>
                </motion.div>
            )}

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
