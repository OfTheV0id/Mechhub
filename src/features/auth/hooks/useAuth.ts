import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import type { Session } from "@supabase/supabase-js";
import { AuthService } from "../../../services/AuthService";
import { UserProfile } from "../../../types/user";
import { useUpdateProfile } from "./useAuthMutations";

const DEFAULT_USER: UserProfile = {
    name: "张同学",
    avatar: "https://images.unsplash.com/photo-1644904105846-095e45fca990?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwc3R1ZGVudCUyMGF2YXRhcnxlbnwxfHx8fDE3Njg3OTU3NDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    role: "工程力学专业学生",
};

export const useAuth = () => {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [showAuth, setShowAuth] = useState(false);
    const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_USER);

    const updateProfileMutation = useUpdateProfile();

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUserProfile(AuthService.parseUserProfile(session, DEFAULT_USER));
            setLoading(false);
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUserProfile(AuthService.parseUserProfile(session, DEFAULT_USER));
        });

        // Cleanup subscription on unmount
        return () => subscription.unsubscribe();
    }, []);

    const handleUpdateProfile = (
        name: string,
        role: string,
        avatar: string,
    ) => {
        // Optimistically update local state
        setUserProfile({ name, role, avatar });

        updateProfileMutation.mutate({ name, role, avatar });
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
        isUpdating: updateProfileMutation.isPending,
    };
};
