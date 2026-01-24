import { createClient } from "@supabase/supabase-js";
import { projectId, publicAnonKey } from "../config/supabase";

const supabase = createClient(
    `https://${projectId}.supabase.co`,
    publicAnonKey,
);

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
        // Calling custom edge function for signup as per original logic
        const response = await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-5abdc916/signup`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${publicAnonKey}`,
                },
                body: JSON.stringify({
                    email,
                    password,
                    name,
                }),
            },
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "注册失败");
        }
        return result;
    }

    static async socialLogin(provider: "google" | "github") {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: provider,
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
            data: data,
        });
        if (error) throw error;
    }
}
