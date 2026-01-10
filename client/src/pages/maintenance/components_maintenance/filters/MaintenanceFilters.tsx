import type { FC } from "react";
import { useTranslation } from "react-i18next";
import {
  Clock,
  CheckCircle,
  LayoutGrid,
  List,
  Droplets,
  Zap,
  Thermometer,
  Box,
  Circle,
  PlayCircle,
  Building2
} from "lucide-react";
import { ButtonGroup } from "@/components/shared/button";
import { FilterChip } from "@/components/shared/inputs/filter-chip";
import { SiteSelector } from "@/components/residents/site-selector/SiteSelector";
import type { MaintenanceStatus, MaintenancePriority, MaintenanceCategory } from "@/types/maintenance.types";
import type { Site, Building } from "@/types/residents.types";
import type { FilterChipVariant } from "@/components/shared/inputs/filter-chip";

interface MaintenanceFiltersProps {
  filterStatus: MaintenanceStatus | "All";
  onStatusChange: (value: MaintenanceStatus | "All") => void;
  filterPriority: MaintenancePriority | "All";
  onPriorityChange: (value: MaintenancePriority | "All") => void;
  filterCategory: MaintenanceCategory | "All";
  onCategoryChange: (value: MaintenanceCategory | "All") => void;
  viewMode: "list" | "grid";
  onViewModeChange: (mode: "list" | "grid") => void;
  // Date Props
  dateFrom: string;
  onDateFromChange: (value: string) => void;
  dateTo: string;
  onDateToChange: (value: string) => void;
  // Site & Building Props
  sites: Site[];
  activeSiteId: string | null;
  onSiteChange: (siteId: string) => void;
  buildings: Building[];
  activeBuildingId: string | null;
  onBuildingChange: (buildingId: string | null) => void;
}

export const MaintenanceFilters: FC<MaintenanceFiltersProps> = ({
  filterStatus,
  onStatusChange,
  filterCategory,
  onCategoryChange,
  viewMode,
  onViewModeChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
  sites,
  activeSiteId,
  onSiteChange,
  buildings,
  activeBuildingId,
  onBuildingChange,
}) => {
  const { t } = useTranslation();

  const getCategoryVariant = (category: MaintenanceCategory | "All"): FilterChipVariant => {
    switch (category) {
      case "All": return "primary";
      case "Tesisat": return "info";
      case "Elektrik": return "warning";
      case "Isıtma/Soğutma": return "destructive";
      case "Genel": return "secondary";
      default: return "default";
    }
  };

  return (
    <div className="flex flex-col gap-4 text-ds-primary-light">

      {/* 1. SATIR: Bağlam Seçimi (Site, Blok, Tarih) */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 bg-ds-background-light/50 dark:bg-ds-background-dark/50 p-2 rounded-2xl border border-ds-border-light dark:border-ds-border-dark overflow-x-auto">

        {/* Site Seçici */}
        <SiteSelector
          sites={sites}
          activeSiteId={activeSiteId}
          onSiteChange={onSiteChange}
        />

        <div className="h-8 w-px bg-ds-border-light dark:bg-ds-border-dark hidden lg:block"></div>

        {/* Bina Seçici */}
        {buildings.length > 0 && (
          <div className="relative">
            <select
              value={activeBuildingId || ""}
              onChange={(e) => onBuildingChange(e.target.value || null)}
              className="appearance-none flex items-center gap-2 pl-10 pr-10 py-2 bg-ds-card-light dark:bg-ds-card-dark text-ds-secondary-light dark:text-ds-secondary-dark rounded-lg border border-ds-border-light dark:border-ds-border-dark hover:border-ds-primary-light dark:hover:border-ds-primary-dark transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-ds-primary-light dark:focus:ring-ds-primary-dark text-sm font-medium min-w-[150px]"
            >
              <option value="">Tüm Bloklar</option>
              {buildings.map((building) => (
                <option key={building.id} value={building.id}>
                  {building.name}
                </option>
              ))}
            </select>

            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-ds-muted-light dark:text-ds-muted-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <Building2 className="w-4 h-4 text-ds-primary-light dark:text-ds-primary-dark" />
            </div>
          </div>
        )}

        <div className="h-8 w-px bg-ds-border-light dark:bg-ds-border-dark hidden lg:block"></div>

        {/* Tarih Seçici */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-2 bg-ds-card-light dark:bg-ds-card-dark rounded-lg border border-ds-border-light dark:border-ds-border-dark">
            <Clock className="w-4 h-4 text-ds-muted-light dark:text-ds-muted-dark" />
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => onDateFromChange(e.target.value)}
              className="bg-transparent text-sm focus:outline-none dark:text-white w-28 md:w-auto"
              placeholder={t("common.startDate", "Başlangıç")}
            />
          </div>
          <span className="text-ds-muted-light max-sm:hidden">-</span>
          <div className="flex items-center gap-2 px-3 py-2 bg-ds-card-light dark:bg-ds-card-dark rounded-lg border border-ds-border-light dark:border-ds-border-dark">
            <input
              type="date"
              value={dateTo}
              onChange={(e) => onDateToChange(e.target.value)}
              className="bg-transparent text-sm focus:outline-none dark:text-white w-28 md:w-auto"
              placeholder={t("common.endDate", "Bitiş")}
            />
          </div>
        </div>
      </div>

      {/* 2. SATIR: Durum ve Görünüm */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="bg-ds-background-light/50 dark:bg-ds-background-dark/50 p-1.5 rounded-xl border border-ds-border-light dark:border-ds-border-dark overflow-x-auto w-full lg:w-auto">
          <ButtonGroup
            items={[
              { id: "New", label: t("maintenance.status.new", "Yeni"), icon: <Circle className="w-4 h-4" /> },
              { id: "In Progress", label: t("maintenance.status.inProgress", "İşleniyor"), icon: <PlayCircle className="w-4 h-4" /> },
              { id: "Completed", label: t("maintenance.status.completed", "Tamamlandı"), icon: <CheckCircle className="w-4 h-4" /> },
              { id: "All", label: t("common.all", "Tümü"), icon: <LayoutGrid className="w-4 h-4" /> },
            ]}
            activeId={filterStatus}
            onChange={(id) => onStatusChange(id as MaintenanceStatus | "All")}
            className="w-full sm:w-auto"
          />
        </div>

        <div className="flex items-center bg-ds-background-light/50 dark:bg-ds-background-dark/50 p-1.5 rounded-xl border border-ds-border-light dark:border-ds-border-dark">
          <ButtonGroup
            items={[
              { id: "grid", label: "", icon: <LayoutGrid className="w-4 h-4" /> },
              { id: "list", label: "", icon: <List className="w-4 h-4" /> },
            ]}
            activeId={viewMode}
            onChange={(id) => onViewModeChange(id as "grid" | "list")}
          />
        </div>
      </div>

      {/* 3. SATIR: Kategoriler */}
      <div className="flex flex-col sm:flex-row gap-4 px-1">
        <div className="flex items-center gap-3 overflow-x-auto pb-2 sm:pb-0 w-full custom-scrollbar">
          <FilterChip
            label={t("common.all", "Tümü")}
            isActive={filterCategory === "All"}
            onClick={() => onCategoryChange("All")}
            variant={getCategoryVariant("All")}
            className="px-4 py-2 text-sm rounded-xl border shadow-sm"
          />
          <FilterChip
            label="Tesisat"
            isActive={filterCategory === "Tesisat"}
            onClick={() => onCategoryChange("Tesisat")}
            variant={getCategoryVariant("Tesisat")}
            icon={<Droplets className="w-4 h-4" />}
            className="px-4 py-2 text-sm rounded-xl border shadow-sm"
          />
          <FilterChip
            label="Elektrik"
            isActive={filterCategory === "Elektrik"}
            onClick={() => onCategoryChange("Elektrik")}
            variant={getCategoryVariant("Elektrik")}
            icon={<Zap className="w-4 h-4" />}
            className="px-4 py-2 text-sm rounded-xl border shadow-sm"
          />
          <FilterChip
            label="Isıtma/Soğutma"
            isActive={filterCategory === "Isıtma/Soğutma"}
            onClick={() => onCategoryChange("Isıtma/Soğutma")}
            variant={getCategoryVariant("Isıtma/Soğutma")}
            icon={<Thermometer className="w-4 h-4" />}
            className="px-4 py-2 text-sm rounded-xl border shadow-sm"
          />
          <FilterChip
            label="Genel"
            isActive={filterCategory === "Genel"}
            onClick={() => onCategoryChange("Genel")}
            variant={getCategoryVariant("Genel")}
            icon={<Box className="w-4 h-4" />}
            className="px-4 py-2 text-sm rounded-xl border shadow-sm"
          />
        </div>
      </div>
    </div>
  );
};
