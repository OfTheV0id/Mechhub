import { useSubmitAssignmentActionState } from "./useSubmitAssignmentActionState";
import { useSubmitFileState } from "./useSubmitFileState";

interface UseSubmitAssignmentStateParams {
    onSubmit: (file: File, comments: string) => Promise<void>;
}

export const useSubmitAssignmentState = ({
    onSubmit,
}: UseSubmitAssignmentStateParams) => {
    const fileState = useSubmitFileState();
    const submitState = useSubmitAssignmentActionState({ onSubmit });

    const handleSubmit = async () => {
        await submitState.actions.handleSubmit(fileState.state.file);
    };

    const state = {
        fileName: fileState.state.fileName,
        fileUrl: fileState.state.fileUrl,
        comments: submitState.state.comments,
        isLoading: submitState.state.isLoading,
    };

    const actions = {
        handleFileSelect: fileState.actions.handleFileSelect,
        setComments: submitState.actions.setComments,
        handleSubmit,
    };

    return {
        state,
        actions,
        fileName: state.fileName,
        fileUrl: state.fileUrl,
        comments: state.comments,
        isLoading: state.isLoading,
        handleFileSelect: actions.handleFileSelect,
        setComments: actions.setComments,
        handleSubmit: actions.handleSubmit,
    };
};
