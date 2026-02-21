//Supabase Implementations
import { supabase } from "../../shared/supabase";
import type {
    AuthSession,
    UserProfile,
    ProfileUploadPayload,
} from "../types";
import { getSignupDefaultProfile } from "../constants";

export class SupabaseAuthInstance {
    static async signIn(email: string, password: string) {
        const { data, error } =
            await supabase.auth.signInWithPassword({
                email,
                password,
            });
        if (error) throw error;

        return data;
    }

    static async signUp(email: string, password: string) {
        const signupDefaultProfile = getSignupDefaultProfile(email);
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name: signupDefaultProfile.name,
                    avatar: signupDefaultProfile.avatar,
                },
            },
        });

        if (error) throw error;

        return data;
    }

    //Oauth login.Under Development.
    static async socialLogin(provider: string) {
        return;
    }

    static async signOut() {
        await supabase.auth.signOut();
    }

    static async getSession(): Promise<AuthSession | null> {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;

        return data.session as AuthSession | null;
    }

    static onAuthStateChange(
        callback: (session: AuthSession | null) => void,
    ): () => void {
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            callback(session as AuthSession | null);
        });

        return () => subscription.unsubscribe();
    }

    static async updateUser(
        profileUploadPayload: ProfileUploadPayload,
    ) {
        const { avatarFile: _avatarFile, ...metadata } =
            profileUploadPayload;

        const { error } = await supabase.auth.updateUser({
            data: metadata,
        });
        if (error) throw error;
    }

    //From session to profile.
    static parseUserProfile(
        session: AuthSession | null,
    ): UserProfile | null {
        if (!session) return null;
        const metadata = (session.user?.user_metadata ??
            {}) as Record<string, unknown>;

        return {
            name:
                typeof metadata.name === "string"
                    ? metadata.name
                    : "",
            avatar:
                typeof metadata.avatar === "string"
                    ? metadata.avatar
                    : "",
        };
    }
}
