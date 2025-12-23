import { X, Edit2, User, Phone, Mail, Car } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
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

    if (!isOpen) return null;

    const currentBlock = buildings.find((b) => b.id === blockId);
    const currentUnit = currentBlock?.units.find((u) => u.id === unitId);

    const handleSubmit = () => {
        onSave(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl relative overflow-hidden">
                {/* Modal Header */}
                <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Edit2 className="w-5 h-5 text-blue-500" /> {t("residents.modals.editResident.title")}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh] custom-scrollbar">
                    {/* Location Selection (Disabled) */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-slate-400 uppercase">{t("residents.messages.blockLabel")}</label>
                            <select
                                value={blockId}
                                disabled
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 opacity-50 cursor-not-allowed appearance-none"
                            >
                                <option value={blockId}>{currentBlock?.name}</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-slate-400 uppercase">
                                {t("residents.messages.unitLabel")} {t("residents.messages.unitNumber").replace(":", "")}
                            </label>
                            <select
                                value={unitId}
                                disabled
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 opacity-50 cursor-not-allowed appearance-none"
                            >
                                <option value={unitId}>{t("residents.messages.unitLabel")} {currentUnit?.number}</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-400 uppercase">
                            {t("residents.messages.residentType")}
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <label
                                className={`flex items-center justify-center gap-2 p-3 border rounded-lg cursor-pointer transition-all ${formData.type === "owner"
                                        ? "border-blue-500/50 bg-blue-500/10"
                                        : "border-slate-700 bg-slate-950 hover:border-slate-600"
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="type"
                                    className="accent-blue-500"
                                    checked={formData.type === "owner"}
                                    onChange={() => setFormData({ ...formData, type: "owner" })}
                                />
                                <span
                                    className={`text-sm font-medium ${formData.type === "owner" ? "text-white" : "text-slate-300"
                                        }`}
                                >
                                    {t("residents.messages.owner")}
                                </span>
                            </label>
                            <label
                                className={`flex items-center justify-center gap-2 p-3 border rounded-lg cursor-pointer transition-all ${formData.type === "tenant"
                                        ? "border-blue-500/50 bg-blue-500/10"
                                        : "border-slate-700 bg-slate-950 hover:border-slate-600"
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="type"
                                    className="accent-blue-500"
                                    checked={formData.type === "tenant"}
                                    onChange={() => setFormData({ ...formData, type: "tenant" })}
                                />
                                <span
                                    className={`text-sm font-medium ${formData.type === "tenant" ? "text-white" : "text-slate-300"
                                        }`}
                                >
                                    {t("residents.messages.tenant")}
                                </span>
                            </label>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-400 uppercase">{t("residents.messages.fullName")}</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-3 py-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder={t("residents.messages.fullNamePlaceholder")}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-slate-400 uppercase">{t("residents.messages.phone")}</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="text"
                                    value={formData.phone}
                                    onChange={(e) =>
                                        setFormData({ ...formData, phone: e.target.value })
                                    }
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-3 py-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="5XX..."
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-slate-400 uppercase">
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
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-3 py-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="ornek@email.com"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Info Note about vehicles */}
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-800 flex gap-3">
                        <div className="p-2 bg-slate-800 rounded-lg h-fit">
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

                {/* Footer */}
                <div className="p-6 border-t border-slate-800 bg-slate-950/50 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors"
                    >
                        {t("residents.modals.editResident.cancel")}
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!formData.name.trim() || !formData.phone.trim()}
                        className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-lg shadow-blue-900/20 transition-colors flex items-center justify-center gap-2"
                    >
                        <Edit2 className="w-4 h-4" />
                        {t("residents.modals.editResident.save")}
                    </button>
                </div>
            </div>
        </div>
    );
}
