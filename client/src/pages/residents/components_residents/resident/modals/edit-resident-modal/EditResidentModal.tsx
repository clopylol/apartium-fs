import { X, Edit2, User, Phone, Mail, Car, Building as BuildingIcon, Home, MapPin } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { Building, Resident, Site, UnitWithResidents } from "@/types/residents.types";
import { useBuildingData } from "@/hooks/residents/api";
import { showError } from "@/utils/toast";
import {
    formatPhoneNumber,
    cleanPhoneNumber,
    getNameError,
    getPhoneNumberError,
    getEmailError,
    truncateName,
    type ResidentFormErrors,
} from "@/utils/validation";

interface EditResidentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (residentData: Partial<Resident>) => void;
    resident: Resident;
    blockId: string;
    unitId: string;
    sites: Site[];
    buildings: Building[];
}

export function EditResidentModal({
    isOpen,
    onClose,
    onSave,
    resident,
    blockId,
    unitId,
    sites,
    buildings,
}: EditResidentModalProps) {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        name: "",
        type: "owner" as "owner" | "tenant",
        phone: "",
        email: "",
    });
    
    // Form validation errors
    const [formErrors, setFormErrors] = useState<ResidentFormErrors>({});
    
    // Display phone number (formatted)
    const [displayPhone, setDisplayPhone] = useState("");

    useEffect(() => {
        if (resident) {
            setFormData({
                name: resident.name,
                type: resident.type,
                phone: resident.phone,
                email: resident.email || "",
            });
            // Format phone for display
            setDisplayPhone(formatPhoneNumber(resident.phone));
        }
    }, [resident]);

    // Real-time validation
    useEffect(() => {
        const errors: ResidentFormErrors = {};
        
        const nameError = getNameError(formData.name);
        if (nameError) errors.name = nameError;
        
        const phoneError = getPhoneNumberError(formData.phone);
        if (phoneError) errors.phone = phoneError;
        
        const emailError = getEmailError(formData.email);
        if (emailError) errors.email = emailError;
        
        setFormErrors(errors);
    }, [formData.name, formData.phone, formData.email]);

    // Fetch units for the building (hooks must be called before conditional return)
    const { data: buildingData, isLoading: isLoadingUnit } = useBuildingData(blockId || null);

    // Safe access with null checks
    const currentBlock = buildings?.find((b) => b.id === blockId);
    const currentSite = currentBlock?.siteId ? sites?.find((s) => s.id === currentBlock.siteId) : null;
    
    // Get unit from fetched building data or fallback to buildings array
    const currentUnit = useMemo((): UnitWithResidents | undefined => {
        if (!unitId) return undefined;
        
        // First try to get from fetched building data (most reliable)
        if (buildingData?.units && buildingData.units.length > 0) {
            const found = buildingData.units.find((u: UnitWithResidents) => u.id === unitId);
            if (found) return found;
        }
        
        // Fallback to buildings array (usually empty but just in case)
        if (currentBlock?.units && currentBlock.units.length > 0) {
            const found = currentBlock.units.find((u) => u.id === unitId);
            // Type assertion needed because Building.units is Unit[] not UnitWithResidents[]
            return found as UnitWithResidents | undefined;
        }
        
        return undefined;
    }, [buildingData, unitId, currentBlock]);

    if (!isOpen) return null;

    const handleSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        
        // Validate form
        const errors: ResidentFormErrors = {};
        
        const nameError = getNameError(formData.name);
        if (nameError) errors.name = nameError;
        
        const phoneError = getPhoneNumberError(formData.phone);
        if (phoneError) errors.phone = phoneError;
        
        const emailError = getEmailError(formData.email);
        if (emailError) errors.email = emailError;
        
        if (Object.keys(errors).length > 0) {
            const firstError = Object.values(errors)[0];
            if (firstError) {
                showError(firstError);
            }
            setFormErrors(errors);
            return;
        }
        
        // Clean phone number before saving (remove formatting)
        const cleanedPhone = cleanPhoneNumber(formData.phone);
        
        // Prepare data for save (with cleaned phone)
        onSave({
            ...formData,
            phone: cleanedPhone,
            name: formData.name.trim(),
            email: formData.email.trim() || undefined,
        });
        onClose();
    };
    
    // Handle name change with max length
    const handleNameChange = (value: string) => {
        const truncated = truncateName(value, 100);
        setFormData({ ...formData, name: truncated });
    };
    
    // Handle phone change with formatting
    const handlePhoneChange = (value: string) => {
        // Remove all non-digits first
        const digits = value.replace(/\D/g, "");
        
        // Limit to 10 digits
        const limited = digits.slice(0, 10);
        
        // Update both display and form data
        setDisplayPhone(formatPhoneNumber(limited));
        setFormData({ ...formData, phone: limited });
    };
    
    // Handle email change
    const handleEmailChange = (value: string) => {
        // Limit email length
        const limited = value.slice(0, 255);
        setFormData({ ...formData, email: limited });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-2xl bg-[#0F111A] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Edit2 className="w-5 h-5 text-[#3B82F6]" />
                        {t("residents.modals.editResident.title")}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-white/5 text-slate-400 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Site, Building & Unit Selection (Disabled - Read Only) */}
                    <div className="grid grid-cols-3 gap-4">
                        {/* Site (Apartman) */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                                Apartman
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <select
                                    value={currentSite?.id || ""}
                                    disabled
                                    className="w-full bg-[#151821] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white opacity-50 cursor-not-allowed appearance-none"
                                >
                                    <option value={currentSite?.id || ""}>{currentSite?.name || "-"}</option>
                                </select>
                            </div>
                        </div>
                        
                        {/* Building (Blok) */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                                Blok
                            </label>
                            <div className="relative">
                                <BuildingIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <select
                                    value={blockId}
                                    disabled
                                    className="w-full bg-[#151821] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white opacity-50 cursor-not-allowed appearance-none"
                                >
                                    <option value={blockId}>{currentBlock?.name || "-"}</option>
                                </select>
                            </div>
                        </div>
                        
                        {/* Unit (Daire) */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                                Daire
                            </label>
                            <div className="relative">
                                <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <select
                                    value={unitId || ""}
                                    disabled
                                    className="w-full bg-[#151821] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white opacity-50 cursor-not-allowed appearance-none"
                                >
                                    <option value={unitId || ""}>
                                        {isLoadingUnit ? "Yükleniyor..." : (currentUnit?.number || "-")}
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>

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

                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">{t("residents.messages.fullName")}</label>
                            <span className="text-[10px] text-slate-500">
                                {formData.name.length}/100
                            </span>
                        </div>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleNameChange(e.target.value)}
                                maxLength={100}
                                className={`w-full bg-[#151821] border rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors ${
                                    formErrors.name
                                        ? "border-red-500/50 focus:border-red-500"
                                        : "border-white/10 focus:border-[#3B82F6]"
                                }`}
                                placeholder={t("residents.messages.fullNamePlaceholder")}
                            />
                        </div>
                        {formErrors.name && (
                            <p className="text-[10px] text-red-400 mt-1">{formErrors.name}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">{t("residents.messages.phone")}</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="text"
                                    placeholder="538-765-0525"
                                    value={displayPhone}
                                    onChange={(e) => handlePhoneChange(e.target.value)}
                                    maxLength={12}
                                    className={`w-full bg-[#151821] border rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors ${
                                        formErrors.phone
                                            ? "border-red-500/50 focus:border-red-500"
                                            : "border-white/10 focus:border-[#3B82F6]"
                                    }`}
                                />
                            </div>
                            {formErrors.phone && (
                                <p className="text-[10px] text-red-400 mt-1">{formErrors.phone}</p>
                            )}
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                                {t("residents.messages.email")} <span className="text-slate-500">(Opsiyonel)</span>
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="email"
                                    placeholder="ornek@email.com"
                                    value={formData.email}
                                    onChange={(e) => handleEmailChange(e.target.value)}
                                    maxLength={255}
                                    className={`w-full bg-[#151821] border rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors ${
                                        formErrors.email
                                            ? "border-red-500/50 focus:border-red-500"
                                            : "border-white/10 focus:border-[#3B82F6]"
                                    }`}
                                />
                            </div>
                            {formErrors.email && (
                                <p className="text-[10px] text-red-400 mt-1">{formErrors.email}</p>
                            )}
                        </div>
                    </div>

                    {/* Info Note about vehicles */}
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-3">
                        <div className="p-2 rounded-lg bg-blue-500/20 h-fit">
                            <Car className="w-4 h-4 text-blue-400" />
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-blue-400 mb-0.5">{t("residents.messages.vehicleNoteTitle")}</h4>
                            <p className="text-[10px] text-blue-300/80 leading-relaxed">
                                {t("residents.messages.vehicleNoteDescription")}
                            </p>
                        </div>
                    </div>
                </form>

                {/* Footer */}
                <div className="flex gap-3 pt-2 p-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl bg-[#1A1D26] hover:bg-[#20242F] text-slate-400 font-bold text-sm transition-colors border border-white/5"
                    >
                        {t("residents.modals.editResident.cancel")}
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={!formData.name.trim() || !formData.phone.trim()}
                        className="flex-1 py-3 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm transition-colors shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                    >
                        <Edit2 className="w-4 h-4" />
                        {t("residents.modals.editResident.save")}
                    </button>
                </div>
            </div>
        </div>
    );
}
