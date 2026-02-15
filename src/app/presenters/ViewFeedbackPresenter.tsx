import { useMemo, useState } from "react";
import type { AssignmentFeedbackSummary } from "@hooks";
import { ViewFeedbackView } from "@views/assignment";

interface ViewFeedbackPresenterProps {
    feedbackList: AssignmentFeedbackSummary[];
    onOpenChat: () => void;
}

const toDisplayScore = (summary: AssignmentFeedbackSummary) => {
    if (!summary.grade) {
        return "未发布";
    }

    return `${summary.grade.score}/${summary.grade.maxScore}`;
};

export const ViewFeedbackPresenter = ({
    feedbackList,
    onOpenChat,
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

    return (
        <ViewFeedbackView
            items={feedbackList.map((item) => ({
                submissionId: item.submission.id,
                assignmentTitle: item.assignment?.title ?? "未命名作业",
                score: toDisplayScore(item),
                status: item.grade ? "released" : "pending",
                releasedAt: item.grade?.releasedAt ?? null,
                submittedAt: item.submission.submittedAt,
            }))}
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
            onOpenChat={onOpenChat}
        />
    );
};
