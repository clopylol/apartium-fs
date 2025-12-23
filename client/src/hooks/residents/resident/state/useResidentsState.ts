import { useState, useEffect, useMemo } from "react";
import type { Building } from "@/types/residents.types";
import { INITIAL_BUILDINGS, ITEMS_PER_PAGE } from "@/constants/residents.constants";

export interface ResidentsStateReturn {
    // Core State
    buildings: Building[];
    setBuildings: React.Dispatch<React.SetStateAction<Building[]>>;
    activeBlockId: string;
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
    filteredUnits: typeof INITIAL_BUILDINGS[0]["units"];
    paginatedUnits: typeof INITIAL_BUILDINGS[0]["units"];
    stats: {
        total: number;
        occupied: number;
        empty: number;
    };
}

export function useResidentsState(): ResidentsStateReturn {
    // Core State
    const [buildings, setBuildings] = useState<Building[]>(INITIAL_BUILDINGS);
    const [activeBlockId, setActiveBlockId] = useState("A");
    const [searchTerm, setSearchTerm] = useState("");

    // Granular Loading States
    const [loadingStates, setLoadingStates] = useState({
        buildings: true,
        residents: true,
        parking: true,
        guests: true,
    });

    // View State
    const [residentViewMode, setResidentViewMode] = useState<"grid" | "list">("grid");
    const [currentPage, setCurrentPage] = useState(1);

    // Simulate Loading for each module
    useEffect(() => {
        // Buildings loaded first
        const buildingsTimer = setTimeout(() => {
            setLoadingStates(prev => ({ ...prev, buildings: false }));
        }, 500);

        // Residents loaded
        const residentsTimer = setTimeout(() => {
            setLoadingStates(prev => ({ ...prev, residents: false }));
        }, 1000);

        // Parking loaded
        const parkingTimer = setTimeout(() => {
            setLoadingStates(prev => ({ ...prev, parking: false }));
        }, 1200);

        // Guests loaded last
        const guestsTimer = setTimeout(() => {
            setLoadingStates(prev => ({ ...prev, guests: false }));
        }, 1500);

        return () => {
            clearTimeout(buildingsTimer);
            clearTimeout(residentsTimer);
            clearTimeout(parkingTimer);
            clearTimeout(guestsTimer);
        };
    }, []);

    // Reset Page on Filter Change
    useEffect(() => {
        setCurrentPage(1);
    }, [activeBlockId, searchTerm]);

    // Computed: Any Loading
    const isAnyLoading = useMemo(
        () => Object.values(loadingStates).some(loading => loading),
        [loadingStates]
    );

    // Computed: Active Block
    const activeBlock = useMemo(
        () => buildings.find((b) => b.id === activeBlockId),
        [buildings, activeBlockId]
    );

    // Computed: Filtered Units
    const filteredUnits = useMemo(() => {
        if (!activeBlock) return [];

        return activeBlock.units.filter((unit) => {
            const term = searchTerm.toLowerCase();
            const matchesSearch =
                unit.number.includes(term) ||
                unit.residents.some(
                    (r) =>
                        r.name.toLowerCase().includes(term) ||
                        r.vehicles.some((v) =>
                            v.plate.toLowerCase().replace(/\s/g, "").includes(term.replace(/\s/g, ""))
                        )
                );
            return matchesSearch;
        });
    }, [activeBlock, searchTerm]);

    // Computed: Paginated Units
    const paginatedUnits = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredUnits.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredUnits, currentPage]);

    // Computed: Stats
    const stats = useMemo(() => {
        if (!activeBlock) {
            return { total: 0, occupied: 0, empty: 0 };
        }

        return {
            total: activeBlock.units.length,
            occupied: activeBlock.units.filter((u) => u.status === "occupied").length,
            empty: activeBlock.units.filter((u) => u.status === "empty").length,
        };
    }, [activeBlock]);

    return {
        // Core State
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
        filteredUnits,
        paginatedUnits,
        stats,
    };
}
