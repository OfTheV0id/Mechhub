import { useMemo } from "react";
import {
    createDefaultChatWiring,
    useChatRuntimeFlow,
    useChatSessionsFlow,
} from "../features/chat";
import { useAuthFlow } from "../features/auth";
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
    } = useAuthFlow();
    const chatWiring = useMemo(() => createDefaultChatWiring(), []);
    const {
        chatSessions,
        isLoadingSessions,
        currentSessionId,
        chatMode,
        setChatMode,
        deleteChatSession,
        handleSelectSession,
        handleStartNewQuest,
        handleRenameSession,
        messages,
        setCurrentSessionId,
    } = useChatSessionsFlow(session, chatWiring.chatQueryUseCases);
    const { isTyping, handleSendMessage, handleStopGeneration } =
        useChatRuntimeFlow({
            currentSessionId,
            setCurrentSessionId,
            chatQueryUseCases: chatWiring.chatQueryUseCases,
            aiGateway: chatWiring.aiGateway,
            createChatCachePort: chatWiring.createChatCachePort,
        });
    const { activeView, setActiveView, onSendMessage, onStartChat } =
        useAppView({ handleSendMessage });
    const uploadImage = chatWiring.storagePort.uploadImage;

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
                uploadImage={uploadImage}
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
