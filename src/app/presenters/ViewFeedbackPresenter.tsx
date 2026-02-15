import { useMemo, useState } from "react";
import type { AssignmentFeedbackSummary } from "@hooks";
import { ViewFeedbackView } from "@views/assignment";

interface ViewFeedbackPresenterProps {
    feedbackList: AssignmentFeedbackSummary[];
    classNameById: Record<string, string>;
}

const toDisplayScore = (summary: AssignmentFeedbackSummary) => {
    if (!summary.grade) {
        return "未发布";
    }

    return `${summary.grade.score}/${summary.grade.maxScore}`;
};

export const ViewFeedbackPresenter = ({
    feedbackList,
    classNameById,
}: ViewFeedbackPresenterProps) => {
    const [activeSubmissionId, setActiveSubmissionId] = useState<string | null>(
        feedbackList[0]?.submission.id ?? null,
    );

    const activeItem = useMemo(
        () =>
            feedbackList.find(
                (item) => item.submission.id === activeSubmissionId,
            ) ?? null,
        [activeSubmissionId, feedbackList],
    );

    const groupedItems = useMemo(() => {
        const groups = new Map<
            string,
            {
                classId: string;
                className: string;
                items: Array<{
                    submissionId: string;
                    assignmentTitle: string;
                    classId: string;
                    className: string;
                }>;
            }
        >();

        feedbackList.forEach((item) => {
            const classId =
                item.assignment?.classId || item.submission.classId || "unknown";
            const className = classNameById[classId] ?? "未命名班级";
            const entry = {
                submissionId: item.submission.id,
                assignmentTitle: item.assignment?.title ?? "未命名作业",
                classId,
                className,
            };

            if (!groups.has(classId)) {
                groups.set(classId, {
                    classId,
                    className,
                    items: [entry],
                });
                return;
            }

            groups.get(classId)?.items.push(entry);
        });

        return Array.from(groups.values());
    }, [classNameById, feedbackList]);

    return (
        <ViewFeedbackView
            groups={groupedItems}
            activeSubmissionId={activeSubmissionId}
            onSelectSubmission={setActiveSubmissionId}
            detail={
                activeItem
                    ? {
                          assignmentTitle:
                              activeItem.assignment?.title ?? "未命名作业",
                          dueAt: activeItem.assignment?.dueAt ?? null,
                          submittedAt: activeItem.submission.submittedAt,
                          reflectionText: activeItem.submission.reflectionText,
                          teacherFeedback: activeItem.grade?.teacherFeedback ?? "",
                          aiFeedbackDraft:
                              activeItem.grade?.aiFeedbackDraft ?? null,
                          score: toDisplayScore(activeItem),
                          rubric: activeItem.grade?.rubric ?? [],
                      }
                    : null
            }
        />
    );
};
