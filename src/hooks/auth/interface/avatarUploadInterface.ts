//Avatar Upload Interface
import { supabaseAvatarUploadInstance } from "../implementation/supabaseAvatarUploadInstance";
import type { AvatarUploadInterface } from "../types";

//Pass in an instance class
const createAvatarUploadInstance = (
    avatarUploadInstance: AvatarUploadInterface,
): AvatarUploadInterface => ({
    uploadAvatarFn: avatarUploadInstance.uploadAvatarFn,
});

export const avatarUploadInstance = createAvatarUploadInstance(
    supabaseAvatarUploadInstance,
);
