import { useState, useEffect, useMemo, useCallback } from "react";
import type { Building, UnitWithResidents, Site } from "@/types/residents.types";
import { ITEMS_PER_PAGE } from "@/constants/residents.constants";
import { useBuildings, useBuildingData } from "@/hooks/residents/api";
import { useSites } from "@/hooks/residents/site";
import { useDebounce } from "@/hooks/useDebounce";

const DEBOUNCE_DELAY = 300; // 300ms debounce delay

export interface ResidentsStateReturn {
    // Core State
    sites: Site[];
    activeSiteId: string | null;
    setActiveSiteId: (id: string) => void;
    buildings: Building[];
    setBuildings: React.Dispatch<React.SetStateAction<Building[]>>;
    activeBlockId: string | null;
    setActiveBlockId: (id: string) => void;
    localSearchTerm: string;
    setLocalSearchTerm: (term: string) => void;
    debouncedSearchTerm: string;

    // Filter State
    typeFilter: "all" | "owner" | "tenant";
    setTypeFilter: (value: "all" | "owner" | "tenant") => void;
    unitStatusFilter: "all" | "occupied" | "empty";
    setUnitStatusFilter: (value: "all" | "occupied" | "empty") => void;
    vehicleFilter: "all" | "with" | "without";
    setVehicleFilter: (value: "all" | "with" | "without") => void;
    floorFilter: "all" | number;
    setFloorFilter: (value: "all" | number) => void;
    availableFloors: number[];
    clearAllFilters: () => void;

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
    const [localSearchTerm, setLocalSearchTerm] = useState("");

    // Debounced search term
    const debouncedSearchTerm = useDebounce(localSearchTerm, DEBOUNCE_DELAY);

    // View State
    const [residentViewMode, setResidentViewMode] = useState<"grid" | "list">("grid");
    const [currentPage, setCurrentPage] = useState(1);

    // Filter State
    const [typeFilter, setTypeFilter] = useState<"all" | "owner" | "tenant">("all");
    const [unitStatusFilter, setUnitStatusFilter] = useState<"all" | "occupied" | "empty">("all");
    const [vehicleFilter, setVehicleFilter] = useState<"all" | "with" | "without">("all");
    const [floorFilter, setFloorFilter] = useState<"all" | number>("all");

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

    // Set first building as active when buildings are loaded or site changes
    useEffect(() => {
        if (buildings.length > 0) {
            // Eğer hiç aktif blok yoksa veya aktif blok bu sitenin bloklarından değilse, ilk blok'u seç
            const isCurrentBlockValid = activeBlockId && buildings.some(b => b.id === activeBlockId);
            if (!isCurrentBlockValid) {
                setActiveBlockId(buildings[0].id);
            }
        } else if (!activeSiteId) {
            // Hiç site seçili değilse blok'u da sıfırla
            setActiveBlockId(null);
        }
    }, [buildings, activeSiteId, activeBlockId]);

    // Reset Page on Filter Change
    useEffect(() => {
        setCurrentPage(1);
    }, [activeBlockId, debouncedSearchTerm, typeFilter, unitStatusFilter, vehicleFilter, floorFilter]);

    // Computed: Active Block (merge with buildingData to include parkingSpots and units)
    const activeBlock = useMemo(() => {
        const baseBuilding = buildings.find((b: Building) => b.id === activeBlockId);
        if (!baseBuilding) return undefined;
        
        // Merge with buildingData to include parkingSpots and units
        if (buildingData) {
            return {
                ...baseBuilding,
                parkingSpots: buildingData.parkingSpots || [],
                units: buildingData.units || [],
            };
        }
        
        return baseBuilding;
    }, [buildings, activeBlockId, buildingData]);

    // Units from building data
    const units = buildingData?.units || [];

    // Computed: Available Floors
    const availableFloors = useMemo(() => {
        const floors = new Set<number>();
        units.forEach((unit) => floors.add(unit.floor));
        return Array.from(floors).sort((a, b) => a - b);
    }, [units]);

    // Computed: Filtered Units
    const filteredUnits = useMemo(() => {
        let filtered = units;

        // Search filter (using debounced search term)
        if (debouncedSearchTerm) {
            const term = debouncedSearchTerm.toLowerCase();
            filtered = filtered.filter((unit) => {
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
        }

        // Type filter
        if (typeFilter !== "all") {
            filtered = filtered.filter((unit) =>
                unit.residents.some((r) => r.type === typeFilter)
            );
        }

        // Unit Status filter
        if (unitStatusFilter !== "all") {
            filtered = filtered.filter((unit) => unit.status === unitStatusFilter);
        }

        // Vehicle filter
        if (vehicleFilter !== "all") {
            if (vehicleFilter === "with") {
                filtered = filtered.filter((unit) =>
                    unit.residents.some((r) => r.vehicles.length > 0)
                );
            } else {
                // without: all residents must have no vehicles
                filtered = filtered.filter((unit) =>
                    unit.residents.length > 0 && unit.residents.every((r) => r.vehicles.length === 0)
                );
            }
        }

        // Floor filter
        if (floorFilter !== "all") {
            filtered = filtered.filter((unit) => unit.floor === floorFilter);
        }

        return filtered;
    }, [units, debouncedSearchTerm, typeFilter, unitStatusFilter, vehicleFilter, floorFilter]);

    // Computed: Paginated Units
    const paginatedUnits = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredUnits.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredUnits, currentPage]);

    // Computed: Stats
    // Stats are calculated from all units, not filtered units
    // This ensures stats always show the total state regardless of active filters
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

    // Clear all filters
    const clearAllFilters = useCallback(() => {
        setTypeFilter("all");
        setUnitStatusFilter("all");
        setVehicleFilter("all");
        setFloorFilter("all");
        setLocalSearchTerm("");
    }, []);

    return {
        // Core State
        sites,
        activeSiteId,
        setActiveSiteId,
        buildings,
        setBuildings,
        activeBlockId,
        setActiveBlockId,
        localSearchTerm,
        setLocalSearchTerm,
        debouncedSearchTerm,

        // Filter State
        typeFilter,
        setTypeFilter,
        unitStatusFilter,
        setUnitStatusFilter,
        vehicleFilter,
        setVehicleFilter,
        floorFilter,
        setFloorFilter,
        availableFloors,
        clearAllFilters,

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
