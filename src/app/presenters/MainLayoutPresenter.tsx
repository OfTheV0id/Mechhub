import { MainLayoutView } from "@views/layout/MainLayoutView";
import { HomePresenter } from "./HomePresenter";
import { ChatPresenter } from "./ChatPresenter";
import { SidebarPresenter } from "./SidebarPresenter";
import { ProfilePresenter } from "./ProfilePresenter";
import type {
    ChatMode as HookChatMode,
    ChatSession as HookChatSession,
    DeleteChatResult,
    FileAttachment,
    Message as HookMessage,
    SubmitMessage,
    UploadImageHandler,
    UserProfile as HookUserProfile,
} from "@hooks";
import type { ActiveView } from "@views/shared/types";
import { mapChatSession, mapMessage } from "../mappers/chat";
import { mapUserProfile } from "../mappers/user";

interface MainLayoutPresenterProps {
    activeView: ActiveView;
    setActiveView: (view: ActiveView) => void;
    userProfile: HookUserProfile;
    chatSessions: HookChatSession[];
    currentSessionId: string | null;
    chatMode: HookChatMode;
    setChatMode: (mode: HookChatMode) => void;
    deleteChatSession: (id: string) => Promise<DeleteChatResult>;
    handleSelectSession: (id: string) => boolean;
    handleStartNewQuest: () => void;
    handleRenameSession: (id: string, newTitle: string) => Promise<boolean>;
    handleSignOut: () => void;
    isLoadingSessions: boolean;
    messages: HookMessage[];
    onSendMessage: (submitMessage: SubmitMessage) => void;
    uploadImage: UploadImageHandler;
    isTyping: boolean;
    handleStopGeneration: () => void;
    handleUpdateProfile: (name: string, role: string, avatar: string) => void;
    onStartChat: (
        message?: string,
        imageUrls?: string[],
        fileAttachments?: FileAttachment[],
        model?: string,
        mode?: HookChatMode,
    ) => void;
}

export const MainLayoutPresenter = ({
    activeView,
    setActiveView,
    userProfile,
    chatSessions,
    currentSessionId,
    chatMode,
    setChatMode,
    deleteChatSession,
    handleSelectSession,
    handleStartNewQuest,
    handleRenameSession,
    handleSignOut,
    isLoadingSessions,
    messages,
    onSendMessage,
    uploadImage,
    isTyping,
    handleStopGeneration,
    handleUpdateProfile,
    onStartChat,
}: MainLayoutPresenterProps) => {
    const viewUserProfile = mapUserProfile(userProfile);
    const viewSessions = chatSessions.map(mapChatSession);
    const viewMessages = messages.map(mapMessage);

    return (
        <MainLayoutView
            activeView={activeView}
            sidebar={
                <SidebarPresenter
                    activeView={activeView}
                    setActiveView={setActiveView}
                    userProfile={viewUserProfile}
                    sessions={viewSessions}
                    currentSessionId={currentSessionId}
                    isLoading={isLoadingSessions}
                    handleSelectSession={handleSelectSession}
                    handleStartNewQuest={handleStartNewQuest}
                    deleteChatSession={deleteChatSession}
                    handleRenameSession={handleRenameSession}
                    handleSignOut={handleSignOut}
                />
            }
            home={
                <HomePresenter
                    onStartChat={onStartChat}
                    mode={chatMode}
                    setMode={setChatMode}
                    userName={viewUserProfile.name}
                    uploadImage={uploadImage}
                />
            }
            chat={
                <ChatPresenter
                    messages={viewMessages}
                    onSendMessage={onSendMessage}
                    uploadImage={uploadImage}
                    isTyping={isTyping}
                    onStop={handleStopGeneration}
                    mode={chatMode}
                    setMode={setChatMode}
                    sessionId={currentSessionId}
                />
            }
            profile={
                <ProfilePresenter
                    user={userProfile}
                    onUpdateProfile={handleUpdateProfile}
                />
            }
        />
    );
};
