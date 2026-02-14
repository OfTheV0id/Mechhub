import { Toaster } from "sonner";
import { useAppShellState } from "@hooks";
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

    const submitAssignmentNode = derived.permissions
        .canAccessStudentAssignments ? (
        derived.hasStudentClassMembership ? (
            <SubmitAssignmentPresenter
                assignmentTitle={
                    derived.selectedClass
                        ? `${derived.assignmentFixtures.assignmentTitle} · ${derived.selectedClass.name}`
                        : derived.assignmentFixtures.assignmentTitle
                }
                assignmentDescription={
                    derived.assignmentFixtures.assignmentDescription
                }
                onSubmit={async () => {}}
                onCancel={() => actions.setActiveView("home")}
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
                assignmentTitle={derived.assignmentFixtures.assignmentTitle}
                overallScore={
                    derived.assignmentFixtures.viewFeedback.overallScore
                }
                maxScore={derived.assignmentFixtures.viewFeedback.maxScore}
                submittedDate={
                    derived.assignmentFixtures.viewFeedback.submittedDate
                }
                teacherName={
                    derived.assignmentFixtures.viewFeedback.teacherName
                }
                teacherSummary={
                    derived.assignmentFixtures.viewFeedback.teacherSummary
                }
                aiAnalysis={derived.assignmentFixtures.viewFeedback.aiAnalysis}
                gradeBreakdown={derived.assignmentFixtures.gradeBreakdown}
                keyInsights={derived.assignmentFixtures.keyInsights}
                generalComments={
                    derived.assignmentFixtures.viewFeedback.generalComments
                }
                privateNotes={
                    derived.assignmentFixtures.viewFeedback.privateNotes
                }
                onDownloadPDF={() => {}}
                onShareToClass={actions.handleShareFeedbackToClass}
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
                modules={derived.assignmentFixtures.modules}
                onPublish={async () => {}}
                onCancel={() => actions.setActiveView("home")}
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
                assignmentTitle={derived.assignmentFixtures.assignmentTitle}
                students={derived.assignmentFixtures.gradeStudents}
                onSaveGrade={async () => {}}
                onCancel={() => actions.setActiveView("home")}
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
                onShareSessionToClass={actions.handleShareChatSessionToClass}
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
                chatTargetType={derived.chatTargetType}
                classChatTarget={derived.classChatTarget}
                classHub={classHubNode}
                submitAssignment={submitAssignmentNode}
                viewFeedback={viewFeedbackNode}
                publishAssignment={publishAssignmentNode}
                gradeAssignment={gradeAssignmentNode}
            />

            <ClassPickerPopover
                open={!!state.shareIntent}
                title="Share to class"
                description={derived.sharePickerDescription}
                classOptions={derived.classOptions.map((classItem) => ({
                    id: classItem.id,
                    name: classItem.name,
                    role: classItem.role,
                }))}
                isSubmitting={meta.isSharing}
                onSelectClass={actions.handleConfirmClassShare}
                onClose={() => actions.setShareIntent(null)}
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
