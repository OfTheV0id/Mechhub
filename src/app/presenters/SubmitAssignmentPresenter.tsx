import { buildSnapshotPreview, type Assignment } from "@hooks";
import { MessageListPresenter } from "./MessageListPresenter";
import { SubmitAssignmentView } from "@views/assignment";

interface SubmitAssignmentPresenterProps {
    assignments: Assignment[];
    classNameById: Record<string, string>;
    isSubmitting: boolean;
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
    isSubmitting,
}: SubmitAssignmentPresenterProps) => {
    return (
        <SubmitAssignmentView
            assignments={assignments.map((assignment) => ({
                id: assignment.id,
                title: assignment.title,
                className: classNameById[assignment.classId] ?? "未命名班级",
                dueAt: assignment.dueAt,
                instructions: assignment.instructions,
                attachments: assignment.attachments ?? [],
                ...(assignment.latestSubmission?.evidenceSnapshot
                    ? (() => {
                          const preview = buildSnapshotPreview(
                              assignment.latestSubmission?.evidenceSnapshot,
                          );
                          return {
                              hasPreview: preview.messages.length > 0,
                              previewContent:
                                  preview.messages.length > 0 ? (
                                      <MessageListPresenter
                                          messages={preview.messages}
                                          isTyping={false}
                                          sessionId={
                                              assignment.latestSubmission?.id ??
                                              assignment.id
                                          }
                                          showActions={false}
                                          className="h-full overflow-y-auto overflow-x-hidden bg-slate-50 px-4 py-3"
                                          contentClassName="space-y-4"
                                      />
                                  ) : undefined,
                          };
                      })()
                    : { hasPreview: false }),
                status: toDashboardStatus(assignment),
                latestAttemptNo: assignment.latestSubmission?.attemptNo ?? 0,
                latestSubmittedAt: assignment.latestSubmission?.submittedAt ?? null,
                latestGrade: assignment.latestGrade
                    ? `${assignment.latestGrade.score}/${assignment.latestGrade.maxScore}`
                    : null,
            }))}
            isSubmitting={isSubmitting}
        />
    );
};
