import { useCallback, useEffect, useMemo, useState } from "react";
import { AppLoadingView } from "@views/layout/AppLoadingView";
import { PermissionsConsoleView } from "@views/admin/PermissionsConsoleView";
import {
    PERMISSION_LABELS,
    PERMISSION_KEYS,
    useAdminUserAccessQuery,
    useAdminUserSearchMutation,
    useAuthFlow,
    useUpsertUserAccessMutation,
    isForbiddenError,
    type AdminUserSummary,
    type BaseRole,
    type PermissionEffect,
    type PermissionKey,
} from "@hooks";

const createDefaultPermissionEffects = (): Record<
    PermissionKey,
    PermissionEffect
> =>
    PERMISSION_KEYS.reduce(
        (acc, permissionKey) => {
            acc[permissionKey] = "inherit";
            return acc;
        },
        {} as Record<PermissionKey, PermissionEffect>,
    );

const mapSnapshotToPermissionEffects = (
    overrides?: Partial<Record<PermissionKey, "allow" | "deny">>,
) =>
    PERMISSION_KEYS.reduce(
        (acc, permissionKey) => {
            acc[permissionKey] = overrides?.[permissionKey] ?? "inherit";
            return acc;
        },
        {} as Record<PermissionKey, PermissionEffect>,
    );

export const PermissionsConsolePresenter = () => {
    const { session, loading } = useAuthFlow();
    const [searchEmail, setSearchEmail] = useState("");
    const [selectedUser, setSelectedUser] = useState<AdminUserSummary | null>(
        null,
    );
    const [baseRole, setBaseRole] = useState<BaseRole>("student");
    const [permissionEffects, setPermissionEffects] = useState<
        Record<PermissionKey, PermissionEffect>
    >(createDefaultPermissionEffects());
    const [message, setMessage] = useState<string>();
    const [didInitialLoad, setDidInitialLoad] = useState(false);

    const probeQuery = useAdminUserAccessQuery(session?.user.id, !!session);
    const searchMutation = useAdminUserSearchMutation();
    const upsertMutation = useUpsertUserAccessMutation();
    const selectedUserAccessQuery = useAdminUserAccessQuery(
        selectedUser?.id,
        !!selectedUser && !!session,
    );
    const isForbidden = isForbiddenError(probeQuery.error);
    const mode: "loading" | "forbidden" | "ready" = loading
        ? "loading"
        : !session
          ? "forbidden"
          : probeQuery.isLoading
            ? "loading"
            : isForbidden
              ? "forbidden"
              : "ready";

    const performSearch = useCallback(
        async (email: string) => {
            try {
                setMessage(undefined);
                const users = await searchMutation.mutateAsync(email);

                if (users.length === 0) {
                    setSelectedUser(null);
                    if (email) {
                        setMessage("未找到匹配用户。");
                    }
                    return;
                }

                setSelectedUser((current) => {
                    if (
                        current &&
                        users.some((user) => user.id === current.id)
                    ) {
                        return current;
                    }
                    return users[0];
                });
            } catch (error) {
                setMessage(error instanceof Error ? error.message : "搜索失败");
            }
        },
        [searchMutation],
    );

    useEffect(() => {
        if (!selectedUserAccessQuery.data) {
            return;
        }

        setBaseRole(selectedUserAccessQuery.data.baseRole);
        setPermissionEffects(
            mapSnapshotToPermissionEffects(
                selectedUserAccessQuery.data.overrides,
            ),
        );
    }, [selectedUserAccessQuery.data]);

    useEffect(() => {
        if (mode !== "ready") {
            return;
        }
        if (didInitialLoad) {
            return;
        }

        setDidInitialLoad(true);
        void performSearch("");
    }, [didInitialLoad, mode, performSearch]);

    const onSearch = async () => {
        await performSearch(searchEmail.trim());
    };

    const onSelectUser = (userId: string) => {
        const users = searchMutation.data ?? [];
        const selected = users.find((user) => user.id === userId) ?? null;
        setSelectedUser(selected);
        setMessage(undefined);
    };

    const onPermissionChange = (key: string, effect: PermissionEffect) => {
        if (!PERMISSION_KEYS.includes(key as PermissionKey)) {
            return;
        }

        setPermissionEffects((prev) => ({
            ...prev,
            [key]: effect,
        }));
    };

    const onSave = async () => {
        if (!selectedUser) {
            setMessage("请先选择用户。");
            return;
        }

        try {
            setMessage(undefined);
            await upsertMutation.mutateAsync({
                targetUserId: selectedUser.id,
                baseRole,
                overrides: permissionEffects,
            });
            await selectedUserAccessQuery.refetch();
            setMessage("权限已保存。");
        } catch (error) {
            setMessage(error instanceof Error ? error.message : "保存失败");
        }
    };

    const permissionRows = useMemo(
        () =>
            PERMISSION_KEYS.map((permissionKey) => ({
                key: permissionKey,
                label: PERMISSION_LABELS[permissionKey],
                effect: permissionEffects[permissionKey],
            })),
        [permissionEffects],
    );

    if (mode === "loading") {
        return <AppLoadingView />;
    }

    return (
        <PermissionsConsoleView
            mode={mode}
            requesterEmail={session?.user.email}
            searchEmail={searchEmail}
            onSearchEmailChange={setSearchEmail}
            onSearch={onSearch}
            isSearching={searchMutation.isPending}
            searchResults={searchMutation.data ?? []}
            selectedUserId={selectedUser?.id}
            selectedUserEmail={selectedUser?.email}
            onSelectUser={onSelectUser}
            isAccessLoading={selectedUserAccessQuery.isFetching}
            baseRole={baseRole}
            onBaseRoleChange={setBaseRole}
            permissionRows={permissionRows}
            onPermissionChange={onPermissionChange}
            effectivePermissions={
                selectedUserAccessQuery.data?.effectivePermissions ?? []
            }
            isSaving={upsertMutation.isPending}
            onSave={onSave}
            message={message}
        />
    );
};
