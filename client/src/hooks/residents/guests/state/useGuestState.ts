import { useState, useMemo } from "react";
import type { GuestVisit } from "@/types/residents.types";
import { INITIAL_GUESTS } from "@/constants/residents.constants";

export interface GuestStateReturn {
    guestList: GuestVisit[];
    setGuestList: React.Dispatch<React.SetStateAction<GuestVisit[]>>;
    guestFilter: "all" | "pending" | "active" | "completed";
    setGuestFilter: (filter: "all" | "pending" | "active" | "completed") => void;

    // Computed Values
    filteredGuests: GuestVisit[];
    guestStats: {
        active: number;
        pending: number;
        completedToday: number;
    };
}

export function useGuestState(searchTerm: string): GuestStateReturn {
    const [guestList, setGuestList] = useState<GuestVisit[]>(INITIAL_GUESTS);
    const [guestFilter, setGuestFilter] = useState<"all" | "pending" | "active" | "completed">("all");

    // Computed: Filtered Guests
    const filteredGuests = useMemo(() => {
        let filtered = guestList;

        // Filter by status
        if (guestFilter !== "all") {
            filtered = filtered.filter((g) => g.status === guestFilter);
        }

        // Filter by search term
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(
                (g) =>
                    g.guestName?.toLowerCase().includes(term) ||
                    g.plate?.toLowerCase().includes(term) ||
                    g.hostName.toLowerCase().includes(term)
            );
        }

        return filtered;
    }, [guestList, guestFilter, searchTerm]);

    // Computed: Guest Stats
    const guestStats = useMemo(() => {
        return {
            active: guestList.filter((g) => g.status === "active").length,
            pending: guestList.filter((g) => g.status === "pending").length,
            completedToday: guestList.filter((g) => g.status === "completed").length,
        };
    }, [guestList]);

    return {
        guestList,
        setGuestList,
        guestFilter,
        setGuestFilter,
        filteredGuests,
        guestStats,
    };
}
