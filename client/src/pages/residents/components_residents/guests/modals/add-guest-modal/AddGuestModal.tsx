import React, { useMemo, useEffect, useState } from "react";
import { CarFront, ArrowUp, ArrowDown, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { FormModal } from "@/components/shared/modals";
import type { Building, UnitWithResidents, Site } from "@/types/residents.types";
import { useBuildingData, useVehicleBrands, useVehicleModels } from "@/hooks/residents/api";
import { SearchableUnitSelect } from "@/components/shared/inputs/searchable-unit-select";
import { SearchableSelect } from "@/components/shared/inputs/searchable-select";
import {
    formatLicensePlateForDisplay,
    cleanLicensePlate,
    getLicensePlateError,
} from "@/utils/validation";
import { showError } from "@/utils/toast";
import { formatDateForInput } from "@/utils/date";

interface AddGuestModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (guestData: any) => void;
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
    expectedDate: string;
    durationDays: number;
    note: string;
    parkingSpotId: string;
}

export function AddGuestModal({ isOpen, onClose, onSubmit, sites, buildings }: AddGuestModalProps) {
    const { t } = useTranslation();
    const [formData, setFormData] = React.useState<GuestFormData>({
        siteId: "",
        blockId: "",
        unitId: "",
        guestName: "",
        plate: "",
        brandId: "",
        modelId: "",
        color: "",
        expectedDate: formatDateForInput(new Date()),
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

    // Filter buildings by selected site
    const availableBuildings = useMemo(() => {
        if (!formData.siteId) return [];
        return buildings.filter((b) => b.siteId === formData.siteId);
    }, [buildings, formData.siteId]);

    // Fetch building data when block is selected
    const { data: buildingData } = useBuildingData(formData.blockId || null);
    
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

    // Set first site as default when modal opens
    useEffect(() => {
        if (isOpen && sites.length > 0 && !formData.siteId) {
            setFormData((prev) => ({
                ...prev,
                siteId: sites[0].id,
            }));
        }
    }, [isOpen, sites, formData.siteId]);

    // Set first building as default when site is selected
    useEffect(() => {
        if (formData.siteId && availableBuildings.length > 0 && !formData.blockId) {
            setFormData((prev) => ({
                ...prev,
                blockId: availableBuildings[0].id,
                unitId: "", // Reset unit when building changes
                parkingSpotId: "", // Reset parking spot when building changes
            }));
        }
    }, [formData.siteId, availableBuildings, formData.blockId]);

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

    const handleSubmit = () => {
        // Validate required fields
        if (!formData.siteId) {
            showError(t("residents.guests.modals.addGuest.errors.siteRequired") || "Lütfen bir apartman seçin");
            return;
        }
        if (!formData.blockId) {
            showError(t("residents.guests.modals.addGuest.errors.blockRequired") || "Lütfen bir blok seçin");
            return;
        }
        if (!formData.unitId) {
            showError(t("residents.guests.modals.addGuest.errors.unitRequired") || "Lütfen bir daire seçin");
            return;
        }
        if (!formData.guestName || formData.guestName.trim() === "") {
            showError(t("residents.guests.modals.addGuest.errors.guestNameRequired") || "Lütfen misafir adını girin");
            return;
        }
        if (!formData.expectedDate) {
            showError(t("residents.guests.modals.addGuest.errors.expectedDateRequired") || "Lütfen beklenen tarihi seçin");
            return;
        }
        
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

        onSubmit({
            ...formData,
            plate: cleanedPlate,
            model: modelString || undefined,
            expectedDate: formData.expectedDate,
            parkingSpotId: formData.parkingSpotId || undefined,
        });
        onClose();
        // Reset form
        setFormData({
            siteId: "",
            blockId: "",
            unitId: "",
            guestName: "",
            plate: "",
            brandId: "",
            modelId: "",
            color: "",
            expectedDate: formatDateForInput(new Date()),
            durationDays: 3,
            note: "",
            parkingSpotId: "",
        });
        setDisplayPlate("");
        setPlateError(null);
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
                    {/* Site and Building Selection */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                                Apartman
                            </label>
                            <SearchableSelect
                                value={formData.siteId}
                                onChange={(siteId) =>
                                    setFormData({ ...formData, siteId, blockId: "", unitId: "" })
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

                    {/* Parking Spot Selection */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                            {t("residents.guests.modals.addGuest.labels.parkingSpot") || "Park Yeri"}
                        </label>
                        <SearchableSelect
                            value={formData.parkingSpotId}
                            onChange={(parkingSpotId) => setFormData({ ...formData, parkingSpotId })}
                            options={buildingData?.parkingSpots?.map((spot) => ({
                                id: spot.id,
                                label: `${spot.name}${spot.floor !== undefined ? ` (Kat ${spot.floor})` : ""}`,
                            })) || []}
                            disabled={!formData.blockId}
                            placeholder={t("residents.guests.modals.addGuest.labels.parkingSpotSelect") || "Park Yeri Seçin"}
                        />
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
                            {t("residents.guests.modals.addGuest.labels.expectedDate")}
                        </label>
                        <input
                            type="date"
                            value={formData.expectedDate}
                            onChange={(e) => setFormData({ ...formData, expectedDate: e.target.value })}
                            className="w-full bg-[#151821] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#3B82F6] transition-colors [color-scheme:dark]"
                            min={formatDateForInput(new Date())}
                            placeholder={t("residents.guests.modals.addGuest.labels.expectedDatePlaceholder")}
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
