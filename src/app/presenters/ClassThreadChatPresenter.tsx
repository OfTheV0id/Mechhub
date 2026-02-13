import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Send } from "lucide-react";
import { useClassThreadMessages, usePostClassMessage } from "@hooks";
import { GroupTextMessageView } from "@views/chat/message";
import styles from "@views/shared/scrollbar.module.css";

interface ClassThreadChatPresenterProps {
    threadId: string;
    className: string;
    threadTitle: string;
    currentUserId: string;
}

const renderClassMessageContent = (content: Record<string, unknown>) => {
    if (typeof content.text === "string" && content.text.trim()) {
        return content.text;
    }
    if (content.kind === "shared_chat") {
        return "Shared a private chat session.";
    }
    if (content.kind === "shared_grade") {
        return "Shared a grade result.";
    }
    try {
        return JSON.stringify(content);
    } catch {
        return "[Unsupported message content]";
    }
};

export const ClassThreadChatPresenter = ({
    threadId,
    className,
    threadTitle,
    currentUserId,
}: ClassThreadChatPresenterProps) => {
    const [inputValue, setInputValue] = useState("");
    const scrollAnchorRef = useRef<HTMLDivElement | null>(null);

    const threadMessagesQuery = useClassThreadMessages(threadId, !!threadId);
    const postClassMessageMutation = usePostClassMessage();

    const messages = threadMessagesQuery.data ?? [];

    useEffect(() => {
        scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, [messages.length]);

    const sortedMessages = useMemo(
        () =>
            [...messages].sort(
                (left, right) =>
                    new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime(),
            ),
        [messages],
    );

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const text = inputValue.trim();
        if (!text) {
            return;
        }
        try {
            await postClassMessageMutation.mutateAsync({
                threadId,
                content: { text },
            });
            setInputValue("");
        } catch (error) {
            console.error("Failed to send class thread message", error);
        }
    };

    return (
        <div className="absolute inset-0 z-0 flex flex-col bg-white">
            <header className="border-b border-slate-200 bg-white px-6 py-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Class Group Chat
                </p>
                <h2 className="mt-1 text-xl font-bold text-slate-900">{className}</h2>
                <p className="text-sm text-slate-600">{threadTitle}</p>
            </header>

            <div
                className={`flex-1 overflow-y-auto bg-slate-50 px-6 py-5 ${styles.scrollbar}`}
            >
                <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
                    {sortedMessages.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-6 text-center text-sm text-slate-500">
                            Begin with new group chat
                        </div>
                    ) : (
                        sortedMessages.map((message) => (
                            <GroupTextMessageView
                                key={message.id}
                                content={renderClassMessageContent(message.content)}
                                senderName={message.senderName ?? "Class Member"}
                                senderAvatar={message.senderAvatar}
                                createdAt={message.createdAt}
                                isOwnMessage={message.senderUserId === currentUserId}
                                role={message.role}
                            />
                        ))
                    )}
                    <div ref={scrollAnchorRef} />
                </div>
            </div>

            <form
                onSubmit={handleSubmit}
                className="border-t border-slate-200 bg-white px-6 py-4"
            >
                <div className="mx-auto flex w-full max-w-5xl items-center gap-2">
                    <input
                        value={inputValue}
                        onChange={(event) => setInputValue(event.target.value)}
                        placeholder="Type a message, use @ai to trigger AI reply"
                        className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                    />
                    <button
                        type="submit"
                        disabled={postClassMessageMutation.isPending}
                        className="inline-flex items-center gap-1 rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
                    >
                        <Send size={14} />
                        {postClassMessageMutation.isPending ? "Sending..." : "Send"}
                    </button>
                </div>
            </form>
        </div>
    );
};
