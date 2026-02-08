import type { UserProfile as HookUserProfile } from "../../hooks";
import type { UserProfile as ViewUserProfile } from "../../views/shared/types";

export const mapUserProfile = (
    profile: HookUserProfile,
): ViewUserProfile => ({
    name: profile.name,
    avatar: profile.avatar,
    role: profile.role,
});
