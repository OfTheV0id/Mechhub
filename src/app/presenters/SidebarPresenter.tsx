import { MessageSquare, Share2 } from "lucide-react";
import {
    useSidebarActionsFlow,
    useSidebarResizeState,
    type DeleteChatResult,
} from "@hooks";
import { SidebarView } from "@views/sidebar/SidebarView";
import type { ActiveView, UserProfile } from "@views/shared/types";
import type { ChatSession } from "@views/chat/types";
import type { SidebarClassGroup, SidebarClassThread } from "@views/sidebar/types";
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
    classGroups: SidebarClassGroup[];
    activeClassThreadId?: string;
    currentSessionId: string | null;
    isLoading: boolean;
    handleSelectSession: (id: string) => boolean;
    handleStartNewQuest: () => void;
    deleteChatSession: (id: string) => Promise<DeleteChatResult>;
    handleRenameSession: (id: string, newTitle: string) => Promise<boolean>;
    onCreateClassThread?: (classId: string) => void;
    creatingClassThreadId?: string | null;
    onSelectClassThread?: (thread: SidebarClassThread) => void;
    onShareSessionToClass?: (sessionId: string) => void;
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
    classGroups,
    activeClassThreadId,
    currentSessionId,
    isLoading,
    handleSelectSession,
    handleStartNewQuest,
    deleteChatSession,
    handleRenameSession,
    onCreateClassThread,
    creatingClassThreadId,
    onSelectClassThread,
    onShareSessionToClass,
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
            menuActions={
                onShareSessionToClass
                    ? [
                          {
                              key: "share_to_class",
                              label: "分享到班级",
                              icon: Share2,
                              onClick: () => onShareSessionToClass(session.id),
                          },
                      ]
                    : undefined
            }
        />
    );

    return (
        <SidebarView
            activeView={activeView}
            canAccessChat={canAccessChat}
            sidebarWidth={sidebarWidth}
            user={userProfile}
            sessions={sessions}
            classGroups={classGroups}
            activeClassThreadId={activeClassThreadId}
            currentSessionId={currentSessionId}
            isLoading={isLoading}
            onResizeMouseDown={handleMouseDown}
            onLogoClick={() => setActiveView("home")}
            onLogoIconClick={(event) => {
                event.stopPropagation();
                setActiveView("landing");
            }}
            onNewQuest={canAccessChat ? onNewQuest : undefined}
            onCreateClassThread={onCreateClassThread}
            creatingClassThreadId={creatingClassThreadId}
            onSelectClassThread={onSelectClassThread}
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
