import { useTextMessageUiState } from "@hooks";
import { TextMessageView } from "@views/chat/message/TextMessageView";
import type { FileAttachment } from "@views/chat/types";

interface TextMessagePresenterProps {
    messageId: string;
    role: "user" | "assistant";
    text: string;
    reasoning?: string;
    showThinking?: boolean;
    autoOpenThinking?: boolean;
    autoScrollThinking?: boolean;
    imageUrls?: string[];
    fileAttachments?: FileAttachment[];
    onImageClick: (url: string) => void;
    isGenerating?: boolean;
    onShareToClass?: (messageId: string) => void;
}

export const TextMessagePresenter = ({
    messageId,
    role,
    text,
    reasoning,
    showThinking,
    autoOpenThinking,
    autoScrollThinking,
    imageUrls,
    fileAttachments,
    onImageClick,
    isGenerating,
    onShareToClass,
}: TextMessagePresenterProps) => {
    const {
        isCopied,
        handleCopyText,
        thinkingOpen,
        handleToggleThinking,
        isAttachmentExpanded,
        handleToggleAttachment,
    } = useTextMessageUiState(text, { autoOpenThinking });

    return (
        <TextMessageView
            role={role}
            text={text}
            reasoning={reasoning}
            showThinking={showThinking}
            thinkingOpen={thinkingOpen}
            onToggleThinking={handleToggleThinking}
            autoScrollThinking={autoScrollThinking}
            imageUrls={imageUrls}
            fileAttachments={fileAttachments}
            isAttachmentExpanded={isAttachmentExpanded}
            onToggleAttachment={handleToggleAttachment}
            onImageClick={onImageClick}
            isGenerating={isGenerating}
            isCopied={isCopied}
            onCopy={handleCopyText}
            onShareToClass={
                onShareToClass ? () => onShareToClass(messageId) : undefined
            }
        />
    );
};
