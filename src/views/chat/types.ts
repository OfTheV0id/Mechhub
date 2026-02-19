export interface BoundingBox {
    x: number;
    y: number;
    width: number;
    height: number;
}

export type ChatMode = "study" | "correct";

export interface DeleteChatResult {
    success: boolean;
    wasCurrentSession: boolean;
}

export interface FileAttachment {
    filename: string;
    content: string;
    language?: string;
}

export interface GradingStep {
    stepNumber: number;
    stepTitle: string;
    isCorrect: boolean;
    formula?: string;
    text?: string;
    comment: string;
    suggestion?: string;
    correctFormula?: string;
    bbox: BoundingBox;
}

export interface ImageGradingResult {
    imageUrl: string;
    steps: GradingStep[];
}

export interface GradingResult {
    summary: string;
    imageGradingResult: ImageGradingResult[];
}

export interface OcrResult {
    imageUrl: string;
    text: string;
}

export interface SubmitMessage {
    text: string;
    mode: ChatMode;
    imageUrls?: string[];
    fileAttachments?: FileAttachment[];
    model: string;
}

export interface Message extends SubmitMessage {
    id: string;
    role: "user" | "assistant";
    type: "text" | "grading";
    gradingResult?: GradingResult;
    reasoning?: string;
    ocrText?: string;
    createdAt?: string;
}

export interface ChatSession {
    id: string;
    title: string;
    updatedAt: number;
    messages?: Message[];
    isGeneratingTitle?: boolean;
}

export interface UploadImageResult {
    publicUrl: string;
    storagePath?: string;
}

export type UploadImageHandler = (file: File) => Promise<UploadImageResult>;
