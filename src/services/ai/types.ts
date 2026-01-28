import { Message, FileAttachment, GradingResult } from "../../types/message";

export interface AICompletionRequest {
    messages: Message[];
    mode: "study" | "correct";
    imageUrl?: string;
    imageUrls?: string[];
    fileAttachments?: FileAttachment[];
}

export interface AICompletionResponse {
    content: string;
    gradingResult?: GradingResult; // Structured grading for correct mode
}
