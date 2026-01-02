import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { Trash2, ShoppingBag, Coffee, Sparkles, Bell, Phone, Clock, CheckCircle, MoreVertical } from "lucide-react";
import type { JanitorRequest, Janitor } from "@/types/janitor.types";
import { Button, IconButton } from "@/components/shared/button";
import { formatDateTime, formatRelativeTime } from "@/utils/date";

interface RequestCardProps {
  request: JanitorRequest;
  assignedJanitor?: Janitor;
  onSelect: (request: JanitorRequest) => void;
  onCompleteRequest: (request: JanitorRequest) => void;
}

const getRequestIcon = (type: string) => {
  switch (type) {
    case "trash":
      return <Trash2 className="w-5 h-5" />;
    case "market":
      return <ShoppingBag className="w-5 h-5" />;
    case "bread":
      return <Coffee className="w-5 h-5" />;
    case "cleaning":
      return <Sparkles className="w-5 h-5" />;
    default:
      return <Bell className="w-5 h-5" />;
  }
};

const getRequestIconColors = (type: string) => {
  switch (type) {
    case "trash":
      return "bg-ds-in-destructive-500/10 border-ds-in-destructive-500/30 text-ds-in-destructive-400";
    case "market":
      return "bg-ds-in-success-500/10 border-ds-in-success-500/30 text-ds-in-success-400";
    case "bread":
      return "bg-ds-in-warning-500/10 border-ds-in-warning-500/30 text-ds-in-warning-400";
    case "cleaning":
      return "bg-ds-in-sky-500/10 border-ds-in-sky-500/30 text-ds-in-sky-400";
    default:
      return "bg-ds-in-indigo-500/10 border-ds-in-indigo-500/30 text-ds-in-indigo-400";
  }
};

export const RequestCard: FC<RequestCardProps> = ({
  request,
  assignedJanitor,
  onSelect,
  onCompleteRequest,
}) => {
  const { t } = useTranslation();

  const getRequestLabel = (type: string) => {
    return t(`janitor.requests.types.${type}` as any);
  };

  return (
    <div
      onClick={() => onSelect(request)}
      className="bg-ds-card-light dark:bg-ds-card-dark border border-ds-border-light dark:border-ds-border-dark rounded-2xl p-5 transition-all hover:border-ds-muted-light dark:hover:border-ds-muted-dark cursor-pointer"
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shadow-sm ${getRequestIconColors(request.type)}`}>
          {getRequestIcon(request.type)}
        </div>
        {request.status === "pending" ? (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-ds-in-warning-500/10 text-ds-in-warning-400 border border-ds-in-warning-500/20 text-xs font-bold animate-pulse">
            {t("janitor.requests.status.pending")}
          </span>
        ) : (
          <div className="flex flex-col items-end gap-1">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-ds-in-success-500/10 text-ds-in-success-400 border border-ds-in-success-500/20 text-xs font-bold">
              {t("janitor.requests.status.completed")}
            </span>
            {assignedJanitor && (
              <div className="flex items-center gap-1">
                <img
                  src={assignedJanitor.avatar}
                  alt=""
                  className="w-4 h-4 rounded-full object-cover border border-ds-border-light dark:border-ds-border-dark"
                />
                <span className="text-[10px] text-ds-secondary-light dark:text-ds-secondary-dark">
                  {assignedJanitor.name}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mb-4">
        <h3 className="font-bold text-ds-primary-light dark:text-ds-primary-dark text-lg mb-1">
          {getRequestLabel(request.type)}
        </h3>
        <div className="flex items-center gap-2 text-sm text-ds-secondary-light dark:text-ds-secondary-dark">
          <span className="font-medium text-ds-primary-light dark:text-ds-primary-dark">
            {request.resident?.name || request.residentName || t("common.status.unknown")}
          </span>
          <span className="w-1 h-1 rounded-full bg-ds-muted-light dark:bg-ds-muted-dark"></span>
          <span className="bg-ds-background-light dark:bg-ds-background-dark px-1.5 rounded border border-ds-border-light dark:border-ds-border-dark text-xs font-mono">
            {request.unit?.building?.name || request.blockId || "?"} - {request.unit?.number || request.unitLegacy || "?"}
          </span>
        </div>
        <div className="text-xs text-ds-muted-light dark:text-ds-muted-dark mt-1 flex items-center gap-1">
          <Phone className="w-3 h-3" /> {request.resident?.phone || request.phone || "-"}
        </div>
      </div>

      <div className="pt-4 border-t border-ds-border-light dark:border-ds-border-dark flex justify-between items-end">
        <div className="flex flex-col gap-1.5 text-xs">
          <div className="flex items-center gap-1.5 text-ds-secondary-light dark:text-ds-secondary-dark">
            <Clock className="w-3 h-3" />{" "}
            <div className="flex flex-col">
              <span className="text-ds-primary-light dark:text-ds-primary-dark font-bold leading-none">
                {formatRelativeTime(request.openedAt)}
              </span>
              <span className="text-[10px] text-ds-muted-light dark:text-ds-muted-dark opacity-60 mt-0.5">
                {formatDateTime(request.openedAt)}
              </span>
            </div>
          </div>
          {request.status === "completed" && request.completedAt && (
            <span className="text-[9px] text-ds-in-success-400/40 leading-tight pl-4.5 font-mono">
              {formatDateTime(request.completedAt)}
            </span>
          )}
        </div>

        {request.status === "pending" ? (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onCompleteRequest(request);
            }}
            size="sm"
            leftIcon={<CheckCircle className="w-3.5 h-3.5" />}
            className="bg-ds-in-success-600 hover:bg-ds-in-success-500 text-white shadow-lg shadow-ds-in-success-900/20 opacity-100"
          >
            {t("janitor.requests.modals.actions.complete")}
          </Button>
        ) : (
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onSelect(request);
            }}
            icon={<MoreVertical className="w-4 h-4" />}
            ariaLabel="More options"
            className="hover:bg-ds-accent-light dark:hover:bg-ds-accent-dark text-ds-secondary-light dark:text-ds-secondary-dark hover:text-ds-primary-light dark:hover:text-ds-primary-dark opacity-100"
          />
        )}
      </div>
    </div>
  );
};

