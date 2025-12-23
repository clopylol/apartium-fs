import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { AnnouncementFormData } from '@/types';

/**
 * Hook for announcement CRUD mutations
 * Automatically invalidates announcements cache on success
 */
export function useAnnouncementMutations() {
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: (data: AnnouncementFormData) => api.announcements.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['announcements'] });
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<AnnouncementFormData> }) => 
            api.announcements.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['announcements'] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => api.announcements.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['announcements'] });
        },
    });

    return {
        createAnnouncement: createMutation.mutate,
        updateAnnouncement: updateMutation.mutate,
        deleteAnnouncement: deleteMutation.mutate,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
        createError: createMutation.error,
        updateError: updateMutation.error,
        deleteError: deleteMutation.error,
    };
}

