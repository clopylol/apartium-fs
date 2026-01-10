import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface MaintenanceComment {
    id: string;
    requestId: string;
    authorId: string;
    message: string;
    isSystem: boolean;
    createdAt: string;
    authorName?: string | null;
    authorAvatar?: string | null;
}

export const useMaintenanceComments = (requestId: string) => {
    return useQuery({
        queryKey: ["maintenance-comments", requestId],
        queryFn: async () => {
            // We need to implement this endpoint in api.ts first!
            // api.ts does not have getComments yet.
            // I will use apiClient directly for now or update api.ts.
            // Updating api.ts is cleaner.
            // But for now I will assume I can extend api object here or import apiClient.
            // Let's import apiClient.
            return await api.maintenance.getComments(requestId);
        },
        enabled: !!requestId,
    });
};

export const useCreateMaintenanceComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ requestId, message }: { requestId: string; message: string }) => {
            return await api.maintenance.createComment(requestId, { message });
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["maintenance-comments", variables.requestId] });
        },
    });
};
