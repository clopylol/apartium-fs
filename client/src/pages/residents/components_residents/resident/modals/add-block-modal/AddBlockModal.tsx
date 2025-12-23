import { Plus } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FormModal } from "@/components/shared/modals";

interface AddBlockModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (name: string) => void;
}

export function AddBlockModal({ isOpen, onClose, onSave }: AddBlockModalProps) {
    const { t } = useTranslation();
    const [name, setName] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onSave(name.trim());
            setName("");
            onClose();
        }
    };

    const footer = (
        <div className="flex gap-3 pt-2">
            <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl bg-[#1A1D26] hover:bg-[#20242F] text-slate-400 font-bold text-sm transition-colors border border-white/5"
            >
                {t("residents.modals.addBuilding.cancel")}
            </button>
            <button
                type="submit"
                form="add-block-form"
                disabled={!name.trim()}
                className="flex-1 py-3 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm transition-colors shadow-lg shadow-blue-500/20"
            >
                {t("residents.modals.addBuilding.save")}
            </button>
        </div>
    );

    return (
        <FormModal
            isOpen={isOpen}
            onClose={onClose}
            title={t("residents.modals.addBuilding.title")}
            titleIcon={<Plus className="w-5 h-5" />}
            footer={footer}
            maxWidth="sm"
            zIndex={60}
        >
            <form id="add-block-form" onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                        {t("residents.modals.addBuilding.label")}
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-[#151821] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#3B82F6] transition-colors"
                        placeholder={t("residents.modals.addBuilding.placeholder")}
                        autoFocus
                    />
                </div>
            </form>
        </FormModal>
    );
}
