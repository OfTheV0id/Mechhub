import React from "react";
import {
  Plus,
  Rocket,
  Target,
  Clock,
  Settings,
  User,
  MessageSquare,
  Trash2,
} from "lucide-react";

interface ChatSession {
  id: string;
  title: string;
  updatedAt: number;
}

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  onNewQuest: () => void;
  userName?: string;
  userAvatar?: string;
  userRole?: string;
  sessions?: ChatSession[];
  currentSessionId?: string | null;
  onSelectSession?: (id: string) => void;
  onDeleteSession?: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  onNewQuest,
  userName = "张同学",
  userAvatar = "https://images.unsplash.com/photo-1644904105846-095e45fca990?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwc3R1ZGVudCUyMGF2YXRhcnxlbnwxfHx8fDE3Njg3OTU3NDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  userRole = "Lv.12 学徒",
  sessions = [],
  currentSessionId,
  onSelectSession,
  onDeleteSession
}) => {
  return (
    <div className="w-[280px] flex-1 flex flex-col bg-white border-r border-slate-100 flex-shrink-0">
      {/* Header */}
      <div className="px-6 py-6">
        <div
          className="flex items-center gap-3 mb-8 cursor-pointer"
          onClick={() => setActiveView("home")}
        >
          <div 
            className="bg-black text-white rounded-lg p-[14px] cursor-pointer hover:opacity-90 transition-all"
            onClick={(e) => {
              e.stopPropagation();
              setActiveView('landing');
            }}
          >
            <Settings
              size={30}
              className="animate-[spin_10s_linear_infinite]"
            />
          </div>
          <div>
            <h1 className="font-bold leading-tight tracking-tight font-['Abhaya_Libre'] font-medium text-[40px]">
              MechHub
            </h1>
            <p className="text-[13px] font-bold text-slate-400 tracking-widest uppercase">
              学生版
            </p>
          </div>
        </div>

        <button
          onClick={onNewQuest}
          className="w-full flex items-center justify-center gap-2 bg-black hover:bg-slate-800 text-white py-[6px] px-[16px] rounded-full font-bold text-sm transition-all shadow-lg shadow-slate-200 text-[18px]"
        >
          <Plus size={18} strokeWidth={3} />
          <span className="text-[22px]">新对话</span>
        </button>
      </div>

      {/* Recent Missions */}
      <div className="flex-1 overflow-y-auto px-6 py-2">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
          最近对话
        </h3>
        <div className="space-y-1">
          {sessions.length === 0 ? (
            <div className="text-sm text-slate-400 text-center py-4">暂无历史记录</div>
          ) : (
            sessions.map((session) => (
              <MissionItem
                key={session.id}
                label={session.title}
                icon={MessageSquare}
                active={currentSessionId === session.id && activeView === 'chat'}
                onClick={() => {
                  setActiveView('chat');
                  onSelectSession?.(session.id);
                }}
                onDelete={(e) => {
                  e.stopPropagation();
                  onDeleteSession?.(session.id);
                }}
              />
            ))
          )}
        </div>
      </div>

      {/* Daily Goal Widget */}
      <div className="px-6 py-6">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Target size={14} /> 今日目标
        </h3>
        <div className="bg-slate-50 p-4 rounded-[50px] border border-slate-100">
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm font-semibold text-slate-700">
              今日经验
            </span>
            <span className="text-xs font-bold text-slate-400">
              2/3
            </span>
          </div>
          <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-slate-800 w-2/3 rounded-full" />
          </div>
          <p className="text-[10px] text-slate-400 mt-2">
            今日已完成 2/3 个测验！
          </p>
        </div>
      </div>

      {/* User Footer */}
      <div className="p-4 border-t border-slate-100 m-2">
        <button
          onClick={() => setActiveView("profile")}
          className="flex items-center gap-3 w-full p-2 hover:bg-slate-50 rounded-xl transition-colors text-left text-[20px]"
        >
          <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
            <img
              src={userAvatar}
              alt={userName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-sm text-slate-800 truncate">
              {userName}
            </div>
            <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wide truncate">
              {userRole}
            </div>
          </div>
          <Settings size={16} className="text-slate-300" />
        </button>
      </div>
    </div>
  );
};

const MissionItem = ({
  label,
  icon: Icon,
  active,
  onClick,
  onDelete,
}: {
  label: string;
  icon: any;
  active: boolean;
  onClick: () => void;
  onDelete?: (e: React.MouseEvent) => void;
}) => (
  <button
    onClick={onClick}
    className={`w-full group flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors relative ${
      active
        ? "bg-slate-100 text-slate-900"
        : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
    }`}
  >
    <Icon size={16} />
    <span className="truncate flex-1 text-left">{label}</span>
    {onDelete && (
      <div 
        onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-200 rounded-md transition-all text-slate-400 hover:text-red-500"
      >
        <Trash2 size={14} />
      </div>
    )}
  </button>
);
