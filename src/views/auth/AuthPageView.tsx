import { Card } from "../shared/ui/card";
import { MechHubLogo } from "../shared/MechHubLogo";
import { AuthForm } from "./parts/AuthForm";
import { AuthHero } from "./parts/AuthHero";
import { AuthVerification } from "./parts/AuthVerification";
import type { AuthMode } from "./types";

interface AuthPageViewProps {
    mode: AuthMode;
    setMode: (mode: AuthMode) => void;
    email: string;
    setEmail: (email: string) => void;
    password: string;
    setPassword: (password: string) => void;
    isLoading: boolean;
    showPassword: boolean;
    setShowPassword: (show: boolean) => void;
    handleSubmit: (e: React.FormEvent) => void;
    handleSocialLogin: (provider: "google" | "github") => void;
    isVerificationPending: boolean;
    setIsVerificationPending: (pending: boolean) => void;
}

export const AuthPageView = ({
    mode,
    setMode,
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    showPassword,
    setShowPassword,
    handleSubmit,
    handleSocialLogin,
    isVerificationPending,
    setIsVerificationPending,
}: AuthPageViewProps) => {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#f8fafc] p-4">
            <Card
                radius="3xl"
                shadow="xl"
                className="w-full max-w-6xl h-[37.5rem] flex overflow-hidden"
            >
                <AuthHero />

                <div className="flex-1 flex flex-col items-center p-12 relative">
                    <div className="w-full max-w-sm">
                        {isVerificationPending ? (
                            <AuthVerification
                                email={email}
                                onBackToSignIn={() => setMode("signin")}
                                onResend={() => setIsVerificationPending(false)}
                            />
                        ) : (
                            <>
                                <MechHubLogo className="mb-6 justify-center" />
                                <AuthForm
                                    mode={mode}
                                    setMode={setMode}
                                    email={email}
                                    setEmail={setEmail}
                                    password={password}
                                    setPassword={setPassword}
                                    isLoading={isLoading}
                                    showPassword={showPassword}
                                    setShowPassword={setShowPassword}
                                    onSubmit={handleSubmit}
                                    onSocialLogin={handleSocialLogin}
                                />
                            </>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
};
