import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { X, UserCog, Phone, Clock, CheckCircle, Trash2, ShoppingBag, Coffee, Sparkles, Bell, FileText } from "lucide-react";
import type { JanitorRequest, Janitor } from "@/types/janitor.types";
import { Button, IconButton } from "@/components/shared/button";
import { InfoBanner } from "@/components/shared/info-banner";

import { formatDateTime, formatRelativeTime } from "@/utils/date";

interface RequestDetailModalProps {
  isOpen: boolean;
  request: JanitorRequest | null;
  assignedJanitor?: Janitor;
  onClose: () => void;
  onComplete: (request: JanitorRequest) => void;
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

export const RequestDetailModal: FC<RequestDetailModalProps> = ({
  isOpen,
  request,
  assignedJanitor,
  onClose,
  onComplete,
}) => {
  const { t } = useTranslation();

  if (!isOpen || !request) return null;

  const getRequestLabel = (type: string) => {
    return t(`janitor.requests.types.${type}` as any);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ds-background-dark/80 dark:bg-ds-background-dark/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-ds-card-light dark:bg-ds-card-dark border border-ds-border-light dark:border-ds-border-dark rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-ds-border-light dark:border-ds-border-dark bg-ds-card-light dark:bg-ds-card-dark flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-ds-primary-light dark:text-ds-primary-dark flex items-center gap-2">
              {getRequestIcon(request.type)}
              {getRequestLabel(request.type)}
            </h2>
            <p className="text-xs text-ds-muted-light dark:text-ds-muted-dark font-mono mt-0.5">
              {request.id}
            </p>
          </div>
          <IconButton
            onClick={onClose}
            icon={<X className="w-5 h-5" />}
            ariaLabel="Close modal"
            className="text-ds-secondary-light dark:text-ds-secondary-dark hover:text-ds-primary-light dark:hover:text-ds-primary-dark bg-ds-accent-light dark:bg-ds-accent-dark"
          />
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-ds-muted-light dark:text-ds-muted-dark font-medium uppercase mb-1">
                {t("common.labels.status")}
              </p>
              {request.status === "pending" ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold bg-ds-in-warning-500/10 text-ds-in-warning-400 border border-ds-in-warning-500/20">
                  <Clock className="w-4 h-4" /> {t("janitor.requests.status.pending")}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold bg-ds-in-success-500/10 text-ds-in-success-400 border border-ds-in-success-500/20">
                  <CheckCircle className="w-4 h-4" /> {t("janitor.requests.status.completed")}
                </span>
              )}
            </div>
            <div className="text-right">
              <p className="text-xs text-ds-muted-light dark:text-ds-muted-dark font-medium uppercase mb-1">
                {t("janitor.requests.labels.requestTime")}
              </p>
              <div className="flex flex-col items-end">
                <p className="text-ds-primary-light dark:text-ds-primary-dark font-bold text-sm">
                  {formatRelativeTime(request.openedAt)}
                </p>
                <p className="text-ds-muted-light dark:text-ds-muted-dark text-[10px] font-mono opacity-60 mt-0.5">
                  {formatDateTime(request.openedAt)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-ds-background-light dark:bg-ds-background-dark rounded-xl p-4 border border-ds-border-light dark:border-ds-border-dark flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-ds-card-light dark:bg-ds-card-dark border border-ds-border-light dark:border-ds-border-dark flex items-center justify-center shrink-0">
              <UserCog className="w-6 h-6 text-ds-in-sky-500" />
            </div>
            <div>
              <h3 className="text-ds-primary-light dark:text-ds-primary-dark font-bold text-base">
                {request.resident?.name || request.residentName || "Bilinmeyen Sakin"}
              </h3>
              <p className="text-ds-secondary-light dark:text-ds-secondary-dark text-sm font-mono">
                {request.unit?.building?.name || request.blockId || "?"} - {request.unit?.number || request.unitLegacy || "?"}
              </p>
              <p className="text-ds-muted-light dark:text-ds-muted-dark text-xs mt-1 flex items-center gap-1">
                <Phone className="w-3 h-3" /> {request.resident?.phone || request.phone || "-"}
              </p>
            </div>
          </div>

          {request.note && (
            <InfoBanner
              icon={<FileText className="w-5 h-5" />}
              title={t("janitor.requests.labels.note")}
              description={`"${request.note}"`}
              variant="info"
            />
          )}

          {request.status === "completed" && (
            <div className="space-y-4">
              <div className="bg-ds-in-success-900/10 border border-ds-in-success-900/20 p-4 rounded-xl flex justify-between items-center">
                <div>
                  <p className="text-xs font-bold text-ds-in-success-500 uppercase mb-1">
                    {t("janitor.requests.labels.completedAt")}
                  </p>
                  <div className="flex flex-col items-start gap-0.5">
                    <p className="text-sm text-ds-in-success-100 font-bold">
                      {request.completedAt ? formatRelativeTime(request.completedAt) : t("common.status.unknown")}
                    </p>
                    <p className="text-[10px] text-ds-in-success-400/50 font-mono">
                      {request.completedAt ? formatDateTime(request.completedAt) : ""}
                    </p>
                  </div>
                </div>
                {assignedJanitor && (
                  <div className="text-right">
                    <p className="text-xs font-bold text-ds-in-success-500 uppercase mb-1">
                      {t("janitor.requests.labels.completedBy")}
                    </p>
                    <p className="text-sm text-ds-in-success-100">{assignedJanitor.name}</p>
                  </div>
                )}
              </div>

              {request.completionNote && request.completionNote !== "null" && (
                <InfoBanner
                  icon={<CheckCircle className="w-5 h-5" />}
                  title={t("janitor.requests.labels.completionNote")}
                  description={`"${request.completionNote}"`}
                  variant="success"
                />
              )}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-ds-border-light dark:border-ds-border-dark bg-ds-background-light/50 dark:bg-ds-background-dark/50 flex gap-3">
          <Button
            onClick={onClose}
            variant="secondary"
            className="flex-1 bg-ds-accent-light dark:bg-ds-accent-dark hover:bg-ds-muted-light dark:hover:bg-ds-muted-dark text-ds-primary-light dark:text-ds-primary-dark"
          >
            {t("common.buttons.close")}
          </Button>
          {request.status === "pending" && (
            <Button
              onClick={() => onComplete(request)}
              leftIcon={<CheckCircle className="w-4 h-4" />}
              className="flex-[2] bg-ds-in-success-600 hover:bg-ds-in-success-500 text-white shadow-lg shadow-ds-in-success-900/20"
            >
              {t("janitor.requests.modals.actions.complete")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

