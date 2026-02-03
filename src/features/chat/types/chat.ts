export type ChatMode = "study" | "correct";

export interface DeleteChatResult {
    success: boolean;
    wasCurrentSession: boolean;
}
