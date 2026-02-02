import { useState, useEffect } from "react";
import { Sidebar } from "./features/sidebar/Sidebar";
import { ChatInterface } from "./features/chat/ChatView";
import { HomeView } from "./features/home/HomeView";
import { ProfileView } from "./features/profile/ProfileView";
import { AuthPage } from "./features/auth/AuthPage";
import { LandingPage } from "./features/landing/LandingPage";
import { Toaster } from "sonner";
import { useAuth } from "./features/auth/hooks/useAuth";
import { useChatSession } from "./features/chat/hooks/useChatSession";
import { FileAttachment } from "./types/message";

export default function App() {
    const {
        session,
        loading,
        showAuth,
        setShowAuth,
        userProfile,
        handleUpdateProfile,
        handleSignOut,
    } = useAuth();
    const {
        messages,
        isTyping,
        chatSessions,
        currentSessionId,
        chatMode,
        setChatMode,
        fetchChatSessions,
        deleteChatSession,
        handleSelectSession,
        handleStartNewQuest,
        handleSendMessage,
        handleRenameSession,
        handleStopGeneration,
        isLoadingSessions,
    } = useChatSession(session);

    const [activeView, setActiveView] = useState("home"); // 'home', 'chat', 'profile'

    // Initial fetch when session becomes available
    useEffect(() => {
        if (session) {
            fetchChatSessions();
        }
    }, [session]);

    // Wrapper to switch view on new message
    const onSendMessageWrapper = (
        text: string,
        imageUrls?: string[],
        fileAttachments?: FileAttachment[],
    ) => {
        handleSendMessage(
            text,
            imageUrls,
            () => setActiveView("chat"),
            fileAttachments,
        );
    };

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-[#F8FAFC]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
            </div>
        );
    }

    if (!session) {
        if (showAuth) {
            return (
                <>
                    <Toaster position="top-center" richColors />
                    <AuthPage onLoginSuccess={() => {}} />
                </>
            );
        }

        return (
            <>
                <Toaster position="top-center" richColors />
                <LandingPage
                    onStart={() => setShowAuth(true)}
                    onLogin={() => setShowAuth(true)}
                />
            </>
        );
    }

    if (activeView === "landing") {
        return (
            <>
                <Toaster position="top-center" richColors />
                <LandingPage
                    onStart={() => setActiveView("home")}
                    onLogin={() => setActiveView("home")}
                />
            </>
        );
    }

    return (
        <div className="flex h-screen bg-white text-slate-800 font-sans overflow-hidden">
            <Toaster position="top-center" richColors />

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
                        onStartChat={(msg, imageUrls, fileAttachments) =>
                            onSendMessageWrapper(
                                msg ||
                                    (imageUrls || fileAttachments
                                        ? ""
                                        : "我们开始吧！"),
                                imageUrls,
                                fileAttachments,
                            )
                        }
                        mode={chatMode}
                        setMode={setChatMode}
                        userName={userProfile.name}
                    />
                )}

                {activeView === "chat" && (
                    <ChatInterface
                        messages={messages}
                        onSendMessage={onSendMessageWrapper}
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
}
