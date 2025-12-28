import type { GuestVisit, Building } from "@/types/residents.types";
import { GuestStats } from "../../guests/guest-stats";
import { GuestFilters } from "../../guests/guest-filters";
import { GuestTable } from "../../guests/guest-table";
import { GuestRowSkeleton } from "../../guests/skeletons";
import { StatCardSkeleton } from "../../resident/skeletons";
import { BuildingTabs } from "../../resident/building-tabs";

export interface GuestsViewProps {
    buildings: Building[];
    activeBlockId: string | null;
    activeBlock: Building | null;
    guestStats: {
        active: number;
        pending: number;
        completedToday: number;
    };
    guestFilter: "all" | "pending" | "active" | "completed";
    onFilterChange: (filter: "all" | "pending" | "active" | "completed") => void;
    onAddGuest: () => void;
    filteredGuests: GuestVisit[];
    onGuestSelect: (guest: GuestVisit | null) => void;
    onEditGuest?: (guest: GuestVisit) => void;
    onDeleteGuest?: (guestId: string) => void;
    isLoading: boolean;
    onBlockChange: (blockId: string) => void;
    onAddBuilding: () => void;
    onEditBuilding: () => void;
    onDeleteBuilding: () => void;
}

export function GuestsView({
    buildings,
    activeBlockId,
    activeBlock,
    guestStats,
    guestFilter,
    onFilterChange,
    onAddGuest,
    filteredGuests,
    onGuestSelect,
    onEditGuest,
    onDeleteGuest,
    isLoading,
    onBlockChange,
    onAddBuilding,
    onEditBuilding,
    onDeleteBuilding,
}: GuestsViewProps) {
    if (isLoading) {
        return (
            <div className="animate-in fade-in duration-300">
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <StatCardSkeleton key={i} />
                        ))}
                    </div>
                    <div className="bg-ds-card-light dark:bg-ds-card-dark border border-ds-border-light dark:border-ds-border-dark rounded-2xl overflow-hidden shadow-xl">
                        <div className="p-6 space-y-4">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <GuestRowSkeleton key={i} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-300">
            {/* Top Controls (Building Tabs) */}
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6 mb-8">
                <BuildingTabs
                    buildings={buildings}
                    activeBlockId={activeBlockId}
                    onBlockChange={onBlockChange}
                    onAddBuilding={onAddBuilding}
                    onEditBuilding={onEditBuilding}
                    onDeleteBuilding={onDeleteBuilding}
                />
            </div>

            <GuestStats
                active={guestStats.active}
                pending={guestStats.pending}
                completedToday={guestStats.completedToday}
            />

            <GuestFilters
                activeFilter={guestFilter}
                onFilterChange={onFilterChange}
                onAddGuest={onAddGuest}
            />

            <GuestTable 
                guests={filteredGuests} 
                onGuestSelect={onGuestSelect}
                onEditGuest={onEditGuest}
                onDeleteGuest={onDeleteGuest}
            />
        </div>
    );
}
