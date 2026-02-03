import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Session } from "@supabase/supabase-js";
import { AuthService } from "../../../services/AuthService";
import { authKeys } from "./authKeys";
import { DEFAULT_USER } from "../constants";

export const useUserProfile = (session: Session | null) => {
    const queryClient = useQueryClient();

    useEffect(() => {
        queryClient.setQueryData(
            authKeys.profile(),
            AuthService.parseUserProfile(session, DEFAULT_USER),
        );
    }, [queryClient, session]);

    return useQuery({
        queryKey: authKeys.profile(),
        queryFn: () => AuthService.parseUserProfile(session, DEFAULT_USER),
        initialData: AuthService.parseUserProfile(session, DEFAULT_USER),
        staleTime: Infinity,
    });
};
