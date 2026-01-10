import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";

// Types
export interface CreateMaintenanceRequest {
    residentId: string;
    unitId: string;
    title: string;
    description?: string;
    category: string;
    priority: string;
    attachmentUrl?: string;
}

// Create Mutation Hook
export const useCreateMaintenanceRequest = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateMaintenanceRequest) => {
            return await api.maintenance.create(data);
        },
        onSuccess: () => {
            // Invalidate maintenance queries to refetch data
            queryClient.invalidateQueries({ queryKey: ["maintenance-requests"] });
            queryClient.invalidateQueries({ queryKey: ["maintenance-stats"] });
        },
    });
};

// Update Status Mutation Hook
export const useUpdateMaintenanceStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            status,
            completedDate,
        }: {
            id: string;
            status: string;
            completedDate?: string;
        }) => {
            return await api.maintenance.updateStatus(id, status, completedDate);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["maintenance-requests"] });
            queryClient.invalidateQueries({ queryKey: ["maintenance-stats"] });
            queryClient.invalidateQueries({ queryKey: ["maintenance-comments", variables.id] });
        },
    });
};

// Delete Mutation Hook
export const useDeleteMaintenanceRequest = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            return await api.maintenance.delete(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["maintenance-requests"] });
            queryClient.invalidateQueries({ queryKey: ["maintenance-stats"] });
        },
    });
};
