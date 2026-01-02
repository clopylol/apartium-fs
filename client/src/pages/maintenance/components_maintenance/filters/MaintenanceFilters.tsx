import type { FC } from "react";
import { useTranslation } from "react-i18next";
import {
  ArrowUpDown,
  Clock,
  CheckCircle,
  LayoutGrid,
  List,
  Droplets,
  Zap,
  Thermometer,
  Box,
  Circle,
  PlayCircle
} from "lucide-react";
import { ButtonGroup } from "@/components/shared/button";
import { FilterChip } from "@/components/shared/inputs/filter-chip";
import type { MaintenanceStatus, MaintenancePriority, MaintenanceCategory } from "@/types/maintenance.types";
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
}

export const MaintenanceFilters: FC<MaintenanceFiltersProps> = ({
  filterStatus,
  onStatusChange,
  filterCategory,
  onCategoryChange,
  viewMode,
  onViewModeChange,
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
      {/* Üst Sıra: Durum Filtreleri */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-ds-background-light/50 dark:bg-ds-background-dark/50 p-2 rounded-2xl border border-ds-border-light dark:border-ds-border-dark">
        <div className="flex items-center gap-2 pl-2">
          <ArrowUpDown className="w-4 h-4 text-ds-muted-light dark:text-ds-muted-dark" />
          <span className="text-xs font-bold text-ds-muted-light dark:text-ds-muted-dark uppercase tracking-wider">
            {t("maintenance.filters.statusTitle", "Bakım Talepleri")}
          </span>
        </div>

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

      {/* Alt Sıra: Kategori Filtreleri ve Görünüm Modu */}
      <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4 px-1">
        <div className="flex items-center gap-3 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto custom-scrollbar">
          <FilterChip
            label={t("common.all", "Tümü")}
            isActive={filterCategory === "All"}
            onClick={() => onCategoryChange("All")}
            variant={getCategoryVariant("All")}
            className="px-4 py-2.5 text-sm rounded-xl"
          />
          <FilterChip
            label="Tesisat"
            isActive={filterCategory === "Tesisat"}
            onClick={() => onCategoryChange("Tesisat")}
            variant={getCategoryVariant("Tesisat")}
            icon={<Droplets className="w-4 h-4" />}
            className="px-4 py-2.5 text-sm rounded-xl"
          />
          <FilterChip
            label="Elektrik"
            isActive={filterCategory === "Elektrik"}
            onClick={() => onCategoryChange("Elektrik")}
            variant={getCategoryVariant("Elektrik")}
            icon={<Zap className="w-4 h-4" />}
            className="px-4 py-2.5 text-sm rounded-xl"
          />
          <FilterChip
            label="Isıtma/Soğutma"
            isActive={filterCategory === "Isıtma/Soğutma"}
            onClick={() => onCategoryChange("Isıtma/Soğutma")}
            variant={getCategoryVariant("Isıtma/Soğutma")}
            icon={<Thermometer className="w-4 h-4" />}
            className="px-4 py-2.5 text-sm rounded-xl"
          />
          <FilterChip
            label="Genel"
            isActive={filterCategory === "Genel"}
            onClick={() => onCategoryChange("Genel")}
            variant={getCategoryVariant("Genel")}
            icon={<Box className="w-4 h-4" />}
            className="px-4 py-2.5 text-sm rounded-xl"
          />
        </div>

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
  );
};

