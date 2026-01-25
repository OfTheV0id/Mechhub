import { useState } from "react";
import { toast } from "sonner";
import { AuthService } from "../../../services/AuthService";

export const useAuthPage = (onLoginSuccess: () => void) => {
    const [mode, setMode] = useState<"signin" | "register">("signin");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (mode === "signin") {
                await AuthService.signIn(email, password);
                toast.success("欢迎回来！");
                onLoginSuccess();
            } else if (mode == "register") {
                await AuthService.signUp(email, password);
                toast.success("账户创建成功！正在登录...");

                // Auto login after signup
                await AuthService.signIn(email, password);
                onLoginSuccess();
            }
        } catch (error: any) {
            toast.error(error.message || "认证失败");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialLogin = async (provider: "google" | "github") => {
        try {
            await AuthService.socialLogin(provider);
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    return {
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
    };
};
