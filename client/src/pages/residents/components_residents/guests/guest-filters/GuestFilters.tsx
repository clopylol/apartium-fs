import { Clock, CarFront, Plus, LogOut, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FilterChip } from "@/components/shared/inputs/filter-chip";
import { Button } from "@/components/shared/button";
import { formatDateForInput } from "@/utils/date";

interface GuestFiltersProps {
    activeFilter: "all" | "pending" | "active" | "completed";
    onFilterChange: (filter: "all" | "pending" | "active" | "completed") => void;
    onAddGuest: () => void;
    dateRange?: { from: string; to: string } | null;
    onDateRangeChange?: (range: { from: string; to: string } | null) => void;
}

export function GuestFilters({ activeFilter, onFilterChange, onAddGuest, dateRange, onDateRangeChange }: GuestFiltersProps) {
    const { t } = useTranslation();
    const [dateRangeType, setDateRangeType] = useState<"none" | "thisWeek" | "thisMonth" | "custom">("none");
    const [customDateFrom, setCustomDateFrom] = useState("");
    const [customDateTo, setCustomDateTo] = useState("");

    const handleDateRangeTypeChange = (type: "none" | "thisWeek" | "thisMonth" | "custom") => {
        setDateRangeType(type);
        
        if (!onDateRangeChange) return;
        
        if (type === "none") {
            onDateRangeChange(null);
            return;
        }
        
        const today = new Date();
        let from: string;
        let to: string = formatDateForInput(today);
        
        if (type === "thisWeek") {
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - today.getDay());
            from = formatDateForInput(startOfWeek);
        } else if (type === "thisMonth") {
            const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            from = formatDateForInput(startOfMonth);
        } else {
            // custom - will be set when user selects dates
            return;
        }
        
        onDateRangeChange({ from, to });
    };

    const handleCustomDateChange = () => {
        if (!onDateRangeChange || !customDateFrom || !customDateTo) return;
        onDateRangeChange({ from: customDateFrom, to: customDateTo });
    };

    // Sync dateRangeType with external dateRange prop
    useEffect(() => {
        if (!dateRange) {
            setDateRangeType("none");
            setCustomDateFrom("");
            setCustomDateTo("");
            return;
        }

        const today = new Date();
        const todayStr = formatDateForInput(today);
        
        // Check if it's "this week"
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        const weekStartStr = formatDateForInput(startOfWeek);
        
        // Check if it's "this month"
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const monthStartStr = formatDateForInput(startOfMonth);
        
        if (dateRange.from === weekStartStr && dateRange.to === todayStr) {
            setDateRangeType("thisWeek");
        } else if (dateRange.from === monthStartStr && dateRange.to === todayStr) {
            setDateRangeType("thisMonth");
        } else {
            setDateRangeType("custom");
            setCustomDateFrom(dateRange.from);
            setCustomDateTo(dateRange.to);
        }
    }, [dateRange]);

    return (
        <div className="space-y-4 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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

            {/* Date Range Filters */}
            {onDateRangeChange && (
                <div className="flex flex-col gap-3 pt-3 border-t border-slate-800/50">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                            {t("residents.guests.filters.dateRange.label") || "Tarih Aralığı"}
                        </span>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                        <FilterChip
                            label={t("residents.guests.filters.dateRange.none") || "Tümü"}
                            isActive={dateRangeType === "none"}
                            onClick={() => handleDateRangeTypeChange("none")}
                            className="px-3 py-1.5 text-xs rounded-lg"
                        />
                        <FilterChip
                            label={t("residents.guests.filters.dateRange.thisWeek") || "Bu Hafta"}
                            isActive={dateRangeType === "thisWeek"}
                            onClick={() => handleDateRangeTypeChange("thisWeek")}
                            className="px-3 py-1.5 text-xs rounded-lg"
                        />
                        <FilterChip
                            label={t("residents.guests.filters.dateRange.thisMonth") || "Bu Ay"}
                            isActive={dateRangeType === "thisMonth"}
                            onClick={() => handleDateRangeTypeChange("thisMonth")}
                            className="px-3 py-1.5 text-xs rounded-lg"
                        />
                        <FilterChip
                            label={t("residents.guests.filters.dateRange.custom") || "Özel Aralık"}
                            isActive={dateRangeType === "custom"}
                            onClick={() => handleDateRangeTypeChange("custom")}
                            className="px-3 py-1.5 text-xs rounded-lg"
                        />
                    </div>
                    
                    {dateRangeType === "custom" && (
                        <div className="flex items-center gap-3">
                            <div className="flex-1">
                                <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-1">
                                    {t("residents.guests.filters.dateRange.from") || "Başlangıç"}
                                </label>
                                <input
                                    type="date"
                                    value={customDateFrom}
                                    onChange={(e) => {
                                        setCustomDateFrom(e.target.value);
                                        if (e.target.value && customDateTo) {
                                            onDateRangeChange({ from: e.target.value, to: customDateTo });
                                        }
                                    }}
                                    className="w-full bg-[#151821] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#3B82F6] transition-colors [color-scheme:dark]"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-1">
                                    {t("residents.guests.filters.dateRange.to") || "Bitiş"}
                                </label>
                                <input
                                    type="date"
                                    value={customDateTo}
                                    onChange={(e) => {
                                        const newTo = e.target.value;
                                        // Validation: to must be >= from
                                        if (customDateFrom && newTo && newTo < customDateFrom) {
                                            return; // Don't update if invalid
                                        }
                                        setCustomDateTo(newTo);
                                        if (customDateFrom && newTo) {
                                            onDateRangeChange({ from: customDateFrom, to: newTo });
                                        }
                                    }}
                                    min={customDateFrom || undefined}
                                    className="w-full bg-[#151821] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#3B82F6] transition-colors [color-scheme:dark]"
                                />
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

