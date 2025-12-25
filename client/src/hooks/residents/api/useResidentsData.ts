import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { BuildingDataResponse } from '@/types/residents.types';
import type { VehicleBrand, VehicleModel } from 'apartium-shared';
import { getCachedBrands, setCachedBrands, getCachedModels, setCachedModels } from '@/utils/vehicleCache';

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

/**
 * Fetch all vehicle brands
 * Uses localStorage cache for performance - brands don't change often
 * React Query'nin stale-while-revalidate pattern'ini kullanır
 */
export function useVehicleBrands() {
    // localStorage'dan initial data'yı al (sayfa yenilendiğinde hızlı yükleme için)
    const cachedBrands = getCachedBrands();
    
    return useQuery<{ brands: VehicleBrand[] }>({
        queryKey: ['vehicle-brands'],
        queryFn: async () => {
            const data = await api.vehicleBrands.getAll();
            // API'den gelen fresh data'yı localStorage'a kaydet
            setCachedBrands(data);
            return data;
        },
        // localStorage'dan initial data kullan (sayfa yenilendiğinde anında göster)
        placeholderData: cachedBrands || undefined,
        // React Query'nin kendi cache mekanizması
        staleTime: 24 * 60 * 60 * 1000, // 24 saat (brands çok nadiren değişir)
        gcTime: 7 * 24 * 60 * 60 * 1000, // 7 gün garbage collection
        // Arka planda fresh data çek (stale-while-revalidate)
        refetchOnMount: true,
        refetchOnWindowFocus: false, // Window focus'ta refetch yapma (gereksiz)
    });
}

/**
 * Fetch vehicle models by brand ID
 * Uses localStorage cache for performance - models don't change often
 * React Query'nin stale-while-revalidate pattern'ini kullanır
 */
export function useVehicleModels(brandId: string | null) {
    // localStorage'dan initial data'yı al (sayfa yenilendiğinde hızlı yükleme için)
    const cachedModels = brandId ? getCachedModels(brandId) : null;
    
    return useQuery<{ models: VehicleModel[] }>({
        queryKey: ['vehicle-models', brandId],
        queryFn: async () => {
            if (!brandId) return { models: [] };
            
            const data = await api.vehicleBrands.getModelsByBrandId(brandId);
            // API'den gelen fresh data'yı localStorage'a kaydet
            setCachedModels(brandId, data);
            return data;
        },
        enabled: !!brandId, // Only fetch when brandId exists
        // localStorage'dan initial data kullan (sayfa yenilendiğinde anında göster)
        placeholderData: cachedModels || undefined,
        // React Query'nin kendi cache mekanizması
        staleTime: 24 * 60 * 60 * 1000, // 24 saat (models çok nadiren değişir)
        gcTime: 7 * 24 * 60 * 60 * 1000, // 7 gün garbage collection
        // Arka planda fresh data çek (stale-while-revalidate)
        refetchOnMount: true,
        refetchOnWindowFocus: false, // Window focus'ta refetch yapma (gereksiz)
    });
}

