import { AuthPage } from "../../features/auth";
import { LandingPage } from "../../features/landing";

interface AuthGateProps {
    showAuth: boolean;
    setShowAuth: (show: boolean) => void;
}

export const AuthGate = ({ showAuth, setShowAuth }: AuthGateProps) => {
    if (showAuth) {
        return <AuthPage onLoginSuccess={() => {}} />;
    }

    return (
        <LandingPage
            onStart={() => setShowAuth(true)}
            onLogin={() => setShowAuth(true)}
        />
    );
};
