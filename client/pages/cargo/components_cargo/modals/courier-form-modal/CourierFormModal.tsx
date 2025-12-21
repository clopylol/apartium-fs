import type { FC } from "react";
import { Bike, Hash, User, UserCheck } from "lucide-react";
import { FormModal } from "@/components/shared/modals";
import type { CourierFormData } from "@/hooks/cargo";
import { COURIER_COMPANIES, MOCK_RESIDENTS } from "@/constants/cargo";

interface CourierFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: CourierFormData;
  onChange: React.Dispatch<React.SetStateAction<CourierFormData>>;
  onSave: (data: CourierFormData) => void;
  selectedResidentId: string;
  onResidentSelect: (id: string) => void;
  isManualCourier: boolean;
  onManualCourierChange: (manual: boolean) => void;
}

export const CourierFormModal: FC<CourierFormModalProps> = ({
  isOpen,
  onClose,
  formData,
  onChange,
  onSave,
  selectedResidentId,
  onResidentSelect,
  isManualCourier,
  onManualCourierChange,
}) => {
  const handleResidentSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    onResidentSelect(val);

    if (val === "manual") {
      onManualCourierChange(true);
      onChange({ ...formData, residentName: "", unit: "" });
    } else {
      onManualCourierChange(false);
      const resident = MOCK_RESIDENTS.find((r) => r.id === val);
      if (resident) {
        onChange({ ...formData, residentName: resident.name, unit: resident.unit });
      } else {
        onChange({ ...formData, residentName: "", unit: "" });
      }
    }
  };

  const handleSave = () => {
    if (!formData.company || !formData.residentName || !formData.unit) return;
    onSave(formData);
  };

  const footer = (
    <div className="flex gap-3">
      <button
        onClick={onClose}
        className="flex-1 px-4 py-2 bg-ds-accent-light dark:bg-ds-accent-dark hover:bg-ds-muted-light dark:hover:bg-ds-muted-dark text-ds-primary-light dark:text-ds-primary-dark rounded-xl font-medium transition-colors text-sm"
      >
        İptal
      </button>
      <button
        onClick={handleSave}
        className="flex-1 px-4 py-2 bg-ds-in-sky-600 hover:bg-ds-in-sky-500 text-white rounded-xl font-medium shadow-lg transition-colors text-sm"
      >
        Giriş Yap
      </button>
    </div>
  );

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Kurye Girişi Yap"
      titleIcon={<Bike className="w-5 h-5 text-ds-in-sky-500" />}
      footer={footer}
      maxWidth="md"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-medium text-ds-muted-light dark:text-ds-muted-dark uppercase">Firma</label>
          <select
            value={formData.company}
            onChange={(e) => onChange({ ...formData, company: e.target.value })}
            className="w-full bg-ds-background-light dark:bg-ds-background-dark border border-ds-border-light dark:border-ds-border-dark rounded-lg px-3 py-2.5 text-ds-primary-light dark:text-ds-primary-dark focus:outline-none focus:ring-1 focus:ring-ds-in-sky-500 appearance-none cursor-pointer"
          >
            {COURIER_COMPANIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-ds-muted-light dark:text-ds-muted-dark uppercase">Motor Plakası</label>
          <div className="relative">
            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ds-muted-light dark:text-ds-muted-dark" />
            <input
              type="text"
              value={formData.plate}
              onChange={(e) => onChange({ ...formData, plate: e.target.value.toUpperCase() })}
              className="w-full bg-ds-background-light dark:bg-ds-background-dark border border-ds-border-light dark:border-ds-border-dark rounded-lg pl-10 pr-3 py-2.5 text-ds-primary-light dark:text-ds-primary-dark focus:outline-none focus:ring-1 focus:ring-ds-in-sky-500 font-mono tracking-wide"
              placeholder="34 ABC 123"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-ds-muted-light dark:text-ds-muted-dark uppercase">Sipariş Sahibi</label>
          <select
            value={selectedResidentId}
            onChange={handleResidentSelect}
            className="w-full bg-ds-background-light dark:bg-ds-background-dark border border-ds-border-light dark:border-ds-border-dark rounded-lg px-3 py-2.5 text-ds-primary-light dark:text-ds-primary-dark focus:outline-none focus:ring-1 focus:ring-ds-in-sky-500 appearance-none cursor-pointer mb-2"
          >
            <option value="">Seçiniz</option>
            {MOCK_RESIDENTS.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} - {r.unit}
              </option>
            ))}
            <option value="manual">Diğer / Manuel Giriş</option>
          </select>

          {isManualCourier && (
            <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
              <input
                type="text"
                value={formData.residentName}
                onChange={(e) => onChange({ ...formData, residentName: e.target.value })}
                className="w-full bg-ds-background-light dark:bg-ds-background-dark border border-ds-border-light dark:border-ds-border-dark rounded-lg px-3 py-2.5 text-ds-primary-light dark:text-ds-primary-dark focus:outline-none focus:ring-1 focus:ring-ds-in-sky-500"
                placeholder="Ad Soyad"
              />
              <input
                type="text"
                value={formData.unit}
                onChange={(e) => onChange({ ...formData, unit: e.target.value })}
                className="w-full bg-ds-background-light dark:bg-ds-background-dark border border-ds-border-light dark:border-ds-border-dark rounded-lg px-3 py-2.5 text-ds-primary-light dark:text-ds-primary-dark focus:outline-none focus:ring-1 focus:ring-ds-in-sky-500"
                placeholder="Daire"
              />
            </div>
          )}
          {!isManualCourier && selectedResidentId && (
            <div className="px-3 py-2 bg-ds-background-light dark:bg-ds-background-dark border border-ds-border-light dark:border-ds-border-dark rounded-lg flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-ds-in-success-500" />
              <span className="text-sm text-ds-secondary-light dark:text-ds-secondary-dark">
                {formData.residentName} <span className="text-ds-muted-light dark:text-ds-muted-dark">({formData.unit})</span>
              </span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-ds-muted-light dark:text-ds-muted-dark uppercase">Güvenlik Notu (Opsiyonel)</label>
          <input
            type="text"
            value={formData.note}
            onChange={(e) => onChange({ ...formData, note: e.target.value })}
            className="w-full bg-ds-background-light dark:bg-ds-background-dark border border-ds-border-light dark:border-ds-border-dark rounded-lg px-3 py-2.5 text-ds-primary-light dark:text-ds-primary-dark focus:outline-none focus:ring-1 focus:ring-ds-in-sky-500"
            placeholder="Örn: Onay alındı, paketi kapıya bırakacak"
          />
        </div>
      </div>
    </FormModal>
  );
};

