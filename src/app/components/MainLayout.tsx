import { Sidebar } from "../../features/sidebar";
import { ChatInterface } from "../../features/chat";
import { HomeView } from "../../features/home";
import { ProfileView } from "../../features/profile";
import { FileAttachment, Message, SubmitMessage } from "../../types/message";
import { ChatSession } from "../../types/session";
import { UserProfile } from "../../types/user";
import { ActiveView } from "../../types/view";
import { ChatMode, DeleteChatResult } from "../../features/chat";

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
    isTyping: boolean;
    handleStopGeneration: () => void;
    handleUpdateProfile: (name: string, role: string, avatar: string) => void;
    onStartChat: (
        message?: string,
        imageUrls?: string[],
        fileAttachments?: FileAttachment[],
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
                    />
                )}

                {activeView === "chat" && (
                    <ChatInterface
                        messages={messages}
                        onSendMessage={onSendMessage}
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
