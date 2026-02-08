import React from "react";
import { useTextCopyState } from "../../hooks";
import { TextMessageView } from "../../views/chat/message/TextMessageView";
import type { FileAttachment } from "../../views/chat/types";

interface TextMessagePresenterProps {
    role: "user" | "assistant";
    text: string;
    reasoning?: string;
    showThinking?: boolean;
    imageUrls?: string[];
    fileAttachments?: FileAttachment[];
    onImageClick: (url: string) => void;
    isGenerating?: boolean;
}

export const TextMessagePresenter = ({
    role,
    text,
    reasoning,
    showThinking,
    imageUrls,
    fileAttachments,
    onImageClick,
    isGenerating,
}: TextMessagePresenterProps) => {
    const { isCopied, handleCopyText } = useTextCopyState(text);

    return (
        <TextMessageView
            role={role}
            text={text}
            reasoning={reasoning}
            showThinking={showThinking}
            imageUrls={imageUrls}
            fileAttachments={fileAttachments}
            onImageClick={onImageClick}
            isGenerating={isGenerating}
            isCopied={isCopied}
            onCopy={handleCopyText}
        />
    );
};
