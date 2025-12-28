import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { showSuccess, showError } from '@/utils/toast';

export function useParkingMutations(buildingId: string | null) {
    const queryClient = useQueryClient();

    const createParkingSpot = useMutation({
        mutationFn: api.residents.createParkingSpot,
        onSuccess: () => {
            if (buildingId) {
                queryClient.invalidateQueries({ queryKey: ['residents', 'building-data', buildingId] });
            }
            showSuccess('Park yeri başarıyla eklendi');
        },
        onError: (error: Error) => {
            showError(error.message || 'Park yeri eklenirken hata oluştu');
        },
    });

    const updateParkingSpot = useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) =>
            api.residents.updateParkingSpot(id, data),
        onSuccess: () => {
            if (buildingId) {
                queryClient.invalidateQueries({ queryKey: ['residents', 'building-data', buildingId] });
            }
            showSuccess('Park yeri başarıyla güncellendi');
        },
        onError: (error: Error) => {
            showError(error.message || 'Park yeri güncellenirken hata oluştu');
        },
    });

    const deleteParkingSpot = useMutation({
        mutationFn: api.residents.deleteParkingSpot,
        onSuccess: () => {
            if (buildingId) {
                queryClient.invalidateQueries({ queryKey: ['residents', 'building-data', buildingId] });
            }
            showSuccess('Park yeri başarıyla silindi');
        },
        onError: (error: Error) => {
            showError(error.message || 'Park yeri silinirken hata oluştu');
        },
    });

    return {
        createParkingSpot,
        updateParkingSpot,
        deleteParkingSpot,
    };
}

