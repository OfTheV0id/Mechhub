import React from "react";
import { Plus, Settings, MessageSquare, LogOut } from "lucide-react";
import { MissionItem } from "./components/MissionItem";
import { useSidebarResize } from "./hooks/useSidebarResize";
import { useSidebarActions } from "./hooks/useSidebarActions";
import { SidebarProps } from "./types/sidebar";
import { MechHubLogo } from "../../components";

export const Sidebar: React.FC<SidebarProps> = ({
    activeView,
    setActiveView,
    user = {
        name: "张同学",
        avatar: "https://images.unsplash.com/photo-1644904105846-095e45fca990?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwc3R1ZGVudCUyMGF2YXRhcnxlbnwxfHx8fDE3Njg3OTU3NDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        role: "Lv.12 学徒",
    },
    sessions = [],
    currentSessionId,
    handleSelectSession,
    handleStartNewQuest,
    deleteChatSession,
    onRenameSession,
    handleSignOut,
    isLoading = false,
}) => {
    const { sidebarWidth, handleMouseDown } = useSidebarResize();
    const { onNewQuest, onSelectSession, handleDeleteSession } =
        useSidebarActions({
            setActiveView,
            handleSelectSession,
            handleStartNewQuest,
            deleteChatSession,
        });

    return (
        <div
            className="relative flex shrink-0 flex-col border-r border-slate-200 bg-white"
            style={{ width: `${sidebarWidth}px` }}
        >
            {/* Resize Handle */}
            <div
                className="absolute top-0 right-0 w-3 h-full z-50 flex items-center justify-center"
                style={{ cursor: "ew-resize" }}
                onMouseDown={handleMouseDown}
                title="拖拽调整侧边栏宽度"
            >
                <div className="h-full w-[2px] bg-slate-400 transition-colors hover:bg-blue-500"></div>
            </div>

            {/* Header */}
            <div className="px-4 py-6 flex flex-col items-center">
                <MechHubLogo
                    className="mb-8 cursor-pointer flex-wrap"
                    onClick={() => setActiveView("home")}
                    onIconClick={(e) => {
                        e.stopPropagation();
                        setActiveView("landing");
                    }}
                />

                <button
                    onClick={onNewQuest}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-black px-[16px] py-[3px] text-[18px] font-bold text-white shadow-lg shadow-slate-200 transition-all hover:bg-slate-800"
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
                    {isLoading ? (
                        <div className="animate-pulse space-y-3">
                            <div className="h-10 bg-slate-100 rounded-lg w-full"></div>
                            <div className="h-10 bg-slate-100 rounded-lg w-full"></div>
                            <div className="h-10 bg-slate-100 rounded-lg w-full"></div>
                        </div>
                    ) : sessions.length === 0 ? (
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
                                    handleDeleteSession(session.id);
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

            {/* User Footer */}
            <div className="p-4 border-t border-slate-100 m-2">
                <button
                    onClick={() => setActiveView("profile")}
                    className="flex w-full items-center gap-3 rounded-xl p-2 text-left text-[20px] transition-colors hover:bg-slate-50"
                >
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-white bg-slate-200 shadow-sm">
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

                {/* Sign Out Button */}
                {handleSignOut && (
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-red-500 transition-colors w-full px-4 py-2 mt-2 rounded-lg hover:bg-slate-50"
                    >
                        <LogOut size={14} />
                        退出登录
                    </button>
                )}
            </div>
        </div>
    );
};
