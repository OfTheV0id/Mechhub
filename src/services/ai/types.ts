import { Message } from "../../types/message";

export interface AICompletionRequest {
    messages: Message[];
    mode: "study" | "correct";
    imageUrl?: string; // Legacy
    imageUrls?: string[]; // New
}

export interface AICompletionResponse {
    content: string;
    // Future extension: tokenUsage, modelName, etc.
}
