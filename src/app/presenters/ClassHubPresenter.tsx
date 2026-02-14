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
}

export const ClassHubPresenter = ({
    requesterEmail,
    canCreateClass,
    canJoinClass,
    selectedClassId,
    onSelectedClassIdChange,
    onEnterClassChat,
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
        isCreatingThread,
        handleOpenGeneralChat,
        openThreadChat,
        inviteCodeDisplayText,
    } = useClassHubState({
        selectedClassId,
        onSelectedClassIdChange,
        onEnterClassChat,
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
            isCreatingThread={isCreatingThread}
            onEnterGeneralChat={handleOpenGeneralChat}
            onEnterThreadChat={openThreadChat}
            inviteCodeDisplayText={inviteCodeDisplayText}
        />
    );
};
