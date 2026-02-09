import type { LucideIcon } from "lucide-react";
import { useSessionItemUiState } from "@hooks";
import { SessionItem } from "@views/sidebar/parts/SessionItem";

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
    const {
        isEditing,
        editTitle,
        isMenuOpen,
        inputRef,
        menuRef,
        handleSaveRename,
        handleCancelRename,
        handleStartEdit,
        handleToggleMenu,
        handleDelete,
        setEditTitle,
        canRename,
    } = useSessionItemUiState({
        label,
        onRename,
        onDelete,
    });

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
            onStartEdit={canRename ? handleStartEdit : undefined}
            onChangeTitle={setEditTitle}
            onSave={handleSaveRename}
            onCancel={handleCancelRename}
            onToggleMenu={handleToggleMenu}
            onDelete={onDelete ? handleDelete : undefined}
        />
    );
};
