import type { FC } from "react";
import type { MaintenancePriority } from "@/types/maintenance.types";

interface MaintenancePriorityBadgeProps {
  priority: MaintenancePriority;
}

const getPriorityStyles = (priority: MaintenancePriority): string => {
  switch (priority) {
    case "Urgent":
      return "bg-ds-in-destructive-500/20 text-ds-in-destructive-400 border-ds-in-destructive-500/30";
    case "High":
      return "bg-ds-in-orange-500/20 text-ds-in-orange-400 border-ds-in-orange-500/30";
    case "Medium":
      return "bg-ds-in-warning-500/20 text-ds-in-warning-400 border-ds-in-warning-500/30";
    case "Low":
      return "bg-ds-in-sky-500/20 text-ds-in-sky-400 border-ds-in-sky-500/30";
    default:
      return "bg-ds-muted-light dark:bg-ds-muted-dark text-ds-secondary-light dark:text-ds-secondary-dark border-ds-border-light dark:border-ds-border-dark";
  }
};

const getPriorityLabel = (priority: MaintenancePriority): string => {
  switch (priority) {
    case "Urgent":
      return "Acil";
    case "High":
      return "Yüksek";
    case "Medium":
      return "Orta";
    case "Low":
      return "Düşük";
    default:
      return priority;
  }
};

export const MaintenancePriorityBadge: FC<MaintenancePriorityBadgeProps> = ({
  priority,
}) => {
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getPriorityStyles(priority)}`}
    >
      {getPriorityLabel(priority)}
    </span>
  );
};

