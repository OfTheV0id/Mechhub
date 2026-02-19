export type StudentSubmissionStatus = "pending" | "graded";

export interface StudentSubmission {
    id: string;
    studentName: string;
    submittedDate: string;
    status: StudentSubmissionStatus;
    submission: string;
}

export type GradeBreakdownColor = "green" | "yellow" | "red";

export interface GradeBreakdown {
    category: string;
    score: number;
    maxScore: number;
    color: GradeBreakdownColor;
}

export type KeyInsightType = "success" | "warning" | "error";

export interface KeyInsight {
    title: string;
    description: string;
    type: KeyInsightType;
}
