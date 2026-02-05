import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabase";
import { AuthService } from "../../../services/AuthService";
import { authKeys } from "./authKeys";

export const useSession = () => {
    const queryClient = useQueryClient();

    useEffect(() => {
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            queryClient.setQueryData(authKeys.session(), session);
        });

        return () => subscription.unsubscribe();
    }, [queryClient]);

    return useQuery({
        queryKey: authKeys.session(),
        queryFn: AuthService.getSession,
        staleTime: Infinity,
    });
};
