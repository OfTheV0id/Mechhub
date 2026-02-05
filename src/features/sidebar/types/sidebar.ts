import { ChatSession } from "../../../types/session";
import { UserProfile } from "../../../types/user";
import { ActiveView } from "../../../types/view";
import { DeleteChatResult } from "../../chat";

export interface SidebarHandlers {
    handleSelectSession?: (id: string) => boolean;
    handleStartNewQuest?: () => void;
    deleteChatSession?: (id: string) => Promise<DeleteChatResult>;
    onRenameSession?: (id: string, newTitle: string) => Promise<boolean>;
    handleSignOut?: () => void;
}

export interface SidebarProps extends SidebarHandlers {
    activeView: ActiveView;
    setActiveView: (view: ActiveView) => void;
    user?: UserProfile;
    sessions?: ChatSession[];
    currentSessionId?: string | null;
    isLoading?: boolean;
}
