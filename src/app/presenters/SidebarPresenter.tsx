import { MessageSquare } from "lucide-react";
import {
    useSidebarActionsFlow,
    useSidebarResizeState,
    type DeleteChatResult,
} from "@hooks";
import { SidebarView } from "@views/sidebar/SidebarView";
import type { ActiveView, UserProfile } from "@views/shared/types";
import type { ChatSession } from "@views/chat/types";
import { SessionItemPresenter } from "./SessionItemPresenter";

interface SidebarPresenterProps {
    activeView: ActiveView;
    canAccessChat: boolean;
    canAccessProfile: boolean;
    canAccessClassHub: boolean;
    canAccessStudentAssignments: boolean;
    canAccessTeacherAssignments: boolean;
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
    canAccessChat,
    canAccessProfile,
    canAccessClassHub,
    canAccessStudentAssignments,
    canAccessTeacherAssignments,
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

    const renderSession = (session: ChatSession, active: boolean) => (
        <SessionItemPresenter
            label={session.title}
            icon={MessageSquare}
            active={active}
            onClick={() => handleSessionSelect(session.id)}
            onDelete={() => handleDeleteSession(session.id)}
            onRename={(newTitle) => handleRenameSession(session.id, newTitle)}
            isGeneratingTitle={session.isGeneratingTitle}
        />
    );

    return (
        <SidebarView
            activeView={activeView}
            canAccessChat={canAccessChat}
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
            onNewQuest={canAccessChat ? onNewQuest : undefined}
            renderSession={renderSession}
            onOpenProfile={
                canAccessProfile
                    ? () => setActiveView("profile")
                    : undefined
            }
            onOpenClassHub={
                canAccessClassHub
                    ? () => setActiveView("classHub")
                    : undefined
            }
            onSignOut={handleSignOut}
            onSubmitAssignment={
                canAccessStudentAssignments
                    ? () => setActiveView("submitAssignment")
                    : undefined
            }
            onViewFeedback={
                canAccessStudentAssignments
                    ? () => setActiveView("viewFeedback")
                    : undefined
            }
            onPublishAssignment={
                canAccessTeacherAssignments
                    ? () => setActiveView("publishAssignment")
                    : undefined
            }
            onGradeAssignment={
                canAccessTeacherAssignments
                    ? () => setActiveView("gradeAssignment")
                    : undefined
            }
        />
    );
};
