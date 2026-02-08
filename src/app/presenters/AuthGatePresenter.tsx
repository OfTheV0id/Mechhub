import React from "react";
import { AuthGateView } from "../../views/layout/AuthGateView";
import { AuthPagePresenter } from "./AuthPagePresenter";
import { LandingPagePresenter } from "./LandingPagePresenter";

interface AuthGatePresenterProps {
    showAuth: boolean;
    setShowAuth: (show: boolean) => void;
}

export const AuthGatePresenter = ({
    showAuth,
    setShowAuth,
}: AuthGatePresenterProps) => {
    return (
        <AuthGateView
            showAuth={showAuth}
            authView={<AuthPagePresenter onLoginSuccess={() => {}} />}
            landingView={
                <LandingPagePresenter
                    onStart={() => setShowAuth(true)}
                    onLogin={() => setShowAuth(true)}
                />
            }
        />
    );
};
