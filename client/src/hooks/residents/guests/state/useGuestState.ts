import { useState, useMemo, useEffect } from "react";
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
    totalItems: number;
    isLoading: boolean;
    dateRange: { from: string; to: string } | null;
    setDateRange: React.Dispatch<React.SetStateAction<{ from: string; to: string } | null>>;
    sortBy: string;
    setSortBy: React.Dispatch<React.SetStateAction<string>>;
    sortOrder: 'asc' | 'desc';
    setSortOrder: React.Dispatch<React.SetStateAction<'asc' | 'desc'>>;

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
    const [dateRange, setDateRange] = useState<{ from: string; to: string } | null>(null);
    const [sortBy, setSortBy] = useState<string>('createdAt');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [guestFilter, dateRange, sortBy, sortOrder, searchTerm]);

    // ✅ Fetch guest visits with pagination from API
    const { visits, total, isLoading } = useGuestVisits(
        currentPage,
        GUESTS_PER_PAGE,
        {
            status: guestFilter === 'all' ? undefined : guestFilter,
            search: searchTerm.length >= 3 ? searchTerm : undefined,
            dateFrom: dateRange?.from,
            dateTo: dateRange?.to,
            sortBy,
            sortOrder,
        }
    );

    // ✅ Fetch ALL guest visits for stats (without pagination)
    const { visits: allVisitsForStats } = useGuestVisits(
        1,
        10000, // Large limit to get all filtered results
        {
            status: guestFilter === 'all' ? undefined : guestFilter,
            search: searchTerm.length >= 3 ? searchTerm : undefined,
            dateFrom: dateRange?.from,
            dateTo: dateRange?.to,
            // No sort needed for stats
        }
    );

    // Computed: Stats (from ALL filtered data, not just current page)
    const guestStats = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        return {
            active: allVisitsForStats.filter((g) => g.status === "active").length,
            pending: allVisitsForStats.filter((g) => g.status === "pending").length,
            completedToday: allVisitsForStats.filter((g) => {
                if (g.status !== "completed") return false;
                if (!g.exitTime) return false;
                const exitDate = new Date(g.exitTime);
                exitDate.setHours(0, 0, 0, 0);
                return exitDate.getTime() === today.getTime();
            }).length,
        };
    }, [allVisitsForStats]);

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
        totalItems: total,
        isLoading,
        filteredGuests: visits, // Already filtered by backend
        guestStats,
        dateRange,
        setDateRange,
        sortBy,
        setSortBy,
        sortOrder,
        setSortOrder,
    };
}
