import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { Package, Calendar, Clock, ArrowRight, MoreVertical, RotateCcw } from "lucide-react";
import type { CargoItem } from "@/types/cargo.types";
import { CargoRowSkeleton } from "../../skeletons";
import { CargoStatusBadge } from "@/components/shared/status-badge";
import { getCarrierColor } from "@/utils/cargo";

interface CargoInventoryTableProps {
  items: CargoItem[];
  isLoading: boolean;
  statusFilter: "all" | "received" | "delivered" | "returned";
  onStatusFilterChange: (filter: "all" | "received" | "delivered" | "returned") => void;
  onDeliver: (id: string) => void;
  onReturn: (id: string) => void;
}

export const CargoInventoryTable: FC<CargoInventoryTableProps> = ({
  items,
  isLoading,
  statusFilter,
  onStatusFilterChange,
  onDeliver,
  onReturn,
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-ds-card-light dark:bg-ds-card-dark border border-ds-border-light dark:border-ds-border-dark rounded-2xl overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-ds-border-light dark:border-ds-border-dark bg-ds-background-light/50 dark:bg-ds-background-dark/50 text-xs uppercase text-ds-muted-light dark:text-ds-muted-dark font-semibold tracking-wider">
              <th className="px-6 py-4">{t("cargo.table.columns.cargoInfo")}</th>
              <th className="px-6 py-4">{t("cargo.table.columns.recipientUnit")}</th>
              <th className="px-6 py-4">{t("cargo.table.columns.arrivalTime")}</th>
              <th className="px-6 py-4">{t("cargo.table.columns.status")}</th>
              <th className="px-6 py-4 text-right">{t("cargo.table.columns.actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ds-border-light dark:divide-ds-border-dark">
            {isLoading ? (
              <>
                <CargoRowSkeleton />
                <CargoRowSkeleton />
                <CargoRowSkeleton />
                <CargoRowSkeleton />
                <CargoRowSkeleton />
              </>
            ) : (
              <>
                {items.length > 0 ? (
                  items.map((item) => (
                    <tr key={item.id} className="hover:bg-ds-background-light dark:hover:bg-ds-background-dark transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-ds-background-light dark:bg-ds-background-dark flex items-center justify-center shrink-0 text-ds-muted-light dark:text-ds-muted-dark">
                            <Package className="w-5 h-5" />
                          </div>
                          <div>
                            <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded border w-fit mb-1 ${getCarrierColor(item.carrier)}`}>
                              {item.carrier}
                            </div>
                            <div className="text-xs text-ds-muted-light dark:text-ds-muted-dark font-mono tracking-wide">{item.trackingNo}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-ds-in-indigo-500/10 flex items-center justify-center text-ds-in-indigo-400 text-xs font-bold shrink-0">
                            {item.unit}
                          </div>
                          <div>
                            <div className="font-medium text-ds-primary-light dark:text-ds-primary-dark text-sm">{item.recipientName}</div>
                            <div className="text-xs text-ds-muted-light dark:text-ds-muted-dark">
                              {item.type} {t("cargo.table.package")}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col text-sm text-ds-secondary-light dark:text-ds-secondary-dark">
                          <span className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-ds-muted-light dark:text-ds-muted-dark" /> {item.arrivalDate}
                          </span>
                          <span className="flex items-center gap-2 text-xs text-ds-muted-light dark:text-ds-muted-dark mt-0.5">
                            <Clock className="w-3.5 h-3.5" /> {item.arrivalTime}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <CargoStatusBadge status={item.status} deliveredDate={item.deliveredDate} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        {item.status === "received" ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => onReturn(item.id)}
                              className="p-2 bg-ds-background-light dark:bg-ds-background-dark hover:bg-ds-in-destructive-500/20 hover:text-ds-in-destructive-400 text-ds-muted-light dark:text-ds-muted-dark rounded-lg transition-colors border border-transparent hover:border-ds-in-destructive-500/30"
                              title={t("cargo.table.actions.return")}
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onDeliver(item.id)}
                              className="flex items-center gap-2 px-3 py-2 bg-ds-in-success-600 hover:bg-ds-in-success-500 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-ds-in-success-900/20"
                            >
                              {t("cargo.table.actions.deliver")} <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <button className="p-2 text-ds-muted-light dark:text-ds-muted-dark hover:text-ds-primary-light dark:hover:text-ds-primary-dark hover:bg-ds-background-light dark:hover:bg-ds-background-dark rounded-lg transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-ds-muted-light dark:text-ds-muted-dark">
                      <Package className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p>{t("cargo.table.noRecords")}</p>
                    </td>
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

