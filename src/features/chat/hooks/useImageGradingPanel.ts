import { useState, useRef } from "react";

export const useImageGradingPanel = () => {
    const [showDetail, setShowDetail] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);
    const stepRefs = useRef<Map<number, HTMLDivElement>>(new Map());

    const openDetail = () => setShowDetail(true);
    const closeDetail = () => setShowDetail(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const handleSelectStep = (idx: number) => {
        const newIndex = activeStepIndex === idx ? null : idx;
        setActiveStepIndex(newIndex);
        if (newIndex !== null) {
            const stepEl = stepRefs.current.get(newIndex);
            stepEl?.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    };

    return {
        showDetail,
        openDetail,
        closeDetail,
        isSidebarOpen,
        toggleSidebar,
        activeStepIndex,
        handleSelectStep,
        stepRefs,
    };
};
