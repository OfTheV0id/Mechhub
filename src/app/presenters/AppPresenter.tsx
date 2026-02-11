import { Toaster } from "sonner";
import {
    useAuthFlow,
    useChatRuntimeFlow,
    useChatSessionsFlow,
    useAppView,
    chatUseCases,
} from "@hooks";
import { AppLoadingView } from "@views/layout/AppLoadingView";
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
    } = useChatSessionsFlow(session);

    const { isTyping, handleSendMessage, handleStopGeneration } =
        useChatRuntimeFlow({
            currentSessionId,
            setCurrentSessionId,
        });

    const { activeView, setActiveView, onSendMessage, onStartChat } =
        useAppView({ handleSendMessage });

    const uploadImage = chatUseCases.storagePort.uploadImage;

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

