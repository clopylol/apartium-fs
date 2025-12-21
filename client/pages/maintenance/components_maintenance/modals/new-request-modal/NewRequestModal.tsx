import type { FC } from "react";
import { Wrench, Upload, FileText } from "lucide-react";
import { FormModal } from "@/components/shared/modals/form-modal";
import { Button } from "@/components/shared/button";
import { Dropdown } from "@/components/shared/inputs/dropdown";
import type { NewRequestFormData } from "@/hooks/maintenance";
import type { MaintenancePriority, MaintenanceCategory } from "@/types/maintenance.types";

interface NewRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: NewRequestFormData;
  onChange: (data: NewRequestFormData) => void;
  onSave: () => void;
}

const priorityOptions: MaintenancePriority[] = ["Low", "Medium", "High", "Urgent"];
const categoryOptions: MaintenanceCategory[] = [
  "Tesisat",
  "Elektrik",
  "Isıtma/Soğutma",
  "Genel",
];

const priorityLabels: Record<MaintenancePriority, string> = {
  Low: "Düşük",
  Medium: "Orta",
  High: "Yüksek",
  Urgent: "Acil",
};

export const NewRequestModal: FC<NewRequestModalProps> = ({
  isOpen,
  onClose,
  formData,
  onChange,
  onSave,
}) => {
  const handlePriorityChange = (value: string) => {
    onChange({ ...formData, priority: value as MaintenancePriority });
  };

  const handleCategoryChange = (value: string) => {
    onChange({ ...formData, category: value as MaintenanceCategory });
  };

  const handleSave = () => {
    if (!formData.title) return;
    onSave();
  };

  const footer = (
    <div className="flex gap-3">
      <Button
        variant="secondary"
        onClick={onClose}
        className="flex-1 bg-ds-accent-light dark:bg-ds-accent-dark hover:bg-ds-muted-light dark:hover:bg-ds-muted-dark text-ds-primary-light dark:text-ds-primary-dark"
      >
        İptal
      </Button>
      <Button onClick={handleSave} className="flex-1 bg-ds-in-sky-600 hover:bg-ds-in-sky-500 text-white shadow-lg shadow-ds-in-sky-900/20">
        Talep Oluştur
      </Button>
    </div>
  );

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Yeni Bakım Talebi"
      titleIcon={<Wrench className="w-5 h-5 text-ds-in-sky-500" />}
      footer={footer}
      maxWidth="md"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-medium text-ds-muted-light dark:text-ds-muted-dark uppercase">
            Başlık
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ds-muted-light dark:text-ds-muted-dark" />
            <input
              type="text"
              placeholder="Örn: Mutfak lavabosu damlatıyor"
              value={formData.title}
              onChange={(e) => onChange({ ...formData, title: e.target.value })}
              className="w-full bg-ds-background-light dark:bg-ds-background-dark border border-ds-border-light dark:border-ds-border-dark rounded-lg pl-10 pr-3 py-2.5 text-ds-primary-light dark:text-ds-primary-dark focus:outline-none focus:ring-1 focus:ring-ds-in-sky-500 transition-all placeholder-ds-muted-light dark:placeholder-ds-muted-dark"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-ds-muted-light dark:text-ds-muted-dark uppercase">
            Öncelik
          </label>
          <div className="grid grid-cols-4 gap-2">
            {priorityOptions.map((p) => (
              <button
                key={p}
                onClick={() => handlePriorityChange(p)}
                className={`py-2 rounded-lg text-xs font-medium border transition-all ${
                  formData.priority === p
                    ? p === "Urgent"
                      ? "bg-ds-in-destructive-600 border-ds-in-destructive-500 text-white"
                      : "bg-ds-in-sky-600 border-ds-in-sky-500 text-white"
                    : "bg-ds-background-light dark:bg-ds-background-dark border-ds-border-light dark:border-ds-border-dark text-ds-muted-light dark:text-ds-muted-dark hover:border-ds-muted-light dark:hover:border-ds-muted-dark"
                }`}
              >
                {priorityLabels[p]}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-ds-muted-light dark:text-ds-muted-dark uppercase">
            Kategori
          </label>
          <Dropdown
            options={categoryOptions}
            value={formData.category}
            onChange={handleCategoryChange}
            placeholder="Kategori Seçin"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-ds-muted-light dark:text-ds-muted-dark uppercase">
            Fotoğraf Ekle
          </label>
          <div className="border-2 border-dashed border-ds-border-light dark:border-ds-border-dark rounded-lg p-8 flex flex-col items-center justify-center text-center hover:border-ds-muted-light dark:hover:border-ds-muted-dark hover:bg-ds-background-light dark:hover:bg-ds-background-dark transition-all cursor-pointer group">
            <div className="w-12 h-12 bg-ds-card-light dark:bg-ds-card-dark rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6 text-ds-in-sky-500" />
            </div>
            <p className="text-ds-in-sky-500 font-medium text-sm">Dosya Yükle</p>
            <p className="text-ds-muted-light dark:text-ds-muted-dark text-xs mt-1">
              veya sürükle bırak
              <br />
              PNG, JPG (max 5MB)
            </p>
          </div>
        </div>
      </div>
    </FormModal>
  );
};

