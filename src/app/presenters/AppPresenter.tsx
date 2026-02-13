import { useCallback, useEffect, useMemo, useState } from "react";
import { toast, Toaster } from "sonner";
import {
    chatUseCases,
    hasPermission,
    type ActiveView,
    useAppView,
    useAuthFlow,
    useChatRuntimeFlow,
    useChatSessionsFlow,
    useMyClassContext,
    useMyAuthorization,
    useShareGradeResultToClass,
    useSharePrivateChatToClass,
} from "@hooks";
import { AppLoadingView } from "@views/layout/AppLoadingView";
import { ClassMembershipNoticeView } from "@views/class";
import { AuthGatePresenter } from "./AuthGatePresenter";
import { ClassHubPresenter } from "./ClassHubPresenter";
import { GradeAssignmentPresenter } from "./GradeAssignmentPresenter";
import { LandingPagePresenter } from "./LandingPagePresenter";
import { MainLayoutPresenter } from "./MainLayoutPresenter";
import { PublishAssignmentPresenter } from "./PublishAssignmentPresenter";
import { SubmitAssignmentPresenter } from "./SubmitAssignmentPresenter";
import { ViewFeedbackPresenter } from "./ViewFeedbackPresenter";

const FALLBACK_VIEW_ORDER: ActiveView[] = [
    "home",
    "profile",
    "classHub",
    "submitAssignment",
    "viewFeedback",
    "publishAssignment",
    "gradeAssignment",
];

const SAMPLE_ASSIGNMENT_TITLE = "Statics: Equilibrium of Rigid Bodies";
const SAMPLE_ASSIGNMENT_DESCRIPTION =
    "Upload your solution for 'Statics: Equilibrium of Rigid Bodies'. AI will analyze your steps and provide instant feedback.";
const SAMPLE_MODULES = [
    "Statics of Rigid Bodies",
    "Dynamics I",
    "Mechanics of Materials",
];
const SAMPLE_GRADE_STUDENTS = [
    {
        id: "1",
        studentName: "Oliver Thompson",
        submittedDate: "Submitted 2h ago",
        status: "pending" as const,
        submission: "https://via.placeholder.com/800x600?text=Student+Submission",
    },
    {
        id: "2",
        studentName: "Jane Doe",
        submittedDate: "Graded",
        status: "graded" as const,
        submission: "https://via.placeholder.com/800x600?text=Student+Submission",
    },
    {
        id: "3",
        studentName: "Li Wei",
        submittedDate: "Not submitted",
        status: "pending" as const,
        submission: "https://via.placeholder.com/800x600?text=Student+Submission",
    },
];

export const AppPresenter = () => {
    const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

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
        data: authorization,
        isLoading: isAuthorizationLoading,
        isFetching: isAuthorizationFetching,
    } = useMyAuthorization();
    const {
        data: classContext,
        isLoading: isClassContextLoading,
    } = useMyClassContext();

    const canAccessChat = hasPermission(authorization, "chat.access");
    const canAccessProfile = hasPermission(authorization, "profile.access");
    const canAccessStudentAssignments = hasPermission(
        authorization,
        "assignment.student.access",
    );
    const canAccessTeacherAssignments = hasPermission(
        authorization,
        "assignment.teacher.access",
    );
    const canAccessClassHub =
        !!classContext?.isAdmin ||
        canAccessStudentAssignments ||
        canAccessTeacherAssignments;

    const teachingClasses = classContext?.teachingClasses ?? [];
    const joinedClasses = classContext?.joinedClasses ?? [];
    const classOptions = useMemo(() => {
        const map = new Map<
            string,
            (typeof teachingClasses)[number] | (typeof joinedClasses)[number]
        >();

        teachingClasses.forEach((classItem) => map.set(classItem.id, classItem));
        joinedClasses.forEach((classItem) => {
            if (!map.has(classItem.id)) {
                map.set(classItem.id, classItem);
            }
        });

        return Array.from(map.values());
    }, [teachingClasses, joinedClasses]);

    useEffect(() => {
        if (classOptions.length === 0) {
            setSelectedClassId(null);
            return;
        }

        if (!selectedClassId || !classOptions.some((item) => item.id === selectedClassId)) {
            setSelectedClassId(classOptions[0].id);
        }
    }, [classOptions, selectedClassId]);

    const selectedClass = useMemo(
        () => classOptions.find((item) => item.id === selectedClassId),
        [classOptions, selectedClassId],
    );
    const hasStudentClassMembership = joinedClasses.length > 0;
    const hasTeacherClassMembership = teachingClasses.length > 0;

    const canAccessView = (view: ActiveView) => {
        if (view === "landing") return true;
        if (view === "home" || view === "chat") return canAccessChat;
        if (view === "profile") return canAccessProfile;
        if (view === "classHub") return canAccessClassHub;
        if (view === "submitAssignment" || view === "viewFeedback") {
            return canAccessStudentAssignments;
        }
        if (view === "publishAssignment" || view === "gradeAssignment") {
            return canAccessTeacherAssignments;
        }
        return false;
    };

    const fallbackView = useMemo(
        () =>
            FALLBACK_VIEW_ORDER.find((view) => canAccessView(view)) ?? "landing",
        [
            canAccessChat,
            canAccessProfile,
            canAccessClassHub,
            canAccessStudentAssignments,
            canAccessTeacherAssignments,
        ],
    );

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
    } = useChatSessionsFlow(session, canAccessChat);

    const { isTyping, handleSendMessage, handleStopGeneration } =
        useChatRuntimeFlow({
            currentSessionId,
            setCurrentSessionId,
        });

    const guardedSendMessage = canAccessChat
        ? handleSendMessage
        : () => undefined;

    const { activeView, setActiveView, onSendMessage, onStartChat } =
        useAppView({ handleSendMessage: guardedSendMessage });

    useEffect(() => {
        if (!session) {
            return;
        }

        if (!canAccessView(activeView)) {
            setActiveView(fallbackView);
        }
    }, [
        activeView,
        fallbackView,
        session,
        canAccessChat,
        canAccessProfile,
        canAccessClassHub,
        canAccessStudentAssignments,
        canAccessTeacherAssignments,
    ]);

    const guardedSetActiveView = (view: ActiveView) => {
        setActiveView(canAccessView(view) ? view : fallbackView);
    };

    const uploadImage = chatUseCases.storagePort.uploadImage;

    const safeChatSessions = canAccessChat ? chatSessions : [];
    const safeCurrentSessionId = canAccessChat ? currentSessionId : null;
    const safeMessages = canAccessChat ? messages : [];
    const safeIsLoadingSessions = canAccessChat ? isLoadingSessions : false;
    const safeIsTyping = canAccessChat ? isTyping : false;
    const safeSetChatMode = canAccessChat ? setChatMode : () => undefined;
    const safeOnSendMessage = canAccessChat ? onSendMessage : () => undefined;
    const safeOnStartChat = canAccessChat ? onStartChat : () => undefined;
    const safeHandleStopGeneration = canAccessChat
        ? handleStopGeneration
        : () => undefined;
    const safeDeleteChatSession = canAccessChat
        ? deleteChatSession
        : async () => ({ success: false, wasCurrentSession: false });
    const safeHandleSelectSession = canAccessChat
        ? handleSelectSession
        : () => false;
    const safeHandleStartNewQuest = canAccessChat
        ? handleStartNewQuest
        : () => undefined;
    const safeHandleRenameSession = canAccessChat
        ? handleRenameSession
        : async () => false;

    const sharePrivateChatToClassMutation = useSharePrivateChatToClass();
    const shareGradeResultToClassMutation = useShareGradeResultToClass();

    const handleShareChatMessageToClass = useCallback(
        async (messageId: string) => {
            if (!selectedClassId) {
                toast.error("Open Class Hub and select a class first.");
                return;
            }

            if (!currentSessionId) {
                toast.error("Open a private chat session before sharing.");
                return;
            }

            try {
                await sharePrivateChatToClassMutation.mutateAsync({
                    classId: selectedClassId,
                    chatId: currentSessionId,
                    messageIds: [messageId],
                });
                toast.success(
                    `Shared to class ${selectedClass?.name ?? selectedClassId}.`,
                );
            } catch (error) {
                toast.error(
                    error instanceof Error
                        ? error.message
                        : "Failed to share chat message to class",
                );
            }
        },
        [
            currentSessionId,
            selectedClass?.name,
            selectedClassId,
            sharePrivateChatToClassMutation,
        ],
    );

    const handleShareFeedbackToClass = useCallback(async () => {
        if (!selectedClassId) {
            toast.error("Open Class Hub and select a class first.");
            return;
        }

        try {
            await shareGradeResultToClassMutation.mutateAsync({
                classId: selectedClassId,
                gradePayload: {
                    assignmentTitle: SAMPLE_ASSIGNMENT_TITLE,
                    overallScore: 85,
                    maxScore: 100,
                    submittedDate: "Oct 12, 2023",
                    teacherName: "Prof. Sarah Chen",
                    studentName: userProfile.name,
                    sharedAt: new Date().toISOString(),
                },
            });

            toast.success(
                `Feedback shared to class ${selectedClass?.name ?? selectedClassId}.`,
            );
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to share feedback to class",
            );
        }
    }, [
        selectedClass?.name,
        selectedClassId,
        shareGradeResultToClassMutation,
        userProfile.name,
    ]);

    const classHubNode = canAccessClassHub ? (
        <ClassHubPresenter
            requesterEmail={session?.user.email}
            canCreateClass={
                !!classContext?.isAdmin || canAccessTeacherAssignments
            }
            canJoinClass={canAccessStudentAssignments}
            selectedClassId={selectedClassId}
            onSelectedClassIdChange={setSelectedClassId}
        />
    ) : undefined;

    const submitAssignmentNode = canAccessStudentAssignments ? (
        hasStudentClassMembership ? (
            <SubmitAssignmentPresenter
                assignmentTitle={
                    selectedClass
                        ? `${SAMPLE_ASSIGNMENT_TITLE} · ${selectedClass.name}`
                        : SAMPLE_ASSIGNMENT_TITLE
                }
                assignmentDescription={SAMPLE_ASSIGNMENT_DESCRIPTION}
                onSubmit={async () => {}}
                onCancel={() => guardedSetActiveView("home")}
            />
        ) : (
            <ClassMembershipNoticeView
                title="Join a class to submit assignments"
                description="You currently have student assignment access, but you are not in any class yet."
                actionLabel="Open Class Hub"
                onAction={() => guardedSetActiveView("classHub")}
            />
        )
    ) : undefined;

    const viewFeedbackNode = canAccessStudentAssignments ? (
        hasStudentClassMembership ? (
            <ViewFeedbackPresenter
                assignmentTitle={SAMPLE_ASSIGNMENT_TITLE}
                overallScore={85}
                maxScore={100}
                submittedDate="Oct 12, 2023"
                teacherName="Prof. Sarah Chen"
                teacherSummary="Strong conceptual understanding. Minor sign error in the uniform load moment calculation."
                aiAnalysis="The Free Body Diagram is well-drawn and correctly identifies all external forces and moments. The moment equation for the uniform load shows good understanding but had a sign convention error."
                gradeBreakdown={[
                    { category: "Method", score: 30, maxScore: 30, color: "green" },
                    {
                        category: "Accuracy",
                        score: 35,
                        maxScore: 50,
                        color: "yellow",
                    },
                    {
                        category: "Formatting",
                        score: 20,
                        maxScore: 20,
                        color: "green",
                    },
                ]}
                keyInsights={[
                    {
                        title: "Good FBD Isolation",
                        description:
                            "You correctly identified all external forces acting on the beam.",
                        type: "success",
                    },
                    {
                        title: "Moment Equation (Step 2)",
                        description:
                            "Sign convention error in the uniform load's moment calculation. The load should be negative per your convention.",
                        type: "error",
                    },
                ]}
                generalComments="Great work overall! See annotated notes."
                privateNotes="Needs review on moments topic."
                onDownloadPDF={() => {}}
                onShareToClass={
                    selectedClassId ? handleShareFeedbackToClass : undefined
                }
            />
        ) : (
            <ClassMembershipNoticeView
                title="Join a class to view feedback"
                description="Feedback is available after you join a class. Use an invite code in Class Hub."
                actionLabel="Open Class Hub"
                onAction={() => guardedSetActiveView("classHub")}
            />
        )
    ) : undefined;

    const publishAssignmentNode = canAccessTeacherAssignments ? (
        hasTeacherClassMembership ? (
            <PublishAssignmentPresenter
                modules={SAMPLE_MODULES}
                onPublish={async () => {}}
                onCancel={() => guardedSetActiveView("home")}
            />
        ) : (
            <ClassMembershipNoticeView
                title="Create a class before publishing assignments"
                description="You currently have teacher assignment access, but you are not assigned to any class yet."
                actionLabel="Open Class Hub"
                onAction={() => guardedSetActiveView("classHub")}
            />
        )
    ) : undefined;

    const gradeAssignmentNode = canAccessTeacherAssignments ? (
        hasTeacherClassMembership ? (
            <GradeAssignmentPresenter
                assignmentTitle={SAMPLE_ASSIGNMENT_TITLE}
                students={SAMPLE_GRADE_STUDENTS}
                onSaveGrade={async () => {}}
                onCancel={() => guardedSetActiveView("home")}
            />
        ) : (
            <ClassMembershipNoticeView
                title="Create a class before grading submissions"
                description="No class context is available yet. Create a class or ask admin to assign you."
                actionLabel="Open Class Hub"
                onAction={() => guardedSetActiveView("classHub")}
            />
        )
    ) : undefined;

    if (
        loading ||
        (session &&
            (isAuthorizationLoading ||
                isAuthorizationFetching ||
                isClassContextLoading))
    ) {
        return <AppLoadingView />;
    }

    if (!session) {
        return (
            <>
                <Toaster position="top-center" richColors />
                <AuthGatePresenter showAuth={showAuth} setShowAuth={setShowAuth} />
            </>
        );
    }

    if (activeView === "landing") {
        return (
            <>
                <Toaster position="top-center" richColors />
                <LandingPagePresenter
                    onStart={() => guardedSetActiveView(fallbackView)}
                    onLogin={() => guardedSetActiveView(fallbackView)}
                />
            </>
        );
    }

    return (
        <>
            <Toaster position="top-center" richColors />
            <MainLayoutPresenter
                activeView={activeView}
                setActiveView={guardedSetActiveView}
                canAccessChat={canAccessChat}
                canAccessProfile={canAccessProfile}
                canAccessClassHub={canAccessClassHub}
                canAccessStudentAssignments={canAccessStudentAssignments}
                canAccessTeacherAssignments={canAccessTeacherAssignments}
                userProfile={userProfile}
                chatSessions={safeChatSessions}
                currentSessionId={safeCurrentSessionId}
                chatMode={chatMode}
                setChatMode={safeSetChatMode}
                deleteChatSession={safeDeleteChatSession}
                handleSelectSession={safeHandleSelectSession}
                handleStartNewQuest={safeHandleStartNewQuest}
                handleRenameSession={safeHandleRenameSession}
                handleSignOut={handleSignOut}
                isLoadingSessions={safeIsLoadingSessions}
                messages={safeMessages}
                onSendMessage={safeOnSendMessage}
                uploadImage={uploadImage}
                isTyping={safeIsTyping}
                handleStopGeneration={safeHandleStopGeneration}
                handleUpdateProfile={handleUpdateProfile}
                onStartChat={safeOnStartChat}
                onShareChatMessageToClass={
                    selectedClassId ? handleShareChatMessageToClass : undefined
                }
                classHub={classHubNode}
                submitAssignment={submitAssignmentNode}
                viewFeedback={viewFeedbackNode}
                publishAssignment={publishAssignmentNode}
                gradeAssignment={gradeAssignmentNode}
            />
        </>
    );
};
