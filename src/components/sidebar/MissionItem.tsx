import React from "react";
import { Trash2, LucideIcon } from "lucide-react";

interface MissionItemProps {
    label: string;
    icon: LucideIcon;
    active: boolean;
    onClick: () => void;
    onDelete?: (e: React.MouseEvent) => void;
}

export const MissionItem: React.FC<MissionItemProps> = ({
    label,
    icon: Icon,
    active,
    onClick,
    onDelete,
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
