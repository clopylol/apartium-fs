import { Edit2, User, Phone, Mail, Car } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FormModal } from "@/components/shared/modals";
import { RadioGroup } from "@/components/shared/inputs";
import type { Building, Resident } from "@/types/residents.types";

interface EditResidentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (residentData: Partial<Resident>) => void;
    resident: Resident;
    blockId: string;
    unitId: string;
    buildings: Building[];
}

export function EditResidentModal({
    isOpen,
    onClose,
    onSave,
    resident,
    blockId,
    unitId,
    buildings,
}: EditResidentModalProps) {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        name: "",
        type: "owner" as "owner" | "tenant",
        phone: "",
        email: "",
    });

    useEffect(() => {
        if (resident) {
            setFormData({
                name: resident.name,
                type: resident.type,
                phone: resident.phone,
                email: resident.email || "",
            });
        }
    }, [resident]);

    const currentBlock = buildings.find((b) => b.id === blockId);
    const currentUnit = currentBlock?.units.find((u) => u.id === unitId);

    const handleSubmit = () => {
        onSave(formData);
        onClose();
    };

    const footer = (
        <div className="flex gap-3">
            <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 bg-[#1A1D26] hover:bg-[#20242F] text-slate-400 rounded-xl font-medium transition-colors"
            >
                {t("residents.modals.editResident.cancel")}
            </button>
            <button
                onClick={handleSubmit}
                disabled={!formData.name.trim() || !formData.phone.trim()}
                className="flex-1 px-4 py-2.5 bg-[#3B82F6] hover:bg-[#2563EB] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-colors flex items-center justify-center gap-2"
            >
                <Edit2 className="w-4 h-4" />
                {t("residents.modals.editResident.save")}
            </button>
        </div>
    );

    return (
        <FormModal
            isOpen={isOpen}
            onClose={onClose}
            title={t("residents.modals.editResident.title")}
            titleIcon={<Edit2 className="w-5 h-5" />}
            footer={footer}
            maxWidth="lg"
            zIndex={50}
        >
            <div className="space-y-5">
                    {/* Location Selection (Disabled) */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">{t("residents.messages.blockLabel")}</label>
                            <select
                                value={blockId}
                                disabled
                                className="w-full bg-[#151821] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-slate-400 opacity-50 cursor-not-allowed appearance-none"
                            >
                                <option value={blockId}>{currentBlock?.name}</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                                {t("residents.messages.unitLabel")} {t("residents.messages.unitNumber").replace(":", "")}
                            </label>
                            <select
                                value={unitId}
                                disabled
                                className="w-full bg-[#151821] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-slate-400 opacity-50 cursor-not-allowed appearance-none"
                            >
                                <option value={unitId}>{t("residents.messages.unitLabel")} {currentUnit?.number}</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                            {t("residents.messages.residentType")}
                        </label>
                        <RadioGroup
                            options={[
                                { value: "owner", label: t("residents.messages.owner") },
                                { value: "tenant", label: t("residents.messages.tenant") },
                            ]}
                            value={formData.type}
                            onChange={(type) => setFormData({ ...formData, type })}
                            gridCols={2}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">{t("residents.messages.fullName")}</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-[#151821] border border-white/10 rounded-xl pl-10 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#3B82F6] transition-colors"
                                placeholder={t("residents.messages.fullNamePlaceholder")}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">{t("residents.messages.phone")}</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="text"
                                    value={formData.phone}
                                    onChange={(e) =>
                                        setFormData({ ...formData, phone: e.target.value })
                                    }
                                    className="w-full bg-[#151821] border border-white/10 rounded-xl pl-10 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#3B82F6] transition-colors"
                                    placeholder="5XX..."
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                                {t("residents.messages.email")}
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({ ...formData, email: e.target.value })
                                    }
                                    className="w-full bg-[#151821] border border-white/10 rounded-xl pl-10 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#3B82F6] transition-colors"
                                    placeholder="ornek@email.com"
                                />
                            </div>
                        </div>
                    </div>

                {/* Info Note about vehicles */}
                <div className="bg-[#151821] border border-white/5 rounded-xl p-4 flex gap-3">
                    <div className="p-2 bg-[#151821] rounded-lg h-fit">
                        <Car className="w-4 h-4 text-slate-400" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-300">{t("residents.messages.vehicleNoteTitle")}</p>
                        <p className="text-xs text-slate-500 mt-1">
                            {t("residents.messages.vehicleNoteDescription")}
                        </p>
                    </div>
                </div>
            </div>
        </FormModal>
    );
}
