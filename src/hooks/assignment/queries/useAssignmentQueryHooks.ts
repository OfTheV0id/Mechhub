import { useQuery } from "@tanstack/react-query";
import { useSessionQuery } from "../../auth/public";
import { assignmentInterface } from "../interface/assignmentInterface";
import { assignmentKeys } from "./assignmentKeys";

export const useMyAssignmentsQuery = (
    classId?: string,
    enabled = true,
    options?: {
        staleTime?: number;
        refetchInterval?: number | false;
        refetchOnMount?: boolean | "always";
    },
) => {
    const { data: session } = useSessionQuery();
    const viewerUserId = session?.user.id ?? null;

    return useQuery({
        queryKey: assignmentKeys.myAssignments(viewerUserId, classId),
        queryFn: () => assignmentInterface.listMyAssignments(classId),
        enabled: enabled && !!session,
        staleTime: options?.staleTime ?? 15_000,
        refetchInterval: options?.refetchInterval,
        refetchOnMount: options?.refetchOnMount,
    });
};

export const useClassAssignmentsQuery = (
    classId?: string,
    enabled = true,
) => {
    const { data: session } = useSessionQuery();
    const viewerUserId = session?.user.id ?? null;

    return useQuery({
        queryKey: assignmentKeys.classAssignments(
            viewerUserId,
            classId ?? "unknown",
        ),
        queryFn: () => assignmentInterface.listClassAssignments(classId ?? ""),
        enabled: enabled && !!session && !!classId,
        staleTime: 15_000,
    });
};

export const useClassAssignmentDashboardQuery = (
    classId?: string,
    enabled = true,
) => {
    const { data: session } = useSessionQuery();
    const viewerUserId = session?.user.id ?? null;

    return useQuery({
        queryKey: assignmentKeys.dashboard(viewerUserId, classId ?? "unknown"),
        queryFn: () =>
            assignmentInterface.listClassAssignmentDashboard(
                classId ?? "",
            ),
        enabled: enabled && !!session && !!classId,
        staleTime: 10_000,
    });
};

export const useAssignmentSubmissionsQuery = (
    assignmentId?: string,
    classId?: string,
    enabled = true,
) => {
    const { data: session } = useSessionQuery();
    const viewerUserId = session?.user.id ?? null;

    return useQuery({
        queryKey: assignmentKeys.assignmentSubmissions(
            viewerUserId,
            assignmentId ?? "unknown",
        ),
        queryFn: () =>
            assignmentInterface.listAssignmentSubmissions({
                assignmentId: assignmentId ?? "",
                classId,
            }),
        enabled: enabled && !!session && !!assignmentId,
        staleTime: 5_000,
    });
};

export const useMyFeedbackQuery = (
    classId?: string,
    enabled = true,
    options?: {
        staleTime?: number;
        refetchInterval?: number | false;
        refetchOnMount?: boolean | "always";
    },
) => {
    const { data: session } = useSessionQuery();
    const viewerUserId = session?.user.id ?? null;

    return useQuery({
        queryKey: assignmentKeys.myFeedback(viewerUserId, classId),
        queryFn: () => assignmentInterface.listMyFeedback(classId),
        enabled: enabled && !!session,
        staleTime: options?.staleTime ?? 15_000,
        refetchInterval: options?.refetchInterval,
        refetchOnMount: options?.refetchOnMount,
    });
};

export const useFeedbackDetailQuery = (
    submissionId?: string,
    enabled = true,
) => {
    const { data: session } = useSessionQuery();
    const viewerUserId = session?.user.id ?? null;

    return useQuery({
        queryKey: assignmentKeys.feedbackDetail(
            viewerUserId,
            submissionId ?? "unknown",
        ),
        queryFn: () =>
            assignmentInterface.getFeedbackDetail(submissionId ?? ""),
        enabled: enabled && !!session && !!submissionId,
        staleTime: 5_000,
    });
};
