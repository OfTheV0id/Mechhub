import { useEffect, useMemo, useState } from "react";
import {
    useAssignmentSubmissionsQuery,
    type Assignment,
    type SaveGradeReviewPayload,
} from "@hooks";
import { GradeAssignmentView } from "@views/assignment";

interface GradeAssignmentPresenterProps {
    classId?: string;
    assignments: Assignment[];
    onGenerateGradeDraft: (submissionId: string, model?: string) => Promise<boolean>;
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
    const [activeAssignmentId, setActiveAssignmentId] = useState<string | null>(
        assignments[0]?.id ?? null,
    );
    const [activeSubmissionId, setActiveSubmissionId] = useState<string | null>(
        null,
    );
    const [score, setScore] = useState(0);
    const [maxScore, setMaxScore] = useState(100);
    const [teacherFeedback, setTeacherFeedback] = useState("");

    useEffect(() => {
        if (!activeAssignmentId && assignments[0]) {
            setActiveAssignmentId(assignments[0].id);
        }
    }, [activeAssignmentId, assignments]);

    const submissionsQuery = useAssignmentSubmissionsQuery(
        activeAssignmentId ?? undefined,
        classId,
        !!activeAssignmentId,
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

    return (
        <GradeAssignmentView
            assignments={assignments.map((assignment) => ({
                id: assignment.id,
                title: assignment.title,
                submissionCount: assignment.submissionCount ?? 0,
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
                          evidenceSnapshot: activeSubmission.evidenceSnapshot,
                          score,
                          maxScore,
                          teacherFeedback,
                          releaseStatus: activeSubmission.grade?.status ?? "draft",
                      }
                    : null
            }
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
            onSaveReview={async () => {
                if (!activeSubmission) {
                    return;
                }

                const success = await onSaveGradeReview({
                    submissionId: activeSubmission.id,
                    score,
                    maxScore,
                    teacherFeedback,
                    rubric: activeSubmission.grade?.rubric ?? [],
                    aiFeedbackDraft: activeSubmission.grade?.aiFeedbackDraft,
                });

                if (success) {
                    await submissionsQuery.refetch();
                }
            }}
            onReleaseGrade={async () => {
                if (!activeSubmission) {
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
