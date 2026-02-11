import { useAuthPageState } from "@hooks";
import { AuthPageView } from "@views/auth/AuthPageView";

interface AuthPagePresenterProps {
    onLoginSuccess: () => void;
}

export const AuthPagePresenter = ({
    onLoginSuccess,
}: AuthPagePresenterProps) => {
    const authState = useAuthPageState(onLoginSuccess);

    return <AuthPageView {...authState} />;
};
