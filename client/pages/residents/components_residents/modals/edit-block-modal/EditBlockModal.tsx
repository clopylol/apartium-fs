import { X, Edit2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

interface EditBlockModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (newName: string) => void;
    currentName: string;
}

export function EditBlockModal({
    isOpen,
    onClose,
    onSave,
    currentName,
}: EditBlockModalProps) {
    const { t } = useTranslation();
    const [name, setName] = useState(currentName);

    useEffect(() => {
        setName(currentName);
    }, [currentName, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(name);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-[#0F111A] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Edit2 className="w-5 h-5 text-[#3B82F6]" />
                        {t("residents.modals.editBuilding.title")}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-white/5 text-ds-muted-light dark:text-ds-muted-dark transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase text-ds-muted-light dark:text-ds-muted-dark/60 tracking-wider">
                            {t("residents.modals.editBuilding.label")}
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-[#151821] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#3B82F6] transition-colors"
                            placeholder={t("residents.modals.editBuilding.placeholder")}
                            autoFocus
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 rounded-xl bg-[#1A1D26] hover:bg-[#20242F] text-ds-muted-light dark:text-ds-muted-dark font-bold text-sm transition-colors border border-white/5"
                        >
                            {t("residents.modals.editBuilding.cancel")}
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-3 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold text-sm transition-colors shadow-lg shadow-blue-500/20"
                        >
                            {t("residents.modals.editBuilding.save")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
