import React from "react";
import { CarFront, ArrowUp, ArrowDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { FormModal } from "@/components/shared/modals";
import type { Building } from "@/types/residents.types";

interface AddGuestModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (guestData: any) => void;
    buildings: Building[];
}

interface GuestFormData {
    blockId: string;
    unitId: string;
    guestName: string;
    plate: string;
    model: string;
    color: string;
    durationDays: number;
    note: string;
}

export function AddGuestModal({ isOpen, onClose, onSubmit, buildings }: AddGuestModalProps) {
    const { t } = useTranslation();
    const [formData, setFormData] = React.useState<GuestFormData>({
        blockId: "",
        unitId: "",
        guestName: "",
        plate: "",
        model: "",
        color: "",
        durationDays: 3,
        note: "",
    });

    const selectedBlock = buildings.find((b) => b.id === formData.blockId);

    const handleSubmit = () => {
        onSubmit(formData);
        onClose();
        // Reset form
        setFormData({
            blockId: "",
            unitId: "",
            guestName: "",
            plate: "",
            model: "",
            color: "",
            durationDays: 3,
            note: "",
        });
    };

    const footer = (
        <div className="flex gap-3">
            <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl bg-[#1A1D26] hover:bg-[#20242F] text-slate-400 font-bold text-sm transition-colors border border-white/5"
            >
                {t("residents.guests.modals.addGuest.buttons.cancel")}
            </button>
            <button
                onClick={handleSubmit}
                className="flex-1 py-3 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold text-sm transition-colors shadow-lg shadow-blue-500/20"
            >
                {t("residents.guests.modals.addGuest.buttons.saveAndCheckIn")}
            </button>
        </div>
    );

    return (
        <FormModal
            isOpen={isOpen}
            onClose={onClose}
            title={t("residents.guests.modals.addGuest.title")}
            titleIcon={<CarFront className="w-5 h-5" />}
            footer={footer}
            maxWidth="lg"
            zIndex={50}
        >
            <div className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                                {t("residents.guests.modals.addGuest.labels.block")}
                            </label>
                            <select
                                value={formData.blockId}
                                onChange={(e) =>
                                    setFormData({ ...formData, blockId: e.target.value, unitId: "" })
                                }
                                className="w-full bg-[#151821] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#3B82F6] transition-colors appearance-none cursor-pointer"
                            >
                                <option value="">{t("residents.guests.modals.addGuest.labels.blockSelect")}</option>
                                {buildings.map((b) => (
                                    <option key={b.id} value={b.id}>
                                        {b.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                                {t("residents.guests.modals.addGuest.labels.unit")}
                            </label>
                            <select
                                value={formData.unitId}
                                onChange={(e) => setFormData({ ...formData, unitId: e.target.value })}
                                disabled={!formData.blockId}
                                className={`w-full bg-[#151821] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#3B82F6] transition-colors appearance-none cursor-pointer ${!formData.blockId ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                            >
                                <option value="">{t("residents.guests.modals.addGuest.labels.unitSelect")}</option>
                                {selectedBlock?.units.map((u) => (
                                    <option key={u.id} value={u.id}>
                                        Daire {u.number}{" "}
                                        {u.residents.length > 0 ? `(${u.residents[0].name})` : ""}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                            {t("residents.guests.modals.addGuest.labels.guestName")}
                        </label>
                        <input
                            type="text"
                            value={formData.guestName}
                            onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                            className="w-full bg-[#151821] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#3B82F6] transition-colors"
                            placeholder={t("residents.guests.modals.addGuest.labels.guestNamePlaceholder")}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                            {t("residents.guests.modals.addGuest.labels.plate")}
                        </label>
                        <input
                            type="text"
                            value={formData.plate}
                            onChange={(e) =>
                                setFormData({ ...formData, plate: e.target.value.toUpperCase() })
                            }
                            className="w-full bg-[#151821] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#3B82F6] transition-colors font-mono text-lg tracking-wide"
                            placeholder={t("residents.guests.modals.addGuest.labels.platePlaceholder")}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                                {t("residents.guests.modals.addGuest.labels.model")}
                            </label>
                            <input
                                type="text"
                                value={formData.model}
                                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                className="w-full bg-[#151821] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#3B82F6] transition-colors"
                                placeholder={t("residents.guests.modals.addGuest.labels.modelPlaceholder")}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                                {t("residents.guests.modals.addGuest.labels.color")}
                            </label>
                            <input
                                type="text"
                                value={formData.color}
                                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                className="w-full bg-[#151821] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#3B82F6] transition-colors"
                                placeholder={t("residents.guests.modals.addGuest.labels.colorPlaceholder")}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                            {t("residents.guests.modals.addGuest.labels.duration")}
                        </label>
                        <div className="flex items-center gap-4 bg-[#151821] border border-white/10 rounded-xl p-2">
                            <button
                                onClick={() =>
                                    setFormData({
                                        ...formData,
                                        durationDays: Math.max(1, formData.durationDays - 1),
                                    })
                                }
                                className="p-2 hover:bg-ds-background-dark rounded text-slate-400 transition-colors"
                            >
                                <ArrowDown className="w-4 h-4" />
                            </button>
                            <span className="flex-1 text-center font-bold text-white">
                                {formData.durationDays} {t("residents.guests.modals.addGuest.labels.days")}
                            </span>
                            <button
                                onClick={() =>
                                    setFormData({
                                        ...formData,
                                        durationDays: formData.durationDays + 1,
                                    })
                                }
                                className="p-2 hover:bg-ds-background-dark rounded text-slate-400 transition-colors"
                            >
                                <ArrowUp className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">{t("residents.guests.modals.addGuest.labels.note")}</label>
                    <textarea
                        value={formData.note}
                        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                        className="w-full bg-[#151821] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#3B82F6] transition-colors resize-none h-20"
                        placeholder={t("residents.guests.modals.addGuest.labels.notePlaceholder")}
                    />
                </div>
            </div>
        </FormModal>
    );
}
