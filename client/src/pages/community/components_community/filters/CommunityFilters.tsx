import type { FC } from "react";
import { Clock, CheckCircle, XCircle, Filter, MessageSquare, Lightbulb } from "lucide-react";

import { FilterChip } from "@/components/shared/inputs/filter-chip";
import { SearchInput } from "@/components/shared/inputs/search-input";
import { Dropdown } from "@/components/shared/inputs/dropdown";

interface CommunityFiltersProps {
    activeTab: 'requests' | 'polls';
    searchTerm: string;
    onSearchChange: (value: string) => void;
    filterStatus: string;
    onStatusChange: (value: string) => void;
    filterType?: 'all' | 'wish' | 'suggestion';
    onTypeChange?: (value: 'all' | 'wish' | 'suggestion') => void;
}

const requestStatusOptions = [
    { value: "all", label: "Tüm Durumlar" },
    { value: "pending", label: "Beklemede" },
    { value: "in-progress", label: "İşlemde" },
    { value: "resolved", label: "Çözüldü" },
    { value: "rejected", label: "Reddedildi" },
];

const pollStatusOptions = [
    { value: "all", label: "Tüm Durumlar" },
    { value: "active", label: "Aktif" },
    { value: "closed", label: "Kapandı" },
];

export const CommunityFilters: FC<CommunityFiltersProps> = ({
    activeTab,
    searchTerm,
    onSearchChange,
    filterStatus,
    onStatusChange,
    filterType = 'all',
    onTypeChange,
}) => {
    const statusOptions = activeTab === 'requests' ? requestStatusOptions : pollStatusOptions;

    return (
        <div className="flex flex-col gap-4 bg-ds-card-light/50 dark:bg-ds-card-dark/50 p-3 rounded-xl border border-ds-border-light dark:border-ds-border-dark">
            {/* Top Row: Chips and Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Type Chips (Only for Requests) */}
                {activeTab === 'requests' && onTypeChange && (
                    <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 px-1 -mx-1 md:mx-0 md:px-0 custom-scrollbar">
                        <span className="text-xs font-bold text-ds-muted-light dark:text-ds-muted-dark uppercase mr-1 flex-shrink-0">Tür:</span>
                        <FilterChip
                            label="Tümü"
                            isActive={filterType === 'all'}
                            onClick={() => onTypeChange('all')}
                            className="px-4 py-2.5 text-sm rounded-xl"
                        />
                        <FilterChip
                            label="Dilek"
                            isActive={filterType === 'wish'}
                            onClick={() => onTypeChange('wish')}
                            variant="warning"
                            icon={<MessageSquare className="w-4 h-4" />}
                            className="px-4 py-2.5 text-sm rounded-xl"
                        />
                        <FilterChip
                            label="Öneri"
                            isActive={filterType === 'suggestion'}
                            onClick={() => onTypeChange('suggestion')}
                            variant="success"
                            icon={<Lightbulb className="w-4 h-4" />}
                            className="px-4 py-2.5 text-sm rounded-xl"
                        />
                    </div>
                )}

                {/* Status Chips (For Polls) */}
                {activeTab === 'polls' && (
                    <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 px-1 -mx-1 md:mx-0 md:px-0 custom-scrollbar">
                        <span className="text-xs font-bold text-ds-muted-light dark:text-ds-muted-dark uppercase mr-1 flex-shrink-0">Durum:</span>
                        <FilterChip
                            label="Tümü"
                            isActive={filterStatus === 'all'}
                            onClick={() => onStatusChange('all')}
                            className="px-4 py-2.5 text-sm rounded-xl"
                        />
                        <FilterChip
                            label="Aktif"
                            isActive={filterStatus === 'active'}
                            onClick={() => onStatusChange('active')}
                            variant="success"
                            icon={<CheckCircle className="w-4 h-4" />}
                            className="px-4 py-2.5 text-sm rounded-xl"
                        />
                        <FilterChip
                            label="Kapandı"
                            isActive={filterStatus === 'closed'}
                            onClick={() => onStatusChange('closed')}
                            variant="destructive"
                            icon={<XCircle className="w-4 h-4" />}
                            className="px-4 py-2.5 text-sm rounded-xl"
                        />
                    </div>
                )}

                {/* Search & Status Filter */}
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <SearchInput
                            value={searchTerm}
                            onChange={onSearchChange}
                            placeholder={
                                activeTab === 'requests'
                                    ? "Talep ara (min. 3 karakter)..."
                                    : "Anket ara (min. 3 karakter)..."
                            }
                            className="w-full"
                        />
                    </div>

                    {/* Status Dropdown (Only for Requests) */}
                    {activeTab === 'requests' && (
                        <div className="relative group shrink-0 w-48">
                            <Dropdown
                                options={statusOptions}
                                value={filterStatus}
                                onChange={onStatusChange}
                                icon={Filter}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

