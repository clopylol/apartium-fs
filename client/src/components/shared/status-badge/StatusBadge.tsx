import type { FC, ReactNode } from "react";
import { Clock, CheckCircle, RotateCcw, CarFront } from "lucide-react";

export type StatusBadgeVariant = "warning" | "success" | "destructive" | "info" | "default";
export type StatusBadgeType = "cargo" | "courier";

interface StatusBadgeProps {
  variant: StatusBadgeVariant;
  label: string;
  icon?: ReactNode;
  animate?: boolean;
  showDate?: string;
}

const variantStyles: Record<StatusBadgeVariant, string> = {
  warning: "bg-ds-in-warning-500/10 text-ds-in-warning-400 border-ds-in-warning-500/20",
  success: "bg-ds-in-success-500/10 text-ds-in-success-400 border-ds-in-success-500/20",
  destructive: "bg-ds-in-destructive-500/10 text-ds-in-destructive-400 border-ds-in-destructive-500/20",
  info: "bg-ds-in-sky-500/10 text-ds-in-sky-400 border-ds-in-sky-500/20",
  default: "bg-ds-background-light dark:bg-ds-background-dark text-ds-muted-light dark:text-ds-muted-dark border-ds-border-light dark:border-ds-border-dark",
};

export const StatusBadge: FC<StatusBadgeProps> = ({
  variant,
  label,
  icon,
  animate = false,
  showDate,
}) => {
  const baseClasses = "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border";
  const variantClass = variantStyles[variant];
  const animateClass = animate ? "animate-pulse" : "";

  return (
    <div>
      <span className={`${baseClasses} ${variantClass} ${animateClass}`}>
        {icon || <Clock className="w-3.5 h-3.5" />}
        {label}
      </span>
      {showDate && (
        <div className="text-[10px] text-ds-in-success-500/60 mt-1 pl-1">{showDate}</div>
      )}
    </div>
  );
};

// Cargo status badge'leri için helper component'ler
export const CargoStatusBadge: FC<{ status: "received" | "delivered" | "returned"; deliveredDate?: string }> = ({
  status,
  deliveredDate,
}) => {
  switch (status) {
    case "received":
      return (
        <StatusBadge
          variant="warning"
          label="Bekliyor"
          icon={<Clock className="w-3.5 h-3.5" />}
          animate
        />
      );
    case "delivered":
      return (
        <StatusBadge
          variant="success"
          label="Teslim Edildi"
          icon={<CheckCircle className="w-3.5 h-3.5" />}
          showDate={deliveredDate}
        />
      );
    case "returned":
      return (
        <StatusBadge
          variant="destructive"
          label="İade"
          icon={<RotateCcw className="w-3.5 h-3.5" />}
        />
      );
    default:
      return null;
  }
};

// Courier status badge'leri için helper component'ler
export const CourierStatusBadge: FC<{ 
  status: "pending" | "inside" | "completed";
  customLabels?: {
    pending?: string;
    inside?: string;
    completed?: string;
  };
}> = ({
  status,
  customLabels,
}) => {
  switch (status) {
    case "pending":
      return (
        <StatusBadge
          variant="warning"
          label={customLabels?.pending || "Bekliyor"}
          icon={<Clock className="w-3.5 h-3.5" />}
        />
      );
    case "inside":
      return (
        <StatusBadge
          variant="info"
          label={customLabels?.inside || "İçeride"}
          icon={<CarFront className="w-3.5 h-3.5" />}
          animate
        />
      );
    case "completed":
      return (
        <StatusBadge
          variant="default"
          label={customLabels?.completed || "Tamamlandı"}
          icon={<CheckCircle className="w-3.5 h-3.5" />}
        />
      );
    default:
      return null;
  }
};

