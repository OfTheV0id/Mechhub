import { Message, FileAttachment } from "../../types/message";

export interface AICompletionRequest {
    messages: Message[];
    mode: "study" | "correct";
    imageUrl?: string; // Legacy
    imageUrls?: string[]; // New
    fileAttachments?: FileAttachment[]; // File attachments with content
}

export interface AICompletionResponse {
    content: string;
    // Future extension: tokenUsage, modelName, etc.
}
