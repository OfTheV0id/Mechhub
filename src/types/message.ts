export interface Annotation {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    comment: string;
    type: "correct" | "incorrect" | "info";
}

export interface FileAttachment {
    filename: string;
    content: string;
    language?: string;
}

// Bounding box for annotation overlay (percentage-based, 0-100)
export interface BoundingBox {
    x: number; // left position %
    y: number; // top position %
    width: number; // width %
    height: number; // height %
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
    score: number;
    steps: GradingStep[];
}

// Full grading response
export interface GradingResult {
    overallScore: number;
    summary: string;
    images: ImageGradingResult[];
}

export interface Message {
    id: string;
    role: "user" | "assistant";
    type: "text" | "grading";
    content: string;
    imageUrl?: string;
    imageUrls?: string[];
    fileAttachments?: FileAttachment[];
    annotations?: Annotation[];
    score?: number;
    gradingResult?: GradingResult; // Structured grading response
}
