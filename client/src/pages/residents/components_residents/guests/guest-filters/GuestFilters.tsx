import { Clock, CarFront, Plus, LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";
import { FilterChip } from "@/components/shared/inputs/filter-chip";
import { Button } from "@/components/shared/button";

interface GuestFiltersProps {
    activeFilter: "all" | "pending" | "active" | "completed";
    onFilterChange: (filter: "all" | "pending" | "active" | "completed") => void;
    onAddGuest: () => void;
}

export function GuestFilters({ activeFilter, onFilterChange, onAddGuest }: GuestFiltersProps) {
    const { t } = useTranslation();
    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            {/* Filter Container with subtle background */}
            <div className="flex items-center gap-3 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 px-1 -mx-1 sm:mx-0 sm:px-0 custom-scrollbar">
                <FilterChip
                    label={t("residents.guests.filters.all")}
                    isActive={activeFilter === "all"}
                    onClick={() => onFilterChange("all")}
                    className="px-4 py-2.5 text-sm rounded-xl"
                />
                <FilterChip
                    label={t("residents.guests.filters.pending")}
                    isActive={activeFilter === "pending"}
                    onClick={() => onFilterChange("pending")}
                    variant="warning"
                    icon={<Clock className="w-4 h-4" />}
                    className="px-4 py-2.5 text-sm rounded-xl"
                />
                <FilterChip
                    label={t("residents.guests.filters.active")}
                    isActive={activeFilter === "active"}
                    onClick={() => onFilterChange("active")}
                    variant="info"
                    icon={<CarFront className="w-4 h-4" />}
                    className="px-4 py-2.5 text-sm rounded-xl"
                />
                <FilterChip
                    label={t("residents.guests.filters.completed")}
                    isActive={activeFilter === "completed"}
                    onClick={() => onFilterChange("completed")}
                    variant="destructive"
                    icon={<LogOut className="w-4 h-4" />}
                    className="px-4 py-2.5 text-sm rounded-xl"
                />
            </div>

            {/* Add Button with better spacing */}
            <div className="flex-shrink-0 w-full sm:w-auto">
                <Button
                    onClick={onAddGuest}
                    leftIcon={<Plus className="w-4 h-4" />}
                    className="bg-ds-in-sky-600 hover:bg-ds-in-sky-500 shadow-lg shadow-ds-in-sky-900/20 w-full sm:w-auto"
                >
                    {t("residents.guests.filters.addGuest")}
                </Button>
            </div>
        </div>
    );
}

