import { Sidebar } from "../../features/sidebar";
import {
    ChatInterface,
    ChatMode,
    ChatSession,
    DeleteChatResult,
    FileAttachment,
    Message,
    SubmitMessage,
} from "../../features/chat";
import type { UploadImageHandler } from "../../features/chat";
import { HomeView } from "../../features/home";
import { ProfileView } from "../../features/profile";
import { UserProfile } from "../../features/auth";
import { ActiveView } from "../types/view";

interface MainLayoutProps {
    activeView: ActiveView;
    setActiveView: (view: ActiveView) => void;
    userProfile: UserProfile;
    chatSessions: ChatSession[];
    currentSessionId: string | null;
    chatMode: ChatMode;
    setChatMode: (mode: ChatMode) => void;
    deleteChatSession: (id: string) => Promise<DeleteChatResult>;
    handleSelectSession: (id: string) => boolean;
    handleStartNewQuest: () => void;
    handleRenameSession: (id: string, newTitle: string) => Promise<boolean>;
    handleSignOut: () => void;
    isLoadingSessions: boolean;
    messages: Message[];
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
        mode?: ChatMode,
    ) => void;
}

export const MainLayout = ({
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
}: MainLayoutProps) => {
    return (
        <div className="flex h-screen bg-white text-slate-800 font-sans overflow-hidden">
            <Sidebar
                activeView={activeView}
                setActiveView={setActiveView}
                user={userProfile}
                sessions={chatSessions}
                currentSessionId={currentSessionId}
                handleSelectSession={handleSelectSession}
                handleStartNewQuest={handleStartNewQuest}
                deleteChatSession={deleteChatSession}
                onRenameSession={handleRenameSession}
                handleSignOut={handleSignOut}
                isLoading={isLoadingSessions}
            />

            <main className="flex-1 flex flex-col h-full relative overflow-hidden min-w-0 min-h-0">
                {activeView === "home" && (
                    <HomeView
                        onStartChat={onStartChat}
                        mode={chatMode}
                        setMode={setChatMode}
                        userName={userProfile.name}
                        uploadImage={uploadImage}
                    />
                )}

                {activeView === "chat" && (
                    <ChatInterface
                        messages={messages}
                        onSendMessage={onSendMessage}
                        uploadImage={uploadImage}
                        isTyping={isTyping}
                        onStop={handleStopGeneration}
                        mode={chatMode}
                        setMode={setChatMode}
                        sessionId={currentSessionId}
                    />
                )}

                {activeView === "profile" && (
                    <ProfileView
                        user={userProfile}
                        onUpdateProfile={handleUpdateProfile}
                    />
                )}
            </main>
        </div>
    );
};
