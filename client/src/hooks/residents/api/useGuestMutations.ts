import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { showSuccess, showError } from '@/utils/toast';

export function useGuestMutations() {
    const queryClient = useQueryClient();

    const createGuest = useMutation({
        mutationFn: api.residents.createGuestVisit,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['guest-visits'] });
            showSuccess('Misafir kaydı oluşturuldu');
        },
        onError: (error: Error) => {
            showError(error.message || 'Misafir kaydı oluşturulamadı');
        },
    });

    const updateGuestStatus = useMutation({
        mutationFn: ({ id, status, timestamp }: { id: string; status: string; timestamp?: Date }) =>
            api.residents.updateGuestVisitStatus(id, status, timestamp),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['guest-visits'] });
            showSuccess('Misafir durumu güncellendi');
        },
        onError: (error: Error) => {
            showError(error.message || 'Durum güncellenemedi');
        },
    });

    const updateGuest = useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) =>
            api.residents.updateGuestVisit(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['guest-visits'] });
            showSuccess('Misafir kaydı güncellendi');
        },
        onError: (error: Error) => {
            showError(error.message || 'Kayıt güncellenemedi');
        },
    });

    const deleteGuest = useMutation({
        mutationFn: api.residents.deleteGuestVisit,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['guest-visits'] });
            showSuccess('Misafir kaydı silindi');
        },
        onError: (error: Error) => {
            showError(error.message || 'Kayıt silinemedi');
        },
    });

    return {
        createGuest,
        updateGuestStatus,
        updateGuest,
        deleteGuest,
    };
}

