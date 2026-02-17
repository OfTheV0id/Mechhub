import { useAvatarUploadMutation, useProfileState } from "@hooks";
import { ProfileView } from "@views/profile/ProfileView";
import type { UserProfile } from "@hooks";

interface ProfilePresenterProps {
    user: UserProfile;
    onUpdateProfile: (name: string, avatar: string) => void;
}

export const ProfilePresenter = ({
    user,
    onUpdateProfile,
}: ProfilePresenterProps) => {
    const avatarUploadMutation = useAvatarUploadMutation();
    const profileState = useProfileState(user, onUpdateProfile, async (file) => {
        const result = await avatarUploadMutation.mutateAsync(file);
        return result.publicUrl;
    });

    return <ProfileView {...profileState} />;
};
