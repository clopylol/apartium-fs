import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { showSuccess, showError } from '@/utils/toast';

export function useResidentMutations(buildingId: string | null) {
    const queryClient = useQueryClient();

    const createResident = useMutation({
        mutationFn: api.residents.createResident,
        onSuccess: () => {
            if (buildingId) {
                queryClient.invalidateQueries({ queryKey: ['residents', 'building-data', buildingId] });
            }
            showSuccess('Sakin başarıyla eklendi');
        },
        onError: (error: Error) => {
            showError(error.message || 'Sakin eklenirken hata oluştu');
        },
    });

    const updateResident = useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) =>
            api.residents.updateResident(id, data),
        onSuccess: () => {
            if (buildingId) {
                queryClient.invalidateQueries({ queryKey: ['residents', 'building-data', buildingId] });
            }
            showSuccess('Sakin başarıyla güncellendi');
        },
        onError: (error: Error) => {
            showError(error.message || 'Sakin güncellenirken hata oluştu');
        },
    });

    const deleteResident = useMutation({
        mutationFn: api.residents.deleteResident,
        onSuccess: () => {
            if (buildingId) {
                queryClient.invalidateQueries({ queryKey: ['residents', 'building-data', buildingId] });
            }
            showSuccess('Sakin başarıyla silindi');
        },
        onError: (error: Error) => {
            showError(error.message || 'Sakin silinirken hata oluştu');
        },
    });

    return {
        createResident,
        updateResident,
        deleteResident,
    };
}

