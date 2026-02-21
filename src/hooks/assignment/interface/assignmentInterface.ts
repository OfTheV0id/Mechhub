import {
    createAssignment,
    generateGradeDraft,
    getFeedbackDetail,
    listAssignmentSubmissions,
    listClassAssignments,
    listClassAssignmentDashboard,
    listMyAssignments,
    listMyFeedback,
    releaseGrade,
    saveGradeReview,
    submitAssignmentFromChat,
} from "../implementation/assignmentService";

export interface AssignmentInterface {
    createAssignment: typeof createAssignment;
    listMyAssignments: typeof listMyAssignments;
    listClassAssignments: typeof listClassAssignments;
    listClassAssignmentDashboard: typeof listClassAssignmentDashboard;
    submitAssignmentFromChat: typeof submitAssignmentFromChat;
    listAssignmentSubmissions: typeof listAssignmentSubmissions;
    generateGradeDraft: typeof generateGradeDraft;
    saveGradeReview: typeof saveGradeReview;
    releaseGrade: typeof releaseGrade;
    listMyFeedback: typeof listMyFeedback;
    getFeedbackDetail: typeof getFeedbackDetail;
}

export const createAssignmentInterface =
    (): AssignmentInterface => ({
        createAssignment,
        listMyAssignments,
        listClassAssignments,
        listClassAssignmentDashboard,
        submitAssignmentFromChat,
        listAssignmentSubmissions,
        generateGradeDraft,
        saveGradeReview,
        releaseGrade,
        listMyFeedback,
        getFeedbackDetail,
    });

export const assignmentInterface = createAssignmentInterface();
