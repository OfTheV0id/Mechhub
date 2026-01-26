import React from "react";
import { motion } from "motion/react";
import {
    Mail,
    Lock,
    GraduationCap,
    Chrome,
    Loader2,
    ArrowRight,
    Eye,
    EyeOff,
} from "lucide-react";
import { useAuthPage } from "./hooks/useAuthPage";

interface AuthPageProps {
    onLoginSuccess: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
    const {
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
    } = useAuthPage(onLoginSuccess);

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#F8FAFC] p-4">
            <div className="bg-white w-full max-w-5xl h-[600px] rounded-[3rem] shadow-2xl flex overflow-hidden border border-slate-100">
                {/* Left Side - Visual/Decor */}
                <div className="hidden md:flex flex-1 bg-slate-50 relative items-center justify-center overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1692889783742-7d99b124c402?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMG1pbmltYWwlMjB3aGl0ZSUyMGdlb21ldHJpYyUyMDNkJTIwc2hhcGVzfGVufDF8fHx8MTc2ODgxNDQxNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                        alt="Abstract"
                        className="absolute inset-0 w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/40 to-transparent" />

                    <div className="relative z-10 p-8 backdrop-blur-md bg-white/30 rounded-2xl border border-white/50 shadow-lg max-w-xs">
                        <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mb-4">
                            <GraduationCap className="text-white" />
                        </div>
                        <h3 className="font-bold text-xl text-slate-800 mb-2">
                            精通力学
                        </h3>
                        <p className="text-sm text-slate-600">
                            加入数万名通过 AI 辅助掌握理论力学的学生行列。
                        </p>
                    </div>
                </div>

                {/* Right Side - Auth Form */}
                <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-16 relative">
                    <div className="w-full max-w-sm">
                        {isVerificationPending ? (
                            <div className="flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                                    <Mail className="text-green-600 w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                                    请验证您的邮箱
                                </h3>
                                <p className="text-slate-600 mb-8">
                                    我们已向{" "}
                                    <span className="font-semibold text-slate-900">
                                        {email}
                                    </span>{" "}
                                    发送了一封验证邮件。
                                    <br />
                                    请点击邮件中的链接以激活您的账户。
                                </p>
                                <button
                                    onClick={() => setMode("signin")}
                                    className="text-sm font-bold text-black border-b-2 border-black hover:border-transparent transition-colors pb-0.5"
                                >
                                    返回登录
                                </button>
                                <button
                                    onClick={() =>
                                        setIsVerificationPending(false)
                                    }
                                    className="mt-4 text-xs text-slate-400 hover:text-slate-600"
                                >
                                    重新发送 (开发中)
                                </button>
                            </div>
                        ) : (
                            <>
                                {/* Logo */}
                                <div className="flex items-center gap-2 mb-10 justify-center">
                                    <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="text-white animate-[spin_10s_linear_infinite]"
                                        >
                                            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    </div>
                                    <span
                                        className="font-bold text-2xl text-slate-900 tracking-tight text-[32px]"
                                        style={{
                                            fontFamily:
                                                "Courier New, monospace",
                                        }}
                                    >
                                        MechHub
                                    </span>
                                </div>

                                {/* Toggle */}
                                <div className="bg-slate-100 p-1.5 rounded-full flex relative mb-8">
                                    <motion.div
                                        className="absolute top-1.5 bottom-1.5 bg-white rounded-full shadow-sm z-0"
                                        layoutId="authMode"
                                        initial={false}
                                        animate={{
                                            left:
                                                mode === "signin"
                                                    ? "6px"
                                                    : "50%",
                                            width: "calc(50% - 6px)",
                                        }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 30,
                                        }}
                                    />
                                    <button
                                        onClick={() => setMode("signin")}
                                        className={`flex-1 relative z-10 text-sm font-bold py-2.5 text-center transition-colors ${mode === "signin" ? "text-slate-900" : "text-slate-500"}`}
                                    >
                                        登录
                                    </button>
                                    <button
                                        onClick={() => setMode("register")}
                                        className={`flex-1 relative z-10 text-sm font-bold py-2.5 text-center transition-colors ${mode === "register" ? "text-slate-900" : "text-slate-500"}`}
                                    >
                                        注册
                                    </button>
                                </div>

                                {/* Form */}
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-4"
                                >
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                                            邮箱地址
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                                <Mail size={18} />
                                            </div>
                                            <input
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) =>
                                                    setEmail(e.target.value)
                                                }
                                                placeholder="student@university.edu"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-slate-700 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center mb-2 ml-1">
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                                                密码
                                            </label>
                                            {mode === "signin" && (
                                                <button
                                                    type="button"
                                                    className="text-xs font-semibold text-slate-900 hover:underline"
                                                >
                                                    忘记密码？
                                                </button>
                                            )}
                                        </div>
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                                <Lock size={18} />
                                            </div>
                                            <input
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                required
                                                value={password}
                                                onChange={(e) =>
                                                    setPassword(e.target.value)
                                                }
                                                placeholder="••••••••"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-10 text-slate-700 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword,
                                                    )
                                                }
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                            >
                                                {showPassword ? (
                                                    <Eye size={16} />
                                                ) : (
                                                    <EyeOff size={16} />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-black text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                                    >
                                        {isLoading ? (
                                            <Loader2
                                                size={20}
                                                className="animate-spin"
                                            />
                                        ) : (
                                            <>
                                                {mode === "signin"
                                                    ? "登录"
                                                    : "创建账户"}
                                                <ArrowRight size={18} />
                                            </>
                                        )}
                                    </button>
                                </form>

                                <div className="relative my-8">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-slate-200"></div>
                                    </div>
                                    <div className="relative flex justify-center text-xs">
                                        <span className="bg-white px-2 text-slate-500">
                                            或通过以下方式继续
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-4 justify-center">
                                    <button
                                        onClick={() =>
                                            handleSocialLogin("google")
                                        }
                                        className="p-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                                        title="通过 Google 继续"
                                    >
                                        <Chrome
                                            size={24}
                                            className="text-slate-700"
                                        />
                                    </button>
                                    {/* Note: Google is the most common example, keeping it simple as per design */}
                                    <button
                                        className="p-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                                        title="校园账号登录 (模拟)"
                                    >
                                        <GraduationCap
                                            size={24}
                                            className="text-slate-700"
                                        />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
