import { usePublishAssignmentState } from "@hooks";
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
    const publishState = usePublishAssignmentState({ onPublish });

    return (
        <PublishAssignmentView
            assignmentName={publishState.assignmentName}
            setAssignmentName={publishState.setAssignmentName}
            selectedModule={publishState.selectedModule}
            setSelectedModule={publishState.setSelectedModule}
            modules={modules}
            dueDate={publishState.dueDate}
            setDueDate={publishState.setDueDate}
            dueTime={publishState.dueTime}
            setDueTime={publishState.setDueTime}
            instructions={publishState.instructions}
            setInstructions={publishState.setInstructions}
            attachedFiles={publishState.attachedFiles}
            onFileUpload={publishState.handleFileUpload}
            onRemoveFile={publishState.handleRemoveFile}
            aiGradingEnabled={publishState.aiGradingEnabled}
            setAiGradingEnabled={publishState.setAiGradingEnabled}
            onPublish={publishState.handlePublish}
            onCancel={onCancel}
            isLoading={publishState.isLoading}
        />
    );
};
