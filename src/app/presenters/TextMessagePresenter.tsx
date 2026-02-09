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
    const [thinkingOpen, setThinkingOpen] = React.useState(false);
    const [expandedAttachmentMap, setExpandedAttachmentMap] = React.useState<
        Record<number, boolean>
    >({});

    const handleToggleThinking = () => {
        setThinkingOpen((prev) => !prev);
    };

    const handleToggleAttachment = (index: number) => {
        setExpandedAttachmentMap((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    const isAttachmentExpanded = (index: number) =>
        Boolean(expandedAttachmentMap[index]);

    return (
        <TextMessageView
            role={role}
            text={text}
            reasoning={reasoning}
            showThinking={showThinking}
            thinkingOpen={thinkingOpen}
            onToggleThinking={handleToggleThinking}
            imageUrls={imageUrls}
            fileAttachments={fileAttachments}
            isAttachmentExpanded={isAttachmentExpanded}
            onToggleAttachment={handleToggleAttachment}
            onImageClick={onImageClick}
            isGenerating={isGenerating}
            isCopied={isCopied}
            onCopy={handleCopyText}
        />
    );
};
