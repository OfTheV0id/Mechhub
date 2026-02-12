import { Toaster } from "sonner";
import {
    useAuthFlow,
    useChatRuntimeFlow,
    useChatSessionsFlow,
    useAppView,
    chatUseCases,
} from "@hooks";
import { AppLoadingView } from "@views/layout/AppLoadingView";
import { AuthGatePresenter } from "./AuthGatePresenter";
import { LandingPagePresenter } from "./LandingPagePresenter";
import { MainLayoutPresenter } from "./MainLayoutPresenter";
import { SubmitAssignmentPresenter } from "./SubmitAssignmentPresenter";
import { ViewFeedbackPresenter } from "./ViewFeedbackPresenter";
import { PublishAssignmentPresenter } from "./PublishAssignmentPresenter";
import { GradeAssignmentPresenter } from "./GradeAssignmentPresenter";

export const AppPresenter = () => {
    const {
        session,
        loading,
        showAuth,
        setShowAuth,
        userProfile,
        handleUpdateProfile,
        handleSignOut,
    } = useAuthFlow();

    const {
        chatSessions,
        isLoadingSessions,
        currentSessionId,
        chatMode,
        setChatMode,
        deleteChatSession,
        handleSelectSession,
        handleStartNewQuest,
        handleRenameSession,
        messages,
        setCurrentSessionId,
    } = useChatSessionsFlow(session);

    const { isTyping, handleSendMessage, handleStopGeneration } =
        useChatRuntimeFlow({
            currentSessionId,
            setCurrentSessionId,
        });

    const { activeView, setActiveView, onSendMessage, onStartChat } =
        useAppView({ handleSendMessage });

    const uploadImage = chatUseCases.storagePort.uploadImage;

    if (loading) {
        return <AppLoadingView />;
    }

    if (!session) {
        return (
            <>
                <Toaster position="top-center" richColors />
                <AuthGatePresenter
                    showAuth={showAuth}
                    setShowAuth={setShowAuth}
                />
            </>
        );
    }

    if (activeView === "landing") {
        return (
            <>
                <Toaster position="top-center" richColors />
                <LandingPagePresenter
                    onStart={() => setActiveView("home")}
                    onLogin={() => setActiveView("home")}
                />
            </>
        );
    }

    return (
        <>
            <Toaster position="top-center" richColors />
            <MainLayoutPresenter
                activeView={activeView}
                setActiveView={setActiveView}
                userProfile={userProfile}
                chatSessions={chatSessions}
                currentSessionId={currentSessionId}
                chatMode={chatMode}
                setChatMode={setChatMode}
                deleteChatSession={deleteChatSession}
                handleSelectSession={handleSelectSession}
                handleStartNewQuest={handleStartNewQuest}
                handleRenameSession={handleRenameSession}
                handleSignOut={handleSignOut}
                isLoadingSessions={isLoadingSessions}
                messages={messages}
                onSendMessage={onSendMessage}
                uploadImage={uploadImage}
                isTyping={isTyping}
                handleStopGeneration={handleStopGeneration}
                handleUpdateProfile={handleUpdateProfile}
                onStartChat={onStartChat}
                submitAssignment={
                    <SubmitAssignmentPresenter
                        assignmentTitle="Statics: Equilibrium of Rigid Bodies"
                        assignmentDescription="Upload your solution for 'Statics: Equilibrium of Rigid Bodies'. AI will analyze your steps and provide instant feedback."
                        onSubmit={async () => {}}
                        onCancel={() => setActiveView("home")}
                    />
                }
                viewFeedback={
                    <ViewFeedbackPresenter
                        assignmentTitle="Statics: Equilibrium of Rigid Bodies"
                        overallScore={85}
                        maxScore={100}
                        submittedDate="Oct 12, 2023"
                        teacherName="Prof. Sarah Chen"
                        teacherSummary="Strong conceptual understanding. Minor sign error in the uniform load moment calculation."
                        aiAnalysis="The Free Body Diagram is well-drawn and correctly identifies all external forces and moments. The moment equation for the uniform load shows good understanding but had a sign convention error."
                        gradeBreakdown={[
                            { category: "Method", score: 30, maxScore: 30, color: "green" },
                            { category: "Accuracy", score: 35, maxScore: 50, color: "yellow" },
                            { category: "Formatting", score: 20, maxScore: 20, color: "green" },
                        ]}
                        keyInsights={[
                            {
                                title: "Good FBD Isolation",
                                description: "You correctly identified all external forces acting on the beam.",
                                type: "success",
                            },
                            {
                                title: "Moment Equation (Step 2)",
                                description: "Sign convention error in the uniform load's moment calculation. The load should be negative per your convention.",
                                type: "error",
                            },
                        ]}
                        generalComments="Great work overall! See annotated notes."
                        privateNotes="Needs review on moments topic."
                        onDownloadPDF={() => {}}
                    />
                }
                publishAssignment={
                    <PublishAssignmentPresenter
                        modules={[
                            "Statics of Rigid Bodies",
                            "Dynamics I",
                            "Mechanics of Materials",
                        ]}
                        onPublish={async () => {}}
                        onCancel={() => setActiveView("home")}
                    />
                }
                gradeAssignment={
                    <GradeAssignmentPresenter
                        assignmentTitle="Statics: Equilibrium of Rigid Bodies"
                        students={[
                            {
                                id: "1",
                                studentName: "Oliver Thompson",
                                submittedDate: "Submitted 2h ago",
                                status: "pending",
                                submission:
                                    "https://via.placeholder.com/800x600?text=Student+Submission",
                            },
                            {
                                id: "2",
                                studentName: "Jane Doe",
                                submittedDate: "Graded",
                                status: "graded",
                                submission:
                                    "https://via.placeholder.com/800x600?text=Student+Submission",
                            },
                            {
                                id: "3",
                                studentName: "Li Wei",
                                submittedDate: "Not submitted",
                                status: "pending",
                                submission:
                                    "https://via.placeholder.com/800x600?text=Student+Submission",
                            },
                        ]}
                        onSaveGrade={async () => {}}
                        onCancel={() => setActiveView("home")}
                    />
                }
            />
        </>
    );
};
