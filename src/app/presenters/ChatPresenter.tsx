import React, { useState } from "react";
import { ChatView } from "../../views/chat/ChatView";
import { ChatInputView } from "../../views/chat/parts/ChatInputView";
import { MessageListPresenter } from "./MessageListPresenter";
import { UnifiedInputBarPresenter } from "./UnifiedInputBarPresenter";
import type { ChatMode, Message, SubmitMessage, UploadImageHandler } from "../../views/chat/types";

interface ChatPresenterProps {
    messages: Message[];
    isTyping: boolean;
    sessionId: string | null;
    onSendMessage: (payload: SubmitMessage) => void;
    uploadImage: UploadImageHandler;
    mode: ChatMode;
    setMode: (mode: ChatMode) => void;
    onStop?: () => void;
}

export const ChatPresenter = ({
    messages,
    isTyping,
    sessionId,
    onSendMessage,
    uploadImage,
    mode,
    setMode,
    onStop,
}: ChatPresenterProps) => {
    const [model, setModel] = useState("qwen3-vl-235b-a22b-thinking");

    return (
        <ChatView
            messageList={
                <MessageListPresenter
                    messages={messages}
                    isTyping={isTyping}
                    sessionId={sessionId}
                />
            }
            chatInput={
                <ChatInputView
                    inputBar={
                        <UnifiedInputBarPresenter
                            onSendMessage={onSendMessage}
                            uploadImage={uploadImage}
                            mode={mode}
                            setMode={setMode}
                            model={model}
                            setModel={setModel}
                            isTyping={isTyping}
                            onStop={onStop}
                        />
                    }
                />
            }
        />
    );
};
