import React from "react";
import {
    useSidebarActionsFlow,
    useSidebarResizeState,
    type DeleteChatResult,
} from "../../hooks";
import { SidebarView } from "../../views/sidebar/SidebarView";
import type { ActiveView, UserProfile } from "../../views/shared/types";
import type { ChatSession } from "../../views/chat/types";

interface SidebarPresenterProps {
    activeView: ActiveView;
    setActiveView: (view: ActiveView) => void;
    userProfile: UserProfile;
    sessions: ChatSession[];
    currentSessionId: string | null;
    isLoading: boolean;
    handleSelectSession: (id: string) => boolean;
    handleStartNewQuest: () => void;
    deleteChatSession: (id: string) => Promise<DeleteChatResult>;
    handleRenameSession: (id: string, newTitle: string) => Promise<boolean>;
    handleSignOut?: () => void;
}

export const SidebarPresenter = ({
    activeView,
    setActiveView,
    userProfile,
    sessions,
    currentSessionId,
    isLoading,
    handleSelectSession,
    handleStartNewQuest,
    deleteChatSession,
    handleRenameSession,
    handleSignOut,
}: SidebarPresenterProps) => {
    const { sidebarWidth, handleMouseDown } = useSidebarResizeState();
    const { onNewQuest, handleDeleteSession } = useSidebarActionsFlow({
        setActiveView,
        handleSelectSession,
        handleStartNewQuest,
        deleteChatSession,
    });

    const handleSessionSelect = (id: string) => {
        setActiveView("chat");
        handleSelectSession(id);
    };

    return (
        <SidebarView
            activeView={activeView}
            sidebarWidth={sidebarWidth}
            user={userProfile}
            sessions={sessions}
            currentSessionId={currentSessionId}
            isLoading={isLoading}
            onResizeMouseDown={handleMouseDown}
            onLogoClick={() => setActiveView("home")}
            onLogoIconClick={(event) => {
                event.stopPropagation();
                setActiveView("landing");
            }}
            onNewQuest={onNewQuest}
            onSelectSession={handleSessionSelect}
            onDeleteSession={handleDeleteSession}
            onRenameSession={handleRenameSession}
            onOpenProfile={() => setActiveView("profile")}
            onSignOut={handleSignOut}
        />
    );
};
