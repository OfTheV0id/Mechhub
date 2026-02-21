import {
    assignTeacherToClass,
    createClass,
    createInviteCode,
    deleteClass,
    leaveClass,
    getMyClassContext,
    joinClassByInviteCode,
    listClassMembers,
    listInviteCodes,
    removeStudentFromClass,
    revokeInviteCode,
} from "../implementation/classManagementService";
import {
    createGroupThread,
    deleteClassThread,
    getClassThreadMessages,
    listClassThreads,
    postClassMessage,
    renameClassThread,
    shareGradeResultToClass,
    sharePrivateChatToClass,
} from "../implementation/classThreadService";
import { isClassForbiddenError as isClassForbiddenErrorPredicate } from "../implementation/classErrors";

export interface ClassInterface {
    getMyClassContext: typeof getMyClassContext;
    listClassMembers: typeof listClassMembers;
    listInviteCodes: typeof listInviteCodes;
    listClassThreads: typeof listClassThreads;
    getClassThreadMessages: typeof getClassThreadMessages;
    createClass: typeof createClass;
    assignTeacherToClass: typeof assignTeacherToClass;
    deleteClass: typeof deleteClass;
    leaveClass: typeof leaveClass;
    createInviteCode: typeof createInviteCode;
    revokeInviteCode: typeof revokeInviteCode;
    joinClassByInviteCode: typeof joinClassByInviteCode;
    removeStudentFromClass: typeof removeStudentFromClass;
    createGroupThread: typeof createGroupThread;
    renameClassThread: typeof renameClassThread;
    deleteClassThread: typeof deleteClassThread;
    postClassMessage: typeof postClassMessage;
    sharePrivateChatToClass: typeof sharePrivateChatToClass;
    shareGradeResultToClass: typeof shareGradeResultToClass;
    isClassForbiddenError: typeof isClassForbiddenErrorPredicate;
}

export const createClassInterface = (): ClassInterface => ({
    getMyClassContext,
    listClassMembers,
    listInviteCodes,
    listClassThreads,
    getClassThreadMessages,
    createClass,
    assignTeacherToClass,
    deleteClass,
    leaveClass,
    createInviteCode,
    revokeInviteCode,
    joinClassByInviteCode,
    removeStudentFromClass,
    createGroupThread,
    renameClassThread,
    deleteClassThread,
    postClassMessage,
    sharePrivateChatToClass,
    shareGradeResultToClass,
    isClassForbiddenError: isClassForbiddenErrorPredicate,
});

export const classInterface = createClassInterface();
export const isClassForbiddenError = classInterface.isClassForbiddenError;
