import React, { useState, useEffect } from "react";
import { Sidebar, ChatSession } from "./components/Sidebar";
import { ChatInterface, Message } from "./components/ChatInterface";
import { AssignmentModal } from "./components/AssignmentModal";
import { HomeView } from "./components/HomeView";
import { ProfileView } from "./components/ProfileView";
import { AuthPage } from "./components/AuthPage";
import { LandingPage } from "./components/LandingPage";
import { Toaster, toast } from "sonner";
import { createClient } from "@supabase/supabase-js";
import { projectId, publicAnonKey } from "./utils/supabase/info";
import { LogOut } from "lucide-react";

const supabase = createClient(
    `https://${projectId}.supabase.co`,
    publicAnonKey,
);

// Mock data for initial messages or empty state
const INITIAL_MESSAGES: Message[] = [];

// Default User Data
const DEFAULT_USER = {
    name: "张同学",
    avatar: "https://images.unsplash.com/photo-1644904105846-095e45fca990?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwc3R1ZGVudCUyMGF2YXRhcnxlbnwxfHx8fDE3Njg3OTU3NDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    role: "机械工程专业学生",
};

export default function App() {
    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showAuth, setShowAuth] = useState(false);
    const [activeView, setActiveView] = useState("home"); // 'home', 'chat', 'profile'
    const [chatMode, setChatMode] = useState<"study" | "boss">("study");
    const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
    const [isTyping, setIsTyping] = useState(false);
    const [isSubmissionOpen, setIsSubmissionOpen] = useState(false);

    // Chat Persistence State
    const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(
        null,
    );

    // User Profile State
    const [userProfile, setUserProfile] = useState(DEFAULT_USER);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session?.user?.user_metadata) {
                const { name, avatar_url, role } = session.user.user_metadata;
                setUserProfile({
                    name: name || DEFAULT_USER.name,
                    avatar: avatar_url || DEFAULT_USER.avatar,
                    role: role || DEFAULT_USER.role,
                });
                // Fetch chats when session is active
                fetchChatSessions();
            }
            setLoading(false);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session?.user?.user_metadata) {
                const { name, avatar_url, role } = session.user.user_metadata;
                setUserProfile({
                    name: name || DEFAULT_USER.name,
                    avatar: avatar_url || DEFAULT_USER.avatar,
                    role: role || DEFAULT_USER.role,
                });
                // Fetch chats on auth change
                fetchChatSessions();
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchChatSessions = async () => {
        try {
            const {
                data: { session },
            } = await supabase.auth.getSession();
            if (!session) return;

            const response = await fetch(
                `https://${projectId}.supabase.co/functions/v1/make-server-5abdc916/chats`,
                {
                    headers: {
                        Authorization: `Bearer ${session.access_token}`,
                    },
                },
            );

            if (response.ok) {
                const data = await response.json();
                setChatSessions(data.chats || []);
            }
        } catch (error) {
            console.error("Failed to fetch chats", error);
        }
    };

    const saveChatSession = async (
        id: string | null,
        msgs: Message[],
        title?: string,
    ) => {
        try {
            const {
                data: { session },
            } = await supabase.auth.getSession();
            if (!session) return;

            const generatedTitle =
                title ||
                (msgs.length > 0 ? msgs[0].content.slice(0, 20) : "新对话");

            const response = await fetch(
                `https://${projectId}.supabase.co/functions/v1/make-server-5abdc916/chats`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session.access_token}`,
                    },
                    body: JSON.stringify({
                        id: id,
                        title: generatedTitle,
                        messages: msgs,
                    }),
                },
            );

            if (response.ok) {
                const savedChat = await response.json();

                // Manually update local state for immediate feedback
                setChatSessions((prev) => {
                    const filtered = prev.filter((c) => c.id !== savedChat.id);
                    return [savedChat, ...filtered].sort(
                        (a, b) => (b.updatedAt || 0) - (a.updatedAt || 0),
                    );
                });

                // If it was a new chat, update the current ID
                if (!id) {
                    setCurrentSessionId(savedChat.id);
                }
                // Refresh list from server to ensure synchronization
                fetchChatSessions();
                return savedChat.id;
            }
        } catch (error) {
            console.error("Failed to save chat", error);
        }
        return id;
    };

    const deleteChatSession = async (id: string) => {
        try {
            const {
                data: { session },
            } = await supabase.auth.getSession();
            if (!session) return;

            const response = await fetch(
                `https://${projectId}.supabase.co/functions/v1/make-server-5abdc916/chats/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${session.access_token}`,
                    },
                },
            );

            if (response.ok) {
                setChatSessions((prev) => prev.filter((c) => c.id !== id));
                if (currentSessionId === id) {
                    handleStartNewQuest();
                }
                toast.success("对话已删除");
            }
        } catch (error) {
            console.error("Failed to delete chat", error);
            toast.error("删除失败");
        }
    };

    const handleSelectSession = (id: string) => {
        const session = chatSessions.find((c) => c.id === id);
        if (session) {
            setCurrentSessionId(id);
            setMessages(session.messages || []);
            setActiveView("chat");
        }
    };

    const handleUpdateProfile = async (
        name: string,
        role: string,
        avatar: string,
    ) => {
        // Optimistic update
        setUserProfile({ name, role, avatar });

        const { error } = await supabase.auth.updateUser({
            data: { name, role, avatar_url: avatar },
        });

        if (error) {
            toast.error("更新个人信息失败");
            // Revert? For now we'll just leave the optimistic update or would need previous state
        } else {
            toast.success("个人信息已更新");
        }
    };

    // Mock function to handle sending messages
    const handleSendMessage = async (text: string, image?: File) => {
        // If not in chat view, switch to chat
        if (activeView !== "chat") {
            setActiveView("chat");
        }

        // Add user message
        const newMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            type: "text",
            content: text,
        };

        // Update local state immediately
        const updatedMessages = [...messages, newMessage];
        setMessages(updatedMessages);
        setIsTyping(true);

        // Save user message immediately to backend
        const activeId = await saveChatSession(
            currentSessionId,
            updatedMessages,
        );

        // If we just created a new session, update our state ID
        if (!currentSessionId && activeId) {
            setCurrentSessionId(activeId);
        }

        // Simulate AI delay and response
        setTimeout(() => {
            setIsTyping(false);

            let aiResponse: Message;

            if (image || chatMode === "boss") {
                // Mock Grading Response (Boss Battle)
                aiResponse = {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    type: "grading",
                    content: "批改完成。请查看下方的详细分析。",
                    imageUrl:
                        "https://images.unsplash.com/photo-1727522974735-44251dfe61b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaHlzaWNzJTIwZGlhZ3JhbSUyMG1lY2hhbmljcyUyMHNrZXRjaGVzfGVufDF8fHx8MTc2ODc5NTc0OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                    score: 85,
                    annotations: [
                        {
                            id: "a1",
                            x: 35,
                            y: 30,
                            width: 25,
                            height: 15,
                            comment: "初速度的推导是正确的。",
                            type: "correct",
                        },
                        {
                            id: "a2",
                            x: 50,
                            y: 60,
                            width: 30,
                            height: 20,
                            comment:
                                "最后的计算有一个算术错误，请重新检查你的乘法。",
                            type: "incorrect",
                        },
                        {
                            id: "a3",
                            x: 10,
                            y: 70,
                            width: 30,
                            height: 25,
                            comment: "你在受力图中遗漏了摩擦力矢量。",
                            type: "info",
                        },
                    ],
                };
            } else {
                // Mock Text Response
                aiResponse = {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    type: "text",
                    content:
                        "单摆运动是简谐运动的一个经典例子。对于小角度摆动，周期 T 大约等于 2π√(L/g)，其中 L 是摆长，g 是重力加速度。你想和我一起推导这个公式吗？",
                };
            }

            const finalMessages = [...updatedMessages, aiResponse];
            setMessages(finalMessages);

            // Save AI response to backend
            // activeId is captured from the outer scope
            saveChatSession(activeId || currentSessionId, finalMessages);
        }, 1500);
    };

    const handleStartNewQuest = () => {
        setMessages([]);
        setCurrentSessionId(null);
        setActiveView("home");
        setChatMode("study");
    };

    const handleSubmitAssignment = (assignmentId: string) => {
        toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
            loading: "正在提交任务...",
            success: "任务提交成功！",
            error: "提交失败",
        });
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        setSession(null);
    };

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-[#F8FAFC]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
            </div>
        );
    }

    if (!session) {
        if (showAuth) {
            return (
                <>
                    <Toaster position="top-center" richColors />
                    <AuthPage onLoginSuccess={() => {}} />
                </>
            );
        }

        return (
            <>
                <Toaster position="top-center" richColors />
                <LandingPage
                    onStart={() => setShowAuth(true)}
                    onLogin={() => setShowAuth(true)}
                />
            </>
        );
    }

    if (activeView === "landing") {
        return (
            <>
                <Toaster position="top-center" richColors />
                <LandingPage
                    onStart={() => setActiveView("home")}
                    onLogin={() => setActiveView("home")}
                />
            </>
        );
    }

    return (
        <div className="flex h-screen bg-white text-slate-800 font-sans overflow-hidden">
            <Toaster position="top-center" richColors />

            <div className="flex flex-col h-full">
                <Sidebar
                    activeView={activeView}
                    setActiveView={setActiveView}
                    onNewQuest={handleStartNewQuest}
                    userName={userProfile.name}
                    userAvatar={userProfile.avatar}
                    userRole={userProfile.role}
                    sessions={chatSessions}
                    currentSessionId={currentSessionId}
                    onSelectSession={handleSelectSession}
                    onDeleteSession={deleteChatSession}
                />
                <div className="mt-auto p-4 border-r border-slate-100 bg-white">
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-red-500 transition-colors w-full px-4 py-2 rounded-lg hover:bg-slate-50"
                    >
                        <LogOut size={14} />
                        退出登录
                    </button>
                </div>
            </div>

            <main className="flex-1 flex flex-col h-full relative overflow-hidden">
                {activeView === "home" && (
                    <HomeView
                        onStartChat={(msg) =>
                            handleSendMessage(msg || "我们开始吧！")
                        }
                        mode={chatMode}
                        setMode={setChatMode}
                        userName={userProfile.name}
                    />
                )}

                {activeView === "chat" && (
                    <ChatInterface
                        messages={messages}
                        onSendMessage={handleSendMessage}
                        isTyping={isTyping}
                        onOpenSubmission={() => setIsSubmissionOpen(true)}
                        mode={chatMode}
                        setMode={setChatMode}
                    />
                )}

                {activeView === "profile" && (
                    <ProfileView
                        user={userProfile}
                        onUpdateProfile={handleUpdateProfile}
                    />
                )}
            </main>

            <AssignmentModal
                isOpen={isSubmissionOpen}
                onClose={() => setIsSubmissionOpen(false)}
                onSubmit={handleSubmitAssignment}
            />
        </div>
    );
}
