import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { UserCog } from "lucide-react";
import { FormModal } from "@/components/shared/modals";
import { ToggleSwitch, MultiSelect } from "@/components/shared/inputs";
import type { StaffFormData } from "@/hooks/janitor";
import type { Building } from "@/types/residents.types";
import { Button } from "@/components/shared/button";
import { formatPhoneNumber } from "@/utils/validation";
import { useState, useEffect } from "react";

interface StaffFormModalProps {
  isOpen: boolean;
  isEditing: boolean;
  formData: StaffFormData;
  onClose: () => void;
  onSave: (data: StaffFormData) => void;
  onChange: (data: StaffFormData) => void;
  buildings: Building[];
}

export const StaffFormModal: FC<StaffFormModalProps> = ({
  isOpen,
  isEditing,
  formData,
  onClose,
  onSave,
  onChange,
  buildings,
}) => {
  const { t } = useTranslation();
  const [displayPhone, setDisplayPhone] = useState(formatPhoneNumber(formData.phone || ""));

  // Sync display phone when formData.phone changes externally
  useEffect(() => {
    setDisplayPhone(formatPhoneNumber(formData.phone || ""));
  }, [formData.phone]);

  const handlePhoneChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 10);
    setDisplayPhone(formatPhoneNumber(digits));
    onChange({ ...formData, phone: digits });
  };

  const handleSave = () => {
    if (!formData.name || formData.assignedBlocks.length === 0) return;
    onSave(formData);
  };

  const footer = (
    <div className="flex gap-3">
      <Button
        onClick={onClose}
        variant="secondary"
        fullWidth
        className="bg-ds-background-light dark:bg-ds-background-dark hover:bg-ds-muted-light dark:hover:bg-ds-muted-dark text-ds-muted-light dark:text-ds-muted-dark border border-ds-border-light dark:border-ds-border-dark"
      >
        {t("common.buttons.cancel")}
      </Button>
      <Button
        onClick={handleSave}
        fullWidth
        className={!isEditing
          ? "bg-ds-success hover:bg-ds-success/90 text-white shadow-lg shadow-ds-success/20"
          : "bg-ds-action hover:bg-ds-action-hover text-white shadow-lg shadow-ds-action/20"}
      >
        {t("common.buttons.save")}
      </Button>
    </div>
  );

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing
        ? t("janitor.staff.modals.edit.title")
        : t("janitor.staff.modals.add.title")}
      titleIcon={<UserCog className={`w-5 h-5 ${!isEditing ? "text-ds-success" : "text-ds-action"}`} />}
      footer={footer}
      maxWidth="md"
      zIndex={50}
    >
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
            {t("janitor.staff.modals.labels.fullName")}
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => onChange({ ...formData, name: e.target.value })}
            className={`w-full bg-ds-background-light dark:bg-ds-background-dark border border-ds-border-light dark:border-ds-border-dark rounded-xl px-4 py-3 text-sm text-ds-primary-light dark:text-ds-primary-dark placeholder-ds-muted-light focus:outline-none transition-colors ${!isEditing ? "focus:border-ds-success" : "focus:border-ds-action"}`}
            placeholder={t("janitor.staff.modals.labels.fullName")}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
            {t("janitor.staff.modals.labels.phone")}
          </label>
          <input
            type="text"
            value={displayPhone}
            onChange={(e) => handlePhoneChange(e.target.value)}
            className={`w-full bg-ds-background-light dark:bg-ds-background-dark border border-ds-border-light dark:border-ds-border-dark rounded-xl px-4 py-3 text-sm text-ds-primary-light dark:text-ds-primary-dark placeholder-ds-muted-light focus:outline-none transition-colors ${!isEditing ? "focus:border-ds-success" : "focus:border-ds-action"}`}
            placeholder={t("janitor.staff.modals.labels.phonePlaceholder")}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-2 block">
            {t("janitor.staff.modals.labels.assignedBlocks")}
          </label>
          <MultiSelect
            options={buildings.map((block) => ({ value: block.id, label: block.name }))}
            selectedValues={formData.assignedBlocks}
            onChange={(values) => {
              const newFormData = { ...formData, assignedBlocks: values };
              onChange(newFormData);
            }}
            gridCols={2}
          />
          <p className="text-[10px] text-slate-500 mt-1">
            {t("janitor.staff.modals.labels.multipleBlocks")}
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-2 block">
            {t("janitor.staff.modals.labels.status")}
          </label>
          <ToggleSwitch
            options={[
              { value: "on-duty", label: t("janitor.staff.status.onDuty") },
              { value: "off-duty", label: t("janitor.staff.status.offDuty") },
              { value: "passive", label: t("janitor.staff.status.passive") },
            ]}
            value={formData.status}
            onChange={(status) => onChange({ ...formData, status })}
          />
        </div>
      </div>
    </FormModal>
  );
};

