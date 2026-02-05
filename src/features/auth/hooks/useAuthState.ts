import { useState } from "react";
import { useSession } from "../queries/useSession";
import { useUserProfile } from "../queries/useUserProfile";
import { DEFAULT_USER } from "../constants";

export const useAuthState = () => {
    const [showAuth, setShowAuth] = useState(false);
    const { data: session, isLoading } = useSession();
    const { data: userProfile } = useUserProfile(session ?? null);

    return {
        session,
        loading: isLoading,
        showAuth,
        setShowAuth,
        userProfile: userProfile ?? DEFAULT_USER,
    };
};
