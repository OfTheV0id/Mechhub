import React, { useState, useRef } from "react";
import { ImageGradingResult } from "../../../../types/message";
import { StepAnnotationBox } from "./StepAnnotationBox";
import { StepFeedbackList } from "./StepFeedbackList";
import { X, ZoomIn, ChevronRight, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ImageGradingPanelProps {
    imageGrading: ImageGradingResult;
    onImageClick?: (url: string) => void;
}

export const ImageGradingPanel: React.FC<ImageGradingPanelProps> = ({
    imageGrading,
    onImageClick,
}) => {
    const [showDetail, setShowDetail] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);
    const stepRefs = useRef<Map<number, HTMLDivElement>>(new Map());

    const handleSelectStep = (idx: number) => {
        const newIndex = activeStepIndex === idx ? null : idx;
        setActiveStepIndex(newIndex);
        if (newIndex !== null) {
            const stepEl = stepRefs.current.get(newIndex);
            stepEl?.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    };

    return (
        <>
            {/* 紧凑卡片视图 - 上图下文 */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                {/* 顶部：图片 + 标注框 */}
                {/* 顶部：图片 + 标注框 */}
                <div
                    className="relative w-full bg-slate-50 cursor-pointer group border-b border-slate-100 flex items-center justify-center overflow-hidden"
                    onClick={() => setShowDetail(true)}
                    style={{ aspectRatio: "16/9", minHeight: "200px" }}
                >
                    {/* 包装器：确保标注框和图片坐标系一致 */}
                    <div className="relative inline-block max-w-full max-h-full group-hover:scale-105 transition-transform duration-300">
                        <img
                            src={imageGrading.imageUrl}
                            alt="作业图片"
                            className="block max-w-full max-h-full object-contain"
                        />
                        {/* Compact模式下的标注框 */}
                        {imageGrading.steps?.map((step, idx) => (
                            <StepAnnotationBox
                                key={step.stepNumber}
                                step={step}
                                isActive={false}
                                onSelect={() => setShowDetail(true)}
                                isCompact={true}
                            />
                        ))}
                    </div>

                    {/* 悬停遮罩 */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center pointer-events-none z-10">
                        <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                            <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                <ZoomIn size={16} /> 查看详情
                            </span>
                        </div>
                    </div>
                </div>

                {/* 底部：步骤小球列表 */}
                <div className="p-4 bg-slate-50/50">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            评测步骤
                        </span>
                        <span className="text-xs text-slate-400">
                            {imageGrading.steps?.length || 0} Steps
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {imageGrading.steps?.map((step, idx) => (
                            <div
                                key={step.stepNumber}
                                className={`
                                    w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm border border-white/50
                                    ${step.isCorrect ? "bg-green-500" : "bg-red-500"}
                                `}
                                title={`Step ${step.stepNumber}: ${step.stepTitle} - ${step.isCorrect ? "正确" : "错误"}`}
                            >
                                {step.stepNumber}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 全屏详情弹窗 */}
            <AnimatePresence>
                {showDetail && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
                        onClick={() => setShowDetail(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            transition={{
                                type: "spring",
                                damping: 25,
                                stiffness: 300,
                            }}
                            className="bg-white rounded-2xl w-full max-w-7xl h-[90vh] overflow-hidden flex flex-col shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* 头部 */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white z-10">
                                <div className="flex items-center gap-4">
                                    <h3 className="text-xl font-bold text-slate-800">
                                        详细批改报告
                                    </h3>
                                </div>
                                <button
                                    onClick={() => setShowDetail(false)}
                                    className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-800"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* 内容区域 */}
                            <div className="flex-1 flex flex-row overflow-hidden bg-slate-50 relative">
                                {/* 左侧：大图 (Canvas) - 自适应剩余空间 */}
                                <div className="flex-1 relative min-w-0 bg-slate-200/50 flex flex-col overflow-auto">
                                    <div className="inline-flex relative m-4 shadow-2xl rounded-lg bg-white border border-slate-200">
                                        <img
                                            src={imageGrading.imageUrl}
                                            alt="作业图片"
                                            className="block w-auto h-auto min-w-[600px] min-h-[400px] max-w-none object-contain"
                                        />
                                        {imageGrading.steps?.map(
                                            (step, idx) => (
                                                <StepAnnotationBox
                                                    key={step.stepNumber}
                                                    step={step}
                                                    isActive={
                                                        activeStepIndex === idx
                                                    }
                                                    onSelect={() =>
                                                        handleSelectStep(idx)
                                                    }
                                                    isCompact={false}
                                                />
                                            ),
                                        )}
                                    </div>
                                </div>

                                {/* 右侧：可折叠反馈列表 */}
                                <AnimatePresence initial={false}>
                                    {isSidebarOpen && (
                                        <motion.div
                                            initial={{
                                                width: 0,
                                                opacity: 0,
                                            }}
                                            animate={{
                                                width: 320, // 固定宽度，不再用百分比
                                                opacity: 1,
                                            }}
                                            exit={{
                                                width: 0,
                                                opacity: 0,
                                            }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 300,
                                                damping: 30,
                                            }}
                                            className="flex-none border-l border-slate-200 bg-white overflow-y-auto shadow-xl z-20 relative"
                                        >
                                            <div className="w-[320px]">
                                                <StepFeedbackList
                                                    steps={
                                                        imageGrading.steps || []
                                                    }
                                                    activeStepIndex={
                                                        activeStepIndex
                                                    }
                                                    onSelectStep={
                                                        handleSelectStep
                                                    }
                                                    stepRefs={stepRefs}
                                                />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* 折叠/展开按钮 */}
                                <motion.button
                                    onClick={() =>
                                        setIsSidebarOpen(!isSidebarOpen)
                                    }
                                    initial={false}
                                    animate={{
                                        right: isSidebarOpen ? 320 : 0,
                                    }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 30,
                                    }}
                                    className="absolute top-1/2 z-30 transform -translate-y-1/2 bg-white border border-slate-200 shadow-md p-1.5 rounded-l-lg hover:bg-slate-50 hover:text-blue-600"
                                    style={{
                                        borderRight: isSidebarOpen
                                            ? "none"
                                            : "1px solid #e2e8f0",
                                    }}
                                    title={
                                        isSidebarOpen ? "收起列表" : "展开列表"
                                    }
                                >
                                    {isSidebarOpen ? (
                                        <ChevronRight size={20} />
                                    ) : (
                                        <ChevronLeft size={20} />
                                    )}
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
