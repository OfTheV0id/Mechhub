// This usage of useAuth will be replaced in next step after creating singleton client.
// For now, I'll update useAuth to use AuthService for actions.
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { projectId, publicAnonKey } from "../../config/supabase";
import { toast } from "sonner";
import { AuthService } from "../../services/AuthService";
import { UserProfile } from "../../types/user";

const supabase = createClient(
    `https://${projectId}.supabase.co`,
    publicAnonKey,
);

const DEFAULT_USER: UserProfile = {
    name: "张同学",
    avatar: "https://images.unsplash.com/photo-1644904105846-095e45fca990?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwc3R1ZGVudCUyMGF2YXRhcnxlbnwxfHx8fDE3Njg3OTU3NDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    role: "机械工程专业学生",
};

export const useAuth = () => {
    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showAuth, setShowAuth] = useState(false);
    const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_USER);

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
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleUpdateProfile = async (
        name: string,
        role: string,
        avatar: string,
    ) => {
        setUserProfile({ name, role, avatar });
        try {
            await AuthService.updateUser({ name, role, avatar_url: avatar });
            toast.success("个人信息已更新");
        } catch (error) {
            toast.error("更新个人信息失败");
        }
    };

    const handleSignOut = async () => {
        await AuthService.signOut();
        setSession(null);
    };

    return {
        session,
        loading,
        showAuth,
        setShowAuth,
        userProfile,
        handleUpdateProfile,
        handleSignOut,
        supabase,
    };
};
