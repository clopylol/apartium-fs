import type { FC } from "react";
import { Eye, MoreVertical, ArrowUpDown, Tag, MapPin, Clock } from "lucide-react";
import type { MaintenanceRequest } from "@/types/maintenance.types";
import { IconButton } from "@/components/shared/button";
import { MaintenanceStatusBadge, MaintenancePriorityBadge } from "@/components/shared/status-badge";
import { MaintenanceRowSkeleton } from "../skeletons";

interface MaintenanceTableProps {
  requests: MaintenanceRequest[];
  isLoading: boolean;
  sortOrder: "asc" | "desc";
  onSortToggle: () => void;
  onSelect: (request: MaintenanceRequest) => void;
}

export const MaintenanceTable: FC<MaintenanceTableProps> = ({
  requests,
  isLoading,
  sortOrder,
  onSortToggle,
  onSelect,
}) => {
  if (isLoading) {
    return (
      <div className="bg-ds-card-light dark:bg-ds-card-dark border border-ds-border-light dark:border-ds-border-dark rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-ds-background-light/50 dark:bg-ds-background-dark/50 border-b border-ds-border-light dark:border-ds-border-dark text-xs uppercase tracking-wider text-ds-muted-light dark:text-ds-muted-dark">
              <th className="p-4 font-semibold">ID</th>
              <th className="p-4 font-semibold">Başlık</th>
              <th className="p-4 font-semibold">Talep Eden</th>
              <th className="p-4 font-semibold">Kategori</th>
              <th className="p-4 font-semibold">Tarih</th>
              <th className="p-4 font-semibold">Öncelik</th>
              <th className="p-4 font-semibold">Durum</th>
              <th className="p-4 font-semibold text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ds-border-light dark:divide-ds-border-dark">
            <MaintenanceRowSkeleton />
            <MaintenanceRowSkeleton />
            <MaintenanceRowSkeleton />
            <MaintenanceRowSkeleton />
            <MaintenanceRowSkeleton />
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="bg-ds-card-light dark:bg-ds-card-dark border border-ds-border-light dark:border-ds-border-dark rounded-2xl overflow-hidden shadow-xl">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-ds-background-light/50 dark:bg-ds-background-dark/50 border-b border-ds-border-light dark:border-ds-border-dark text-xs uppercase tracking-wider text-ds-muted-light dark:text-ds-muted-dark">
            <th className="p-4 font-semibold">ID</th>
            <th className="p-4 font-semibold">Başlık</th>
            <th className="p-4 font-semibold">Talep Eden</th>
            <th className="p-4 font-semibold">Kategori</th>
            <th
              className="p-4 font-semibold cursor-pointer hover:text-ds-primary-light dark:hover:text-ds-primary-dark transition-colors group flex items-center gap-1"
              onClick={onSortToggle}
            >
              Tarih
              <ArrowUpDown
                className={`w-3 h-3 transition-opacity ${
                  sortOrder ? "opacity-100" : "opacity-50"
                }`}
              />
            </th>
            <th className="p-4 font-semibold">Öncelik</th>
            <th className="p-4 font-semibold">Durum</th>
            <th className="p-4 font-semibold text-right">İşlemler</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ds-border-light dark:divide-ds-border-dark">
          {requests.map((req) => (
            <tr
              key={req.id}
              className="hover:bg-ds-background-light dark:hover:bg-ds-background-dark transition-colors group animate-in fade-in duration-300"
            >
              <td className="p-4 text-ds-muted-light dark:text-ds-muted-dark font-mono text-sm">
                {req.id}
              </td>
              <td className="p-4 font-medium text-ds-primary-light dark:text-ds-primary-dark">
                {req.title}
              </td>
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <img
                    src={req.avatar}
                    alt=""
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-sm font-medium text-ds-primary-light dark:text-ds-primary-dark">
                      {req.user}
                    </div>
                    <div className="text-xs text-ds-muted-light dark:text-ds-muted-dark">
                      Daire {req.unit}
                    </div>
                  </div>
                </div>
              </td>
              <td className="p-4 text-ds-secondary-light dark:text-ds-secondary-dark text-sm">
                {req.category}
              </td>
              <td className="p-4 text-ds-muted-light dark:text-ds-muted-dark text-sm">
                {req.date}
              </td>
              <td className="p-4">
                          <MaintenancePriorityBadge priority={req.priority} />
                        </td>
                        <td className="p-4">
                          <MaintenanceStatusBadge status={req.status} />
              </td>
              <td className="p-4 text-right">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <IconButton
                    icon={<Eye className="w-4 h-4" />}
                    ariaLabel="Detaylar"
                    onClick={() => onSelect(req)}
                  />
                  <IconButton
                    icon={<MoreVertical className="w-4 h-4" />}
                    ariaLabel="Daha fazla"
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

