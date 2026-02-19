import React from "react";

interface ChatViewProps {
    messageList: React.ReactNode;
    chatInput: React.ReactNode;
}

export const ChatView = ({ messageList, chatInput }: ChatViewProps) => {
    return (
        <div className="absolute inset-0 z-0 flex flex-col">
            {messageList}
            {chatInput}
        </div>
    );
};
