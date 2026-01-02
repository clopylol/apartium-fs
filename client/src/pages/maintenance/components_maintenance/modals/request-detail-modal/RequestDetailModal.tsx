import type { FC } from "react";
import { Wrench, Tag, Clock, PlayCircle, CheckCircle } from "lucide-react";
import type { MaintenanceRequest, MaintenanceStatus } from "@/types/maintenance.types";
import { FormModal } from "@/components/shared/modals/form-modal";
import { Button } from "@/components/shared/button";
import { MaintenancePriorityBadge, MaintenanceStatusBadge } from "@/components/shared/status-badge";

interface RequestDetailModalProps {
  isOpen: boolean;
  request: MaintenanceRequest | null;
  onClose: () => void;
  onStatusUpdate: (id: string, status: MaintenanceStatus) => void;
}

export const RequestDetailModal: FC<RequestDetailModalProps> = ({
  isOpen,
  request,
  onClose,
  onStatusUpdate,
}) => {
  if (!request) return null;

  const footer = (
    <div className="flex gap-3">
      <Button
        variant="secondary"
        onClick={onClose}
        className="flex-1 bg-ds-accent-light dark:bg-ds-accent-dark hover:bg-ds-muted-light dark:hover:bg-ds-muted-dark text-ds-primary-light dark:text-ds-primary-dark"
      >
        Kapat
      </Button>
      {request.status === "New" && (
        <Button
          onClick={() => onStatusUpdate(request.id, "In Progress")}
          leftIcon={<PlayCircle className="w-4 h-4" />}
          className="flex-1 bg-ds-in-warning-600 hover:bg-ds-in-warning-500 shadow-lg shadow-ds-in-warning-900/20"
        >
          İşleme Al
        </Button>
      )}
      {request.status === "In Progress" && (
        <Button
          onClick={() => onStatusUpdate(request.id, "Completed")}
          leftIcon={<CheckCircle className="w-4 h-4" />}
          className="flex-1 bg-ds-in-success-600 hover:bg-ds-in-success-500 shadow-lg shadow-ds-in-success-900/20"
        >
          Tamamla
        </Button>
      )}
      <Button className="flex-1">Düzenle</Button>
    </div>
  );

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Talep Detayları"
      titleIcon={<Wrench className="w-5 h-5 text-ds-in-sky-500" />}
      footer={footer}
      maxWidth="lg"
    >
      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-start gap-4 mb-2">
            <h4 className="text-lg font-semibold text-ds-primary-light dark:text-ds-primary-dark leading-tight">
              {request.title}
            </h4>
            <MaintenancePriorityBadge priority={request.priority} />
          </div>
          <div className="flex items-center gap-2 text-ds-secondary-light dark:text-ds-secondary-dark text-sm">
            <Tag className="w-4 h-4 text-ds-in-sky-500" />
            <span>{request.category}</span>
          </div>
        </div>

        <div className="bg-ds-background-light dark:bg-ds-background-dark rounded-xl p-4 flex items-center gap-4 border border-ds-border-light dark:border-ds-border-dark">
          <img
            src={request.avatar}
            className="w-12 h-12 rounded-full ring-2 ring-ds-border-light dark:ring-ds-border-dark"
            alt="User"
          />
          <div>
            <p className="text-ds-primary-light dark:text-ds-primary-dark font-medium text-base">
              {request.user}
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="flex items-center gap-1 px-2 py-0.5 bg-ds-background-light dark:bg-ds-background-dark border border-ds-border-light dark:border-ds-border-dark rounded text-xs text-ds-secondary-light dark:text-ds-secondary-dark font-mono">
                {request.buildingName} - Daire {request.unit}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-ds-in-sky-500/5 border border-ds-in-sky-500/10 rounded-xl p-4">
          <p className="text-xs text-ds-muted-light dark:text-ds-muted-dark font-medium uppercase mb-2 tracking-wide">
            Açıklama
          </p>
          <p className={`text-sm leading-relaxed ${request.description ? 'text-ds-primary-light dark:text-ds-primary-dark' : 'text-ds-muted-light dark:text-ds-muted-dark italic opacity-50'}`}>
            {request.description || "Talep açıklaması belirtilmemiş."}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-ds-background-light dark:bg-ds-background-dark p-4 rounded-xl border border-ds-border-light dark:border-ds-border-dark">
            <p className="text-ds-muted-light dark:text-ds-muted-dark text-xs font-medium mb-1 uppercase tracking-wide">
              Oluşturulma
            </p>
            <div className="flex items-center gap-2 text-ds-primary-light dark:text-ds-primary-dark text-sm font-medium">
              <Clock className="w-4 h-4 text-ds-muted-light dark:text-ds-muted-dark" />
              {request.date}
            </div>
          </div>
          <div className="bg-ds-background-light dark:bg-ds-background-dark p-4 rounded-xl border border-ds-border-light dark:border-ds-border-dark">
            <p className="text-ds-muted-light dark:text-ds-muted-dark text-xs font-medium mb-1 uppercase tracking-wide">
              Durum
            </p>
            <div className="flex items-center gap-2 text-ds-primary-light dark:text-ds-primary-dark text-sm font-medium">
              <MaintenanceStatusBadge status={request.status} />
            </div>
          </div>
        </div>
      </div>
    </FormModal>
  );
};

