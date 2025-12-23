import type { FC } from "react";
import type { MaintenanceStatus } from "@/types/maintenance.types";

interface MaintenanceStatusBadgeProps {
  status: MaintenanceStatus;
}

const getStatusStyles = (status: MaintenanceStatus): string => {
  switch (status) {
    case "In Progress":
      return "bg-ds-in-warning-500/10 text-ds-in-warning-400";
    case "Completed":
      return "bg-ds-in-success-500/10 text-ds-in-success-400";
    case "New":
      return "bg-ds-in-sky-500/10 text-ds-in-sky-400";
    default:
      return "bg-ds-muted-light dark:bg-ds-muted-dark text-ds-secondary-light dark:text-ds-secondary-dark";
  }
};

const getStatusLabel = (status: MaintenanceStatus): string => {
  switch (status) {
    case "In Progress":
      return "İşleniyor";
    case "Completed":
      return "Tamamlandı";
    case "New":
      return "Yeni";
    default:
      return status;
  }
};

export const MaintenanceStatusBadge: FC<MaintenanceStatusBadgeProps> = ({
  status,
}) => {
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyles(status)}`}
    >
      {getStatusLabel(status)}
    </span>
  );
};

