import React, { useMemo } from "react";
import { Toaster } from "sonner";
import {
    createDefaultChatWiring,
    useAuthFlow,
    useChatRuntimeFlow,
    useChatSessionsFlow,
    useAppView,
} from "../../hooks";
import { AppLoadingView } from "../../views/layout/AppLoadingView";
import { AuthGatePresenter } from "./AuthGatePresenter";
import { LandingPagePresenter } from "./LandingPagePresenter";
import { MainLayoutPresenter } from "./MainLayoutPresenter";

export const AppPresenter = () => {
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
        return <AppLoadingView />;
    }

    if (!session) {
        return (
            <>
                <Toaster position="top-center" richColors />
                <AuthGatePresenter
                    showAuth={showAuth}
                    setShowAuth={setShowAuth}
                />
            </>
        );
    }

    if (activeView === "landing") {
        return (
            <>
                <Toaster position="top-center" richColors />
                <LandingPagePresenter
                    onStart={() => setActiveView("home")}
                    onLogin={() => setActiveView("home")}
                />
            </>
        );
    }

    return (
        <>
            <Toaster position="top-center" richColors />
            <MainLayoutPresenter
                activeView={activeView}
                setActiveView={setActiveView}
                userProfile={userProfile}
                chatSessions={chatSessions}
                currentSessionId={currentSessionId}
                chatMode={chatMode}
                setChatMode={setChatMode}
                deleteChatSession={deleteChatSession}
                handleSelectSession={handleSelectSession}
                handleStartNewQuest={handleStartNewQuest}
                handleRenameSession={handleRenameSession}
                handleSignOut={handleSignOut}
                isLoadingSessions={isLoadingSessions}
                messages={messages}
                onSendMessage={onSendMessage}
                uploadImage={uploadImage}
                isTyping={isTyping}
                handleStopGeneration={handleStopGeneration}
                handleUpdateProfile={handleUpdateProfile}
                onStartChat={onStartChat}
            />
        </>
    );
};
