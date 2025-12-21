import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { Trash2, ShoppingBag, Coffee, Sparkles, LayoutGrid, List, ArrowUpDown } from "lucide-react";
import { ButtonGroup } from "@/components/shared/button";
import { FilterChip } from "@/components/shared/inputs/filter-chip";
import { Dropdown } from "@/components/shared/inputs/dropdown";

interface RequestFiltersProps {
  typeFilter: "all" | "trash" | "market" | "cleaning" | "bread";
  onTypeFilterChange: (filter: "all" | "trash" | "market" | "cleaning" | "bread") => void;
  statusSort: "pending_first" | "completed_first";
  onStatusSortChange: (sort: "pending_first" | "completed_first") => void;
  viewMode: "list" | "grid";
  onViewModeChange: (mode: "list" | "grid") => void;
}

export const RequestFilters: FC<RequestFiltersProps> = ({
  typeFilter,
  onTypeFilterChange,
  statusSort,
  onStatusSortChange,
  viewMode,
  onViewModeChange,
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
    <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4">
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

      <div className="flex items-center gap-4">
        <ButtonGroup
          items={[
            { id: "grid", label: "", icon: <LayoutGrid className="w-4 h-4" /> },
            { id: "list", label: "", icon: <List className="w-4 h-4" /> },
          ]}
          activeId={viewMode}
          onChange={(id) => onViewModeChange(id as "grid" | "list")}
        />

        <div className="flex items-center gap-2">
          <span className="text-xs text-ds-muted-light dark:text-ds-muted-dark font-bold uppercase whitespace-nowrap">
            {t("janitor.requests.sorting.label")}
          </span>
          <Dropdown
            options={[
              { value: "pending_first", label: t("janitor.requests.sorting.pendingFirst") },
              { value: "completed_first", label: t("janitor.requests.sorting.completedFirst") },
            ]}
            value={statusSort}
            onChange={(val) => onStatusSortChange(val as "pending_first" | "completed_first")}
            icon={ArrowUpDown}
          />
        </div>
      </div>
    </div>
  );
};

