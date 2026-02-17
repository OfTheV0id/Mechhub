import { useMessageListUiState } from "@hooks";
import { MessageListView } from "@views/chat/parts/MessageListView";
import type { Message } from "@views/chat/types";
import { TextMessagePresenter } from "./TextMessagePresenter";
import { ImageGradingPanelPresenter } from "./ImageGradingPanelPresenter";
import { GradingResultPresenter } from "./GradingResultPresenter";

interface MessageListPresenterProps {
    messages: Message[];
    isTyping: boolean;
    sessionId: string | null;
    onShareToClassMessage?: (messageId: string) => void;
    onSubmitToAssignmentMessage?: (messageId: string) => void;
    showActions?: boolean;
    className?: string;
    contentClassName?: string;
}

export const MessageListPresenter = ({
    messages,
    isTyping,
    sessionId,
    onShareToClassMessage,
    onSubmitToAssignmentMessage,
    showActions = true,
    className,
    contentClassName,
}: MessageListPresenterProps) => {
    const {
        contentRef,
        messagesEndRef,
        previewImage,
        openPreview,
        closePreview,
        handleScroll,
        messageRenderItems,
    } = useMessageListUiState({
        messages,
        isTyping,
        sessionId,
    });

    const items = messageRenderItems.map((item) => {
        if (item.renderKind === "grading" && item.message.gradingResult) {
            return (
                <div key={item.message.id} className="w-full">
                    <GradingResultPresenter
                        gradingResult={item.message.gradingResult}
                        reply={item.message.text}
                        reasoning={item.message.reasoning}
                        ocrText={item.message.ocrText}
                        showThinking={item.showThinking}
                        renderImagePanel={(image) => (
                            <ImageGradingPanelPresenter imageGrading={image} />
                        )}
                    />
                </div>
            );
        }

        return (
            <div key={item.message.id} className="w-full">
                <TextMessagePresenter
                    messageId={item.message.id}
                    role={item.message.role}
                    text={item.message.text}
                    reasoning={item.message.reasoning}
                    showThinking={item.showThinking}
                    autoOpenThinking={item.shouldAutoOpenThinking}
                    autoScrollThinking={item.shouldAutoOpenThinking}
                    imageUrls={item.message.imageUrls}
                    fileAttachments={item.message.fileAttachments}
                    onImageClick={openPreview}
                    isGenerating={item.isGenerating}
                    onShareToClass={onShareToClassMessage}
                    onSubmitToAssignment={onSubmitToAssignmentMessage}
                    showActions={showActions}
                />
            </div>
        );
    });

    return (
        <MessageListView
            items={items}
            contentRef={contentRef}
            messagesEndRef={messagesEndRef}
            onScroll={handleScroll}
            previewImage={previewImage}
            onClosePreview={closePreview}
            className={className}
            contentClassName={contentClassName}
        />
    );
};
