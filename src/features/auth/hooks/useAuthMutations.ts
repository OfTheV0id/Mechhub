import { useMutation } from "@tanstack/react-query";
import { AuthService } from "../../../services/AuthService";
import { toast } from "sonner";

export const useUpdateProfile = () => {
    return useMutation({
        mutationFn: async (data: {
            name: string;
            role: string;
            avatar: string;
        }) => {
            await AuthService.updateUser({
                name: data.name,
                role: data.role,
                avatar_url: data.avatar,
            });
            return data;
        },
        onSuccess: () => {
            toast.success("个人信息已更新");
        },
        onError: () => {
            toast.error("更新个人信息失败");
        },
    });
};
