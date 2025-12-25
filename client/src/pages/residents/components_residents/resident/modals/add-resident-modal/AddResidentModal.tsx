import { X, User, Phone, Mail, Building as BuildingIcon, Home, Car, MapPin, Users, AlertCircle } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { Building, Site, UnitWithResidents, ResidentWithVehicles } from "@/types/residents.types";
import { showError } from "@/utils/toast";
import { useBuildingData } from "@/hooks/residents/api";
import {
    formatPhoneNumber,
    cleanPhoneNumber,
    validateResidentForm,
    getNameError,
    getPhoneNumberError,
    getEmailError,
    truncateName,
    type ResidentFormErrors,
} from "@/utils/validation";

interface AddResidentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (residentData: any) => void;
    sites: Site[];
    buildings: Building[];
    activeBuildingData?: any; // Full building data with units
    initialSiteId?: string;
    initialBlockId?: string;
    initialUnitId?: string;
}

export function AddResidentModal({
    isOpen,
    onClose,
    onSave,
    sites,
    buildings,
    activeBuildingData,
    initialSiteId,
    initialBlockId,
    initialUnitId,
}: AddResidentModalProps) {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        name: "",
        type: "tenant" as "owner" | "tenant",
        phone: "",
        email: "",
        siteId: initialSiteId || "",
        buildingId: initialBlockId || "",
        unitId: initialUnitId || "",
    });
    
    // Form validation errors
    const [formErrors, setFormErrors] = useState<ResidentFormErrors>({});
    
    // Display phone number (formatted)
    const [displayPhone, setDisplayPhone] = useState("");

    // Filter buildings by selected site
    const availableBuildings = useMemo(() => {
        if (!formData.siteId) return [];
        return buildings.filter(b => b.siteId === formData.siteId);
    }, [buildings, formData.siteId]);

    // Fetch units for selected building
    const { data: selectedBuildingData, isLoading: isLoadingUnits } = useBuildingData(formData.buildingId || null);

    // Get units from selected building
    const availableUnits = useMemo((): UnitWithResidents[] => {
        if (!formData.buildingId) return [];
        // First try to get from fetched building data
        if (selectedBuildingData?.units) {
            return selectedBuildingData.units;
        }
        // Fallback to activeBuildingData if it matches
        if (activeBuildingData?.id === formData.buildingId && activeBuildingData?.units) {
            return activeBuildingData.units;
        }
        // Last fallback: try to get from buildings array (usually empty)
        const selectedBuilding = availableBuildings.find(b => b.id === formData.buildingId);
        return (selectedBuilding?.units as UnitWithResidents[]) || [];
    }, [selectedBuildingData, formData.buildingId, activeBuildingData, availableBuildings]);

    // Get selected unit with residents info
    const selectedUnit = useMemo((): UnitWithResidents | null => {
        if (!formData.unitId) return null;
        return availableUnits.find((u: UnitWithResidents) => u.id === formData.unitId) || null;
    }, [availableUnits, formData.unitId]);

    // Update form data when initial props change
    useEffect(() => {
        if (isOpen) {
            const defaultSiteId = initialSiteId || (sites.length > 0 ? sites[0].id : "");
            const siteBuildings = defaultSiteId ? buildings.filter(b => b.siteId === defaultSiteId) : [];
            const defaultBuildingId = initialBlockId || (siteBuildings.length > 0 ? siteBuildings[0].id : "");
            
            setFormData({
                name: "",
                type: "tenant" as "owner" | "tenant",
                phone: "",
                email: "",
                siteId: defaultSiteId,
                buildingId: defaultBuildingId,
                unitId: initialUnitId || "",
            });
            setDisplayPhone("");
            setFormErrors({});
        }
    }, [isOpen, initialSiteId, initialBlockId, initialUnitId, sites, buildings]);

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

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate all fields
        const errors = validateResidentForm(formData);
        
        if (Object.keys(errors).length > 0) {
            // Show first error
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
            email: formData.email.trim() || null,
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
                    {/* Site, Building & Unit Selection */}
                    <div className="grid grid-cols-3 gap-4">
                        {/* Site (Apartman) */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                                Apartman
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <select
                                    value={formData.siteId}
                                    onChange={(e) => setFormData({ ...formData, siteId: e.target.value, buildingId: "", unitId: "" })}
                                    disabled={!!initialUnitId}
                                    className={`w-full bg-[#151821] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none transition-colors appearance-none ${
                                        initialUnitId
                                            ? "opacity-50 cursor-not-allowed"
                                            : "focus:border-[#3B82F6]"
                                    }`}
                                >
                                    <option value="" disabled>Apartman Seçin</option>
                                    {sites.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.name}
                                        </option>
                                    ))}
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
                                    value={formData.buildingId}
                                    onChange={(e) => setFormData({ ...formData, buildingId: e.target.value, unitId: "" })}
                                    disabled={!formData.siteId || !!initialUnitId}
                                    className={`w-full bg-[#151821] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none transition-colors appearance-none ${
                                        !formData.siteId || initialUnitId
                                            ? "opacity-50 cursor-not-allowed"
                                            : "focus:border-[#3B82F6]"
                                    }`}
                                >
                                    <option value="" disabled>Blok Seçin</option>
                                    {availableBuildings.map((b) => (
                                        <option key={b.id} value={b.id}>
                                            {b.name}
                                        </option>
                                    ))}
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
                                    value={formData.unitId}
                                    onChange={(e) => setFormData({ ...formData, unitId: e.target.value })}
                                    disabled={!formData.buildingId || isLoadingUnits || !!initialUnitId}
                                    className={`w-full bg-[#151821] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none transition-colors appearance-none ${
                                        !formData.buildingId || isLoadingUnits || initialUnitId
                                            ? "opacity-50 cursor-not-allowed"
                                            : "focus:border-[#3B82F6]"
                                    }`}
                                >
                                    <option value="" disabled>
                                        {isLoadingUnits ? "Yükleniyor..." : "Daire Seçin"}
                                    </option>
                                    {availableUnits.map((u: UnitWithResidents) => (
                                        <option key={u.id} value={u.id}>
                                            {u.number}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Selected Unit Residents Info */}
                    {selectedUnit && selectedUnit.residents && selectedUnit.residents.length > 0 && (
                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex gap-3 animate-in fade-in duration-200">
                            <div className="p-2 rounded-lg bg-amber-500/20 h-fit">
                                <AlertCircle className="w-4 h-4 text-amber-400" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-xs font-bold text-amber-400 mb-1.5 flex items-center gap-2">
                                    <Users className="w-3.5 h-3.5" />
                                    Bu dairede mevcut sakinler:
                                </h4>
                                <div className="space-y-1">
                                    {selectedUnit.residents.map((resident: ResidentWithVehicles) => (
                                        <div key={resident.id} className="text-[11px] text-slate-300 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                                            <span className="font-medium">{resident.name}</span>
                                            <span className="text-slate-500">({resident.type === "owner" ? "Mal Sahibi" : "Kiracı"})</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

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
                        <div className="flex items-center justify-between">
                            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                                {t("residents.messages.fullName")}
                            </label>
                            <span className="text-[10px] text-slate-500">
                                {formData.name.length}/100
                            </span>
                        </div>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                type="text"
                                placeholder={t("residents.messages.fullNamePlaceholder")}
                                value={formData.name}
                                onChange={(e) => handleNameChange(e.target.value)}
                                maxLength={100}
                                className={`w-full bg-[#151821] border rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors ${
                                    formErrors.name
                                        ? "border-red-500/50 focus:border-red-500"
                                        : "border-white/10 focus:border-[#3B82F6]"
                                }`}
                            />
                        </div>
                        {formErrors.name && (
                            <p className="text-[10px] text-red-400 mt-1">{formErrors.name}</p>
                        )}
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

                    {/* Vehicle Info Note */}
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
