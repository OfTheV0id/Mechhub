import { ClassHubView } from "@views/class";
import { useClassHubState } from "@hooks";

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
    onRenameClassThread?: (
        classId: string,
        threadId: string,
        title: string,
    ) => Promise<boolean>;
    onDeleteClassThread?: (
        classId: string,
        threadId: string,
    ) => Promise<boolean>;
}

export const ClassHubPresenter = ({
    requesterEmail,
    canCreateClass,
    canJoinClass,
    selectedClassId,
    onSelectedClassIdChange,
    onEnterClassChat,
    onRenameClassThread,
    onDeleteClassThread,
}: ClassHubPresenterProps) => {
    const {
        screen,
        setScreen,
        isAdmin,
        classOptions,
        createClassName,
        setCreateClassName,
        createClassDescription,
        setCreateClassDescription,
        createTeacherUserId,
        setCreateTeacherUserId,
        handleCreateClass,
        isCreatingClass,
        inviteCodeInput,
        setInviteCodeInput,
        handleJoinByInviteCode,
        isJoiningClass,
        teachers,
        students,
        threads,
        handleCreateThread,
        canCreateThread,
        canManageThreads,
        handleRenameThread,
        handleDeleteThread,
        isCreatingThread,
        openThreadChat,
        inviteCodeDisplayText,
    } = useClassHubState({
        selectedClassId,
        onSelectedClassIdChange,
        onEnterClassChat,
        onRenameClassThread,
        onDeleteClassThread,
    });

    return (
        <ClassHubView
            requesterEmail={requesterEmail}
            isAdmin={isAdmin}
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
            isCreatingClass={isCreatingClass}
            inviteCodeInput={inviteCodeInput}
            onInviteCodeInputChange={setInviteCodeInput}
            onJoinByInviteCode={handleJoinByInviteCode}
            isJoiningClass={isJoiningClass}
            teachers={teachers}
            students={students}
            threads={threads.map((thread) => ({
                id: thread.id,
                title: thread.title,
                threadType: thread.threadType as "group" | "shared_chat",
            }))}
            onCreateThread={handleCreateThread}
            canCreateThread={canCreateThread}
            canManageThreads={canManageThreads}
            onRenameThread={handleRenameThread}
            onDeleteThread={handleDeleteThread}
            isCreatingThread={isCreatingThread}
            onEnterThreadChat={openThreadChat}
            inviteCodeDisplayText={inviteCodeDisplayText}
        />
    );
};
