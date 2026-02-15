import { useEffect, useMemo, useRef, useState } from "react";
import {
    normalizeSnapshotMessage,
    normalizeSnapshotMessages,
    useAssignmentSubmissionsQuery,
    useClassAssignmentDashboardQuery,
    useClassMembersQuery,
    type Assignment,
    type SaveGradeReviewPayload,
} from "@hooks";
import { GradeAssignmentView } from "@views/assignment";
import { MessageListPresenter } from "./MessageListPresenter";

interface GradeAssignmentPresenterProps {
    classId?: string;
    assignments: Assignment[];
    onGenerateGradeDraft: (
        submissionId: string,
        model?: string,
        options?: { silent?: boolean },
    ) => Promise<boolean>;
    onSaveGradeReview: (payload: SaveGradeReviewPayload) => Promise<boolean>;
    onReleaseGrade: (submissionId: string) => Promise<boolean>;
    isGeneratingDraft: boolean;
    isSavingReview: boolean;
    isReleasingGrade: boolean;
}

export const GradeAssignmentPresenter = ({
    classId,
    assignments,
    onGenerateGradeDraft,
    onSaveGradeReview,
    onReleaseGrade,
    isGeneratingDraft,
    isSavingReview,
    isReleasingGrade,
}: GradeAssignmentPresenterProps) => {
    const [viewMode, setViewMode] = useState<"dashboard" | "detail">(
        "dashboard",
    );
    const [activeAssignmentId, setActiveAssignmentId] = useState<string | null>(
        assignments[0]?.id ?? null,
    );
    const [activeSubmissionId, setActiveSubmissionId] = useState<string | null>(
        null,
    );
    const [score, setScore] = useState(0);
    const [maxScore, setMaxScore] = useState(100);
    const [teacherFeedback, setTeacherFeedback] = useState("");
    const autoDraftedRef = useRef<Set<string>>(new Set());

    const dashboardQuery = useClassAssignmentDashboardQuery(
        classId,
        !!classId,
    );
    const classMembersQuery = useClassMembersQuery(classId, !!classId);
    const dashboardItems = dashboardQuery.data ?? [];

    const assignmentOptions = useMemo(() => {
        if (dashboardItems.length > 0) {
            return dashboardItems.map((item) => item.assignment);
        }
        return assignments;
    }, [assignments, dashboardItems]);

    useEffect(() => {
        if (!assignmentOptions.length) {
            setActiveAssignmentId(null);
            return;
        }

        if (
            !activeAssignmentId ||
            !assignmentOptions.some(
                (assignment) => assignment.id === activeAssignmentId,
            )
        ) {
            setActiveAssignmentId(assignmentOptions[0].id);
        }
    }, [activeAssignmentId, assignmentOptions]);

    const submissionsQuery = useAssignmentSubmissionsQuery(
        activeAssignmentId ?? undefined,
        classId,
        viewMode === "detail" && !!activeAssignmentId,
    );
    const submissions = submissionsQuery.data?.submissions ?? [];

    useEffect(() => {
        if (!submissions.length) {
            setActiveSubmissionId(null);
            return;
        }

        if (
            !activeSubmissionId ||
            !submissions.some((submission) => submission.id === activeSubmissionId)
        ) {
            setActiveSubmissionId(submissions[0].id);
        }
    }, [activeSubmissionId, submissions]);

    const activeSubmission = useMemo(
        () =>
            submissions.find((submission) => submission.id === activeSubmissionId) ??
            null,
        [activeSubmissionId, submissions],
    );

    const activeAssignment = useMemo(
        () =>
            assignmentOptions.find(
                (assignment) => assignment.id === activeAssignmentId,
            ) ?? null,
        [activeAssignmentId, assignmentOptions],
    );
    const aiGradingEnabled = activeAssignment?.aiGradingEnabled ?? false;
    const summary = useMemo(() => {
        const publishedCount = assignmentOptions.filter(
            (assignment) => assignment.status === "published",
        ).length;
        const closedCount = assignmentOptions.filter(
            (assignment) => assignment.status === "closed",
        ).length;
        const submissionCount =
            dashboardItems.length > 0
                ? dashboardItems.reduce(
                      (total, item) => total + item.submissions.length,
                      0,
                  )
                : assignmentOptions.reduce(
                      (total, assignment) =>
                          total + (assignment.submissionCount ?? 0),
                      0,
                  );
        return { publishedCount, closedCount, submissionCount };
    }, [assignmentOptions, dashboardItems]);

    const activeStudents = useMemo(() => {
        const students = classMembersQuery.data?.students ?? [];
        return students.filter((student) => student.status !== "removed");
    }, [classMembersQuery.data?.students]);

    const dashboardCards = useMemo(() => {
        return dashboardItems.map((item) => {
            const submissionByStudent = new Map<
                string,
                typeof item.submissions[number]
            >();
            item.submissions.forEach((submission) => {
                if (!submission.studentUserId) {
                    return;
                }
                if (!submissionByStudent.has(submission.studentUserId)) {
                    submissionByStudent.set(
                        submission.studentUserId,
                        submission,
                    );
                }
            });

            const submittedStudents = Array.from(
                submissionByStudent.values(),
            ).map((submission) => ({
                id: submission.studentUserId,
                name: submission.studentName || "Unknown User",
            }));
            const missingStudents = activeStudents
                .filter((student) => !submissionByStudent.has(student.userId))
                .map((student) => ({
                    id: student.userId,
                    name:
                        student.name ||
                        student.email ||
                        "Unknown User",
                }));

            const uniqueSubmissions = Array.from(
                submissionByStudent.values(),
            );
            const aiCompletedCount = uniqueSubmissions.filter(
                (submission) => !!submission.aiFeedbackDraft?.trim(),
            ).length;
            const teacherNotManualCount = uniqueSubmissions.filter(
                (submission) =>
                    !!submission.aiFeedbackDraft?.trim() &&
                    submission.gradeStatus === "draft",
            ).length;

            return {
                id: item.assignment.id,
                title: item.assignment.title,
                status: item.assignment.status,
                dueAt: item.assignment.dueAt,
                submittedCount: submittedStudents.length,
                missingCount: missingStudents.length,
                aiCompletedCount,
                teacherNotManualCount,
                submittedStudents,
                missingStudents,
            };
        });
    }, [activeStudents, dashboardItems]);

    const previewData = useMemo(() => {
        const snapshot = activeSubmission?.evidenceSnapshot;
        if (!snapshot || typeof snapshot !== "object" || Array.isArray(snapshot)) {
            return {
                title: "私聊会话",
                capturedAt: null as string | null,
                messages: [],
            };
        }

        const record = snapshot as Record<string, unknown>;
        const title =
            typeof record.sourceTitle === "string" && record.sourceTitle.trim()
                ? record.sourceTitle
                : "私聊会话";
        const capturedAt =
            typeof record.capturedAt === "string" ? record.capturedAt : null;
        const kind =
            typeof record.kind === "string" ? record.kind : "chat_session_snapshot";

        if (kind === "chat_response_snapshot") {
            const message = normalizeSnapshotMessage(record.targetMessage);
            return {
                title,
                capturedAt,
                messages: message ? [message] : [],
            };
        }

        return {
            title,
            capturedAt,
            messages: normalizeSnapshotMessages(record.messages),
        };
    }, [activeSubmission]);

    useEffect(() => {
        if (!activeSubmission) {
            setScore(0);
            setMaxScore(100);
            setTeacherFeedback("");
            return;
        }

        setScore(activeSubmission.grade?.score ?? 0);
        setMaxScore(activeSubmission.grade?.maxScore ?? 100);
        setTeacherFeedback(activeSubmission.grade?.teacherFeedback ?? "");
    }, [activeSubmission]);

    useEffect(() => {
        if (viewMode !== "detail" || !activeSubmission || !aiGradingEnabled) {
            return;
        }

        if (activeSubmission.grade) {
            return;
        }

        if (autoDraftedRef.current.has(activeSubmission.id)) {
            return;
        }

        autoDraftedRef.current.add(activeSubmission.id);
        void (async () => {
            const success = await onGenerateGradeDraft(activeSubmission.id, undefined, {
                silent: true,
            });
            if (success) {
                await submissionsQuery.refetch();
            }
        })();
    }, [
        activeSubmission,
        aiGradingEnabled,
        onGenerateGradeDraft,
        submissionsQuery,
        viewMode,
    ]);

    return (
        <GradeAssignmentView
            mode={viewMode}
            summary={summary}
            dashboardAssignments={dashboardCards}
            isDashboardLoading={dashboardQuery.isLoading}
            onEnterDetail={(assignmentId) => {
                setActiveAssignmentId(assignmentId);
                setActiveSubmissionId(null);
                setViewMode("detail");
            }}
            onBackToDashboard={() => setViewMode("dashboard")}
            assignments={assignmentOptions.map((assignment) => ({
                id: assignment.id,
                title: assignment.title,
                submissionCount:
                    dashboardItems.find(
                        (item) => item.assignment.id === assignment.id,
                    )?.submissions.length ??
                    assignment.submissionCount ??
                    0,
            }))}
            activeAssignmentId={activeAssignmentId}
            onSelectAssignment={setActiveAssignmentId}
            submissions={submissions.map((submission) => ({
                id: submission.id,
                studentName: submission.studentName ?? "Unknown User",
                submittedAt: submission.submittedAt,
                status: submission.grade?.status === "released" ? "released" : "draft",
                attemptNo: submission.attemptNo,
            }))}
            activeSubmissionId={activeSubmissionId}
            onSelectSubmission={setActiveSubmissionId}
            detail={
                activeSubmission
                    ? {
                          submissionId: activeSubmission.id,
                          studentName:
                              activeSubmission.studentName ?? "Unknown User",
                          submittedAt: activeSubmission.submittedAt,
                          reflectionText: activeSubmission.reflectionText,
                          score,
                          maxScore,
                          teacherFeedback,
                          releaseStatus: activeSubmission.grade?.status ?? "draft",
                      }
                    : null
            }
            previewTitle={previewData.title}
            previewCapturedAt={previewData.capturedAt}
            previewContent={
                <MessageListPresenter
                    messages={previewData.messages}
                    isTyping={false}
                    sessionId={activeSubmission?.id ?? "preview"}
                    showActions={false}
                    className="h-full overflow-y-auto overflow-x-hidden bg-slate-50 px-6 py-4"
                    contentClassName="space-y-4"
                />
            }
            hasPreview={previewData.messages.length > 0}
            aiGradingEnabled={aiGradingEnabled}
            isLoading={submissionsQuery.isLoading}
            isGeneratingDraft={isGeneratingDraft}
            isSavingReview={isSavingReview}
            isReleasingGrade={isReleasingGrade}
            onScoreChange={setScore}
            onMaxScoreChange={setMaxScore}
            onTeacherFeedbackChange={setTeacherFeedback}
            onGenerateDraft={async () => {
                if (!activeSubmission) {
                    return;
                }

                const success = await onGenerateGradeDraft(activeSubmission.id);
                if (success) {
                    await submissionsQuery.refetch();
                }
            }}
            onReleaseGrade={async () => {
                if (!activeSubmission) {
                    return;
                }

                const saved = await onSaveGradeReview({
                    submissionId: activeSubmission.id,
                    score,
                    maxScore,
                    teacherFeedback,
                    rubric: activeSubmission.grade?.rubric ?? [],
                    aiFeedbackDraft: activeSubmission.grade?.aiFeedbackDraft,
                });

                if (!saved) {
                    return;
                }

                const success = await onReleaseGrade(activeSubmission.id);
                if (success) {
                    await submissionsQuery.refetch();
                }
            }}
        />
    );
};
