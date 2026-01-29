import React, { useState, useEffect } from "react";
import { Plus, Settings, MessageSquare } from "lucide-react";
import { ChatSession } from "../types/session";
import { UserProfile } from "../types/user";
import { MissionItem } from "./sidebar/MissionItem";

const MIN_SIDEBAR_WIDTH = 240;
const MAX_SIDEBAR_WIDTH = 500;
const DEFAULT_SIDEBAR_WIDTH = 280;

interface SidebarProps {
    activeView: string;
    setActiveView: (view: string) => void;
    onNewQuest: () => void;
    user?: UserProfile;
    sessions?: ChatSession[];
    currentSessionId?: string | null;
    onSelectSession?: (id: string) => void;
    onDeleteSession?: (id: string) => void;
    onRenameSession?: (id: string, newTitle: string) => Promise<boolean>;
}

export const Sidebar: React.FC<SidebarProps> = ({
    activeView,
    setActiveView,
    onNewQuest,
    user = {
        name: "张同学",
        avatar: "https://images.unsplash.com/photo-1644904105846-095e45fca990?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwc3R1ZGVudCUyMGF2YXRhcnxlbnwxfHx8fDE3Njg3OTU3NDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        role: "Lv.12 学徒",
    },
    sessions = [],
    currentSessionId,
    onSelectSession,
    onDeleteSession,
    onRenameSession,
}) => {
    // Sidebar width state
    const [sidebarWidth, setSidebarWidth] = useState(() => {
        const saved = localStorage.getItem("sidebarWidth");
        return saved ? parseInt(saved, 10) : DEFAULT_SIDEBAR_WIDTH;
    });
    const [isResizing, setIsResizing] = useState(false);

    // Handle mouse move for resizing
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizing) return;

            const newWidth = e.clientX;
            if (
                newWidth >= MIN_SIDEBAR_WIDTH &&
                newWidth <= MAX_SIDEBAR_WIDTH
            ) {
                setSidebarWidth(newWidth);
                localStorage.setItem("sidebarWidth", newWidth.toString());
            }
        };

        const handleMouseUp = () => {
            setIsResizing(false);
        };

        if (isResizing) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
            document.body.style.cursor = "ew-resize";
            document.body.style.userSelect = "none";
        }

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
            document.body.style.cursor = "";
            document.body.style.userSelect = "";
        };
    }, [isResizing]);

    return (
        <div
            className="flex-1 flex flex-col bg-white border-r border-slate-200 flex-shrink-0 relative"
            style={{ width: `${sidebarWidth}px` }}
        >
            {/* Resize Handle - wider drag area with visible line */}
            <div
                className="absolute top-0 right-0 w-3 h-full z-50 flex items-center justify-center"
                style={{ cursor: "ew-resize" }}
                onMouseDown={() => setIsResizing(true)}
                title="拖拽调整侧边栏宽度"
            >
                {/* Visible indicator line */}
                <div className="w-[2px] h-full bg-slate-400 hover:bg-blue-500 transition-colors"></div>
            </div>

            {/* Header */}
            <div className="px-4 py-6">
                <div
                    className="flex items-center gap-3 mb-8 cursor-pointer flex-wrap"
                    onClick={() => setActiveView("home")}
                >
                    <div
                        className="bg-black text-white rounded-lg p-[14px] cursor-pointer hover:opacity-90 transition-all flex-shrink-0"
                        onClick={(e) => {
                            e.stopPropagation();
                            setActiveView("landing");
                        }}
                    >
                        <Settings
                            size={30}
                            className="animate-[spin_10s_linear_infinite]"
                        />
                    </div>
                    <div className="min-w-0 flex-shrink">
                        <h1
                            className="font-bold leading-tight tracking-tight text-[32px] whitespace-nowrap overflow-hidden text-ellipsis"
                            style={{ fontFamily: "Courier New, monospace" }}
                        >
                            MechHub
                        </h1>
                    </div>
                </div>

                <button
                    onClick={onNewQuest}
                    className="w-full flex items-center justify-center gap-2 bg-black hover:bg-slate-800 text-white rounded-full font-bold text-sm transition-all shadow-lg shadow-slate-200 text-[18px] px-[16px] py-[3px]"
                >
                    <Plus size={18} strokeWidth={3} />
                    <span className="text-[19px]">新对话</span>
                </button>
            </div>

            {/* Recent Missions */}
            <div className="flex-1 overflow-y-auto px-6 py-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                    最近对话
                </h3>
                <div className="space-y-1">
                    {sessions.length === 0 ? (
                        <div className="text-sm text-slate-400 text-center py-4">
                            暂无历史记录
                        </div>
                    ) : (
                        sessions.map((session) => (
                            <MissionItem
                                key={session.id}
                                label={session.title}
                                icon={MessageSquare}
                                active={
                                    currentSessionId === session.id &&
                                    activeView === "chat"
                                }
                                onClick={() => {
                                    setActiveView("chat");
                                    onSelectSession?.(session.id);
                                }}
                                onDelete={(e) => {
                                    e.stopPropagation();
                                    onDeleteSession?.(session.id);
                                }}
                                onRename={
                                    onRenameSession
                                        ? (newTitle) =>
                                              onRenameSession(
                                                  session.id,
                                                  newTitle,
                                              )
                                        : undefined
                                }
                                isGeneratingTitle={session.isGeneratingTitle}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* Daily Goal Widget */}

            {/* User Footer */}
            <div className="p-4 border-t border-slate-100 m-2">
                <button
                    onClick={() => setActiveView("profile")}
                    className="flex items-center gap-3 w-full p-2 hover:bg-slate-50 rounded-xl transition-colors text-left text-[20px]"
                >
                    <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
                        <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm text-slate-800 truncate">
                            {user.name}
                        </div>
                        <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wide truncate">
                            {user.role}
                        </div>
                    </div>
                    <Settings size={16} className="text-slate-300" />
                </button>
            </div>
        </div>
    );
};
