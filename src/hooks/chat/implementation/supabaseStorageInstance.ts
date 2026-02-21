import type { StorageInterface } from "../interface/storageInterface";
import { StorageService } from "./supabaseStorageService";

export const createSupabaseStoragePort = (): StorageInterface => ({
    uploadImage: (file) => StorageService.uploadImage(file),
});

