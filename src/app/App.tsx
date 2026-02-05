import { useChat } from "../features/chat";
import { useAuth } from "../features/auth";
import { LandingPage } from "../features/landing";
import { Toaster } from "sonner";
import { useAppView } from "./hooks/useAppView";
import { AppLoading } from "./components/AppLoading";
import { AuthGate } from "./components/AuthGate";
import { MainLayout } from "./components/MainLayout";

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
        deleteChatSession,
        handleSelectSession,
        handleStartNewQuest,
        handleSendMessage,
        handleRenameSession,
        handleStopGeneration,
        isLoadingSessions,
    } = useChat(session);
    const { activeView, setActiveView, onSendMessage, onStartChat } =
        useAppView({ handleSendMessage });

    if (loading) {
        return <AppLoading />;
    }

    if (!session) {
        return (
            <>
                <Toaster position="top-center" richColors />
                <AuthGate showAuth={showAuth} setShowAuth={setShowAuth} />
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
        <>
            <Toaster position="top-center" richColors />
            <MainLayout
                activeView={activeView}
                setActiveView={setActiveView}
                userProfile={userProfile}
                chatSessions={chatSessions}
                currentSessionId={currentSessionId}
                handleSelectSession={handleSelectSession}
                handleStartNewQuest={handleStartNewQuest}
                deleteChatSession={deleteChatSession}
                handleRenameSession={handleRenameSession}
                handleSignOut={handleSignOut}
                isLoadingSessions={isLoadingSessions}
                messages={messages}
                onSendMessage={onSendMessage}
                isTyping={isTyping}
                handleStopGeneration={handleStopGeneration}
                chatMode={chatMode}
                setChatMode={setChatMode}
                handleUpdateProfile={handleUpdateProfile}
                onStartChat={onStartChat}
            />
        </>
    );
}
