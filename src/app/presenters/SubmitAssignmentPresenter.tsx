import type { Assignment } from "@hooks";
import { SubmitAssignmentView } from "@views/assignment";

interface SubmitAssignmentPresenterProps {
    assignments: Assignment[];
    classNameById: Record<string, string>;
    hasCurrentSession: boolean;
    isSubmitting: boolean;
    onSubmitFromCurrentSession: (assignmentId: string) => void;
    onOpenChat: () => void;
}

const toDashboardStatus = (assignment: Assignment) => {
    const dueAt = assignment.dueAt ? new Date(assignment.dueAt) : null;
    const isOverdue = !!dueAt && dueAt.getTime() < Date.now();
    const submitted = !!assignment.latestSubmission;

    if (isOverdue && !submitted) {
        return "overdue" as const;
    }

    return submitted ? ("submitted" as const) : ("pending" as const);
};

export const SubmitAssignmentPresenter = ({
    assignments,
    classNameById,
    hasCurrentSession,
    isSubmitting,
    onSubmitFromCurrentSession,
    onOpenChat,
}: SubmitAssignmentPresenterProps) => {
    return (
        <SubmitAssignmentView
            assignments={assignments.map((assignment) => ({
                id: assignment.id,
                title: assignment.title,
                className: classNameById[assignment.classId] ?? "未命名班级",
                dueAt: assignment.dueAt,
                status: toDashboardStatus(assignment),
                latestAttemptNo: assignment.latestSubmission?.attemptNo ?? 0,
                latestSubmittedAt: assignment.latestSubmission?.submittedAt ?? null,
                latestGrade: assignment.latestGrade
                    ? `${assignment.latestGrade.score}/${assignment.latestGrade.maxScore}`
                    : null,
            }))}
            hasCurrentSession={hasCurrentSession}
            isSubmitting={isSubmitting}
            onSubmitFromCurrentSession={onSubmitFromCurrentSession}
            onOpenChat={onOpenChat}
        />
    );
};
