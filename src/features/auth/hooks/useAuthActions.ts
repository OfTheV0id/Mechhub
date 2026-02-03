import { AuthService } from "../../../services/AuthService";
import { useUpdateProfile } from "../queries/useUpdateProfile";

export const useAuthActions = () => {
    const updateProfileMutation = useUpdateProfile();

    const handleUpdateProfile = (
        name: string,
        role: string,
        avatar: string,
    ) => {
        updateProfileMutation.mutate({ name, role, avatar });
    };

    const handleSignOut = async () => {
        await AuthService.signOut();
    };

    return {
        handleUpdateProfile,
        handleSignOut,
        isUpdating: updateProfileMutation.isPending,
    };
};
