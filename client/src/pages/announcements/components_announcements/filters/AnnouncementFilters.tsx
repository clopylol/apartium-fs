import type { FC } from "react";
import { AlertTriangle, Info, CheckCircle, Filter } from "lucide-react";

import type { AnnouncementPriority } from "@/types/Announcement.types";
import { FilterChip } from "@/components/shared/inputs/filter-chip";
import { SearchInput } from "@/components/shared/inputs/search-input";
import { Dropdown } from "@/components/shared/inputs/dropdown";

interface AnnouncementFiltersProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    filterStatus: string;
    onStatusChange: (value: string) => void;
    filterPriority: AnnouncementPriority;
    onPriorityChange: (value: AnnouncementPriority) => void;
}

const statusOptions = [
    { value: "All", label: "Tüm Durumlar" },
    { value: "Published", label: "Yayında" },
    { value: "Scheduled", label: "Planlandı" },
    { value: "Draft", label: "Taslak" },
];

export const AnnouncementFilters: FC<AnnouncementFiltersProps> = ({
    searchTerm,
    onSearchChange,
    filterStatus,
    onStatusChange,
    filterPriority,
    onPriorityChange,
}) => {
    return (
        <div className="flex flex-col gap-4 bg-ds-card-light/50 dark:bg-ds-card-dark/50 p-3 rounded-xl border border-ds-border-light dark:border-ds-border-dark">
            {/* Top Row: Chips and Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Priority Chips */}
                <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 px-1 -mx-1 md:mx-0 md:px-0 custom-scrollbar">
                    <span className="text-xs font-bold text-ds-muted-light dark:text-ds-muted-dark uppercase mr-1 flex-shrink-0">Öncelik:</span>
                    <FilterChip
                        label="Tümü"
                        isActive={filterPriority === 'All'}
                        onClick={() => onPriorityChange('All')}
                        className="px-4 py-2.5 text-sm rounded-xl"
                    />
                    <FilterChip
                        label="Yüksek"
                        isActive={filterPriority === 'High'}
                        onClick={() => onPriorityChange('High')}
                        variant="destructive"
                        icon={<AlertTriangle className="w-4 h-4" />}
                        className="px-4 py-2.5 text-sm rounded-xl"
                    />
                    <FilterChip
                        label="Orta"
                        isActive={filterPriority === 'Medium'}
                        onClick={() => onPriorityChange('Medium')}
                        variant="warning"
                        icon={<Info className="w-4 h-4" />}
                        className="px-4 py-2.5 text-sm rounded-xl"
                    />
                    <FilterChip
                        label="Düşük"
                        isActive={filterPriority === 'Low'}
                        onClick={() => onPriorityChange('Low')}
                        variant="success"
                        icon={<CheckCircle className="w-4 h-4" />}
                        className="px-4 py-2.5 text-sm rounded-xl"
                    />
                </div>

                {/* Search & Status Filter */}
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <SearchInput
                            value={searchTerm}
                            onChange={onSearchChange}
                            placeholder="Başlığa göre ara..."
                            className="w-full"
                        />
                    </div>

                    <div className="relative group shrink-0 w-48">
                        <Dropdown
                            options={statusOptions}
                            value={filterStatus}
                            onChange={onStatusChange}
                            icon={Filter}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

