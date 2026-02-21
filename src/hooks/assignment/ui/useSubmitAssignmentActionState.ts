import { useState } from "react";

interface UseSubmitAssignmentActionStateParams {
    onSubmit: (file: File, comments: string) => Promise<void>;
}

export const useSubmitAssignmentActionState = ({
    onSubmit,
}: UseSubmitAssignmentActionStateParams) => {
    const [comments, setComments] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (file?: File) => {
        if (!file) {
            return;
        }

        try {
            setIsLoading(true);
            await onSubmit(file, comments);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        state: {
            comments,
            isLoading,
        },
        actions: {
            setComments,
            handleSubmit,
        },
    };
};
