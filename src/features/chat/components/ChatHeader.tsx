import React from "react";
import { Shield } from "lucide-react";

export const ChatHeader: React.FC = () => {
    return (
        <div className="h-16 flex items-center justify-between px-6 md:px-8 border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-20">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    MechHub AI 在线
                </span>
            </div>
            <div className="flex items-center gap-4">
                <div className="text-right hidden md:block">
                    <div className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                        已获经验
                    </div>
                    <div className="text-sm font-medium text-slate-500">
                        1,250 XP
                    </div>
                </div>
                <button className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-600 transition-colors">
                    <Shield size={16} />
                </button>
            </div>
        </div>
    );
};
