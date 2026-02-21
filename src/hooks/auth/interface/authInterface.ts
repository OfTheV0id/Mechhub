//Auth Interface
import { SupabaseAuthInstance } from "../implementation/supabaseAuthInstance";
import type { AuthInterface } from "../types";

//Pass in an instance class
const createAuthInstance = (
    authInterface: AuthInterface,
): AuthInterface => ({
    signIn: (email, password) =>
        authInterface.signIn(email, password),
    signUp: (email, password) =>
        authInterface.signUp(email, password),
    socialLogin: (provider) => authInterface.socialLogin(provider),
    signOut: () => authInterface.signOut(),
    getSession: () => authInterface.getSession(),
    onAuthStateChange: (callback) =>
        authInterface.onAuthStateChange(callback),
    updateUser: (userUpdateData) =>
        authInterface.updateUser(userUpdateData),
    parseUserProfile: (session) =>
        authInterface.parseUserProfile(session),
});

export const authInstance = createAuthInstance(SupabaseAuthInstance);
