import { useAuthActions } from "./useAuthActions";
import { useAuthState } from "./useAuthState";

export const useAuth = () => {
    const authState = useAuthState();
    const authActions = useAuthActions();

    return {
        ...authState,
        ...authActions,
    };
};
