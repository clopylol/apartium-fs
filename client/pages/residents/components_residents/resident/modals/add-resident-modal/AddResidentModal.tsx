import { X, User, Phone, Mail, Building as BuildingIcon, Home, Car } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { Building } from "@/types/residents.types";

interface AddResidentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (residentData: any) => void;
    buildings: Building[];
    initialBlockId?: string;
    initialUnitId?: string;
}

export function AddResidentModal({
    isOpen,
    onClose,
    onSave,
    buildings,
    initialBlockId,
    initialUnitId,
}: AddResidentModalProps) {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        name: "",
        type: "tenant" as "owner" | "tenant",
        phone: "",
        email: "",
        blockId: initialBlockId || "",
        unitId: initialUnitId || "",
    });

    // Update form data when initial props change
    useEffect(() => {
        if (isOpen) {
            setFormData((prev) => ({
                ...prev,
                blockId: initialBlockId || prev.blockId || (buildings.length > 0 ? buildings[0].id : ""),
                unitId: initialUnitId || prev.unitId || "",
            }));
        }
    }, [isOpen, initialBlockId, initialUnitId, buildings]);

    if (!isOpen) return null;

    const activeBlock = buildings.find((b) => b.id === formData.blockId);
    const availableUnits = activeBlock ? activeBlock.units : [];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-[#0F111A] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <User className="w-5 h-5 text-[#3B82F6]" />
                        {t("residents.modals.addResident.title")}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-white/5 text-slate-400 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Block & Unit Selection */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                                {t("residents.messages.blockLabel")}
                            </label>
                            <div className="relative">
                                <BuildingIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <select
                                    value={formData.blockId}
                                    onChange={(e) => setFormData({ ...formData, blockId: e.target.value, unitId: "" })}
                                    className="w-full bg-[#151821] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#3B82F6] transition-colors appearance-none"
                                >
                                    <option value="" disabled>{t("residents.messages.blockSelect")}</option>
                                    {buildings.map((b) => (
                                        <option key={b.id} value={b.id}>
                                            {b.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                                {t("residents.messages.unitLabel")} {t("residents.messages.unitNumber").replace(":", "")}
                            </label>
                            <div className="relative">
                                <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <select
                                    value={formData.unitId}
                                    onChange={(e) => setFormData({ ...formData, unitId: e.target.value })}
                                    className="w-full bg-[#151821] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#3B82F6] transition-colors appearance-none"
                                    disabled={!formData.blockId}
                                >
                                    <option value="" disabled>{t("residents.messages.unitSelect")}</option>
                                    {availableUnits.map((u) => (
                                        <option key={u.id} value={u.id}>
                                            {t("residents.messages.unitNumber")} {u.number}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Resident Type */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                            {t("residents.messages.residentType")}
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, type: "owner" })}
                                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all border ${formData.type === "owner"
                                    ? "bg-[#151821] border-[#3B82F6] text-white shadow-[0_0_15px_-5px_rgba(59,130,246,0.3)]"
                                    : "bg-[#151821] border-white/5 text-slate-500 hover:border-white/10"
                                    }`}
                            >
                                <div className={`w-2.5 h-2.5 rounded-full border ${formData.type === "owner" ? "bg-[#3B82F6] border-[#3B82F6]" : "border-slate-500"}`}></div>
                                {t("residents.messages.owner")}
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, type: "tenant" })}
                                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all border ${formData.type === "tenant"
                                    ? "bg-[#151821] border-[#3B82F6] text-white shadow-[0_0_15px_-5px_rgba(59,130,246,0.3)]"
                                    : "bg-[#151821] border-white/5 text-slate-500 hover:border-white/10"
                                    }`}
                            >
                                <div className={`w-2.5 h-2.5 rounded-full border ${formData.type === "tenant" ? "bg-[#3B82F6] border-[#3B82F6]" : "border-slate-500"}`}></div>
                                {t("residents.messages.tenant")}
                            </button>
                        </div>
                    </div>

                    {/* Name */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                            {t("residents.messages.fullName")}
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                type="text"
                                placeholder={t("residents.messages.fullNamePlaceholder")}
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-[#151821] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#3B82F6] transition-colors"
                            />
                        </div>
                    </div>

                    {/* Phone & Email */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                                {t("residents.messages.phone")}
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="text"
                                    placeholder="5XX..."
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full bg-[#151821] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#3B82F6] transition-colors"
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
                                    placeholder="ornek@email.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-[#151821] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#3B82F6] transition-colors"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Vehicle Info Note */}
                    <div className="bg-[#151821] rounded-xl p-4 border border-white/5 flex gap-3">
                        <div className="p-2 rounded-lg bg-white/5 h-fit">
                            <Car className="w-4 h-4 text-slate-400" />
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-white mb-0.5">{t("residents.messages.vehicleNoteTitle")}</h4>
                            <p className="text-[10px] text-slate-500 leading-relaxed">
                                {t("residents.messages.vehicleNoteDescription")}
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 rounded-xl bg-[#1A1D26] hover:bg-[#20242F] text-slate-400 font-bold text-sm transition-colors border border-white/5"
                        >
                            {t("residents.modals.addResident.cancel")}
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-3 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold text-sm transition-colors shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                        >
                            <User className="w-4 h-4" />
                            {t("residents.modals.addResident.submit")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
