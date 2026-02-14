import { useClassThreadChatState } from "@hooks";
import { ClassThreadChatView } from "@views/chat/ClassThreadChatView";

interface ClassThreadChatPresenterProps {
    threadId: string;
    className: string;
    threadTitle: string;
    currentUserId: string;
}

export const ClassThreadChatPresenter = ({
    threadId,
    className,
    threadTitle,
    currentUserId,
}: ClassThreadChatPresenterProps) => {
    const classThreadChatState = useClassThreadChatState(threadId);

    return (
        <ClassThreadChatView
            className={className}
            threadTitle={threadTitle}
            messages={classThreadChatState.state.messages}
            currentUserId={currentUserId}
            inputValue={classThreadChatState.state.inputValue}
            onInputChange={classThreadChatState.actions.handleInputChange}
            onSendMessage={classThreadChatState.actions.handleSubmit}
            isSending={classThreadChatState.meta.isSending}
            renderMessageContent={
                classThreadChatState.derived.renderMessageContent
            }
            scrollAnchorRef={classThreadChatState.state.scrollAnchorRef}
        />
    );
};
