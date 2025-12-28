import React from "react";
import { CarFront, ArrowUp, ArrowDown, MapPin } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FormModal } from "@/components/shared/modals";
import type { Building, GuestVisit, UnitWithResidents, Site } from "@/types/residents.types";
import { useBuildingData, useVehicleBrands, useVehicleModels } from "@/hooks/residents/api";
import { SearchableUnitSelect } from "@/components/shared/inputs/searchable-unit-select";
import { SearchableSelect } from "@/components/shared/inputs/searchable-select";
import {
    formatLicensePlateForDisplay,
    cleanLicensePlate,
    getLicensePlateError,
} from "@/utils/validation";
import { showError } from "@/utils/toast";

interface EditGuestModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (guestData: Partial<GuestVisit> & { id: string }) => void;
    guest: GuestVisit;
    sites: Site[];
    buildings: Building[];
}

interface GuestFormData {
    siteId: string;
    blockId: string;
    unitId: string;
    guestName: string;
    plate: string;
    brandId: string;
    modelId: string;
    color: string;
    durationDays: number;
    note: string;
    parkingSpotId: string;
}

export function EditGuestModal({ isOpen, onClose, onSave, guest, sites, buildings }: EditGuestModalProps) {
    const { t } = useTranslation();
    const [formData, setFormData] = useState<GuestFormData>({
        siteId: "",
        blockId: "",
        unitId: "",
        guestName: "",
        plate: "",
        brandId: "",
        modelId: "",
        color: "",
        durationDays: 3,
        note: "",
        parkingSpotId: "",
    });

    // Display plate (with spaces) - separate from actual value
    const [displayPlate, setDisplayPlate] = useState("");
    const [plateError, setPlateError] = useState<string | null>(null);

    // Fetch vehicle brands and models from API (with cache)
    const { data: brandsData, isLoading: loadingBrands } = useVehicleBrands();
    const { data: modelsData, isLoading: loadingModels } = useVehicleModels(
        formData.brandId || null
    );

    // Vehicle brands from API
    const vehicleBrands = useMemo(() => {
        if (!brandsData) return [];
        if (Array.isArray(brandsData)) return brandsData;
        return brandsData.brands || [];
    }, [brandsData]);

    // Vehicle models from API
    const vehicleModels = useMemo(() => {
        return modelsData?.models || [];
    }, [modelsData]);

    // Vehicle colors
    const vehicleColors = [
        "Beyaz", "Siyah", "Gri", "Gümüş", "Kırmızı", "Mavi", "Yeşil",
        "Sarı", "Turuncu", "Kahverengi", "Bej", "Bordo", "Lacivert", "Turkuaz"
    ];

    // Find the building that contains the guest's unit
    const guestBuilding = useMemo(() => {
        if (!guest.unitId) return null;
        return buildings.find((b) => b.units.some((u) => u.id === guest.unitId));
    }, [buildings, guest.unitId]);

    // Find the site that contains the guest's building
    const guestSite = useMemo(() => {
        if (!guestBuilding) return null;
        return sites.find((s) => s.id === guestBuilding.siteId);
    }, [sites, guestBuilding]);

    // Filter buildings by selected site
    const availableBuildings = useMemo(() => {
        if (!formData.siteId) return [];
        return buildings.filter((b) => b.siteId === formData.siteId);
    }, [buildings, formData.siteId]);

    // Fetch building data for selected block (for units and parking spots)
    const { data: buildingData } = useBuildingData(formData.blockId || null);

    // Parse model string to find brandId and modelId
    const parseModelString = useMemo(() => {
        if (!guest?.model || !vehicleBrands.length) return { brandId: "", modelId: "" };
        
        const modelString = guest.model;
        // Try to find brand and model from the string
        // Format is usually "Brand Model" or just "Brand"
        for (const brand of vehicleBrands) {
            if (modelString.startsWith(brand.name)) {
                // Found brand, now try to find model
                const remaining = modelString.substring(brand.name.length).trim();
                if (remaining && vehicleModels.length > 0) {
                    const model = vehicleModels.find((m) => m.name === remaining);
                    if (model) {
                        return { brandId: brand.id, modelId: model.id };
                    }
                }
                return { brandId: brand.id, modelId: "" };
            }
        }
        return { brandId: "", modelId: "" };
    }, [guest?.model, vehicleBrands, vehicleModels]);

    // Initialize form data from guest
    useEffect(() => {
        if (guest && guestBuilding && guestSite) {
            const guestPlate = guest.plate || "";
            setFormData({
                siteId: guestSite.id,
                blockId: guestBuilding.id,
                unitId: guest.unitId || "",
                guestName: guest.guestName || "",
                plate: guestPlate,
                brandId: parseModelString.brandId,
                modelId: parseModelString.modelId,
                color: guest.color || "",
                durationDays: guest.durationDays || 3,
                note: guest.note || "",
                parkingSpotId: guest.parkingSpotId || "",
            });
            // Set display plate with formatted version
            if (guestPlate) {
                setDisplayPlate(formatLicensePlateForDisplay(guestPlate));
            } else {
                setDisplayPlate("");
            }
        } else if (isOpen && sites.length > 0 && !formData.siteId) {
            // If guest data is not available, set first site as default
            setFormData((prev) => ({
                ...prev,
                siteId: sites[0].id,
            }));
        }
    }, [guest, guestBuilding, guestSite, isOpen, sites, formData.siteId, parseModelString]);

    // Set first building as default when site is selected (if no guest data)
    useEffect(() => {
        if (formData.siteId && availableBuildings.length > 0 && !formData.blockId && !guest?.unitId) {
            setFormData((prev) => ({
                ...prev,
                blockId: availableBuildings[0].id,
                unitId: "", // Reset unit when building changes
                parkingSpotId: "", // Reset parking spot when building changes
            }));
        }
    }, [formData.siteId, availableBuildings, formData.blockId, guest?.unitId]);

    // Real-time plate validation
    useEffect(() => {
        if (formData.plate) {
            const error = getLicensePlateError(formData.plate);
            setPlateError(error);
        } else {
            setPlateError(null);
        }
    }, [formData.plate]);

    const handlePlateChange = (value: string) => {
        // Clean the input (remove spaces, uppercase)
        const cleaned = cleanLicensePlate(value);
        
        // Update form data with cleaned plate
        setFormData({ ...formData, plate: cleaned });
        
        // Update display plate with formatted version
        if (cleaned) {
            setDisplayPlate(formatLicensePlateForDisplay(cleaned));
        } else {
            setDisplayPlate("");
        }
    };

    const selectedBlock = availableBuildings.find((b) => b.id === formData.blockId);
    const currentBlock = buildingData || selectedBlock;

    // Get units from fetched building data or fallback to buildings array
    const availableUnits = useMemo((): UnitWithResidents[] => {
        if (!formData.blockId) return [];
        
        // First try to get from fetched building data (most reliable)
        if (buildingData?.units) {
            return buildingData.units;
        }
        
        // Fallback to buildings array (usually empty but just in case)
        const selectedBlock = availableBuildings.find((b) => b.id === formData.blockId);
        return (selectedBlock?.units as UnitWithResidents[]) || [];
    }, [buildingData, formData.blockId, availableBuildings]);

    const handleSubmit = () => {
        // Validate plate
        const error = getLicensePlateError(formData.plate);
        if (error) {
            showError(error);
            setPlateError(error);
            return;
        }

        // Clean plate before saving
        const cleanedPlate = cleanLicensePlate(formData.plate);

        // Build model string from brand and model
        let modelString = "";
        if (formData.brandId && formData.modelId) {
            const brand = vehicleBrands.find((b) => b.id === formData.brandId);
            const model = vehicleModels.find((m) => m.id === formData.modelId);
            if (brand && model) {
                modelString = `${brand.name} ${model.name}`;
            } else if (brand) {
                modelString = brand.name;
            }
        } else if (formData.brandId) {
            const brand = vehicleBrands.find((b) => b.id === formData.brandId);
            if (brand) {
                modelString = brand.name;
            }
        }

        onSave({
            id: guest.id,
            unitId: formData.unitId,
            guestName: formData.guestName || undefined,
            plate: cleanedPlate,
            model: modelString || undefined,
            color: formData.color || undefined,
            durationDays: formData.durationDays,
            note: formData.note || undefined,
            parkingSpotId: formData.parkingSpotId || null,
        });
        onClose();
    };

    const footer = (
        <div className="flex gap-3">
            <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl bg-[#1A1D26] hover:bg-[#20242F] text-slate-400 font-bold text-sm transition-colors border border-white/5"
            >
                {t("residents.guests.modals.editGuest.buttons.cancel") || t("residents.guests.modals.addGuest.buttons.cancel")}
            </button>
            <button
                onClick={handleSubmit}
                className="flex-1 py-3 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold text-sm transition-colors shadow-lg shadow-blue-500/20"
            >
                {t("residents.guests.modals.editGuest.buttons.save") || "Kaydet"}
            </button>
        </div>
    );

    return (
        <FormModal
            isOpen={isOpen}
            onClose={onClose}
            title={t("residents.guests.modals.editGuest.title") || "Misafir Düzenle"}
            titleIcon={<CarFront className="w-5 h-5" />}
            footer={footer}
            maxWidth="lg"
            zIndex={50}
        >
            <div className="space-y-5">
                {/* Site and Building Selection */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                            Apartman
                        </label>
                        <SearchableSelect
                            value={formData.siteId}
                            onChange={(siteId) =>
                                setFormData({ ...formData, siteId, blockId: "", unitId: "", parkingSpotId: "" })
                            }
                            options={sites.map((s) => ({
                                id: s.id,
                                label: s.name,
                            }))}
                            placeholder="Apartman Seçin"
                            icon={<MapPin className="w-4 h-4 text-slate-500" />}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                            {t("residents.guests.modals.addGuest.labels.block")}
                        </label>
                        <SearchableSelect
                            value={formData.blockId}
                            onChange={(blockId) =>
                                setFormData({ ...formData, blockId, unitId: "", parkingSpotId: "" })
                            }
                            options={availableBuildings.map((b) => ({
                                id: b.id,
                                label: b.name,
                            }))}
                            disabled={!formData.siteId}
                            placeholder={t("residents.guests.modals.addGuest.labels.blockSelect")}
                        />
                    </div>
                </div>

                {/* Unit Selection (Searchable) */}
                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                        {t("residents.guests.modals.addGuest.labels.unit")}
                    </label>
                    <SearchableUnitSelect
                        value={formData.unitId}
                        onChange={(unitId) => setFormData({ ...formData, unitId })}
                        units={availableUnits}
                        disabled={!formData.blockId}
                        placeholder={t("residents.guests.modals.addGuest.labels.unitSearchPlaceholder") || t("residents.guests.modals.addGuest.labels.unitSelect")}
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                        {t("residents.guests.modals.addGuest.labels.parkingSpot") || "Park Yeri"}
                    </label>
                    <select
                        value={formData.parkingSpotId}
                        onChange={(e) => setFormData({ ...formData, parkingSpotId: e.target.value })}
                        disabled={!formData.blockId}
                        className={`w-full bg-[#151821] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#3B82F6] transition-colors appearance-none cursor-pointer ${!formData.blockId ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                    >
                        <option value="">{t("residents.guests.modals.addGuest.labels.parkingSpotSelect") || "Park Yeri Seçin"}</option>
                        {currentBlock?.parkingSpots?.map((spot) => (
                            <option key={spot.id} value={spot.id}>
                                {spot.name} {spot.floor !== undefined ? `(Kat ${spot.floor})` : ""}
                            </option>
                        ))}
                    </select>
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
                        value={displayPlate}
                        onChange={(e) => handlePlateChange(e.target.value)}
                        className={`w-full bg-[#151821] border rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors font-mono text-lg tracking-wide ${
                            plateError
                                ? "border-red-500 focus:border-red-500"
                                : "border-white/10 focus:border-[#3B82F6]"
                        }`}
                        placeholder={t("residents.guests.modals.addGuest.labels.platePlaceholder")}
                    />
                    {plateError && (
                        <p className="text-[10px] text-red-400 mt-1">{plateError}</p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                            {t("residents.guests.modals.addGuest.labels.brand") || "Araç Markası"}
                        </label>
                        <SearchableSelect
                            value={formData.brandId}
                            onChange={(brandId) =>
                                setFormData({ ...formData, brandId, modelId: "" })
                            }
                            options={vehicleBrands.map((b) => ({
                                id: b.id,
                                label: b.name,
                            }))}
                            placeholder={loadingBrands ? "Yükleniyor..." : "Marka Seçin"}
                            disabled={loadingBrands}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                            {t("residents.guests.modals.addGuest.labels.model")}
                        </label>
                        <SearchableSelect
                            value={formData.modelId}
                            onChange={(modelId) => setFormData({ ...formData, modelId })}
                            options={vehicleModels.map((m) => ({
                                id: m.id,
                                label: m.name,
                            }))}
                            placeholder={
                                !formData.brandId
                                    ? "Önce marka seçin"
                                    : loadingModels
                                    ? "Yükleniyor..."
                                    : vehicleModels.length === 0
                                    ? "Model bulunamadı"
                                    : "Model Seçin"
                            }
                            disabled={!formData.brandId || loadingModels}
                        />
                    </div>
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                        {t("residents.guests.modals.addGuest.labels.color")}
                    </label>
                    <SearchableSelect
                        value={formData.color}
                        onChange={(color) => setFormData({ ...formData, color })}
                        options={vehicleColors.map((c) => ({
                            id: c,
                            label: c,
                        }))}
                        placeholder={t("residents.guests.modals.addGuest.labels.colorPlaceholder")}
                    />
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

