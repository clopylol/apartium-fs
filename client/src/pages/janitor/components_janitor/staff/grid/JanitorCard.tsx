import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { Edit2, Trash2, Phone, Building2 } from "lucide-react";
import type { Janitor } from "@/types/janitor.types";
import { IconButton } from "@/components/shared/button";

interface JanitorCardProps {
  janitor: Janitor;
  onEdit: (janitor: Janitor) => void;
  onDelete: (id: string, name: string) => void;
}

export const JanitorCard: FC<JanitorCardProps> = ({ janitor, onEdit, onDelete }) => {
  const { t } = useTranslation();

  const getStatusClass = () => {
    switch (janitor.status) {
      case "on-duty":
        return "bg-ds-in-success-500/10 text-ds-in-success-400 border-ds-in-success-500/20";
      case "passive":
        return "bg-ds-in-warning-500/10 text-ds-in-warning-400 border-ds-in-warning-500/20";
      default:
        return "bg-ds-accent-light dark:bg-ds-accent-dark text-ds-secondary-light dark:text-ds-secondary-dark border-ds-border-light dark:border-ds-border-dark";
    }
  };

  const getStatusText = () => {
    switch (janitor.status) {
      case "on-duty":
        return t("janitor.staff.status.onDuty");
      case "passive":
        return t("janitor.staff.status.passive");
      default:
        return t("janitor.staff.status.offDuty");
    }
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <div className="bg-ds-card-light dark:bg-ds-card-dark border border-ds-border-light dark:border-ds-border-dark rounded-2xl p-6 relative group hover:border-ds-muted-light dark:hover:border-ds-muted-dark transition-all">
      <div className="absolute top-4 right-4 flex gap-1">
        <IconButton
          onClick={() => onEdit(janitor)}
          icon={<Edit2 className="w-4 h-4" />}
          ariaLabel="Edit janitor"
          className="bg-ds-card-light dark:bg-ds-card-dark border border-ds-border-light dark:border-ds-border-dark hover:bg-ds-accent-light dark:hover:bg-ds-accent-dark"
        />
        <IconButton
          onClick={() => onDelete(janitor.id, janitor.name)}
          icon={<Trash2 className="w-4 h-4" />}
          variant="destructive"
          ariaLabel="Delete janitor"
          className="bg-ds-card-light dark:bg-ds-card-dark border border-ds-border-light dark:border-ds-border-dark hover:bg-ds-accent-light dark:hover:bg-ds-accent-dark"
        />
      </div>

      <div className="flex items-start gap-4 mb-6">
        <div className="w-16 h-16 rounded-full flex items-center justify-center bg-ds-accent-light dark:bg-ds-accent-dark text-ds-primary-light dark:text-ds-primary-dark font-bold text-xl border-2 border-ds-border-light dark:border-ds-border-dark">
          {getInitials(janitor.name)}
        </div>
        <div>
          <h3 className="text-lg font-bold text-ds-primary-light dark:text-ds-primary-dark">
            {janitor.name}
          </h3>
          <p className="text-sm text-ds-secondary-light dark:text-ds-secondary-dark flex items-center gap-1 mt-1">
            <Phone className="w-3 h-3" /> {janitor.phone}
          </p>
          <div
            className={`mt-2 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${getStatusClass()}`}
          >
            {getStatusText()}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-xs text-ds-muted-light dark:text-ds-muted-dark font-bold uppercase mb-2 flex items-center gap-1">
            <Building2 className="w-3 h-3" /> {t("janitor.staff.labels.assignedBlocks")}
          </p>
          <div className="flex flex-wrap gap-2">
            {janitor.assignedBlocks.map((block) => (
              <span
                key={typeof block === 'string' ? block : block.id}
                className="bg-ds-background-light dark:bg-ds-background-dark border border-ds-border-light dark:border-ds-border-dark text-ds-primary-light dark:text-ds-primary-dark px-3 py-1 rounded-lg text-xs font-medium"
              >
                {typeof block === 'string' ? block : block.name}
              </span>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-ds-border-light dark:border-ds-border-dark flex justify-between items-center text-xs text-ds-muted-light dark:text-ds-muted-dark">
          <span>{t("janitor.staff.labels.tasksCompleted")}</span>
          <span className="font-bold text-ds-primary-light dark:text-ds-primary-dark">
            {janitor.tasksCompleted}
          </span>
        </div>
      </div>
    </div>
  );
};


