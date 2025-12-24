import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { CommunityRequestFormData, PollFormData } from '@/types';
import { showSuccess, showError } from '@/utils/toast';

/**
 * Hook for community CRUD mutations
 * Automatically invalidates community cache on success
 */
export function useCommunityMutations() {
    const queryClient = useQueryClient();

    // Request mutations
    const createRequestMutation = useMutation({
        mutationFn: (data: CommunityRequestFormData) => api.community.createRequest(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['community'] });
            showSuccess('Talep başarıyla oluşturuldu');
        },
        onError: (error: Error) => {
            showError(error.message || 'Talep oluşturulurken bir hata oluştu');
        },
    });

    const updateRequestTypeMutation = useMutation({
        mutationFn: ({ id, type }: { id: string; type: 'wish' | 'suggestion' }) => 
            api.community.updateRequestType(id, type),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['community'] });
            showSuccess('Talep tipi başarıyla güncellendi');
        },
        onError: (error: Error) => {
            showError(error.message || 'Talep tipi güncellenirken bir hata oluştu');
        },
    });

    const updateRequestStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) => 
            api.community.updateRequestStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['community'] });
            showSuccess('Talep durumu başarıyla güncellendi');
        },
        onError: (error: Error) => {
            showError(error.message || 'Talep durumu güncellenirken bir hata oluştu');
        },
    });

    const deleteRequestMutation = useMutation({
        mutationFn: (id: string) => api.community.deleteRequest(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['community'] });
            showSuccess('Talep başarıyla silindi');
        },
        onError: (error: Error) => {
            showError(error.message || 'Talep silinirken bir hata oluştu');
        },
    });

    // Poll mutations
    const createPollMutation = useMutation({
        mutationFn: (data: PollFormData) => api.community.createPoll(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['community'] });
            showSuccess('Anket başarıyla oluşturuldu');
        },
        onError: (error: Error) => {
            showError(error.message || 'Anket oluşturulurken bir hata oluştu');
        },
    });

    const updatePollStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string; status: 'active' | 'closed' }) => 
            api.community.updatePollStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['community'] });
            showSuccess('Anket durumu başarıyla güncellendi');
        },
        onError: (error: Error) => {
            showError(error.message || 'Anket durumu güncellenirken bir hata oluştu');
        },
    });

    const deletePollMutation = useMutation({
        mutationFn: (id: string) => api.community.deletePoll(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['community'] });
            showSuccess('Anket başarıyla silindi');
        },
        onError: (error: Error) => {
            showError(error.message || 'Anket silinirken bir hata oluştu');
        },
    });

    const voteMutation = useMutation({
        mutationFn: ({ pollId, residentId, choice }: { pollId: string; residentId: string; choice: 'yes' | 'no' }) => 
            api.community.vote(pollId, residentId, choice),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['community', 'polls'] });
            showSuccess('Oyunuz başarıyla kaydedildi');
        },
        onError: (error: Error) => {
            showError(error.message || 'Oy kullanılırken bir hata oluştu');
        },
    });

    return {
        // Request actions
        createRequest: createRequestMutation.mutate,
        updateRequestType: updateRequestTypeMutation.mutate,
        updateRequestStatus: updateRequestStatusMutation.mutate,
        deleteRequest: deleteRequestMutation.mutate,

        // Poll actions
        createPoll: createPollMutation.mutate,
        updatePollStatus: updatePollStatusMutation.mutate,
        deletePoll: deletePollMutation.mutate,
        vote: voteMutation.mutate,

        // Loading states
        isCreatingRequest: createRequestMutation.isPending,
        isUpdatingRequestType: updateRequestTypeMutation.isPending,
        isUpdatingRequestStatus: updateRequestStatusMutation.isPending,
        isDeletingRequest: deleteRequestMutation.isPending,
        isCreatingPoll: createPollMutation.isPending,
        isUpdatingPollStatus: updatePollStatusMutation.isPending,
        isDeletingPoll: deletePollMutation.isPending,
        isVoting: voteMutation.isPending,

        // Errors
        createRequestError: createRequestMutation.error,
        updateRequestTypeError: updateRequestTypeMutation.error,
        updateRequestStatusError: updateRequestStatusMutation.error,
        deleteRequestError: deleteRequestMutation.error,
        createPollError: createPollMutation.error,
        updatePollStatusError: updatePollStatusMutation.error,
        deletePollError: deletePollMutation.error,
        voteError: voteMutation.error,
    };
}

