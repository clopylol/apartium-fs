import { Edit2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FormModal } from "@/components/shared/modals";

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(name);
        onClose();
    };

    const footer = (
        <div className="flex gap-3 pt-2">
            <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl bg-[#1A1D26] hover:bg-[#20242F] text-slate-400 font-bold text-sm transition-colors border border-white/5"
            >
                {t("residents.modals.editBuilding.cancel")}
            </button>
            <button
                type="submit"
                form="edit-block-form"
                className="flex-1 py-3 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold text-sm transition-colors shadow-lg shadow-blue-500/20"
            >
                {t("residents.modals.editBuilding.save")}
            </button>
        </div>
    );

    return (
        <FormModal
            isOpen={isOpen}
            onClose={onClose}
            title={t("residents.modals.editBuilding.title")}
            titleIcon={<Edit2 className="w-5 h-5" />}
            footer={footer}
            maxWidth="md"
            zIndex={50}
        >
            <form id="edit-block-form" onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                        {t("residents.modals.editBuilding.label")}
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-[#151821] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#3B82F6] transition-colors"
                        placeholder={t("residents.modals.editBuilding.placeholder")}
                        autoFocus
                    />
                </div>
            </form>
        </FormModal>
    );
}
