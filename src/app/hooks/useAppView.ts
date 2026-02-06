import { useState } from "react";
import { FileAttachment, SubmitMessage } from "../../types/message";
import { ActiveView } from "../../types/view";

interface UseAppViewParams {
    handleSendMessage: (
        payload: SubmitMessage,
        switchToChatView?: () => void,
    ) => void;
}

export const useAppView = ({ handleSendMessage }: UseAppViewParams) => {
    const [activeView, setActiveView] = useState<ActiveView>("home");

    const switchToChat = () => setActiveView("chat");

    const onSendMessage = (payload: SubmitMessage) => {
        handleSendMessage(payload, switchToChat);
    };

    const onSendMessageWrapper = (
        text: string,
        imageUrls?: string[],
        fileAttachments?: FileAttachment[],
        model?: string,
    ) => {
        onSendMessage({ text, imageUrls, fileAttachments, model });
    };

    const onStartChat = (
        message?: string,
        imageUrls?: string[],
        fileAttachments?: FileAttachment[],
        model?: string,
    ) => {
        onSendMessageWrapper(
            message || (imageUrls || fileAttachments ? "" : "我们开始吧！"),
            imageUrls,
            fileAttachments,
            model,
        );
    };

    return {
        activeView,
        setActiveView,
        onSendMessage,
        onSendMessageWrapper,
        onStartChat,
    };
};
