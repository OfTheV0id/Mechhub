import React from "react";
import { ViewFeedbackView } from "@views/assignment";

interface GradeBreakdown {
    category: string;
    score: number;
    maxScore: number;
    color: "green" | "yellow" | "red";
}

interface KeyInsight {
    title: string;
    description: string;
    type: "success" | "warning" | "error";
}

interface ViewFeedbackPresenterProps {
    assignmentTitle: string;
    overallScore: number;
    maxScore: number;
    submittedDate: string;
    teacherName: string;
    teacherAvatar?: string;
    teacherSummary: string;
    aiAnalysis: string;
    gradeBreakdown: GradeBreakdown[];
    keyInsights: KeyInsight[];
    generalComments?: string;
    privateNotes?: string;
    onDownloadPDF?: () => void;
}

export const ViewFeedbackPresenter: React.FC<
    ViewFeedbackPresenterProps
> = ({
    assignmentTitle,
    overallScore,
    maxScore,
    submittedDate,
    teacherName,
    teacherAvatar,
    teacherSummary,
    aiAnalysis,
    gradeBreakdown,
    keyInsights,
    generalComments,
    privateNotes,
    onDownloadPDF,
}) => {
    return (
        <ViewFeedbackView
            assignmentTitle={assignmentTitle}
            overallScore={overallScore}
            maxScore={maxScore}
            submittedDate={submittedDate}
            teacherName={teacherName}
            teacherAvatar={teacherAvatar}
            teacherSummary={teacherSummary}
            aiAnalysis={aiAnalysis}
            gradeBreakdown={gradeBreakdown}
            keyInsights={keyInsights}
            generalComments={generalComments}
            privateNotes={privateNotes}
            onDownloadPDF={onDownloadPDF}
        />
    );
};
