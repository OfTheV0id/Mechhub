import {
    deriveViewFeedbackModel,
    type AssignmentGradeBreakdown,
    type AssignmentKeyInsight,
} from "@hooks";
import { ViewFeedbackView } from "@views/assignment";

interface ViewFeedbackPresenterProps {
    assignmentTitle: string;
    overallScore: number;
    maxScore: number;
    submittedDate: string;
    teacherName: string;
    teacherAvatar?: string;
    teacherSummary: string;
    aiAnalysis: string;
    gradeBreakdown: AssignmentGradeBreakdown[];
    keyInsights: AssignmentKeyInsight[];
    generalComments?: string;
    privateNotes?: string;
    onDownloadPDF?: () => void;
    onShareToClass?: () => void;
}

export const ViewFeedbackPresenter = ({
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
    onShareToClass,
}: ViewFeedbackPresenterProps) => {
    const feedbackState = deriveViewFeedbackModel({
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
        onShareToClass,
    });

    return <ViewFeedbackView {...feedbackState} />;
};
