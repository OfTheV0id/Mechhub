import { useProfileState } from "@hooks";
import { ProfileView } from "@views/profile/ProfileView";
import type { UserProfile } from "@hooks";

interface ProfilePresenterProps {
    user: UserProfile;
    onUpdateProfile: (name: string, role: string, avatar: string) => void;
}

export const ProfilePresenter = ({
    user,
    onUpdateProfile,
}: ProfilePresenterProps) => {
    const profileState = useProfileState(user, onUpdateProfile);

    return <ProfileView {...profileState} />;
};
