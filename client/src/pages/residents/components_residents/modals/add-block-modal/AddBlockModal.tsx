import { Plus, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface AddBlockModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (name: string) => void;
}

export function AddBlockModal({ isOpen, onClose, onSave }: AddBlockModalProps) {
    const { t } = useTranslation();
    const [name, setName] = useState("");

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onSave(name.trim());
            setName("");
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-ds-background-light/80 dark:bg-ds-background-dark/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-ds-card-light dark:bg-[#0F111A] border border-ds-border-light dark:border-white/10 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-ds-border-light dark:border-white/5 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-ds-primary-light dark:text-white flex items-center gap-2">
                        <Plus className="w-5 h-5 text-[#3B82F6]" />
                        {t("residents.modals.addBuilding.title")}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-ds-muted-light dark:text-ds-muted-dark hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-ds-muted-light dark:text-ds-muted-dark uppercase tracking-wider">
                            {t("residents.modals.addBuilding.label")}
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-ds-background-light dark:bg-[#1A1D26] border border-ds-border-light dark:border-white/10 rounded-xl px-4 py-3 text-ds-primary-light dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6] transition-all"
                            placeholder={t("residents.modals.addBuilding.placeholder")}
                            autoFocus
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 bg-ds-muted-light/10 dark:bg-white/5 hover:bg-ds-muted-light/20 dark:hover:bg-white/10 text-ds-primary-light dark:text-white rounded-xl font-medium transition-colors text-sm"
                        >
                            {t("residents.modals.addBuilding.cancel")}
                        </button>
                        <button
                            type="submit"
                            disabled={!name.trim()}
                            className="flex-1 px-4 py-2.5 bg-[#3B82F6] hover:bg-[#2563EB] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all text-sm"
                        >
                            {t("residents.modals.addBuilding.save")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
