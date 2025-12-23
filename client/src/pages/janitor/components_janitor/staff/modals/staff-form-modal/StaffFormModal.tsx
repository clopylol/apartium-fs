import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { UserCog } from "lucide-react";
import { FormModal } from "@/components/shared/modals";
import { ToggleSwitch, MultiSelect } from "@/components/shared/inputs";
import type { StaffFormData } from "@/hooks/janitor";
import { BLOCKS } from "@/constants/janitor";
import { Button } from "@/components/shared/button";

interface StaffFormModalProps {
  isOpen: boolean;
  isEditing: boolean;
  formData: StaffFormData;
  onClose: () => void;
  onSave: (data: StaffFormData) => void;
  onChange: (data: StaffFormData) => void;
}

export const StaffFormModal: FC<StaffFormModalProps> = ({
  isOpen,
  isEditing,
  formData,
  onClose,
  onSave,
  onChange,
}) => {
  const { t } = useTranslation();

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
        className="bg-[#1A1D26] hover:bg-[#20242F] text-slate-400 border border-white/5"
      >
        {t("common.buttons.cancel")}
      </Button>
      <Button
        onClick={handleSave}
        fullWidth
        className="bg-[#3B82F6] hover:bg-[#2563EB] text-white shadow-lg shadow-blue-500/20"
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
      titleIcon={<UserCog className="w-5 h-5" />}
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
            className="w-full bg-[#151821] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#3B82F6] transition-colors"
            placeholder={t("janitor.staff.modals.labels.fullName")}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
            {t("janitor.staff.modals.labels.phone")}
          </label>
          <input
            type="text"
            value={formData.phone}
            onChange={(e) => onChange({ ...formData, phone: e.target.value })}
            className="w-full bg-[#151821] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#3B82F6] transition-colors"
            placeholder={t("janitor.staff.modals.labels.phonePlaceholder")}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-2 block">
            {t("janitor.staff.modals.labels.assignedBlocks")}
          </label>
          <MultiSelect
            options={BLOCKS.map((block) => ({ value: block, label: block }))}
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

