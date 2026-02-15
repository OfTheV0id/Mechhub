import { Toaster, toast } from "sonner";
import { uploadAssignmentAttachments, useAppShellState } from "@hooks";
import { AssignmentSubmitPopover } from "@views/assignment";
import { AppLoadingView } from "@views/layout/AppLoadingView";
import { ClassMembershipNoticeView, ClassPickerPopover } from "@views/class";
import { AuthGatePresenter } from "./AuthGatePresenter";
import { ClassHubPresenter } from "./ClassHubPresenter";
import { GradeAssignmentPresenter } from "./GradeAssignmentPresenter";
import { LandingPagePresenter } from "./LandingPagePresenter";
import { MainLayoutPresenter } from "./MainLayoutPresenter";
import { PublishAssignmentPresenter } from "./PublishAssignmentPresenter";
import { SubmitAssignmentPresenter } from "./SubmitAssignmentPresenter";
import { ViewFeedbackPresenter } from "./ViewFeedbackPresenter";

export const AppPresenter = () => {
    const appShellState = useAppShellState();
    const { state, actions, derived, meta } = appShellState;

    if (meta.isAppLoading) {
        return <AppLoadingView />;
    }

    const classHubNode = derived.permissions.canAccessClassHub ? (
        <ClassHubPresenter {...derived.classHubProps} />
    ) : undefined;

    const classNameById = Object.fromEntries(
        derived.classOptions.map((classItem) => [classItem.id, classItem.name]),
    );

    const submitAssignmentNode = derived.permissions
        .canAccessStudentAssignments ? (
        derived.hasStudentClassMembership ? (
            <SubmitAssignmentPresenter
                assignments={derived.studentAssignments}
                classNameById={classNameById}
                isSubmitting={meta.isSubmittingAssignment}
            />
        ) : (
            <ClassMembershipNoticeView
                title={derived.classMembershipNotices.submitAssignment.title}
                description={
                    derived.classMembershipNotices.submitAssignment.description
                }
                actionLabel={
                    derived.classMembershipNotices.submitAssignment.actionLabel
                }
                onAction={() => actions.setActiveView("classHub")}
            />
        )
    ) : undefined;

    const viewFeedbackNode = derived.permissions.canAccessStudentAssignments ? (
        derived.hasStudentClassMembership ? (
            <ViewFeedbackPresenter
                feedbackList={derived.feedbackSummaries}
                classNameById={classNameById}
            />
        ) : (
            <ClassMembershipNoticeView
                title={derived.classMembershipNotices.viewFeedback.title}
                description={
                    derived.classMembershipNotices.viewFeedback.description
                }
                actionLabel={
                    derived.classMembershipNotices.viewFeedback.actionLabel
                }
                onAction={() => actions.setActiveView("classHub")}
            />
        )
    ) : undefined;

    const publishAssignmentNode = derived.permissions
        .canAccessTeacherAssignments ? (
        derived.hasTeacherClassMembership ? (
            <PublishAssignmentPresenter
                modules={
                    derived.classOptions
                        .filter((classItem) => classItem.role === "teacher")
                        .map((classItem) => classItem.name)
                }
                onPublish={async (
                    name,
                    module,
                    dueDate,
                    dueTime,
                    instructions,
                    files,
                    aiGradingEnabled,
                ) => {
                    const targetClass = derived.classOptions.find(
                        (item) =>
                            item.role === "teacher" && item.name === module,
                    );

                    if (!targetClass) {
                        return;
                    }

                    const dueAt =
                        dueDate && dueTime
                            ? new Date(`${dueDate}T${dueTime}`).toISOString()
                            : dueDate
                              ? new Date(dueDate).toISOString()
                              : null;

                    let attachments = [];
                    if (files.length > 0) {
                        try {
                            attachments = await uploadAssignmentAttachments(
                                files,
                            );
                        } catch (error) {
                            const message =
                                error instanceof Error
                                    ? error.message
                                    : "附件上传失败";
                            toast.error(message);
                            return;
                        }
                    }

                    const success = await actions.handleCreateAssignment({
                        classId: targetClass.id,
                        title: name,
                        instructions,
                        dueAt,
                        aiGradingEnabled,
                        status: "published",
                        attachments,
                    });

                    if (success) {
                        actions.setActiveView("gradeAssignment");
                    }
                }}
            />
        ) : (
            <ClassMembershipNoticeView
                title={derived.classMembershipNotices.publishAssignment.title}
                description={
                    derived.classMembershipNotices.publishAssignment.description
                }
                actionLabel={
                    derived.classMembershipNotices.publishAssignment.actionLabel
                }
                onAction={() => actions.setActiveView("classHub")}
            />
        )
    ) : undefined;

    const gradeAssignmentNode = derived.permissions
        .canAccessTeacherAssignments ? (
        derived.hasTeacherClassMembership ? (
            <GradeAssignmentPresenter
                teacherClasses={derived.teacherClassOptions}
                onGenerateGradeDraft={actions.handleGenerateGradeDraft}
                onSaveGradeReview={actions.handleSaveGradeReview}
                onReleaseGrade={actions.handleReleaseGrade}
                isGeneratingDraft={meta.isGeneratingGradeDraft}
                isSavingReview={meta.isSavingGradeReview}
                isReleasingGrade={meta.isReleasingGrade}
            />
        ) : (
            <ClassMembershipNoticeView
                title={derived.classMembershipNotices.gradeAssignment.title}
                description={
                    derived.classMembershipNotices.gradeAssignment.description
                }
                actionLabel={
                    derived.classMembershipNotices.gradeAssignment.actionLabel
                }
                onAction={() => actions.setActiveView("classHub")}
            />
        )
    ) : undefined;

    const mainNode = !state.session ? (
        <AuthGatePresenter
            showAuth={state.showAuth}
            setShowAuth={actions.setShowAuth}
        />
    ) : state.activeView === "landing" ? (
        <LandingPagePresenter
            onStart={() => actions.setActiveView(derived.fallbackView)}
            onLogin={() => actions.setActiveView(derived.fallbackView)}
        />
    ) : (
        <>
            <MainLayoutPresenter
                activeView={state.activeView}
                setActiveView={actions.setActiveView}
                canAccessChat={derived.permissions.canAccessChat}
                canAccessProfile={derived.permissions.canAccessProfile}
                canAccessClassHub={derived.permissions.canAccessClassHub}
                canAccessStudentAssignments={
                    derived.permissions.canAccessStudentAssignments
                }
                canAccessTeacherAssignments={
                    derived.permissions.canAccessTeacherAssignments
                }
                userProfile={derived.safeUserProfile}
                chatSessions={derived.chatSessions}
                classSessionGroups={derived.classSessionGroups}
                isClassAdmin={derived.isClassAdmin}
                activeClassThreadId={derived.activeClassThreadId}
                currentSessionId={derived.currentSessionId}
                chatMode={state.chatMode}
                setChatMode={actions.setChatMode}
                deleteChatSession={actions.deleteChatSession}
                handleSelectSession={actions.handleSelectSession}
                handleStartNewQuest={actions.handleStartNewQuest}
                handleRenameSession={actions.handleRenameSession}
                onCreateClassThread={actions.handleCreateClassThread}
                creatingClassThreadId={meta.creatingClassThreadId}
                onSelectClassThread={actions.handleSelectClassThread}
                onRenameClassThread={actions.handleRenameClassThread}
                onDeleteClassThread={actions.handleDeleteClassThread}
                onShareSessionToClass={actions.handleShareChatSessionToClass}
                onSubmitSessionToAssignment={
                    derived.permissions.canAccessStudentAssignments
                        ? actions.handleSubmitChatSessionToAssignment
                        : undefined
                }
                handleSignOut={actions.handleSignOut}
                isLoadingSessions={derived.isLoadingSessions}
                messages={derived.messages}
                onSendMessage={actions.onSendMessage}
                uploadImage={derived.uploadImage}
                isTyping={derived.isTyping}
                handleStopGeneration={actions.handleStopGeneration}
                handleUpdateProfile={actions.handleUpdateProfile}
                onStartChat={actions.onStartChat}
                onShareChatMessageToClass={
                    actions.handleShareChatMessageToClass
                }
                onSubmitChatMessageToAssignment={
                    derived.permissions.canAccessStudentAssignments
                        ? actions.handleSubmitChatMessageToAssignment
                        : undefined
                }
                chatTargetType={derived.chatTargetType}
                classChatTarget={derived.classChatTarget}
                onCopySharedClassMessageToNewSession={
                    actions.handleCopySharedClassMessageToNewSession
                }
                classHub={classHubNode}
                submitAssignment={submitAssignmentNode}
                viewFeedback={viewFeedbackNode}
                publishAssignment={publishAssignmentNode}
                gradeAssignment={gradeAssignmentNode}
            />

            <ClassPickerPopover
                open={!!state.shareIntent}
                title="Share to class thread"
                description={derived.sharePickerDescription}
                classOptions={derived.shareableThreadGroups.map((classItem) => ({
                    id: classItem.classId,
                    name: classItem.className,
                    role: classItem.role,
                    threads: classItem.threads.map((thread) => ({
                        id: thread.id,
                        title: thread.title,
                        threadType: thread.threadType,
                    })),
                }))}
                isSubmitting={meta.isSharing}
                onSelectThread={({ classId, threadId }) =>
                    actions.handleConfirmThreadShare(classId, threadId)
                }
                onClose={() => actions.setShareIntent(null)}
            />

            <AssignmentSubmitPopover
                open={!!state.submitToAssignmentIntent}
                intentKind={state.submitToAssignmentIntent?.kind ?? null}
                options={derived.submitTargetAssignments.map((assignment) => ({
                    id: assignment.id,
                    title: assignment.title,
                    className: classNameById[assignment.classId],
                    dueAt: assignment.dueAt,
                }))}
                isSubmitting={meta.isSubmittingAssignment}
                onConfirm={(assignmentId, reflectionText) =>
                    void actions.handleConfirmSubmitToAssignment(
                        assignmentId,
                        reflectionText,
                    )
                }
                onClose={() => actions.setSubmitToAssignmentIntent(null)}
            />
        </>
    );

    return (
        <>
            <Toaster position="top-center" richColors />
            {mainNode}
        </>
    );
};
