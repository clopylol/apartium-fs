import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { AnnouncementFormData } from '@/types';
import { showSuccess, showError } from '@/utils/toast';

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
            queryClient.invalidateQueries({ queryKey: ['announcementStats'] });
            showSuccess('Duyuru başarıyla oluşturuldu');
        },
        onError: (error: Error) => {
            showError(error.message || 'Duyuru oluşturulurken bir hata oluştu');
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<AnnouncementFormData> }) => 
            api.announcements.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['announcements'] });
            queryClient.invalidateQueries({ queryKey: ['announcementStats'] });
            showSuccess('Duyuru başarıyla güncellendi');
        },
        onError: (error: Error) => {
            showError(error.message || 'Duyuru güncellenirken bir hata oluştu');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => api.announcements.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['announcements'] });
            queryClient.invalidateQueries({ queryKey: ['announcementStats'] });
            showSuccess('Duyuru başarıyla silindi');
        },
        onError: (error: Error) => {
            showError(error.message || 'Duyuru silinirken bir hata oluştu');
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

