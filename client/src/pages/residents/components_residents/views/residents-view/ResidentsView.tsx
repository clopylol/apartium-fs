import type { Building, Resident } from "@/types/residents.types";
import { Plus, LayoutGrid, List } from "lucide-react";
import { useTranslation } from "react-i18next";
import { BuildingTabs } from "../../resident/building-tabs";
import { ResidentCard } from "../../resident/resident-card";
import { Pagination } from "@/components/shared/pagination";
import { ResidentCardSkeleton, ResidentRowSkeleton } from "../../resident/skeletons";
import { ResidentsListView } from "./ResidentsListView";
import { ITEMS_PER_PAGE } from "@/constants/residents.constants";

export interface ResidentsViewProps {
    // Data
    buildings: Building[];
    activeBlockId: string | null;
    activeBlock: Building | undefined;
    paginatedUnits: any[]; // UnitWithResidents[]
    filteredUnits: any[]; // UnitWithResidents[]
    currentPage: number;
    stats: {
        total: number;
        occupied: number;
        empty: number;
    };
    residentViewMode: "grid" | "list";
    isLoading: boolean;

    // Handlers
    onBlockChange: (id: string) => void;
    onAddBuilding: () => void;
    onEditBuilding: () => void;
    onDeleteBuilding: () => void;
    onViewModeChange: (mode: "grid" | "list") => void;
    onPageChange: (page: number) => void;
    onAddResident: (blockId?: string, unitId?: string) => void;
    onEditResident: (resident: Resident, blockId: string, unitId: string) => void;
    onDeleteResident: (residentId: string, residentName: string, blockId: string, unitId: string) => void;
    onManageVehicles: (resident: Resident, blockId: string, unitId: string) => void;
}

export function ResidentsView({
    buildings,
    activeBlockId,
    activeBlock,
    paginatedUnits,
    filteredUnits,
    currentPage,
    stats,
    residentViewMode,
    isLoading,
    onBlockChange,
    onAddBuilding,
    onEditBuilding,
    onDeleteBuilding,
    onViewModeChange,
    onPageChange,
    onAddResident,
    onEditResident,
    onDeleteResident,
    onManageVehicles,
}: ResidentsViewProps) {
    const { t } = useTranslation();
    
    return (
        <>
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

                {/* Context Actions */}
                <div className="flex items-center gap-4">
                    {activeBlock && (
                        <>
                            {/* Sub View Toggle */}
                            <div className="flex bg-ds-card-light dark:bg-ds-card-dark rounded-lg p-1 border border-ds-border-light dark:border-ds-border-dark">
                                <button
                                    onClick={() => onViewModeChange("grid")}
                                    className={`p-2 rounded-md ${residentViewMode === "grid"
                                            ? "bg-ds-muted-light dark:bg-ds-muted-dark text-ds-primary-light dark:text-ds-primary-dark"
                                            : "text-ds-muted-light dark:text-ds-muted-dark hover:text-ds-primary-light dark:hover:text-ds-primary-dark"
                                        }`}
                                >
                                    <LayoutGrid className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => onViewModeChange("list")}
                                    className={`p-2 rounded-md ${residentViewMode === "list"
                                            ? "bg-ds-muted-light dark:bg-ds-muted-dark text-ds-primary-light dark:text-ds-primary-dark"
                                            : "text-ds-muted-light dark:text-ds-muted-dark hover:text-ds-primary-light dark:hover:text-ds-primary-dark"
                                        }`}
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="flex items-center gap-4">
                                {/* Stats */}
                                <div className="flex items-center gap-4 text-xs font-medium">
                                    <div className="flex items-center gap-2 text-ds-muted-light dark:text-ds-muted-dark">
                                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 dark:bg-emerald-500"></div>
                                        {t("residents.stats.occupied")}: <span className="text-white font-bold text-sm">{stats.occupied}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-ds-muted-light dark:text-ds-muted-dark">
                                        <div className="w-2.5 h-2.5 rounded-full bg-slate-500 dark:bg-slate-500"></div>
                                        {t("residents.stats.empty")}: <span className="text-white font-bold text-sm">{stats.empty}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => onAddResident()}
                                    className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all"
                                >
                                    <Plus className="w-4 h-4" /> <span className="hidden sm:inline">{t("residents.actions.addResident")}</span>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Content */}
            {isLoading ? (
                <>
                    {residentViewMode === "grid" ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <ResidentCardSkeleton key={i} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-ds-card-light dark:bg-ds-card-dark border border-ds-border-light dark:border-ds-border-dark rounded-2xl overflow-hidden shadow-xl">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-ds-border-light dark:border-ds-border-dark bg-ds-background-light/50 dark:bg-ds-background-dark/50 text-xs uppercase text-ds-muted-light dark:text-ds-muted-dark font-semibold tracking-wider">
                                            <th className="px-6 py-4 w-24">{t("residents.table.columns.unit")}</th>
                                            <th className="px-6 py-4 w-24">{t("residents.table.columns.status")}</th>
                                            <th className="px-6 py-4">{t("residents.table.columns.residents")}</th>
                                            <th className="px-6 py-4">{t("residents.table.columns.contact")}</th>
                                            <th className="px-6 py-4">{t("residents.table.columns.vehicles")}</th>
                                            <th className="px-6 py-4 text-right">{t("residents.table.columns.actions")}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-ds-border-light/50 dark:divide-ds-border-dark/50">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <ResidentRowSkeleton key={i} />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <>
                    {residentViewMode === "grid" ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-300">
                            {paginatedUnits.map((unit) => (
                                <ResidentCard
                                    key={unit.id}
                                    unit={unit}
                                    blockId={activeBlockId}
                                    onEditResident={onEditResident}
                                    onDeleteResident={(residentId, blockId, unitId) => {
                                        const resident = unit.residents.find((r) => r.id === residentId);
                                        onDeleteResident(residentId, resident?.name || "", blockId, unitId);
                                    }}
                                    onManageVehicles={onManageVehicles}
                                    onAddResident={onAddResident}
                                />
                            ))}
                            {activeBlock && (
                                <button
                                    onClick={() => console.log("Add unit")}
                                    className="rounded-2xl border-2 border-dashed border-slate-800 flex flex-col items-center justify-center gap-4 min-h-[300px] hover:bg-slate-900/40 hover:border-slate-700 transition-all group"
                                >
                                    <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Plus className="w-8 h-8 text-slate-500 group-hover:text-blue-500 transition-colors" />
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-lg font-bold text-slate-400 group-hover:text-white transition-colors">
                                            {t("residents.actions.addUnit")}
                                        </h3>
                                        <p className="text-sm text-slate-600">{t("residents.messages.addUnitDescription")}</p>
                                    </div>
                                </button>
                            )}
                        </div>
                    ) : (
                        <ResidentsListView
                            paginatedUnits={paginatedUnits}
                            activeBlockId={activeBlockId}
                            onAddResident={onAddResident}
                            onEditResident={onEditResident}
                            onDeleteResident={onDeleteResident}
                            onManageVehicles={onManageVehicles}
                        />
                    )}

                    {/* Pagination Controls */}
                    <Pagination
                        totalItems={filteredUnits.length}
                        itemsPerPage={ITEMS_PER_PAGE}
                        currentPage={currentPage}
                        onPageChange={onPageChange}
                    />
                </>
            )}
        </>
    );
}
