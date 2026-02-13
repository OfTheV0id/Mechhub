import { useSubmitAssignmentState } from "@hooks";
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
    const submitState = useSubmitAssignmentState({ onSubmit });

    return (
        <SubmitAssignmentView
            title={assignmentTitle}
            description={assignmentDescription}
            fileName={submitState.fileName}
            fileUrl={submitState.fileUrl}
            comments={submitState.comments}
            onFileSelect={submitState.handleFileSelect}
            onCommentsChange={submitState.setComments}
            onSubmit={submitState.handleSubmit}
            onCancel={onCancel}
            isLoading={submitState.isLoading}
        />
    );
};
