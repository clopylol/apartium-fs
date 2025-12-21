import type { FC, ReactNode } from "react";
import { X } from "lucide-react";

export interface ActiveFilter {
  key: string;
  label: string;
  value: string;
  onRemove: () => void;
  variant?: "default" | "info" | "warning" | "success" | "destructive";
}

interface ActiveFilterTagProps {
  filter: ActiveFilter;
}

const variantStyles = {
  default: "bg-ds-muted-light dark:bg-ds-muted-dark text-ds-primary-light dark:text-ds-primary-dark border-ds-border-light dark:border-ds-border-dark",
  info: "bg-ds-in-sky-500/10 text-ds-in-sky-400 border-ds-in-sky-500/20",
  warning: "bg-ds-in-warning-500/10 text-ds-in-warning-400 border-ds-in-warning-500/20",
  success: "bg-ds-in-success-500/10 text-ds-in-success-400 border-ds-in-success-500/20",
  destructive: "bg-ds-in-destructive-500/10 text-ds-in-destructive-400 border-ds-in-destructive-500/20",
};

export const ActiveFilterTag: FC<ActiveFilterTagProps> = ({ filter }) => {
  const variant = filter.variant || "default";
  const styles = variantStyles[variant];

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border ${styles} transition-all group`}
    >
      <span className="text-ds-secondary-light dark:text-ds-secondary-dark">
        {filter.label}:
      </span>
      <span className="font-semibold">{filter.value}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          filter.onRemove();
        }}
        className="ml-1 opacity-60 hover:opacity-100 transition-opacity p-0.5 hover:bg-ds-background-light/20 dark:hover:bg-ds-background-dark/20 rounded"
        aria-label={`${filter.label} filtresini kaldır`}
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
};

