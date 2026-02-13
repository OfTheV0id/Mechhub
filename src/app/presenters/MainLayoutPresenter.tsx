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
    canAccessChat: boolean;
    canAccessProfile: boolean;
    canAccessClassHub: boolean;
    canAccessStudentAssignments: boolean;
    canAccessTeacherAssignments: boolean;
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
    handleUpdateProfile: (name: string, avatar: string) => void;
    onStartChat: (
        message?: string,
        imageUrls?: string[],
        fileAttachments?: FileAttachment[],
        model?: string,
        mode?: HookChatMode,
    ) => void;
    onShareChatMessageToClass?: (messageId: string) => void;
    classHub?: React.ReactNode;
    submitAssignment?: React.ReactNode;
    viewFeedback?: React.ReactNode;
    publishAssignment?: React.ReactNode;
    gradeAssignment?: React.ReactNode;
}

export const MainLayoutPresenter = ({
    activeView,
    setActiveView,
    canAccessChat,
    canAccessProfile,
    canAccessClassHub,
    canAccessStudentAssignments,
    canAccessTeacherAssignments,
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
    onShareChatMessageToClass,
    classHub,
    submitAssignment,
    viewFeedback,
    publishAssignment,
    gradeAssignment,
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
                    canAccessChat={canAccessChat}
                    canAccessProfile={canAccessProfile}
                    canAccessClassHub={canAccessClassHub}
                    canAccessStudentAssignments={canAccessStudentAssignments}
                    canAccessTeacherAssignments={canAccessTeacherAssignments}
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
                canAccessChat ? (
                    <HomePresenter
                        onStartChat={onStartChat}
                        mode={chatMode}
                        setMode={setChatMode}
                        userName={viewUserProfile.name}
                        uploadImage={uploadImage}
                    />
                ) : undefined
            }
            chat={
                canAccessChat ? (
                    <ChatPresenter
                        messages={viewMessages}
                        onSendMessage={onSendMessage}
                        uploadImage={uploadImage}
                        isTyping={isTyping}
                        onStop={handleStopGeneration}
                        mode={chatMode}
                        setMode={setChatMode}
                        sessionId={currentSessionId}
                        onShareToClassMessage={onShareChatMessageToClass}
                    />
                ) : undefined
            }
            profile={
                canAccessProfile ? (
                    <ProfilePresenter
                        user={userProfile}
                        onUpdateProfile={handleUpdateProfile}
                    />
                ) : undefined
            }
            classHub={classHub}
            submitAssignment={submitAssignment}
            viewFeedback={viewFeedback}
            publishAssignment={publishAssignment}
            gradeAssignment={gradeAssignment}
        />
    );
};
