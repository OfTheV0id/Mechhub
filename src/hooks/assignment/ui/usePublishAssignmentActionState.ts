import { useState } from "react";
import type { PublishAssignmentDraft } from "../types";

interface UsePublishAssignmentActionStateParams {
    onPublish: (draft: PublishAssignmentDraft) => Promise<void>;
}

export const usePublishAssignmentActionState = ({
    onPublish,
}: UsePublishAssignmentActionStateParams) => {
    const [isLoading, setIsLoading] = useState(false);

    const handlePublish = async (draft: PublishAssignmentDraft) => {
        if (!draft.title.trim() || !draft.classId) {
            return;
        }

        try {
            setIsLoading(true);
            await onPublish({
                ...draft,
                title: draft.title.trim(),
                instructions: draft.instructions.trim(),
            });
        } finally {
            setIsLoading(false);
        }
    };

    return {
        state: {
            isLoading,
        },
        actions: {
            handlePublish,
        },
    };
};
