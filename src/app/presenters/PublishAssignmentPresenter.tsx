import { useState } from "react";
import { PublishAssignmentView } from "@views/assignment";

interface PublishAssignmentPresenterProps {
    modules: string[];
    onPublish: (
        name: string,
        module: string,
        dueDate: string,
        dueTime: string,
        instructions: string,
        files: File[],
        aiGradingEnabled: boolean,
    ) => Promise<void>;
    onCancel: () => void;
}

export const PublishAssignmentPresenter = ({
    modules,
    onPublish,
    onCancel,
}: PublishAssignmentPresenterProps) => {
    const [assignmentName, setAssignmentName] = useState("");
    const [selectedModule, setSelectedModule] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [dueTime, setDueTime] = useState("");
    const [instructions, setInstructions] = useState("");
    const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
    const [aiGradingEnabled, setAiGradingEnabled] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const handleFileUpload = (file: File) => {
        setAttachedFiles([...attachedFiles, file]);
    };

    const handleRemoveFile = (index: number) => {
        setAttachedFiles(attachedFiles.filter((_, i) => i !== index));
    };

    const handlePublish = async () => {
        if (!assignmentName || !selectedModule) return;
        try {
            setIsLoading(true);
            await onPublish(
                assignmentName,
                selectedModule,
                dueDate,
                dueTime,
                instructions,
                attachedFiles,
                aiGradingEnabled,
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <PublishAssignmentView
            assignmentName={assignmentName}
            setAssignmentName={setAssignmentName}
            selectedModule={selectedModule}
            setSelectedModule={setSelectedModule}
            modules={modules}
            dueDate={dueDate}
            setDueDate={setDueDate}
            dueTime={dueTime}
            setDueTime={setDueTime}
            instructions={instructions}
            setInstructions={setInstructions}
            attachedFiles={attachedFiles}
            onFileUpload={handleFileUpload}
            onRemoveFile={handleRemoveFile}
            aiGradingEnabled={aiGradingEnabled}
            setAiGradingEnabled={setAiGradingEnabled}
            onPublish={handlePublish}
            onCancel={onCancel}
            isLoading={isLoading}
        />
    );
};
