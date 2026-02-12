import { useState } from "react";
import { SubmitAssignmentView } from "@views/assignment";

interface SubmitAssignmentPresenterProps {
    assignmentTitle: string;
    assignmentDescription: string;
    onSubmit: (file: File, comments: string) => Promise<void>;
    onCancel: () => void;
}

export const SubmitAssignmentPresenter = ({
    assignmentTitle,
    assignmentDescription,
    onSubmit,
    onCancel,
}: SubmitAssignmentPresenterProps) => {
    const [fileName, setFileName] = useState<string>();
    const [file, setFile] = useState<File>();
    const [comments, setComments] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleFileSelect = (selectedFile: File) => {
        setFile(selectedFile);
        setFileName(selectedFile.name);
    };

    const handleSubmit = async () => {
        if (!file) return;
        try {
            setIsLoading(true);
            await onSubmit(file, comments);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SubmitAssignmentView
            title={assignmentTitle}
            description={assignmentDescription}
            fileName={fileName}
            fileUrl={file ? URL.createObjectURL(file) : undefined}
            comments={comments}
            onFileSelect={handleFileSelect}
            onCommentsChange={setComments}
            onSubmit={handleSubmit}
            onCancel={onCancel}
            isLoading={isLoading}
        />
    );
};
