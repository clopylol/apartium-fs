import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { Edit2, Trash2, Phone } from "lucide-react";
import type { Janitor } from "@/types/janitor.types";
import { JanitorRowSkeleton } from "../../skeletons";
import { IconButton } from "@/components/shared/button";

interface JanitorTableProps {
  janitors: Janitor[];
  isLoading: boolean;
  onEdit: (janitor: Janitor) => void;
  onDelete: (id: string, name: string) => void;
}

export const JanitorTable: FC<JanitorTableProps> = ({
  janitors,
  isLoading,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation();

  const getStatusClass = () => {
    return {
      "on-duty": "bg-ds-in-success-500/10 text-ds-in-success-400",
      passive: "bg-ds-in-warning-500/10 text-ds-in-warning-400",
      "off-duty": "bg-ds-accent-light dark:bg-ds-accent-dark text-ds-secondary-light dark:text-ds-secondary-dark",
    };
  };

  const getStatusText = (status: Janitor["status"]) => {
    switch (status) {
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
    <div className="bg-ds-card-light dark:bg-ds-card-dark border border-ds-border-light dark:border-ds-border-dark rounded-2xl overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-ds-border-light dark:border-ds-border-dark bg-ds-background-light/50 dark:bg-ds-background-dark/50 text-xs uppercase text-ds-muted-light dark:text-ds-muted-dark font-semibold tracking-wider">
              <th className="px-6 py-4">{t("janitor.staff.table.columns.staff")}</th>
              <th className="px-6 py-4">{t("janitor.staff.table.columns.contact")}</th>
              <th className="px-6 py-4">{t("janitor.staff.table.columns.assignedBlocks")}</th>
              <th className="px-6 py-4">{t("janitor.staff.table.columns.status")}</th>
              <th className="px-6 py-4">{t("janitor.staff.table.columns.tasks")}</th>
              <th className="px-6 py-4 text-right">{t("janitor.staff.table.columns.actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ds-border-light/50 dark:divide-ds-border-dark/50">
            {isLoading ? (
              <>
                <JanitorRowSkeleton />
                <JanitorRowSkeleton />
                <JanitorRowSkeleton />
              </>
            ) : (
              janitors.map((janitor) => (
                <tr
                  key={janitor.id}
                  className="hover:bg-ds-accent-light/30 dark:hover:bg-ds-accent-dark/30 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-ds-accent-light dark:bg-ds-accent-dark text-ds-primary-light dark:text-ds-primary-dark font-bold text-sm border border-ds-border-light dark:border-ds-border-dark">
                        {getInitials(janitor.name)}
                      </div>
                      <span className="font-medium text-ds-primary-light dark:text-ds-primary-dark">
                        {janitor.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-ds-secondary-light dark:text-ds-secondary-dark flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-ds-muted-light dark:text-ds-muted-dark" />{" "}
                      {janitor.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {janitor.assignedBlocks.map((block: any) => (
                        <span
                          key={typeof block === 'string' ? block : block.id}
                          className="text-[10px] bg-ds-background-light dark:bg-ds-background-dark border border-ds-border-light dark:border-ds-border-dark px-2 py-0.5 rounded text-ds-secondary-light dark:text-ds-secondary-dark"
                        >
                          {typeof block === 'string' ? block : block.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass()[janitor.status]
                        }`}
                    >
                      {getStatusText(janitor.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-ds-primary-light dark:text-ds-primary-dark font-mono">
                      {janitor.tasksCompleted}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <IconButton
                        onClick={() => onEdit(janitor)}
                        icon={<Edit2 className="w-4 h-4" />}
                        ariaLabel="Edit janitor"
                        className="bg-ds-accent-light/50 dark:bg-ds-accent-dark/50 border border-ds-border-light dark:border-ds-border-dark"
                      />
                      <IconButton
                        onClick={() => onDelete(janitor.id, janitor.name)}
                        icon={<Trash2 className="w-4 h-4" />}
                        variant="destructive"
                        ariaLabel="Delete janitor"
                        className="bg-ds-accent-light/50 dark:bg-ds-accent-dark/50 border border-ds-border-light dark:border-ds-border-dark"
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};


