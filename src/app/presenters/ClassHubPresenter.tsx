import { useEffect, useMemo, useState } from "react";
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
        const map = new Map<string, (typeof teaching)[number]>();

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
            setMessage("Please input class name.");
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
            setMessage("Class created successfully.");
        } catch (error) {
            setMessage(error instanceof Error ? error.message : "Failed to create class");
        }
    };

    const handleJoinByInviteCode = async () => {
        if (!inviteCodeInput.trim()) {
            setMessage("Please input invite code.");
            return;
        }

        try {
            setMessage(undefined);
            const result = await joinClassMutation.mutateAsync({
                inviteCode: inviteCodeInput.trim(),
            });
            onSelectedClassIdChange(result.classSummary.id);
            setInviteCodeInput("");
            setMessage(result.alreadyJoined ? "You already joined this class." : "Joined class successfully.");
        } catch (error) {
            setMessage(error instanceof Error ? error.message : "Failed to join class");
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
            setMessage("Invite code created.");
        } catch (error) {
            setMessage(error instanceof Error ? error.message : "Failed to create invite code");
        }
    };

    const handleRevokeInviteCode = async (inviteCodeId: string) => {
        if (!selectedClassId) {
            return;
        }

        try {
            setMessage(undefined);
            await revokeInviteCodeMutation.mutateAsync({ classId: selectedClassId, inviteCodeId });
            setMessage("Invite code revoked.");
        } catch (error) {
            setMessage(error instanceof Error ? error.message : "Failed to revoke invite code");
        }
    };

    const handleRemoveStudent = async (studentUserId: string) => {
        if (!selectedClassId) {
            return;
        }

        try {
            setMessage(undefined);
            await removeStudentMutation.mutateAsync({ classId: selectedClassId, studentUserId });
            setMessage("Student removed from class.");
        } catch (error) {
            setMessage(error instanceof Error ? error.message : "Failed to remove student");
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
                title: "Class Group",
            });
            setSelectedThreadId(thread.id);
            setMessage("Thread created.");
        } catch (error) {
            setMessage(error instanceof Error ? error.message : "Failed to create thread");
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
            setMessage(error instanceof Error ? error.message : "Failed to send message");
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
            teachers={classMembersQuery.data?.teachers ?? []}
            students={classMembersQuery.data?.students ?? []}
            onRemoveStudent={handleRemoveStudent}
            isRemovingStudent={removeStudentMutation.isPending}
            canManageMembers={!!canManageMembers}
            threads={classThreadsQuery.data ?? []}
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
        />
    );
};
