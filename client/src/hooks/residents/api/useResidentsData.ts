import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { BuildingDataResponse } from '@/types/residents.types';

/**
 * Fetch full building data with nested relationships
 * Uses JOIN on backend to avoid waterfall requests
 */
export function useBuildingData(buildingId: string | null) {
    return useQuery<BuildingDataResponse>({
        queryKey: ['residents', 'building-data', buildingId],
        queryFn: () => api.residents.getBuildingData(buildingId!),
        enabled: !!buildingId, // Only fetch when buildingId exists
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

export function useBuildings() {
    return useQuery({
        queryKey: ['buildings'],
        queryFn: () => api.buildings.getAll(),
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
}

