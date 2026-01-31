// BoundingBox for annotation overlay (percentage-based, 0-100)
export interface BoundingBox {
    x: number; // left position %
    y: number; // top position %
    width: number; // width %
    height: number; // height %
}

export interface FileAttachment {
    filename: string;
    content: string;
    language?: string;
}

// Single grading step with location on image
export interface GradingStep {
    stepNumber: number;
    stepTitle: string;
    isCorrect: boolean;
    comment: string;
    suggestion?: string;
    bbox: BoundingBox;
}

// Grading result for a single image
export interface ImageGradingResult {
    imageUrl: string;
    steps: GradingStep[];
}

export interface GradingResult {
    summary: string;
    imageGradingResult: ImageGradingResult[];
}

export interface Message {
    id: string;
    role: "user" | "assistant";
    type: "text" | "grading";
    content: string;
    imageUrls?: string[];
    fileAttachments?: FileAttachment[];
    gradingResult?: GradingResult;
    createdAt?: string;
}

export interface AICompletionRequest {
    messages: Message[];
    mode: "study" | "correct";
    imageUrls?: string[];
    fileAttachments?: FileAttachment[];
}

export interface AICompletionResponse {
    content: string;
    gradingResult?: GradingResult;
}

// Callback for streaming content updates
export type StreamCallback = (chunk: string) => void;

export interface AIStreamRequest extends AICompletionRequest {
    onChunk: StreamCallback;
}
