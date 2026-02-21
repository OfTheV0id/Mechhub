export type ClassRole = "teacher" | "student";

export interface ClassSummary {
    id: string;
    name: string;
    description?: string | null;
    role: ClassRole;
    teacherCount: number;
    studentCount: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateClassResult {
    classSummary: ClassSummary;
    inviteCode: string;
}

export interface MyClassContext {
    teachingClasses: ClassSummary[];
    joinedClasses: ClassSummary[];
    hasAnyMembership: boolean;
    isAdmin: boolean;
}

export interface InviteCodeSummary {
    id: string;
    code: string;
    codeLast4: string;
    expiresAt: string;
    maxUses: number | null;
    usedCount: number;
    isRevoked: boolean;
    createdAt?: string;
}

export interface ClassMemberSummary {
    userId: string;
    email: string;
    name: string;
    avatar?: string | null;
    role: ClassRole;
    status?: "active" | "removed";
    joinedAt?: string;
    removedAt?: string | null;
}

export interface ClassMembersSnapshot {
    classId: string;
    teachers: ClassMemberSummary[];
    students: ClassMemberSummary[];
}

export type ClassThreadType = "group" | "shared_chat" | "shared_grade";

export interface ClassThread {
    id: string;
    classId: string;
    threadType: ClassThreadType;
    title: string;
    createdByUserId?: string | null;
    sourceChatId?: string | null;
    sourceGradeRef?: string | null;
    createdAt: string;
    updatedAt: string;
}

export type ClassThreadMessageRole = "user" | "assistant" | "system";

export interface ClassThreadMessage {
    id: string;
    threadId: string;
    senderUserId?: string | null;
    senderName?: string | null;
    senderEmail?: string | null;
    senderAvatar?: string | null;
    role: ClassThreadMessageRole;
    content: Record<string, unknown>;
    mentionsAi: boolean;
    replyToMessageId?: string | null;
    createdAt: string;
}

export interface PostClassMessageResult {
    message: ClassThreadMessage;
    aiMessage?: ClassThreadMessage | null;
}

export interface DeleteClassThreadResult {
    success: boolean;
    classId: string;
    threadId: string;
}

export interface CreateClassPayload {
    name: string;
    description?: string;
}

export interface CreateInviteCodePayload {
    classId: string;
    expiresInHours?: number;
    maxUses?: number | null;
}

export interface JoinClassByCodePayload {
    inviteCode: string;
}

export interface AssignTeacherPayload {
    classId: string;
    teacherUserId: string;
}

export interface RemoveStudentPayload {
    classId: string;
    studentUserId: string;
}

export interface DeleteClassPayload {
    classId: string;
}

export interface LeaveClassPayload {
    classId: string;
}

export interface PostClassMessagePayload {
    threadId: string;
    content: Record<string, unknown> | string;
}

export interface RenameClassThreadPayload {
    classId: string;
    threadId: string;
    title: string;
}

export interface DeleteClassThreadPayload {
    classId: string;
    threadId: string;
}

export interface SharePrivateChatPayload {
    classId: string;
    threadId: string;
    chatId: string;
    messageIds?: string[];
}

export interface ShareGradeResultPayload {
    classId: string;
    gradePayload: Record<string, unknown>;
}
