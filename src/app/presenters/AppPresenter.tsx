import { useCallback, useEffect, useMemo, useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { toast, Toaster } from "sonner";
import {
    chatUseCases,
    hasPermission,
    type ActiveView,
    useAppView,
    useAuthFlow,
    useChatRuntimeFlow,
    useChatSessionsFlow,
    useCreateGroupThread,
    useMyClassContext,
    useMyAuthorization,
    useShareGradeResultToClass,
    useSharePrivateChatToClass,
} from "@hooks";
import { AppLoadingView } from "@views/layout/AppLoadingView";
import { ClassMembershipNoticeView, ClassPickerPopover } from "@views/class";
import type { SidebarClassThread } from "@views/sidebar/types";
import { classKeys } from "@hooks/class/queries/classKeys";
import { listClassThreads } from "@hooks/class/implementation/supabaseClassService";
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

const FALLBACK_USER_PROFILE = {
    name: "张同学",
    avatar: "",
    role: "工程力学专业学生",
};

type ActiveChatTarget =
    | { type: "private" }
    | {
          type: "class";
          classId: string;
          className: string;
          threadId: string;
          threadTitle: string;
          currentUserId: string;
      };

type ShareIntent =
    | { kind: "chatMessage"; messageId: string }
    | { kind: "chatSession"; sessionId: string }
    | { kind: "gradeFeedback" };

const isSidebarThread = (thread: { threadType: "group" | "shared_chat" | "shared_grade" }): thread is {
    threadType: "group" | "shared_chat";
} & typeof thread => thread.threadType === "group" || thread.threadType === "shared_chat";

export const AppPresenter = () => {
    const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
    const [activeChatTarget, setActiveChatTarget] = useState<ActiveChatTarget>({
        type: "private",
    });
    const [shareIntent, setShareIntent] = useState<ShareIntent | null>(null);
    const [creatingClassThreadId, setCreatingClassThreadId] = useState<string | null>(null);

    const {
        session,
        loading,
        showAuth,
        setShowAuth,
        userProfile,
        handleUpdateProfile,
        handleSignOut,
    } = useAuthFlow();

    const safeUserProfile = userProfile ?? FALLBACK_USER_PROFILE;

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

    const classThreadsQueries = useQueries({
        queries: classOptions.map((classItem) => ({
            queryKey: classKeys.threads(classItem.id),
            queryFn: () => listClassThreads(classItem.id),
            enabled: !!session && canAccessClassHub,
            staleTime: 5_000,
        })),
    });

    const classSessionGroups = useMemo(
        () =>
            classOptions.map((classItem, index) => {
                const threadRows = classThreadsQueries[index]?.data ?? [];
                const threads = threadRows
                    .filter(isSidebarThread)
                    .map((thread) => ({
                        id: thread.id,
                        classId: classItem.id,
                        title: thread.title,
                        threadType: thread.threadType as "group" | "shared_chat",
                    }));

                return {
                    classId: classItem.id,
                    className: classItem.name,
                    role: classItem.role,
                    threads,
                };
            }),
        [classOptions, classThreadsQueries],
    );

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
    const safeOnSendMessage = canAccessChat
        ? (payload: Parameters<typeof onSendMessage>[0]) => {
              setActiveChatTarget({ type: "private" });
              onSendMessage(payload);
          }
        : () => undefined;
    const safeOnStartChat = canAccessChat
        ? (
              message?: string,
              imageUrls?: string[],
              fileAttachments?: Parameters<typeof onStartChat>[2],
              model?: string,
              mode?: Parameters<typeof onStartChat>[4],
          ) => {
              setActiveChatTarget({ type: "private" });
              onStartChat(message, imageUrls, fileAttachments, model, mode);
          }
        : () => undefined;
    const safeHandleStopGeneration = canAccessChat
        ? handleStopGeneration
        : () => undefined;
    const safeDeleteChatSession = canAccessChat
        ? deleteChatSession
        : async () => ({ success: false, wasCurrentSession: false });
    const safeHandleSelectSession = canAccessChat
        ? (id: string) => {
              setActiveChatTarget({ type: "private" });
              return handleSelectSession(id);
          }
        : () => false;
    const safeHandleStartNewQuest = canAccessChat
        ? () => {
              setActiveChatTarget({ type: "private" });
              handleStartNewQuest();
          }
        : () => undefined;
    const safeHandleRenameSession = canAccessChat
        ? handleRenameSession
        : async () => false;

    const sharePrivateChatToClassMutation = useSharePrivateChatToClass();
    const shareGradeResultToClassMutation = useShareGradeResultToClass();
    const createGroupThreadMutation = useCreateGroupThread();

    const getClassNameById = useCallback(
        (classId: string) =>
            classOptions.find((item) => item.id === classId)?.name ?? classId,
        [classOptions],
    );

    const openSharePicker = useCallback(
        (intent: ShareIntent) => {
            if (classOptions.length === 0) {
                toast.error("Open Class Hub and join a class first.");
                return;
            }
            setShareIntent(intent);
        },
        [classOptions.length],
    );

    const handleShareChatMessageToClass = useCallback(
        (messageId: string) => {
            openSharePicker({ kind: "chatMessage", messageId });
        },
        [openSharePicker],
    );

    const handleShareChatSessionToClass = useCallback(
        (sessionId: string) => {
            openSharePicker({ kind: "chatSession", sessionId });
        },
        [openSharePicker],
    );

    const handleShareFeedbackToClass = useCallback(() => {
        openSharePicker({ kind: "gradeFeedback" });
    }, [openSharePicker]);

    const handleConfirmClassShare = useCallback(
        async (classId: string) => {
            if (!shareIntent) {
                return;
            }

            try {
                if (shareIntent.kind === "chatMessage") {
                    if (!currentSessionId) {
                        toast.error("Open a private chat session before sharing.");
                        return;
                    }
                    await sharePrivateChatToClassMutation.mutateAsync({
                        classId,
                        chatId: currentSessionId,
                        messageIds: [shareIntent.messageId],
                    });
                    toast.success(`Shared to class ${getClassNameById(classId)}.`);
                } else if (shareIntent.kind === "chatSession") {
                    await sharePrivateChatToClassMutation.mutateAsync({
                        classId,
                        chatId: shareIntent.sessionId,
                    });
                    toast.success(`Shared to class ${getClassNameById(classId)}.`);
                } else {
                    await shareGradeResultToClassMutation.mutateAsync({
                        classId,
                        gradePayload: {
                            assignmentTitle: SAMPLE_ASSIGNMENT_TITLE,
                            overallScore: 85,
                            maxScore: 100,
                            submittedDate: "Oct 12, 2023",
                            teacherName: "Prof. Sarah Chen",
                            studentName: safeUserProfile.name,
                            sharedAt: new Date().toISOString(),
                        },
                    });
                    toast.success(`Feedback shared to class ${getClassNameById(classId)}.`);
                }
                setShareIntent(null);
            } catch (error) {
                toast.error(
                    error instanceof Error ? error.message : "Failed to share to class",
                );
            }
        },
        [
            currentSessionId,
            getClassNameById,
            safeUserProfile.name,
            shareIntent,
            shareGradeResultToClassMutation,
            sharePrivateChatToClassMutation,
        ],
    );

    const handleSelectClassThread = useCallback(
        (thread: SidebarClassThread) => {
            const className = getClassNameById(thread.classId);
            setSelectedClassId(thread.classId);
            setActiveChatTarget({
                type: "class",
                classId: thread.classId,
                className,
                threadId: thread.id,
                threadTitle: thread.title,
                currentUserId: session?.user.id ?? "",
            });
            guardedSetActiveView("chat");
        },
        [getClassNameById, guardedSetActiveView, session?.user.id],
    );

    const handleCreateClassThread = useCallback(
        async (classId: string) => {
            try {
                setCreatingClassThreadId(classId);
                const thread = await createGroupThreadMutation.mutateAsync({
                    classId,
                    title: "班级讨论",
                });
                const className = getClassNameById(classId);
                setSelectedClassId(classId);
                setActiveChatTarget({
                    type: "class",
                    classId,
                    className,
                    threadId: thread.id,
                    threadTitle: thread.title,
                    currentUserId: session?.user.id ?? "",
                });
                guardedSetActiveView("chat");
                toast.success("Class thread created.");
            } catch (error) {
                toast.error(
                    error instanceof Error ? error.message : "Failed to create class thread",
                );
            } finally {
                setCreatingClassThreadId(null);
            }
        },
        [createGroupThreadMutation, getClassNameById, guardedSetActiveView, session?.user.id],
    );

    const classHubNode = canAccessClassHub ? (
        <ClassHubPresenter
            requesterEmail={session?.user.email}
            canCreateClass={
                !!classContext?.isAdmin || canAccessTeacherAssignments
            }
            canJoinClass={canAccessStudentAssignments}
            selectedClassId={selectedClassId}
            onSelectedClassIdChange={setSelectedClassId}
            onEnterClassChat={(payload) => {
                setSelectedClassId(payload.classId);
                setActiveChatTarget({
                    type: "class",
                    classId: payload.classId,
                    className: payload.className,
                    threadId: payload.threadId,
                    threadTitle: payload.threadTitle,
                    currentUserId: session?.user.id ?? "",
                });
                guardedSetActiveView("chat");
            }}
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
                onShareToClass={handleShareFeedbackToClass}
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

    const classChatTarget =
        activeChatTarget.type === "class" ? activeChatTarget : undefined;
    const activeClassThreadId =
        activeChatTarget.type === "class" ? activeChatTarget.threadId : undefined;
    const sharePickerDescription =
        shareIntent?.kind === "chatMessage"
            ? "Select a class to share this message."
            : shareIntent?.kind === "chatSession"
              ? "Select a class to share this private session."
              : "Select a class to share this grade feedback.";

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
                userProfile={safeUserProfile}
                chatSessions={safeChatSessions}
                classSessionGroups={classSessionGroups}
                activeClassThreadId={activeClassThreadId}
                currentSessionId={safeCurrentSessionId}
                chatMode={chatMode}
                setChatMode={safeSetChatMode}
                deleteChatSession={safeDeleteChatSession}
                handleSelectSession={safeHandleSelectSession}
                handleStartNewQuest={safeHandleStartNewQuest}
                handleRenameSession={safeHandleRenameSession}
                onCreateClassThread={handleCreateClassThread}
                creatingClassThreadId={creatingClassThreadId}
                onSelectClassThread={handleSelectClassThread}
                onShareSessionToClass={handleShareChatSessionToClass}
                handleSignOut={handleSignOut}
                isLoadingSessions={safeIsLoadingSessions}
                messages={safeMessages}
                onSendMessage={safeOnSendMessage}
                uploadImage={uploadImage}
                isTyping={safeIsTyping}
                handleStopGeneration={safeHandleStopGeneration}
                handleUpdateProfile={handleUpdateProfile}
                onStartChat={safeOnStartChat}
                onShareChatMessageToClass={handleShareChatMessageToClass}
                chatTargetType={activeChatTarget.type}
                classChatTarget={classChatTarget}
                classHub={classHubNode}
                submitAssignment={submitAssignmentNode}
                viewFeedback={viewFeedbackNode}
                publishAssignment={publishAssignmentNode}
                gradeAssignment={gradeAssignmentNode}
            />

            <ClassPickerPopover
                open={!!shareIntent}
                title="Share to class"
                description={sharePickerDescription}
                classOptions={classOptions.map((classItem) => ({
                    id: classItem.id,
                    name: classItem.name,
                    role: classItem.role,
                }))}
                isSubmitting={
                    sharePrivateChatToClassMutation.isPending ||
                    shareGradeResultToClassMutation.isPending
                }
                onSelectClass={handleConfirmClassShare}
                onClose={() => setShareIntent(null)}
            />
        </>
    );
};
