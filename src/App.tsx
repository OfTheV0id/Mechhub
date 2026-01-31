import { useState, useEffect } from "react";
import { Sidebar } from "./components";
import { ChatInterface } from "./features/chat/ChatView";
import { HomeView } from "./features/home/HomeView";
import { ProfileView } from "./features/profile/ProfileView";
import { AuthPage } from "./features/auth/AuthPage";
import { LandingPage } from "./features/landing/LandingPage";
import { Toaster, toast } from "sonner";
import { LogOut } from "lucide-react";
import { useAuth } from "./hooks/useAuth/useAuth";
import { useChatSession } from "./hooks/useChat/useChatSession";
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
    } = useChatSession(session);

    const [activeView, setActiveView] = useState("home"); // 'home', 'chat', 'profile'

    // Initial fetch when session becomes available
    useEffect(() => {
        if (session) {
            fetchChatSessions();
        }
    }, [session]);

    // Wrapper to switch view when selecting a session
    const onSelectSessionWrapper = (id: string) => {
        if (handleSelectSession(id)) {
            setActiveView("chat");
        }
    };

    // Wrapper to switch view when deleting (if needed) or just delete
    const onDeleteSessionWrapper = async (id: string) => {
        const result = await deleteChatSession(id);
        if (result.success) {
            toast.success("对话已删除");
            // If the current session was deleted, switch to home view
            if (result.wasCurrentSession) {
                setActiveView("home");
            }
        } else {
            toast.error("删除失败");
        }
    };

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

    const onStartNewQuestWrapper = () => {
        handleStartNewQuest();
        setActiveView("home");
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

            <div className="flex flex-col h-full">
                <Sidebar
                    activeView={activeView}
                    setActiveView={setActiveView}
                    onNewQuest={onStartNewQuestWrapper}
                    user={userProfile}
                    sessions={chatSessions}
                    currentSessionId={currentSessionId}
                    onSelectSession={onSelectSessionWrapper}
                    onDeleteSession={onDeleteSessionWrapper}
                    onRenameSession={handleRenameSession}
                />
                <div className="mt-auto p-4 border-r border-slate-100 bg-white">
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-red-500 transition-colors w-full px-4 py-2 rounded-lg hover:bg-slate-50"
                    >
                        <LogOut size={14} />
                        退出登录
                    </button>
                </div>
            </div>

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
                        user={userProfile}
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
