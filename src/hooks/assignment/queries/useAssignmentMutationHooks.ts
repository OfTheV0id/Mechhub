import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSessionQuery } from "../../auth/public";
import { assignmentInterface } from "../interface/assignmentInterface";
import type {
    CreateAssignmentPayload,
    GenerateGradeDraftPayload,
    ReleaseGradePayload,
    SaveGradeReviewPayload,
    SubmitAssignmentFromChatPayload,
} from "../types";
import { assignmentKeys } from "./assignmentKeys";

const getErrorMessage = (error: unknown, fallback: string) =>
    error instanceof Error ? error.message : fallback;

const useViewerUserId = () => {
    const { data: session } = useSessionQuery();

    return session?.user.id ?? null;
};

export const useCreateAssignmentMutation = () => {
    const queryClient = useQueryClient();
    const viewerUserId = useViewerUserId();

    return useMutation({
        mutationFn: (payload: CreateAssignmentPayload) =>
            assignmentInterface.createAssignment(payload),
        onSuccess: async (assignment) => {
            toast.success("作业已创建");
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: assignmentKeys.classAssignments(
                        viewerUserId,
                        assignment.classId,
                    ),
                }),
                queryClient.invalidateQueries({
                    queryKey: assignmentKeys.myAssignments(viewerUserId, null),
                }),
                queryClient.invalidateQueries({
                    queryKey: assignmentKeys.dashboard(
                        viewerUserId,
                        assignment.classId,
                    ),
                }),
            ]);
        },
        onError: (error) => {
            toast.error(getErrorMessage(error, "创建作业失败"));
        },
    });
};

export const useSubmitAssignmentFromChatMutation = () => {
    const queryClient = useQueryClient();
    const viewerUserId = useViewerUserId();

    return useMutation({
        mutationFn: (payload: SubmitAssignmentFromChatPayload) =>
            assignmentInterface.submitAssignmentFromChat(payload),
        onSuccess: async (submission) => {
            toast.success("作业提交成功");
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: assignmentKeys.myAssignments(
                        viewerUserId,
                        submission.classId,
                    ),
                }),
                queryClient.invalidateQueries({
                    queryKey: assignmentKeys.myFeedback(
                        viewerUserId,
                        submission.classId,
                    ),
                }),
                queryClient.invalidateQueries({
                    queryKey: assignmentKeys.assignmentSubmissions(
                        viewerUserId,
                        submission.assignmentId,
                    ),
                }),
                queryClient.invalidateQueries({
                    queryKey: assignmentKeys.dashboard(
                        viewerUserId,
                        submission.classId,
                    ),
                }),
            ]);
        },
        onError: (error) => {
            toast.error(getErrorMessage(error, "提交作业失败"));
        },
    });
};

export const useGenerateGradeDraftMutation = () => {
    const queryClient = useQueryClient();
    const viewerUserId = useViewerUserId();

    return useMutation({
        mutationFn: (payload: GenerateGradeDraftPayload) =>
            assignmentInterface.generateGradeDraft(payload),
        onSuccess: async (result) => {
            toast.success("AI 批改草稿已生成");
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: assignmentKeys.feedbackDetail(
                        viewerUserId,
                        result.submissionId,
                    ),
                }),
                queryClient.invalidateQueries({
                    queryKey: assignmentKeys.all(viewerUserId),
                }),
            ]);
        },
        onError: (error) => {
            toast.error(getErrorMessage(error, "生成草稿失败"));
        },
    });
};

export const useSaveGradeReviewMutation = () => {
    const queryClient = useQueryClient();
    const viewerUserId = useViewerUserId();

    return useMutation({
        mutationFn: (payload: SaveGradeReviewPayload) =>
            assignmentInterface.saveGradeReview(payload),
        onSuccess: async (result) => {
            toast.success("评分草稿已保存");
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: assignmentKeys.feedbackDetail(
                        viewerUserId,
                        result.submissionId,
                    ),
                }),
                queryClient.invalidateQueries({
                    queryKey: assignmentKeys.all(viewerUserId),
                }),
            ]);
        },
        onError: (error) => {
            toast.error(getErrorMessage(error, "保存评分失败"));
        },
    });
};

export const useReleaseGradeMutation = () => {
    const queryClient = useQueryClient();
    const viewerUserId = useViewerUserId();

    return useMutation({
        mutationFn: (payload: ReleaseGradePayload) =>
            assignmentInterface.releaseGrade(payload),
        onSuccess: async (result) => {
            toast.success("反馈已发布给学生");
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: assignmentKeys.feedbackDetail(
                        viewerUserId,
                        result.submissionId,
                    ),
                }),
                queryClient.invalidateQueries({
                    queryKey: assignmentKeys.myFeedback(viewerUserId, null),
                }),
                queryClient.invalidateQueries({
                    queryKey: assignmentKeys.all(viewerUserId),
                }),
            ]);
        },
        onError: (error) => {
            toast.error(getErrorMessage(error, "发布反馈失败"));
        },
    });
};
