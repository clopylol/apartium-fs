import type { FC } from "react";
import { useTranslation } from "react-i18next";
import {
  Trash2,
  ShoppingBag,
  Coffee,
  Sparkles,
  Bell,
  Phone,
  Clock,
  CheckCircle,
  MoreVertical,
} from "lucide-react";
import type { JanitorRequest, Janitor } from "@/types/janitor.types";
import { RequestRowSkeleton } from "../../skeletons";
import { IconButton } from "@/components/shared/button";

interface RequestsTableProps {
  requests: JanitorRequest[];
  isLoading: boolean;
  getJanitor: (id?: string) => Janitor | undefined;
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

export const RequestsTable: FC<RequestsTableProps> = ({
  requests,
  isLoading,
  getJanitor,
  onSelect,
  onCompleteRequest,
}) => {
  const { t } = useTranslation();

  const getRequestLabel = (type: string) => {
    return t(`janitor.requests.types.${type}` as any);
  };

  return (
    <div className="bg-ds-card-light dark:bg-ds-card-dark border border-ds-border-light dark:border-ds-border-dark rounded-2xl overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-ds-border-light dark:border-ds-border-dark bg-ds-background-light/50 dark:bg-ds-background-dark/50 text-xs uppercase text-ds-muted-light dark:text-ds-muted-dark font-semibold tracking-wider">
              <th className="px-6 py-4 w-16">{t("janitor.requests.table.columns.type")}</th>
              <th className="px-6 py-4">{t("janitor.requests.table.columns.resident")}</th>
              <th className="px-6 py-4">{t("janitor.requests.table.columns.blockUnit")}</th>
              <th className="px-6 py-4">{t("janitor.requests.table.columns.subject")}</th>
              <th className="px-6 py-4">{t("janitor.requests.table.columns.timeStatus")}</th>
              <th className="px-6 py-4 text-right">{t("janitor.requests.table.columns.actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ds-border-light/50 dark:divide-ds-border-dark/50">
            {isLoading ? (
              <>
                <RequestRowSkeleton />
                <RequestRowSkeleton />
                <RequestRowSkeleton />
              </>
            ) : requests.length > 0 ? (
              requests.map((req) => {
                const assignedJanitor = getJanitor(req.assignedJanitorId);
                return (
                  <tr
                    key={req.id}
                    onClick={() => onSelect(req)}
                    className="hover:bg-ds-accent-light/30 dark:hover:bg-ds-accent-dark/30 transition-colors group cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className={`w-10 h-10 rounded-lg border flex items-center justify-center ${getRequestIconColors(req.type)}`}>
                        {getRequestIcon(req.type)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-ds-primary-light dark:text-ds-primary-dark">
                        {req.residentName}
                      </div>
                      <div className="text-xs text-ds-muted-light dark:text-ds-muted-dark mt-0.5 flex items-center gap-1 opacity-70">
                        <Phone className="w-3 h-3" /> {req.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-ds-background-light dark:bg-ds-background-dark text-ds-secondary-light dark:text-ds-secondary-dark px-2 py-1 rounded border border-ds-border-light dark:border-ds-border-dark text-xs font-mono">
                        {req.blockId} - {req.unit}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-ds-primary-light dark:text-ds-primary-dark font-medium">
                        {getRequestLabel(req.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5">
                        {req.status === "pending" ? (
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-ds-in-warning-500/10 text-ds-in-warning-400 border border-ds-in-warning-500/20 text-[10px] font-bold uppercase tracking-wide animate-pulse">
                              {t("janitor.requests.status.pending")}
                            </span>
                            <span className="text-ds-muted-light dark:text-ds-muted-dark text-xs flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {req.openedAt}
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-1">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-ds-in-success-500/10 text-ds-in-success-400 border border-ds-in-success-500/20 text-[10px] font-bold uppercase tracking-wide w-fit">
                              {t("janitor.requests.status.completed")}
                            </span>
                            {assignedJanitor && (
                              <div className="flex items-center gap-1.5 mt-0.5">
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
                            {req.completedAt && (
                              <span className="text-[10px] text-ds-in-success-400/50 font-mono">
                                {req.completedAt}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-100">
                        {req.status === "pending" ? (
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              onCompleteRequest(req);
                            }}
                            icon={<CheckCircle className="w-5 h-5" />}
                            ariaLabel={t("janitor.requests.modals.actions.markComplete")}
                            className="hover:bg-ds-in-success-900/20 text-ds-secondary-light dark:text-ds-secondary-dark hover:text-ds-in-success-400"
                          />
                        ) : (
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelect(req);
                            }}
                            icon={<MoreVertical className="w-5 h-5" />}
                            ariaLabel="More options"
                            className="hover:bg-ds-accent-light dark:hover:bg-ds-accent-dark text-ds-secondary-light dark:text-ds-secondary-dark hover:text-ds-primary-light dark:hover:text-ds-primary-dark"
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-ds-muted-light dark:text-ds-muted-dark">
                  {t("janitor.requests.table.noResults")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

