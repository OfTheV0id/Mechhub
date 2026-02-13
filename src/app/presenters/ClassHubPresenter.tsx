import { useEffect, useMemo, useRef, useState } from "react";
import { ClassHubView } from "@views/class";
import {
    useClassMembers,
    useClassThreadMessages,
    useClassThreads,
    useCreateClass,
    useCreateGroupThread,
    useCreateInviteCode,
    useInviteCodes,
    useJoinClassByInviteCode,
    useMyClassContext,
    usePostClassMessage,
    useRemoveStudentFromClass,
    useRevokeInviteCode,
} from "@hooks";

type HubTab = "overview" | "members" | "invites" | "chat";

interface ClassHubPresenterProps {
    requesterEmail?: string;
    canCreateClass: boolean;
    canJoinClass: boolean;
    selectedClassId: string | null;
    onSelectedClassIdChange: (classId: string | null) => void;
}

export const ClassHubPresenter = ({
    requesterEmail,
    canCreateClass,
    canJoinClass,
    selectedClassId,
    onSelectedClassIdChange,
}: ClassHubPresenterProps) => {
    const [activeTab, setActiveTab] = useState<HubTab>("overview");
    const [memberSearch, setMemberSearch] = useState("");
    const [threadSearch, setThreadSearch] = useState("");

    const [createClassName, setCreateClassName] = useState("");
    const [createClassDescription, setCreateClassDescription] = useState("");
    const [createTeacherUserId, setCreateTeacherUserId] = useState("");

    const [inviteCodeInput, setInviteCodeInput] = useState("");
    const [inviteExpiresHours, setInviteExpiresHours] = useState(168);
    const [inviteMaxUsesInput, setInviteMaxUsesInput] = useState("");
    const [latestCreatedInviteCode, setLatestCreatedInviteCode] = useState<string>();

    const [selectedThreadId, setSelectedThreadId] = useState<string>();
    const [threadInput, setThreadInput] = useState("");
    const [message, setMessage] = useState<string>();

    const classContextQuery = useMyClassContext();

    const classOptions = useMemo(() => {
        const teaching = classContextQuery.data?.teachingClasses ?? [];
        const joined = classContextQuery.data?.joinedClasses ?? [];
        const map = new Map<string, (typeof teaching)[number] | (typeof joined)[number]>();

        teaching.forEach((item) => {
            map.set(item.id, item);
        });

        joined.forEach((item) => {
            if (!map.has(item.id)) {
                map.set(item.id, item);
            }
        });

        return Array.from(map.values());
    }, [classContextQuery.data]);

    useEffect(() => {
        if (classOptions.length === 0) {
            if (selectedClassId) {
                onSelectedClassIdChange(null);
            }
            return;
        }

        if (!selectedClassId || !classOptions.some((item) => item.id === selectedClassId)) {
            onSelectedClassIdChange(classOptions[0].id);
        }
    }, [classOptions, selectedClassId, onSelectedClassIdChange]);

    const selectedClass = classOptions.find((item) => item.id === selectedClassId);
    const canManageMembers =
        !!selectedClass &&
        (selectedClass.role === "teacher" || classContextQuery.data?.isAdmin);

    const classMembersQuery = useClassMembers(selectedClassId ?? undefined, !!selectedClassId);
    const inviteCodesQuery = useInviteCodes(
        selectedClassId ?? undefined,
        !!selectedClassId && canManageMembers,
    );
    const classThreadsQuery = useClassThreads(selectedClassId ?? undefined, !!selectedClassId);

    const previousClassIdRef = useRef<string | null>(null);

    useEffect(() => {
        if (!selectedClassId) {
            previousClassIdRef.current = null;
            return;
        }

        if (previousClassIdRef.current === selectedClassId) {
            return;
        }

        previousClassIdRef.current = selectedClassId;
        setMemberSearch("");
        setThreadSearch("");

        const isStudentOnly =
            selectedClass?.role === "student" && !classContextQuery.data?.isAdmin;
        setActiveTab(isStudentOnly ? "chat" : "overview");
    }, [selectedClassId, selectedClass?.role, classContextQuery.data?.isAdmin]);

    useEffect(() => {
        const threads = classThreadsQuery.data ?? [];
        if (!threads.length) {
            setSelectedThreadId(undefined);
            return;
        }

        if (!selectedThreadId || !threads.some((item) => item.id === selectedThreadId)) {
            setSelectedThreadId(threads[0].id);
        }
    }, [classThreadsQuery.data, selectedThreadId]);

    useEffect(() => {
        const isStudentOnly =
            selectedClass?.role === "student" && !classContextQuery.data?.isAdmin;
        const hasThreads = (classThreadsQuery.data?.length ?? 0) > 0;

        if (isStudentOnly && hasThreads && activeTab === "overview") {
            setActiveTab("chat");
        }
    }, [
        activeTab,
        classThreadsQuery.data?.length,
        classContextQuery.data?.isAdmin,
        selectedClass?.role,
    ]);

    const normalizedMemberSearch = memberSearch.trim().toLowerCase();
    const teachers = classMembersQuery.data?.teachers ?? [];
    const students = classMembersQuery.data?.students ?? [];

    const filteredTeachers = useMemo(() => {
        if (!normalizedMemberSearch) {
            return teachers;
        }

        return teachers.filter((teacher) => {
            const hitTarget = `${teacher.name} ${teacher.email}`.toLowerCase();
            return hitTarget.includes(normalizedMemberSearch);
        });
    }, [teachers, normalizedMemberSearch]);

    const filteredStudents = useMemo(() => {
        if (!normalizedMemberSearch) {
            return students;
        }

        return students.filter((student) => {
            const hitTarget = `${student.name} ${student.email}`.toLowerCase();
            return hitTarget.includes(normalizedMemberSearch);
        });
    }, [students, normalizedMemberSearch]);

    const normalizedThreadSearch = threadSearch.trim().toLowerCase();
    const allThreads = classThreadsQuery.data ?? [];

    const filteredThreads = useMemo(() => {
        if (!normalizedThreadSearch) {
            return allThreads;
        }

        return allThreads.filter((thread) => {
            const hitTarget = `${thread.title} ${thread.threadType}`.toLowerCase();
            return hitTarget.includes(normalizedThreadSearch);
        });
    }, [allThreads, normalizedThreadSearch]);

    const threadMessagesQuery = useClassThreadMessages(
        selectedThreadId,
        !!selectedThreadId,
    );

    const createClassMutation = useCreateClass();
    const joinClassMutation = useJoinClassByInviteCode();
    const createInviteCodeMutation = useCreateInviteCode();
    const revokeInviteCodeMutation = useRevokeInviteCode();
    const removeStudentMutation = useRemoveStudentFromClass();
    const createGroupThreadMutation = useCreateGroupThread();
    const postClassMessageMutation = usePostClassMessage();

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
            setActiveTab("overview");
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
            setActiveTab("overview");
            setMessage(result.alreadyJoined ? "你已经在该班级中" : "加入班级成功");
        } catch (error) {
            setMessage(error instanceof Error ? error.message : "加入班级失败");
        }
    };

    const handleCreateInviteCode = async () => {
        if (!selectedClassId) {
            return;
        }

        const maxUsesParsed = Number(inviteMaxUsesInput);
        const maxUses =
            inviteMaxUsesInput.trim() && Number.isFinite(maxUsesParsed) && maxUsesParsed > 0
                ? Math.floor(maxUsesParsed)
                : null;

        try {
            setMessage(undefined);
            const result = await createInviteCodeMutation.mutateAsync({
                classId: selectedClassId,
                expiresInHours: inviteExpiresHours,
                maxUses,
            });
            setLatestCreatedInviteCode(result.inviteCode);
            setActiveTab("invites");
            setMessage("邀请码创建成功");
        } catch (error) {
            setMessage(error instanceof Error ? error.message : "创建邀请码失败");
        }
    };

    const handleRevokeInviteCode = async (inviteCodeId: string) => {
        if (!selectedClassId) {
            return;
        }

        try {
            setMessage(undefined);
            await revokeInviteCodeMutation.mutateAsync({ classId: selectedClassId, inviteCodeId });
            setMessage("邀请码已撤销");
        } catch (error) {
            setMessage(error instanceof Error ? error.message : "撤销邀请码失败");
        }
    };

    const handleRemoveStudent = async (studentUserId: string) => {
        if (!selectedClassId) {
            return;
        }

        try {
            setMessage(undefined);
            await removeStudentMutation.mutateAsync({ classId: selectedClassId, studentUserId });
            setMessage("已移出学生");
        } catch (error) {
            setMessage(error instanceof Error ? error.message : "移除学生失败");
        }
    };

    const handleCreateGroupThread = async () => {
        if (!selectedClassId) {
            return;
        }

        try {
            setMessage(undefined);
            const thread = await createGroupThreadMutation.mutateAsync({
                classId: selectedClassId,
                title: "班级讨论",
            });
            setSelectedThreadId(thread.id);
            setActiveTab("chat");
            setMessage("已创建讨论频道");
        } catch (error) {
            setMessage(error instanceof Error ? error.message : "创建频道失败");
        }
    };

    const handlePostThreadMessage = async () => {
        if (!selectedThreadId || !threadInput.trim()) {
            return;
        }

        try {
            setMessage(undefined);
            await postClassMessageMutation.mutateAsync({
                threadId: selectedThreadId,
                content: { text: threadInput.trim() },
            });
            setThreadInput("");
        } catch (error) {
            setMessage(error instanceof Error ? error.message : "发送消息失败");
        }
    };

    return (
        <ClassHubView
            requesterEmail={requesterEmail}
            isAdmin={!!classContextQuery.data?.isAdmin}
            classOptions={classOptions}
            selectedClassId={selectedClassId ?? undefined}
            onSelectClass={(classId) => onSelectedClassIdChange(classId)}
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
            inviteExpiresHours={inviteExpiresHours}
            onInviteExpiresHoursChange={setInviteExpiresHours}
            inviteMaxUsesInput={inviteMaxUsesInput}
            onInviteMaxUsesInputChange={setInviteMaxUsesInput}
            onCreateInviteCode={handleCreateInviteCode}
            isCreatingInviteCode={createInviteCodeMutation.isPending}
            latestCreatedInviteCode={latestCreatedInviteCode}
            inviteCodes={inviteCodesQuery.data ?? []}
            onRevokeInviteCode={handleRevokeInviteCode}
            isRevokingInviteCode={revokeInviteCodeMutation.isPending}
            teachers={filteredTeachers}
            students={filteredStudents}
            onRemoveStudent={handleRemoveStudent}
            isRemovingStudent={removeStudentMutation.isPending}
            canManageMembers={!!canManageMembers}
            threads={filteredThreads}
            selectedThreadId={selectedThreadId}
            onSelectThread={setSelectedThreadId}
            onCreateGroupThread={handleCreateGroupThread}
            isCreatingThread={createGroupThreadMutation.isPending}
            threadMessages={threadMessagesQuery.data ?? []}
            threadInput={threadInput}
            onThreadInputChange={setThreadInput}
            onPostThreadMessage={handlePostThreadMessage}
            isPostingThreadMessage={postClassMessageMutation.isPending}
            message={message}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            memberSearch={memberSearch}
            onMemberSearchChange={setMemberSearch}
            threadSearch={threadSearch}
            onThreadSearchChange={setThreadSearch}
        />
    );
};
