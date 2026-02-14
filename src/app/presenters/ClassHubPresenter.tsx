import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ClassHubView } from "@views/class";
import {
    useClassMembersQuery,
    useClassThreadsQuery,
    useCreateClassMutation,
    useCreateGroupThreadMutation,
    useInviteCodesQuery,
    useJoinClassByInviteCodeMutation,
    useMyClassContextQuery,
} from "@hooks";

type HubScreen = "collection" | "dashboard";
type HubThreadType = "group" | "shared_chat";

const isHubThreadType = (
    threadType: "group" | "shared_chat" | "shared_grade",
): threadType is HubThreadType =>
    threadType === "group" || threadType === "shared_chat";

interface ClassHubPresenterProps {
    requesterEmail?: string;
    canCreateClass: boolean;
    canJoinClass: boolean;
    selectedClassId: string | null;
    onSelectedClassIdChange: (classId: string | null) => void;
    onEnterClassChat?: (payload: {
        classId: string;
        className: string;
        threadId: string;
        threadTitle: string;
    }) => void;
}

export const ClassHubPresenter = ({
    requesterEmail,
    canCreateClass,
    canJoinClass,
    selectedClassId,
    onSelectedClassIdChange,
    onEnterClassChat,
}: ClassHubPresenterProps) => {
    const [screen, setScreen] = useState<HubScreen>("collection");

    const [createClassName, setCreateClassName] = useState("");
    const [createClassDescription, setCreateClassDescription] = useState("");
    const [createTeacherUserId, setCreateTeacherUserId] = useState("");

    const [inviteCodeInput, setInviteCodeInput] = useState("");

    const classContextQuery = useMyClassContextQuery();

    const classOptions = useMemo(() => {
        const teaching = classContextQuery.data?.teachingClasses ?? [];
        const joined = classContextQuery.data?.joinedClasses ?? [];
        const map = new Map<
            string,
            (typeof teaching)[number] | (typeof joined)[number]
        >();

        teaching.forEach((item) => map.set(item.id, item));
        joined.forEach((item) => {
            if (!map.has(item.id)) {
                map.set(item.id, item);
            }
        });

        return Array.from(map.values());
    }, [classContextQuery.data]);

    useEffect(() => {
        if (screen !== "dashboard") {
            return;
        }

        const selectedExists =
            !!selectedClassId &&
            classOptions.some((item) => item.id === selectedClassId);
        if (!selectedExists) {
            setScreen("collection");
        }
    }, [classOptions, screen, selectedClassId]);

    const selectedClass = classOptions.find(
        (item) => item.id === selectedClassId,
    );
    const isDashboardEnabled = screen === "dashboard" && !!selectedClassId;

    const classMembersQuery = useClassMembersQuery(
        selectedClassId ?? undefined,
        isDashboardEnabled,
    );
    const classThreadsQuery = useClassThreadsQuery(
        selectedClassId ?? undefined,
        isDashboardEnabled,
    );
    const canViewInviteCodes = isDashboardEnabled;
    const inviteCodesQuery = useInviteCodesQuery(
        selectedClassId ?? undefined,
        canViewInviteCodes,
    );

    const teachers = classMembersQuery.data?.teachers ?? [];
    const students = classMembersQuery.data?.students ?? [];
    const threads = (classThreadsQuery.data ?? []).filter((thread) =>
        isHubThreadType(thread.threadType),
    );
    const inviteCodeDisplayText = useMemo(() => {
        if (!canViewInviteCodes) {
            return undefined;
        }

        if (inviteCodesQuery.isLoading) {
            return "加载中...";
        }

        const latestActiveCode = (inviteCodesQuery.data ?? [])
            .filter((code) => !code.isRevoked)
            .sort((left, right) => {
                const leftTime = left.createdAt
                    ? new Date(left.createdAt).getTime()
                    : 0;
                const rightTime = right.createdAt
                    ? new Date(right.createdAt).getTime()
                    : 0;
                return rightTime - leftTime;
            })[0];

        return latestActiveCode ? latestActiveCode.code : "暂无";
    }, [canViewInviteCodes, inviteCodesQuery.data, inviteCodesQuery.isLoading]);

    const createClassMutation = useCreateClassMutation();
    const joinClassMutation = useJoinClassByInviteCodeMutation();
    const createGroupThreadMutation = useCreateGroupThreadMutation();

    const openThreadChat = (threadId: string, threadTitle?: string) => {
        if (!selectedClass) {
            return;
        }
        const thread = threads.find((item) => item.id === threadId);
        const resolvedTitle = threadTitle ?? thread?.title;
        if (!resolvedTitle) {
            return;
        }

        onEnterClassChat?.({
            classId: selectedClass.id,
            className: selectedClass.name,
            threadId,
            threadTitle: resolvedTitle,
        });
    };

    const handleOpenGeneralChat = () => {
        const groupThread =
            threads.find((thread) => thread.threadType === "group") ??
            threads[0];
        if (!groupThread) {
            toast.error("当前班级还没有可用话题，请先创建话题。");
            return;
        }
        openThreadChat(groupThread.id);
    };

    const handleCreateClass = async () => {
        if (!createClassName.trim()) {
            toast.error("请输入班级名称");
            return;
        }

        try {
            const createdClass = await createClassMutation.mutateAsync({
                name: createClassName.trim(),
                description: createClassDescription.trim(),
                teacherUserId: createTeacherUserId.trim() || undefined,
            });
            onSelectedClassIdChange(createdClass.classSummary.id);
            setCreateClassName("");
            setCreateClassDescription("");
            setCreateTeacherUserId("");
            setScreen("dashboard");
        } catch {}
    };

    const handleJoinByInviteCode = async () => {
        if (!inviteCodeInput.trim()) {
            toast.error("请输入邀请码");
            return;
        }

        try {
            const result = await joinClassMutation.mutateAsync({
                inviteCode: inviteCodeInput.trim(),
            });
            onSelectedClassIdChange(result.classSummary.id);
            setInviteCodeInput("");
            setScreen("dashboard");
        } catch {}
    };

    const handleCreateThread = async () => {
        if (!selectedClassId) {
            return;
        }

        try {
            const newThread = await createGroupThreadMutation.mutateAsync({
                classId: selectedClassId,
                title: `班级讨论 ${threads.filter((thread) => thread.threadType === "group").length + 1}`,
            });
            openThreadChat(newThread.id, newThread.title);
        } catch {}
    };

    return (
        <ClassHubView
            requesterEmail={requesterEmail}
            isAdmin={!!classContextQuery.data?.isAdmin}
            screen={screen}
            classOptions={classOptions}
            selectedClassId={selectedClassId ?? undefined}
            onOpenClassDashboard={(classId) => {
                onSelectedClassIdChange(classId);
                setScreen("dashboard");
            }}
            onBackToCollection={() => setScreen("collection")}
            canCreateClass={canCreateClass}
            canJoinClass={canJoinClass}
            createClassName={createClassName}
            onCreateClassNameChange={setCreateClassName}
            createClassDescription={createClassDescription}
            onCreateClassDescriptionChange={setCreateClassDescription}
            createTeacherUserId={createTeacherUserId}
            onCreateTeacherUserIdChange={setCreateTeacherUserId}
            onCreateClass={handleCreateClass}
            isCreatingClass={createClassMutation.isPending}
            inviteCodeInput={inviteCodeInput}
            onInviteCodeInputChange={setInviteCodeInput}
            onJoinByInviteCode={handleJoinByInviteCode}
            isJoiningClass={joinClassMutation.isPending}
            teachers={teachers}
            students={students}
            threads={threads.map((thread) => ({
                id: thread.id,
                title: thread.title,
                threadType: thread.threadType as "group" | "shared_chat",
            }))}
            onCreateThread={handleCreateThread}
            isCreatingThread={createGroupThreadMutation.isPending}
            onEnterGeneralChat={handleOpenGeneralChat}
            onEnterThreadChat={openThreadChat}
            inviteCodeDisplayText={inviteCodeDisplayText}
        />
    );
};
