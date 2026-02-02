import { useState } from "react";

export const useFileAttachmentPreview = () => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpanded = () => setIsExpanded(!isExpanded);

    return {
        isExpanded,
        toggleExpanded,
    };
};
