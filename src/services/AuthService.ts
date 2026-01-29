import { supabase } from "../lib/supabase";
import type { Session } from "@supabase/supabase-js";
import { UserProfile } from "../types/user";

export class AuthService {
    static async signIn(email: string, password: string) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
        return data;
    }

    static async signUp(
        email: string,
        password: string,
        name: string = "Student",
    ) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                },
            },
        });

        if (error) throw error;
        return data;
    }

    static async socialLogin(provider: "google" | "github") {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider,
        });
        if (error) throw error;
        return data;
    }

    static async signOut() {
        await supabase.auth.signOut();
    }

    static async updateUser(data: {
        name?: string;
        role?: string;
        avatar_url?: string;
    }) {
        const { error } = await supabase.auth.updateUser({
            data,
        });
        if (error) throw error;
    }

    /**
     * Parse user profile from session metadata with fallback to default values
     */
    static parseUserProfile(
        session: Session | null,
        defaultUser: UserProfile,
    ): UserProfile {
        if (!session?.user?.user_metadata) {
            return defaultUser;
        }

        const { name, avatar_url, role } = session.user.user_metadata;
        return {
            name: name || defaultUser.name,
            avatar: avatar_url || defaultUser.avatar,
            role: role || defaultUser.role,
        };
    }
}
