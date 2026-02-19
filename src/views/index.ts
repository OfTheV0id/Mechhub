export { AuthPageView } from "./auth/AuthPageView";
export { LandingPageView } from "./landing/LandingPageView";
export { HomeView } from "./home/HomeView";
export { ChatView } from "./chat/ChatView";
export { SidebarView } from "./sidebar/SidebarView";
export { ProfileView } from "./profile/ProfileView";
export { MainLayoutView } from "./layout/MainLayoutView";
export { AuthGateView } from "./layout/AuthGateView";
export { AppLoadingView } from "./layout/AppLoadingView";
export { PermissionsConsoleView } from "./admin/PermissionsConsoleView";
export { ClassHubView, ClassMembershipNoticeView } from "./class";
export {
    SubmitAssignmentView,
    PublishAssignmentView,
    GradeAssignmentView,
    ViewFeedbackView,
} from "./assignment";

export type { ActiveView, UserProfile } from "./shared/types";
export type { StudentSubmission, GradeBreakdown, KeyInsight } from "./assignment";
export type {
    ChatMode,
    Message,
    SubmitMessage,
    FileAttachment,
    GradingResult,
    GradingStep,
    ImageGradingResult,
    ChatSession,
    DeleteChatResult,
    UploadImageHandler,
    UploadImageResult,
} from "./chat/types";
