import type { FC } from "react";
import { Package, Box, User, MapPin, CheckCircle } from "lucide-react";
import { FormModal } from "@/components/shared/modals";
import type { CargoFormData } from "@/hooks/cargo";
import { CARRIERS } from "@/constants/cargo";

interface CargoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: CargoFormData;
  onChange: React.Dispatch<React.SetStateAction<CargoFormData>>;
  onSave: (data: CargoFormData) => void;
  isConverting?: boolean;
}

export const CargoFormModal: FC<CargoFormModalProps> = ({
  isOpen,
  onClose,
  formData,
  onChange,
  onSave,
  isConverting = false,
}) => {
  const handleSave = () => {
    if (!formData.recipientName || !formData.unit) return;
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
        {isConverting ? "Kabul Et & Ekle" : "Kaydet"}
      </button>
    </div>
  );

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={isConverting ? "Bildirilen Kargoyu Kabul Et" : "Yeni Kargo Girişi"}
      titleIcon={<Package className="w-5 h-5 text-ds-in-sky-500" />}
      footer={footer}
      maxWidth="md"
    >
      {isConverting && (
        <div className="mb-4 bg-ds-in-sky-500/10 border border-ds-in-sky-500/20 p-3 rounded-lg flex gap-3 items-center">
          <CheckCircle className="w-5 h-5 text-ds-in-sky-400 shrink-0" />
          <p className="text-xs text-ds-in-sky-200">
            Sakin bildiriminden gelen bilgiler otomatik dolduruldu. Lütfen kontrol edip onaylayın.
          </p>
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-medium text-ds-muted-light dark:text-ds-muted-dark uppercase">Kargo Firması</label>
          <select
            value={formData.carrier}
            onChange={(e) => onChange({ ...formData, carrier: e.target.value })}
            className="w-full bg-ds-background-light dark:bg-ds-background-dark border border-ds-border-light dark:border-ds-border-dark rounded-lg px-3 py-2.5 text-ds-primary-light dark:text-ds-primary-dark focus:outline-none focus:ring-1 focus:ring-ds-in-sky-500 appearance-none cursor-pointer"
          >
            {CARRIERS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-ds-muted-light dark:text-ds-muted-dark uppercase">Takip Numarası</label>
          <div className="relative">
            <Box className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ds-muted-light dark:text-ds-muted-dark" />
            <input
              type="text"
              value={formData.trackingNo}
              onChange={(e) => onChange({ ...formData, trackingNo: e.target.value })}
              className="w-full bg-ds-background-light dark:bg-ds-background-dark border border-ds-border-light dark:border-ds-border-dark rounded-lg pl-10 pr-3 py-2.5 text-ds-primary-light dark:text-ds-primary-dark focus:outline-none focus:ring-1 focus:ring-ds-in-sky-500"
              placeholder="Opsiyonel"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-ds-muted-light dark:text-ds-muted-dark uppercase">Alıcı Adı</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ds-muted-light dark:text-ds-muted-dark" />
              <input
                type="text"
                value={formData.recipientName}
                onChange={(e) => onChange({ ...formData, recipientName: e.target.value })}
                className="w-full bg-ds-background-light dark:bg-ds-background-dark border border-ds-border-light dark:border-ds-border-dark rounded-lg pl-10 pr-3 py-2.5 text-ds-primary-light dark:text-ds-primary-dark focus:outline-none focus:ring-1 focus:ring-ds-in-sky-500"
                placeholder="Ad Soyad"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-ds-muted-light dark:text-ds-muted-dark uppercase">Daire No</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ds-muted-light dark:text-ds-muted-dark" />
              <input
                type="text"
                value={formData.unit}
                onChange={(e) => onChange({ ...formData, unit: e.target.value })}
                className="w-full bg-ds-background-light dark:bg-ds-background-dark border border-ds-border-light dark:border-ds-border-dark rounded-lg pl-10 pr-3 py-2.5 text-ds-primary-light dark:text-ds-primary-dark focus:outline-none focus:ring-1 focus:ring-ds-in-sky-500"
                placeholder="Örn: A-5"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-ds-muted-light dark:text-ds-muted-dark uppercase">Paket Tipi / Boyut</label>
          <div className="flex gap-2">
            {(["Small", "Medium", "Large"] as const).map((type) => (
              <button
                key={type}
                onClick={() => onChange({ ...formData, type })}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                  formData.type === type
                    ? "bg-ds-in-sky-600 border-ds-in-sky-500 text-white"
                    : "bg-ds-background-light dark:bg-ds-background-dark border-ds-border-light dark:border-ds-border-dark text-ds-muted-light dark:text-ds-muted-dark hover:border-ds-border-light dark:hover:border-ds-border-dark"
                }`}
              >
                {type === "Small" ? "Küçük" : type === "Medium" ? "Orta" : "Büyük"}
              </button>
            ))}
          </div>
        </div>
      </div>
    </FormModal>
  );
};

