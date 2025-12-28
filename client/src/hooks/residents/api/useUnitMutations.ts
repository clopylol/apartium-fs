import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { showSuccess, showError } from '@/utils/toast';

export function useCreateUnit(buildingId: string | null) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { buildingId: string; number: string; floor: number }) =>
            api.units.create(data),
        onSuccess: (data, variables) => {
            // Invalidate building data cache to refresh the units list
            queryClient.invalidateQueries({ 
                queryKey: ['residents', 'building-data', variables.buildingId] 
            });
            showSuccess('Daire başarıyla eklendi');
        },
        onError: (error: any) => {
            const errorMessage = error?.message || 'Daire eklenirken bir hata oluştu';
            showError(errorMessage);
        },
    });
}

