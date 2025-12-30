import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
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
    
    // Track previous siteId to detect site changes
    const previousSiteIdRef = useRef<string | null>(null);
    // Track if building was manually set to null by user
    const userSetToNullRef = useRef<boolean>(false);

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
    // BUT: Only if no building is currently selected AND user hasn't manually set it to null
    useEffect(() => {
        const siteChanged = previousSiteIdRef.current !== null && previousSiteIdRef.current !== activeSiteId;
        const isFirstLoad = previousSiteIdRef.current === null && activeSiteId !== null;
        
        if (buildings.length > 0) {
            // Check if current building is valid
            const isCurrentBuildingValid = activeBuildingId && buildings.some(b => b.id === activeBuildingId);
            
            // Only auto-select first building if:
            // 1. Current building is invalid (not in current site's buildings) AND not null
            // 2. OR it's the first load or site just changed (activeBuildingId is null AND user hasn't manually set it)
            if (!isCurrentBuildingValid && activeBuildingId !== null) {
                // Invalid building selected - select first building
                setActiveBuildingId(buildings[0].id);
                userSetToNullRef.current = false;
            } else if (activeBuildingId === null && !userSetToNullRef.current && (siteChanged || isFirstLoad)) {
                // First load or site just changed - select first building
                setActiveBuildingId(buildings[0].id);
            }
            
            // Update previous site ref after processing
            if (siteChanged || isFirstLoad) {
                // Site changed or first load - reset user flag for next time
                userSetToNullRef.current = false;
                previousSiteIdRef.current = activeSiteId;
            }
        } else if (!activeSiteId) {
            // No site selected - reset building
            setActiveBuildingId(null);
            userSetToNullRef.current = false;
            previousSiteIdRef.current = null;
        }
    }, [buildings, activeSiteId, activeBuildingId]);

    // Wrapper for setActiveBuildingId to track user's manual null selection
    const handleBuildingChange = useCallback((id: string | null) => {
        // Check if this is a site change (site changed but building change is called)
        const siteChanged = previousSiteIdRef.current !== null && previousSiteIdRef.current !== activeSiteId;
        
        if (id === null) {
            // Only set flag to true if site hasn't changed (user manually selected "All Buildings")
            // If site changed, this is automatic reset, so don't set flag
            if (!siteChanged) {
                userSetToNullRef.current = true;
            } else {
                userSetToNullRef.current = false;
            }
        } else {
            userSetToNullRef.current = false;
        }
        setActiveBuildingId(id);
    }, [activeSiteId]);

    const isLoading = loadingSites || loadingBuildings;

    return {
        sites,
        activeSiteId,
        setActiveSiteId,
        buildings,
        activeBuildingId,
        setActiveBuildingId: handleBuildingChange,
        isLoading,
    };
}

