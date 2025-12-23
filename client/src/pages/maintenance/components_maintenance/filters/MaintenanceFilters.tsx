import type { FC, ReactNode } from "react";
import { MultiFilter } from "@/components/shared/inputs/multi-filter";
import type { FilterConfig, ActiveFilter } from "@/components/shared/inputs/multi-filter";
import type { MaintenanceStatus, MaintenancePriority, MaintenanceCategory } from "@/types/maintenance.types";

interface MaintenanceFiltersProps {
  filterStatus: MaintenanceStatus | "All";
  onStatusChange: (value: MaintenanceStatus | "All") => void;
  filterPriority: MaintenancePriority | "All";
  onPriorityChange: (value: MaintenancePriority | "All") => void;
  filterCategory: MaintenanceCategory | "All";
  onCategoryChange: (value: MaintenanceCategory | "All") => void;
  rightContent?: ReactNode;
}

const getStatusLabel = (status: MaintenanceStatus | "All"): string => {
  switch (status) {
    case "New": return "Yeni";
    case "In Progress": return "İşleniyor";
    case "Completed": return "Tamamlandı";
    default: return status;
  }
};

const getPriorityLabel = (priority: MaintenancePriority | "All"): string => {
  switch (priority) {
    case "Low": return "Düşük";
    case "Medium": return "Orta";
    case "High": return "Yüksek";
    case "Urgent": return "Acil";
    default: return priority;
  }
};

export const MaintenanceFilters: FC<MaintenanceFiltersProps> = ({
  filterStatus,
  onStatusChange,
  filterPriority,
  onPriorityChange,
  filterCategory,
  onCategoryChange,
  rightContent,
}) => {
  const filters: FilterConfig[] = [
    {
      key: "status",
      label: "Durum",
      options: [
        { value: "All", label: "Tüm Durumlar" },
        { value: "New", label: "Yeni" },
        { value: "In Progress", label: "İşleniyor" },
        { value: "Completed", label: "Tamamlandı" },
      ],
      value: filterStatus,
      onChange: (value) => onStatusChange(value as MaintenanceStatus | "All"),
      variant: "info",
    },
    {
      key: "priority",
      label: "Öncelik",
      options: [
        { value: "All", label: "Tüm Öncelikler" },
        { value: "Low", label: "Düşük" },
        { value: "Medium", label: "Orta" },
        { value: "High", label: "Yüksek" },
        { value: "Urgent", label: "Acil" },
      ],
      value: filterPriority,
      onChange: (value) => onPriorityChange(value as MaintenancePriority | "All"),
      variant: "destructive",
    },
    {
      key: "category",
      label: "Kategori",
      options: [
        { value: "All", label: "Tüm Kategoriler" },
        { value: "Tesisat", label: "Tesisat" },
        { value: "Elektrik", label: "Elektrik" },
        { value: "Isıtma/Soğutma", label: "Isıtma/Soğutma" },
        { value: "Genel", label: "Genel" },
      ],
      value: filterCategory,
      onChange: (value) => onCategoryChange(value as MaintenanceCategory | "All"),
    },
  ];

  const activeFilters: ActiveFilter[] = [
    ...(filterStatus !== "All"
      ? [
          {
            key: "status",
            label: "Durum",
            value: getStatusLabel(filterStatus),
            onRemove: () => onStatusChange("All"),
            variant: "info" as const,
          },
        ]
      : []),
    ...(filterPriority !== "All"
      ? [
          {
            key: "priority",
            label: "Öncelik",
            value: getPriorityLabel(filterPriority),
            onRemove: () => onPriorityChange("All"),
            variant: "destructive" as const,
          },
        ]
      : []),
    ...(filterCategory !== "All"
      ? [
          {
            key: "category",
            label: "Kategori",
            value: filterCategory,
            onRemove: () => onCategoryChange("All"),
          },
        ]
      : []),
  ];

  return <MultiFilter filters={filters} activeFilters={activeFilters} rightContent={rightContent} />;
};

