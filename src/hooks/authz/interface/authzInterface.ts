import {
    getAdminUserAccess,
    getMyAuthorization,
    searchUserByEmail,
    upsertAdminUserAccess,
} from "../implementation/authzService";
import { isForbiddenError } from "../implementation/authzErrors";

export interface AuthzInterface {
    getMyAuthorization: typeof getMyAuthorization;
    searchUserByEmail: typeof searchUserByEmail;
    getAdminUserAccess: typeof getAdminUserAccess;
    upsertAdminUserAccess: typeof upsertAdminUserAccess;
    isForbiddenError: typeof isForbiddenError;
}

export const createAuthzInterface = (): AuthzInterface => ({
    getMyAuthorization,
    searchUserByEmail,
    getAdminUserAccess,
    upsertAdminUserAccess,
    isForbiddenError,
});

export const authzInterface = createAuthzInterface();
