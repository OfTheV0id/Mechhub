import React, { useState, useRef, useEffect } from "react";
import {
    Trash2,
    LucideIcon,
    Edit2,
    Check,
    X,
    MoreVertical,
} from "lucide-react";
import { toast } from "sonner";

interface MissionItemProps {
    label: string;
    icon: LucideIcon;
    active: boolean;
    onClick: () => void;
    onDelete?: (e: React.MouseEvent) => void;
    onRename?: (newTitle: string) => Promise<boolean>;
    isGeneratingTitle?: boolean;
}

export const MissionItem: React.FC<MissionItemProps> = ({
    label,
    icon: Icon,
    active,
    onClick,
    onDelete,
    onRename,
    isGeneratingTitle = false,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(label);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            return () =>
                document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [isMenuOpen]);

    const handleSaveRename = async () => {
        if (!onRename || editTitle.trim() === "" || editTitle === label) {
            setIsEditing(false);
            setEditTitle(label);
            return;
        }

        const success = await onRename(editTitle.trim());
        if (success) {
            setIsEditing(false);
            toast.success("重命名成功");
        } else {
            setEditTitle(label);
            setIsEditing(false);
            toast.error("重命名失败，请重试");
        }
    };

    const handleCancelRename = () => {
        setIsEditing(false);
        setEditTitle(label);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSaveRename();
        } else if (e.key === "Escape") {
            handleCancelRename();
        }
    };

    return (
        <div
            onClick={onClick}
            className={`w-full group flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors relative cursor-pointer ${
                active
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
            }`}
        >
            {isEditing ? (
                <div
                    className="flex-1 flex items-center gap-1.5 pr-1 overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    <input
                        ref={inputRef}
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onBlur={handleSaveRename}
                        className="flex-1 px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:border-blue-500 min-w-0"
                    />
                    <div className="flex shrink-0 items-center gap-0.5">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleSaveRename();
                            }}
                            className="p-1 hover:bg-green-100 rounded transition-all text-slate-500 hover:text-green-600"
                            title="保存 (Enter)"
                        >
                            <Check size={14} />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleCancelRename();
                            }}
                            className="p-1 hover:bg-red-100 rounded transition-all text-slate-500 hover:text-red-600"
                            title="取消 (Esc)"
                        >
                            <X size={14} />
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    {isGeneratingTitle ? (
                        <div className="flex-1 flex items-center gap-2">
                            <div className="h-3 bg-slate-200 rounded animate-pulse flex-1 max-w-[120px]"></div>
                            <div className="text-[10px] text-slate-400 animate-pulse">
                                生成中...
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Title - takes most space */}
                            <span className="block truncate flex-1 text-left">
                                {label}
                            </span>

                            {/* Three-dot menu button */}
                            <div
                                className="relative shrink-0"
                                ref={menuRef}
                            >
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsMenuOpen(!isMenuOpen);
                                    }}
                                    className="rounded-md p-1.5 text-slate-400 opacity-0 transition-all group-hover:opacity-100 hover:bg-slate-200 hover:text-slate-700"
                                    title="更多操作"
                                >
                                    <MoreVertical size={16} />
                                </button>

                                {/* Dropdown menu */}
                                {isMenuOpen && (
                                    <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-xl border border-slate-100 py-1.5 w-32 z-50 overflow-hidden">
                                        {onRename && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setIsMenuOpen(false);
                                                    setIsEditing(true);
                                                }}
                                                className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 transition-colors whitespace-nowrap leading-none"
                                            >
                                                <Edit2
                                                    size={15}
                                                    className="text-blue-500 stroke-[1.5]"
                                                />
                                                <span className="font-medium">
                                                    重命名
                                                </span>
                                            </button>
                                        )}
                                        {onDelete && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setIsMenuOpen(false);
                                                    onDelete(e);
                                                }}
                                                className="w-full px-3 py-2 text-left text-sm hover:bg-red-50 flex items-center gap-2.5 text-slate-700 hover:text-red-600 transition-colors whitespace-nowrap leading-none"
                                            >
                                                <Trash2
                                                    size={15}
                                                    className="text-red-500 stroke-[1.5]"
                                                />
                                                <span className="font-medium">
                                                    删除
                                                </span>
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
};
