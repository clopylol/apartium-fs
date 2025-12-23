import { useState, useMemo } from "react";
import type { GuestVisit } from "@/types/residents.types";
import { useGuestVisits } from "@/hooks/residents/api";
import { GUESTS_PER_PAGE } from "@/constants/residents.constants";

export interface GuestStateReturn {
    guestList: GuestVisit[];
    setGuestList: React.Dispatch<React.SetStateAction<GuestVisit[]>>;
    guestFilter: "all" | "pending" | "active" | "completed";
    setGuestFilter: (filter: "all" | "pending" | "active" | "completed") => void;
    currentPage: number;
    setCurrentPage: (page: number) => void;
    totalPages: number;
    isLoading: boolean;

    // Computed Values
    filteredGuests: GuestVisit[];
    guestStats: {
        active: number;
        pending: number;
        completedToday: number;
    };
}

export function useGuestState(searchTerm: string): GuestStateReturn {
    const [guestFilter, setGuestFilter] = useState<"all" | "pending" | "active" | "completed">("all");
    const [currentPage, setCurrentPage] = useState(1);

    // ✅ Fetch guest visits with pagination from API
    const { visits, total, isLoading } = useGuestVisits(
        currentPage,
        GUESTS_PER_PAGE,
        {
            status: guestFilter === 'all' ? undefined : guestFilter,
            search: searchTerm.length >= 3 ? searchTerm : undefined,
        }
    );

    // Computed: Stats (from current page data)
    const guestStats = useMemo(() => ({
        active: visits.filter((g) => g.status === "active").length,
        pending: visits.filter((g) => g.status === "pending").length,
        completedToday: visits.filter((g) => g.status === "completed").length,
    }), [visits]);

    // Dummy setGuestList for compatibility (not used with API)
    const setGuestList = () => {
        console.warn('setGuestList is deprecated with API usage');
    };

    return {
        guestList: visits,
        setGuestList,
        guestFilter,
        setGuestFilter,
        currentPage,
        setCurrentPage,
        totalPages: Math.ceil(total / GUESTS_PER_PAGE),
        isLoading,
        filteredGuests: visits, // Already filtered by backend
        guestStats,
    };
}
