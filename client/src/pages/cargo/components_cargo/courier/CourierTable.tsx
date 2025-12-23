import type { FC, ReactNode } from "react";
import { Bike, ShoppingBag, Utensils, LogIn, LogOut, Smartphone } from "lucide-react";
import type { CourierVisit } from "@/types/cargo.types";
import { CourierRowSkeleton } from "../skeletons";
import { CourierStatusBadge } from "@/components/shared/status-badge";
import { FilterChip } from "@/components/shared/inputs/filter-chip";
import { Button } from "@/components/shared/button";

interface CourierTableProps {
  items: CourierVisit[];
  isLoading: boolean;
  courierFilter: "all" | "pending" | "inside";
  onFilterChange: (filter: "all" | "pending" | "inside") => void;
  onEntry: (id: string) => void;
  onExit: (id: string) => void;
  rightContent?: ReactNode;
}

export const CourierTable: FC<CourierTableProps> = ({
  items,
  isLoading,
  courierFilter,
  onFilterChange,
  onEntry,
  onExit,
  rightContent,
}) => {
  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 px-1 -mx-1 sm:mx-0 sm:px-0 custom-scrollbar">
          <FilterChip
            label="Tümü"
            isActive={courierFilter === "all"}
            onClick={() => onFilterChange("all")}
            className="px-4 py-2.5 text-sm rounded-xl"
          />
          <FilterChip
            label="Bekleyenler"
            isActive={courierFilter === "pending"}
            onClick={() => onFilterChange("pending")}
            variant="warning"
            icon={<Smartphone className="w-4 h-4" />}
            className="px-4 py-2.5 text-sm rounded-xl"
          />
          <FilterChip
            label="İçeridekiler"
            isActive={courierFilter === "inside"}
            onClick={() => onFilterChange("inside")}
            variant="info"
            icon={<LogIn className="w-4 h-4" />}
            className="px-4 py-2.5 text-sm rounded-xl"
          />
        </div>
        {rightContent && (
          <div className="shrink-0">
            {rightContent}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-ds-card-light dark:bg-ds-card-dark border border-ds-border-light dark:border-ds-border-dark rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-ds-border-light dark:border-ds-border-dark bg-ds-background-light/50 dark:bg-ds-background-dark/50 text-xs uppercase text-ds-muted-light dark:text-ds-muted-dark font-semibold tracking-wider">
                <th className="px-6 py-4">Firma / Plaka</th>
                <th className="px-6 py-4">Sipariş Sahibi</th>
                <th className="px-6 py-4">Zaman</th>
                <th className="px-6 py-4">Durum</th>
                <th className="px-6 py-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ds-border-light dark:divide-ds-border-dark">
              {isLoading ? (
                <>
                  <CourierRowSkeleton />
                  <CourierRowSkeleton />
                  <CourierRowSkeleton />
                  <CourierRowSkeleton />
                  <CourierRowSkeleton />
                </>
              ) : (
                <>
                  {items.length > 0 ? (
                    items.map((item) => (
                      <tr key={item.id} className="hover:bg-ds-background-light dark:hover:bg-ds-background-dark transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-ds-background-light dark:bg-ds-background-dark border border-ds-border-light dark:border-ds-border-dark flex items-center justify-center shrink-0">
                              {item.company.includes("Yemek") || item.company.includes("Domino") || item.company.includes("Burger") ? (
                                <Utensils className="w-5 h-5 text-ds-in-orange-400" />
                              ) : (
                                <ShoppingBag className="w-5 h-5 text-ds-in-sky-400" />
                              )}
                            </div>
                            <div>
                              <div className="text-sm font-bold text-ds-primary-light dark:text-ds-primary-dark mb-0.5">{item.company}</div>
                              {item.plate ? (
                                <div className="font-mono text-xs text-ds-muted-light dark:text-ds-muted-dark bg-ds-background-light dark:bg-ds-background-dark px-1.5 py-0.5 rounded border border-ds-border-light dark:border-ds-border-dark w-fit">
                                  {item.plate}
                                </div>
                              ) : (
                                <div className="text-xs text-ds-muted-light dark:text-ds-muted-dark font-medium">Yaya Kurye</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-ds-primary-light dark:text-ds-primary-dark text-sm">{item.residentName}</div>
                          <div className="text-xs text-ds-muted-light dark:text-ds-muted-dark">Daire {item.unit}</div>
                          {item.note && (
                            <div className="text-[10px] text-ds-in-warning-500/80 mt-1 italic">"{item.note}"</div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {item.entryTime ? (
                            <div className="flex flex-col text-sm text-ds-secondary-light dark:text-ds-secondary-dark">
                              <span className="flex items-center gap-2">
                                <LogIn className="w-3.5 h-3.5 text-ds-in-success-500" /> {item.entryTime}
                              </span>
                              {item.exitTime && (
                                <span className="flex items-center gap-2 text-xs text-ds-muted-light dark:text-ds-muted-dark mt-0.5">
                                  <LogOut className="w-3.5 h-3.5 text-ds-in-destructive-500" /> {item.exitTime}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-ds-muted-light dark:text-ds-muted-dark">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <CourierStatusBadge
                            status={item.status}
                            customLabels={{
                              pending: "App Bildirimi",
                              inside: "İçeride",
                              completed: "Çıkış Yaptı",
                            }}
                          />
                        </td>
                        <td className="px-6 py-4 text-right">
                          {item.status === "pending" && (
                            <Button
                              onClick={() => onEntry(item.id)}
                              size="sm"
                              leftIcon={<LogIn className="w-3.5 h-3.5" />}
                              className="bg-ds-in-sky-600 hover:bg-ds-in-sky-500 shadow-lg shadow-ds-in-sky-900/20"
                            >
                              Giriş Yap
                            </Button>
                          )}
                          {item.status === "inside" && (
                            <Button
                              onClick={() => onExit(item.id)}
                              size="sm"
                              variant="secondary"
                              leftIcon={<LogOut className="w-3.5 h-3.5" />}
                            >
                              Çıkış Yap
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-ds-muted-light dark:text-ds-muted-dark">
                        <Bike className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>Kayıt bulunamadı.</p>
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

