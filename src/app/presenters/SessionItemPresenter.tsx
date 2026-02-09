import React from "react";
import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { SessionItem } from "../../views/sidebar/parts/SessionItem";

interface SessionItemPresenterProps {
    label: string;
    icon: LucideIcon;
    active: boolean;
    onClick: () => void;
    onDelete?: () => void;
    onRename?: (newTitle: string) => Promise<boolean>;
    isGeneratingTitle?: boolean;
}

export const SessionItemPresenter = ({
    label,
    icon,
    active,
    onClick,
    onDelete,
    onRename,
    isGeneratingTitle = false,
}: SessionItemPresenterProps) => {
    const [isEditing, setIsEditing] = React.useState(false);
    const [editTitle, setEditTitle] = React.useState(label);
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const menuRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    React.useEffect(() => {
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
        }
    };

    const handleCancelRename = () => {
        setIsEditing(false);
        setEditTitle(label);
    };

    const handleStartEdit = () => {
        if (!onRename) return;
        setIsMenuOpen(false);
        setIsEditing(true);
    };

    const handleToggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };

    const handleDelete = () => {
        setIsMenuOpen(false);
        onDelete?.();
    };

    return (
        <SessionItem
            label={label}
            icon={icon}
            active={active}
            onClick={onClick}
            isGeneratingTitle={isGeneratingTitle}
            isEditing={isEditing}
            editTitle={editTitle}
            isMenuOpen={isMenuOpen}
            inputRef={inputRef}
            menuRef={menuRef}
            onStartEdit={onRename ? handleStartEdit : undefined}
            onChangeTitle={setEditTitle}
            onSave={handleSaveRename}
            onCancel={handleCancelRename}
            onToggleMenu={handleToggleMenu}
            onDelete={onDelete ? handleDelete : undefined}
        />
    );
};
