export interface UserProfile {
    name: string;
    avatar: string;
}

export type ActiveView =
    | "home"
    | "chat"
    | "profile"
    | "landing"
    | "classHub"
    | "submitAssignment"
    | "viewFeedback"
    | "publishAssignment"
    | "gradeAssignment";
