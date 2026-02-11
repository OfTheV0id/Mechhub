import { useTextMessageUiState } from "@hooks";
import { TextMessageView } from "@views/chat/message/TextMessageView";
import type { FileAttachment } from "@views/chat/types";

interface TextMessagePresenterProps {
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
}

export const TextMessagePresenter = ({
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
        />
    );
};

