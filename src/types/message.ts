export interface Annotation {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    comment: string;
    type: "correct" | "incorrect" | "info";
}

export interface Message {
    id: string;
    role: "user" | "assistant";
    type: "text" | "grading";
    content: string;
    imageUrl?: string; // Keep for backward compatibility
    imageUrls?: string[]; // New field for multiple images
    annotations?: Annotation[];
    score?: number;
}
