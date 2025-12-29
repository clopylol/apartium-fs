import { useState, useEffect, useMemo } from 'react';
import type { Building, Site } from '@/types/residents.types';
import { useBuildings } from '@/hooks/residents/api/useResidentsData';
import { useSites } from '@/hooks/residents/site/useSites';

export interface PaymentsStateReturn {
    // Core State
    sites: Site[];
    activeSiteId: string | null;
    setActiveSiteId: (id: string) => void;
    buildings: Building[];
    activeBuildingId: string | null;
    setActiveBuildingId: (id: string | null) => void;
    
    // Loading States
    isLoading: boolean;
}

export function usePaymentsState(): PaymentsStateReturn {
    // Core State
    const [activeSiteId, setActiveSiteId] = useState<string | null>(null);
    const [activeBuildingId, setActiveBuildingId] = useState<string | null>(null);

    // Fetch sites from API
    const { sites, isLoading: loadingSites } = useSites();

    // Fetch buildings from API
    const { data: buildingsData, isLoading: loadingBuildings } = useBuildings();
    const allBuildings = buildingsData?.buildings || [];

    // Filter buildings by active site
    const buildings = useMemo(() => {
        if (!activeSiteId) return [];
        return allBuildings.filter((b: Building) => b.siteId === activeSiteId);
    }, [allBuildings, activeSiteId]);

    // Set first site as active on load
    useEffect(() => {
        if (sites.length > 0 && !activeSiteId) {
            setActiveSiteId(sites[0].id);
        }
    }, [sites, activeSiteId]);

    // Set first building as active when buildings are loaded or site changes
    useEffect(() => {
        if (buildings.length > 0) {
            // Eğer hiç aktif building yoksa veya aktif building bu site'ın buildings'lerinden değilse, ilk building'i seç
            const isCurrentBuildingValid = activeBuildingId && buildings.some(b => b.id === activeBuildingId);
            if (!isCurrentBuildingValid) {
                setActiveBuildingId(buildings[0].id);
            }
        } else if (!activeSiteId) {
            // Hiç site seçili değilse building'i de sıfırla
            setActiveBuildingId(null);
        }
    }, [buildings, activeSiteId, activeBuildingId]);

    const isLoading = loadingSites || loadingBuildings;

    return {
        sites,
        activeSiteId,
        setActiveSiteId,
        buildings,
        activeBuildingId,
        setActiveBuildingId,
        isLoading,
    };
}

