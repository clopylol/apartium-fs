import type { FC } from "react";
import { useRef } from "react";
import { Upload } from "lucide-react";
import { useTranslation } from "react-i18next";

export interface FileUploadProps {
  accept?: string;
  value?: string | null;
  onChange: (fileUrl: string | null) => void;
  label?: string;
  placeholder?: {
    title?: string;
    formats?: string;
    change?: string;
  };
  className?: string;
}

export const FileUpload: FC<FileUploadProps> = ({
  accept = "image/*",
  value,
  onChange,
  label,
  placeholder,
  className = "",
}) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fileUrl = URL.createObjectURL(e.target.files[0]);
      onChange(fileUrl);
    }
  };

  const handleRemove = () => {
    if (value) {
      URL.revokeObjectURL(value);
      onChange(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleChangeClick = () => {
    fileInputRef.current?.click();
  };

  const defaultPlaceholder = {
    title: placeholder?.title || t("payments.modals.addExpense.upload.title") || "Dosya Yükle",
    formats: placeholder?.formats || t("payments.modals.addExpense.upload.formats") || "JPG, PNG, PDF",
    change: placeholder?.change || t("payments.modals.addExpense.upload.change") || "Değiştir",
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="text-xs font-medium text-ds-muted-light uppercase">{label}</label>
      )}
      <div className="border-2 border-dashed border-ds-border-dark rounded-xl p-4 flex flex-col items-center justify-center text-center hover:border-ds-action/50 hover:bg-ds-action/5 transition-all cursor-pointer group relative overflow-hidden">
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          onChange={handleFileChange}
        />

        {value ? (
          <div className="relative w-full h-32 rounded-lg overflow-hidden group-hover:opacity-50 transition-opacity">
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                onClick={handleChangeClick}
                className="bg-black/50 text-white px-2 py-1 rounded text-xs backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                {defaultPlaceholder.change}
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Kaldır
            </button>
          </div>
        ) : (
          <div className="py-4">
            <div className="w-10 h-10 bg-ds-action/20 rounded-full flex items-center justify-center mb-2 mx-auto group-hover:scale-110 transition-transform">
              <Upload className="w-5 h-5 text-ds-action" />
            </div>
            <p className="text-ds-secondary-light text-xs font-medium">{defaultPlaceholder.title}</p>
            <p className="text-ds-muted-light text-[10px] mt-0.5">{defaultPlaceholder.formats}</p>
          </div>
        )}
      </div>
    </div>
  );
};

