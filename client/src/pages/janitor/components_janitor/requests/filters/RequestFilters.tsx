import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { Trash2, ShoppingBag, Coffee, Sparkles, LayoutGrid, List, ArrowUpDown, Clock, CheckCircle } from "lucide-react";
import { ButtonGroup } from "@/components/shared/button";
import { FilterChip } from "@/components/shared/inputs/filter-chip";

interface RequestFiltersProps {
  typeFilter: "all" | "trash" | "market" | "cleaning" | "bread";
  onTypeFilterChange: (filter: "all" | "trash" | "market" | "cleaning" | "bread") => void;
  statusFilter: "pending" | "completed" | "all";
  onStatusFilterChange: (filter: "pending" | "completed" | "all") => void;
  viewMode: "list" | "grid";
  onViewModeChange: (mode: "list" | "grid") => void;
}

export const RequestFilters: FC<RequestFiltersProps> = ({
  typeFilter,
  onTypeFilterChange,
  viewMode,
  onViewModeChange,
  statusFilter,
  onStatusFilterChange,
}) => {
  const { t } = useTranslation();

  // Filter type'a göre variant mapping
  const getFilterVariant = (filterType: string): "default" | "primary" | "secondary" | "success" | "warning" | "destructive" | "info" => {
    const variantMap: Record<string, "default" | "primary" | "secondary" | "success" | "warning" | "destructive" | "info"> = {
      all: "primary",
      trash: "destructive",
      market: "success",
      bread: "warning",
      cleaning: "info",
    };
    return variantMap[filterType] || "default";
  };

  return (
    <div className="flex flex-col gap-4 text-ds-primary-light">
      {/* Üst Sıra: Durum Filtreleri (Pending, Completed, All) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-ds-background-light/50 dark:bg-ds-background-dark/50 p-2 rounded-2xl border border-ds-border-light dark:border-ds-border-dark">
        <div className="flex items-center gap-2 pl-2">
          <ArrowUpDown className="w-4 h-4 text-ds-muted-light dark:text-ds-muted-dark" />
          <span className="text-xs font-bold text-ds-muted-light dark:text-ds-muted-dark uppercase tracking-wider">
            {t("janitor.requests.filters.statusTitle")}
          </span>
        </div>

        <ButtonGroup
          items={[
            { id: "pending", label: t("janitor.requests.status.pending"), icon: <Clock className="w-4 h-4" /> },
            { id: "completed", label: t("janitor.requests.status.completed"), icon: <CheckCircle className="w-4 h-4" /> },
            { id: "all", label: t("janitor.requests.filters.all"), icon: <LayoutGrid className="w-4 h-4" /> },
          ]}
          activeId={statusFilter}
          onChange={(id) => onStatusFilterChange(id as "pending" | "completed" | "all")}
          className="w-full sm:w-auto"
        />
      </div>

      {/* Alt Sıra: Kategori Filtreleri ve Görünüm Modu */}
      <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4 px-1">
        <div className="flex items-center gap-3 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto custom-scrollbar">
          <FilterChip
            label={t("janitor.requests.filters.all")}
            isActive={typeFilter === "all"}
            onClick={() => onTypeFilterChange("all")}
            variant={getFilterVariant("all")}
            className="px-4 py-2.5 text-sm rounded-xl"
          />
          <FilterChip
            label={t("janitor.requests.filters.trash")}
            isActive={typeFilter === "trash"}
            onClick={() => onTypeFilterChange("trash")}
            variant={getFilterVariant("trash")}
            icon={<Trash2 className="w-4 h-4" />}
            className="px-4 py-2.5 text-sm rounded-xl"
          />
          <FilterChip
            label={t("janitor.requests.filters.market")}
            isActive={typeFilter === "market"}
            onClick={() => onTypeFilterChange("market")}
            variant={getFilterVariant("market")}
            icon={<ShoppingBag className="w-4 h-4" />}
            className="px-4 py-2.5 text-sm rounded-xl"
          />
          <FilterChip
            label={t("janitor.requests.filters.bread")}
            isActive={typeFilter === "bread"}
            onClick={() => onTypeFilterChange("bread")}
            variant={getFilterVariant("bread")}
            icon={<Coffee className="w-4 h-4" />}
            className="px-4 py-2.5 text-sm rounded-xl"
          />
          <FilterChip
            label={t("janitor.requests.filters.cleaning")}
            isActive={typeFilter === "cleaning"}
            onClick={() => onTypeFilterChange("cleaning")}
            variant={getFilterVariant("cleaning")}
            icon={<Sparkles className="w-4 h-4" />}
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
