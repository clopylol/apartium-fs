import type { FC } from "react";
import { Tag, MapPin, Clock, Eye } from "lucide-react";
import type { MaintenanceRequest } from "@/types/maintenance.types";
import { MaintenanceStatusBadge, MaintenancePriorityBadge } from "@/components/shared/status-badge";

interface MaintenanceCardProps {
  request: MaintenanceRequest;
  onSelect: (request: MaintenanceRequest) => void;
}

export const MaintenanceCard: FC<MaintenanceCardProps> = ({
  request,
  onSelect,
}) => {
  const getStatusLabel = (status: MaintenanceRequest["status"]): string => {
    switch (status) {
      case "New":
        return "YENİ";
      case "In Progress":
        return "İŞLENİYOR";
      case "Completed":
        return "BİTTİ";
      default:
        return status;
    }
  };

  const getStatusStyles = (status: MaintenanceRequest["status"]): string => {
    switch (status) {
      case "New":
        return "bg-ds-in-sky-500/10 text-ds-in-sky-400";
      case "In Progress":
        return "bg-ds-in-warning-500/10 text-ds-in-warning-400";
      case "Completed":
        return "bg-ds-in-success-500/10 text-ds-in-success-400";
      default:
        return "bg-ds-muted-light dark:bg-ds-muted-dark text-ds-secondary-light dark:text-ds-secondary-dark";
    }
  };

  return (
    <div
      className="bg-ds-card-light dark:bg-ds-card-dark border border-ds-border-light dark:border-ds-border-dark rounded-2xl p-5 hover:border-ds-in-sky-500/30 transition-all group flex flex-col justify-between animate-in fade-in duration-300"
    >
      <div>
        <div className="flex justify-between items-start mb-4">
          <MaintenancePriorityBadge priority={request.priority} />
          <span
            className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide ${getStatusStyles(request.status)}`}
          >
            {getStatusLabel(request.status)}
          </span>
        </div>

        <div className="mb-4">
          <h3
            className="text-ds-primary-light dark:text-ds-primary-dark font-bold text-lg leading-tight mb-1 group-hover:text-ds-in-sky-500 transition-colors cursor-pointer"
            onClick={() => onSelect(request)}
          >
            {request.title}
          </h3>
          <div className="flex items-center gap-2 text-ds-muted-light dark:text-ds-muted-dark text-xs">
            <Tag className="w-3 h-3" />
            {request.category}
          </div>
        </div>

        <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-ds-background-light dark:bg-ds-background-dark border border-ds-border-light dark:border-ds-border-dark">
          <img
            src={request.avatar}
            alt=""
            className="w-10 h-10 rounded-full object-cover border border-ds-border-light dark:border-ds-border-dark"
          />
          <div>
            <div className="text-sm font-medium text-ds-primary-light dark:text-ds-primary-dark">
              {request.user}
            </div>
            <div className="text-xs text-ds-muted-light dark:text-ds-muted-dark flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Daire {request.unit}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-ds-border-light dark:border-ds-border-dark text-xs text-ds-muted-light dark:text-ds-muted-dark">
        <div className="flex items-center gap-1.5 font-medium">
          <Clock className="w-3.5 h-3.5" />
          {request.date}
        </div>
        <div className="flex gap-2">
          <span className="font-mono opacity-50">{request.id}</span>
          <button
            onClick={() => onSelect(request)}
            className="hover:text-ds-primary-light dark:hover:text-ds-primary-dark transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

