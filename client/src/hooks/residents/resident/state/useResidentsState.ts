import { useState, useEffect, useMemo } from "react";
import type { Building, UnitWithResidents, Site } from "@/types/residents.types";
import { ITEMS_PER_PAGE } from "@/constants/residents.constants";
import { useBuildings, useBuildingData } from "@/hooks/residents/api";
import { useSites } from "@/hooks/residents/site";

export interface ResidentsStateReturn {
    // Core State
    sites: Site[];
    activeSiteId: string | null;
    setActiveSiteId: (id: string) => void;
    buildings: Building[];
    setBuildings: React.Dispatch<React.SetStateAction<Building[]>>;
    activeBlockId: string | null;
    setActiveBlockId: (id: string) => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;

    // Loading States (Granular)
    loadingStates: {
        buildings: boolean;
        residents: boolean;
        parking: boolean;
        guests: boolean;
    };
    isAnyLoading: boolean; // Convenience flag for global loading

    // View State
    residentViewMode: "grid" | "list";
    setResidentViewMode: (mode: "grid" | "list") => void;
    currentPage: number;
    setCurrentPage: (page: number) => void;

    // Computed Values
    activeBlock: Building | undefined;
    units: UnitWithResidents[];
    filteredUnits: UnitWithResidents[];
    paginatedUnits: UnitWithResidents[];
    stats: {
        total: number;
        occupied: number;
        empty: number;
    };
}

export function useResidentsState(): ResidentsStateReturn {
    // Core State
    const [activeSiteId, setActiveSiteId] = useState<string | null>(null);
    const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    // View State
    const [residentViewMode, setResidentViewMode] = useState<"grid" | "list">("grid");
    const [currentPage, setCurrentPage] = useState(1);

    // ✅ Fetch sites from API
    const { sites, isLoading: loadingSites } = useSites();

    // ✅ Fetch buildings from API
    const { data: buildingsData, isLoading: loadingBuildings } = useBuildings();
    const allBuildings = buildingsData?.buildings || [];

    // ✅ Filter buildings by active site
    const buildings = useMemo(() => {
        if (!activeSiteId) return [];
        return allBuildings.filter((b: Building) => b.siteId === activeSiteId);
    }, [allBuildings, activeSiteId]);

    // ✅ Fetch active building's full data (lazy loading)
    const { data: buildingData, isLoading: loadingBuildingData } = useBuildingData(activeBlockId);

    // Set first site as active on load
    useEffect(() => {
        if (sites.length > 0 && !activeSiteId) {
            setActiveSiteId(sites[0].id);
        }
    }, [sites, activeSiteId]);

    // Set first building as active when site changes
    useEffect(() => {
        if (buildings.length > 0 && !activeBlockId) {
            setActiveBlockId(buildings[0].id);
        }
    }, [buildings, activeBlockId]);

    // Reset block selection when site changes
    useEffect(() => {
        if (activeSiteId) {
            setActiveBlockId(null);
        }
    }, [activeSiteId]);

    // Reset Page on Filter Change
    useEffect(() => {
        setCurrentPage(1);
    }, [activeBlockId, searchTerm]);

    // Computed: Active Block
    const activeBlock = useMemo(
        () => buildings.find((b: Building) => b.id === activeBlockId),
        [buildings, activeBlockId]
    );

    // Units from building data
    const units = buildingData?.units || [];

    // Computed: Filtered Units
    const filteredUnits = useMemo(() => {
        if (!searchTerm) return units;

        return units.filter((unit) => {
            const term = searchTerm.toLowerCase();
            const matchesSearch =
                unit.number.includes(term) ||
                unit.residents.some(
                    (r) =>
                        r.name.toLowerCase().includes(term) ||
                        r.phone.includes(term) ||
                        r.vehicles.some((v) =>
                            v.plate.toLowerCase().replace(/\s/g, "").includes(term.replace(/\s/g, ""))
                        )
                );
            return matchesSearch;
        });
    }, [units, searchTerm]);

    // Computed: Paginated Units
    const paginatedUnits = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredUnits.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredUnits, currentPage]);

    // Computed: Stats
    const stats = useMemo(() => {
        const totalUnits = units.length;
        const occupiedUnits = units.filter((u) => u.status === "occupied").length;

        return {
            total: totalUnits,
            occupied: occupiedUnits,
            empty: totalUnits - occupiedUnits,
        };
    }, [units]);

    // Loading States
    const loadingStates = useMemo(() => ({
        sites: loadingSites,
        buildings: loadingBuildings,
        residents: loadingBuildingData,
        parking: false, // Will be set by parking hook
        guests: false,  // Will be set by guests hook
    }), [loadingSites, loadingBuildings, loadingBuildingData]);

    // Computed: Any Loading
    const isAnyLoading = useMemo(
        () => Object.values(loadingStates).some(loading => loading),
        [loadingStates]
    );

    // Dummy setBuildings for compatibility (not used with API)
    const setBuildings = () => {
        console.warn('setBuildings is deprecated with API usage');
    };

    return {
        // Core State
        sites,
        activeSiteId,
        setActiveSiteId,
        buildings,
        setBuildings,
        activeBlockId,
        setActiveBlockId,
        searchTerm,
        setSearchTerm,

        // Loading States
        loadingStates,
        isAnyLoading,

        // View State
        residentViewMode,
        setResidentViewMode,
        currentPage,
        setCurrentPage,

        // Computed Values
        activeBlock,
        units,
        filteredUnits,
        paginatedUnits,
        stats,
    };
}
