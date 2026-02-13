import { useEffect, useMemo, useState } from "react";
import { ClassHubView } from "@views/class";
import {
    useClassMembers,
    useClassThreads,
    useCreateClass,
    useCreateGroupThread,
    useJoinClassByInviteCode,
    useMyClassContext,
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
    const [message, setMessage] = useState<string>();

    const classContextQuery = useMyClassContext();

    const classOptions = useMemo(() => {
        const teaching = classContextQuery.data?.teachingClasses ?? [];
        const joined = classContextQuery.data?.joinedClasses ?? [];
        const map = new Map<string, (typeof teaching)[number] | (typeof joined)[number]>();

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

        const selectedExists = !!selectedClassId && classOptions.some((item) => item.id === selectedClassId);
        if (!selectedExists) {
            setScreen("collection");
        }
    }, [classOptions, screen, selectedClassId]);

    const selectedClass = classOptions.find((item) => item.id === selectedClassId);
    const isDashboardEnabled = screen === "dashboard" && !!selectedClassId;

    const classMembersQuery = useClassMembers(selectedClassId ?? undefined, isDashboardEnabled);
    const classThreadsQuery = useClassThreads(selectedClassId ?? undefined, isDashboardEnabled);

    const teachers = classMembersQuery.data?.teachers ?? [];
    const students = classMembersQuery.data?.students ?? [];
    const threads = (classThreadsQuery.data ?? []).filter(
        (thread) => isHubThreadType(thread.threadType),
    );

    const createClassMutation = useCreateClass();
    const joinClassMutation = useJoinClassByInviteCode();
    const createGroupThreadMutation = useCreateGroupThread();

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
        const groupThread = threads.find((thread) => thread.threadType === "group") ?? threads[0];
        if (!groupThread) {
            setMessage("当前班级还没有可用话题，请先创建话题。");
            return;
        }
        openThreadChat(groupThread.id);
    };

    const handleCreateClass = async () => {
        if (!createClassName.trim()) {
            setMessage("请输入班级名称");
            return;
        }

        try {
            setMessage(undefined);
            const createdClass = await createClassMutation.mutateAsync({
                name: createClassName.trim(),
                description: createClassDescription.trim(),
                teacherUserId: createTeacherUserId.trim() || undefined,
            });
            onSelectedClassIdChange(createdClass.id);
            setCreateClassName("");
            setCreateClassDescription("");
            setCreateTeacherUserId("");
            setScreen("dashboard");
            setMessage("班级创建成功");
        } catch (error) {
            setMessage(error instanceof Error ? error.message : "创建班级失败");
        }
    };

    const handleJoinByInviteCode = async () => {
        if (!inviteCodeInput.trim()) {
            setMessage("请输入邀请码");
            return;
        }

        try {
            setMessage(undefined);
            const result = await joinClassMutation.mutateAsync({
                inviteCode: inviteCodeInput.trim(),
            });
            onSelectedClassIdChange(result.classSummary.id);
            setInviteCodeInput("");
            setScreen("dashboard");
            setMessage(result.alreadyJoined ? "你已经在该班级中" : "加入班级成功");
        } catch (error) {
            setMessage(error instanceof Error ? error.message : "加入班级失败");
        }
    };

    const handleCreateThread = async () => {
        if (!selectedClassId) {
            return;
        }

        try {
            setMessage(undefined);
            const newThread = await createGroupThreadMutation.mutateAsync({
                classId: selectedClassId,
                title: `班级讨论 ${threads.filter((thread) => thread.threadType === "group").length + 1}`,
            });
            setMessage("话题已创建");
            openThreadChat(newThread.id, newThread.title);
        } catch (error) {
            setMessage(error instanceof Error ? error.message : "创建话题失败");
        }
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
            message={message}
        />
    );
};
