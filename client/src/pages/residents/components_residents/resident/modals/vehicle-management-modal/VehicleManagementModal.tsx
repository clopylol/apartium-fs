import { X, Car, Trash2, PlusCircle } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { Resident, Building, ResidentVehicle } from "@/types/residents.types";
import { ConfirmationModal } from "@/components/shared/modals";
import {
    formatLicensePlateForDisplay,
    cleanLicensePlate,
    getLicensePlateError,
} from "@/utils/validation";
import { showError } from "@/utils/toast";
import { useVehicleBrands, useVehicleModels, useBuildingData } from "@/hooks/residents/api";

interface VehicleManagementModalProps {
    isOpen: boolean;
    onClose: () => void;
    resident: Resident;
    blockId: string;
    unitId: string;
    buildings: Building[];
    activeBlock?: Building | null;
    onUpdateResident: (residentId: string, vehicles: ResidentVehicle[]) => void;
}

export function VehicleManagementModal({
    isOpen,
    onClose,
    resident,
    blockId,
    buildings,
    activeBlock,
    onUpdateResident,
}: VehicleManagementModalProps) {
    const { t } = useTranslation();
    const [vehicleForm, setVehicleForm] = useState({
        plate: "",
        brandId: "",
        modelId: "",
        customBrand: "",
        customModel: "",
        color: "",
        fuelType: "Benzinli",
        parkingSpot: "",
        parkingSpotId: "",
    });
    
    // Display plate (with spaces) - separate from actual value
    const [displayPlate, setDisplayPlate] = useState("");
    
    // For brand/model dropdowns - allow custom input
    const [isCustomBrand, setIsCustomBrand] = useState(false);
    const [isCustomModel, setIsCustomModel] = useState(false);
    
    const [plateError, setPlateError] = useState<string | null>(null);
    
    // Fetch vehicle brands and models from API (hooks must be called before any conditional returns)
    const { data: brandsData, isLoading: loadingBrands, error: brandsError } = useVehicleBrands();
    const { data: modelsData, isLoading: loadingModels } = useVehicleModels(
        vehicleForm.brandId || null
    );
    // Fetch building data for the blockId to get parkingSpots
    const { data: buildingData } = useBuildingData(blockId);
    
    // Vehicle brands from API
    const vehicleBrands = useMemo(() => {
        // Handle both possible API response formats: { brands: [...] } or direct array
        if (!brandsData) {
            if (brandsError) {
                console.error('Vehicle brands error:', brandsError);
            }
            return [];
        }
        if (Array.isArray(brandsData)) return brandsData;
        return brandsData.brands || [];
    }, [brandsData, brandsError]);
    
    // Vehicle models from API
    const vehicleModels = useMemo(() => {
        return modelsData?.models || [];
    }, [modelsData]);
    
    const vehicleColors = [
        "Beyaz", "Siyah", "Gri", "Gümüş", "Kırmızı", "Mavi", "Yeşil",
        "Sarı", "Turuncu", "Kahverengi", "Bej", "Bordo", "Lacivert", "Turkuaz"
    ];
    
    const fuelTypes = [
        "Benzinli",
        "Dizel",
        "LPG",
        "Hybrid",
        "Elektrik",
        "Diğer"
    ];

    const [deleteConfirm, setDeleteConfirm] = useState<{
        isOpen: boolean;
        vehicleId: string;
        plate: string;
    }>({
        isOpen: false,
        vehicleId: "",
        plate: "",
    });
    
    // Real-time plate validation
    useEffect(() => {
        if (vehicleForm.plate) {
            const error = getLicensePlateError(vehicleForm.plate);
            setPlateError(error);
        } else {
            setPlateError(null);
        }
    }, [vehicleForm.plate]);

    // Conditional return AFTER all hooks
    if (!isOpen) return null;

    // Safe access with null checks
    // Find the block that matches blockId, prioritize buildingData (has parkingSpots), then activeBlock, then buildings array
    const baseBlock = buildings?.find((b) => b.id === blockId);
    const currentBlock = buildingData && baseBlock ? {
        ...baseBlock,
        parkingSpots: buildingData.parkingSpots || [],
        units: buildingData.units || [],
    } : (activeBlock && activeBlock.id === blockId) ? activeBlock : (baseBlock || activeBlock);

    const handleAddVehicle = () => {
        // Validate plate
        const error = getLicensePlateError(vehicleForm.plate);
        if (error) {
            showError(error);
            setPlateError(error);
            return;
        }
        
        // Clean plate before saving
        const cleanedPlate = cleanLicensePlate(vehicleForm.plate);

        // Build model string for custom entries or backward compatibility
        let modelString = "";
        if (isCustomBrand && vehicleForm.customBrand) {
            // Custom brand entered
            if (isCustomModel && vehicleForm.customModel) {
                modelString = `${vehicleForm.customBrand} ${vehicleForm.customModel}`;
            } else {
                modelString = vehicleForm.customBrand;
            }
        } else if (vehicleForm.brandId && vehicleForm.modelId) {
            // Both brand and model selected from dropdown
            const brand = vehicleBrands.find(b => b.id === vehicleForm.brandId);
            const model = vehicleModels.find(m => m.id === vehicleForm.modelId);
            if (brand && model) {
                modelString = `${brand.name} ${model.name}`;
            }
        } else if (vehicleForm.brandId) {
            // Only brand selected
            const brand = vehicleBrands.find(b => b.id === vehicleForm.brandId);
            if (brand) {
                modelString = brand.name;
            }
        } else if (isCustomModel && vehicleForm.customModel) {
            // Only custom model entered
            modelString = vehicleForm.customModel;
        }
        
        const newVehicle: ResidentVehicle = {
            id: `vehicle-${Date.now()}`,
            plate: cleanedPlate,
            model: modelString,
            brandId: isCustomBrand ? null : (vehicleForm.brandId || null),
            modelId: isCustomModel ? null : (vehicleForm.modelId || null),
            color: vehicleForm.color || undefined,
            fuelType: vehicleForm.fuelType || "Benzinli",
            parkingSpot: vehicleForm.parkingSpot || undefined,
            parkingSpotId: vehicleForm.parkingSpotId || undefined,
        };

        const updatedVehicles = [...(resident.vehicles || []), newVehicle];
        onUpdateResident(resident.id, updatedVehicles);

        // Reset form
        setVehicleForm({ plate: "", brandId: "", modelId: "", customBrand: "", customModel: "", color: "", fuelType: "Benzinli", parkingSpot: "", parkingSpotId: "" });
        setDisplayPlate("");
        setPlateError(null);
        setIsCustomBrand(false);
        setIsCustomModel(false);
    };
    
    const handlePlateChange = (value: string) => {
        // Clean the input (remove spaces, uppercase, keep only valid chars)
        const cleaned = cleanLicensePlate(value);
        // Update the actual form value (without spaces for validation)
        setVehicleForm({ ...vehicleForm, plate: cleaned });
        // Update display with formatted version (with spaces)
        if (cleaned) {
            setDisplayPlate(formatLicensePlateForDisplay(cleaned));
        } else {
            setDisplayPlate("");
        }
    };

    const handleOpenDeleteConfirm = (vehicleId: string, plate: string) => {
        setDeleteConfirm({ isOpen: true, vehicleId, plate });
    };

    const handleConfirmDelete = () => {
        const updatedVehicles = (resident.vehicles || []).filter((v) => v.id !== deleteConfirm.vehicleId);
        onUpdateResident(resident.id, updatedVehicles);
        setDeleteConfirm({ isOpen: false, vehicleId: "", plate: "" });
    };

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="w-full max-w-2xl bg-[#0F111A] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 relative z-50">
                    <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#0F111A]">
                        <div>
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <Car className="w-5 h-5 text-[#3B82F6]" />
                                {t("residents.modals.vehicleManagement.title")}
                            </h2>
                            <p className="text-xs text-slate-400 mt-1">{t("residents.modals.vehicleManagement.residentLabel")} {resident.name}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-white/5 text-slate-400 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* List of existing vehicles */}
                        <div>
                            <h3 className="text-sm font-bold text-white mb-3">{t("residents.modals.vehicleManagement.registeredVehicles")}</h3>
                            {(resident.vehicles || []).length > 0 ? (
                                <div className="space-y-3">
                                    {(resident.vehicles || []).map((vehicle) => (
                                        <div
                                            key={vehicle.id}
                                            className="flex items-center justify-between p-3 bg-[#151821] border border-white/10 rounded-xl group"
                                        >
                                            <div>
                                                <div className="font-mono text-white font-bold tracking-wide">
                                                    {formatLicensePlateForDisplay(vehicle.plate)}
                                                </div>
                                                <div className="text-xs text-slate-400">{vehicle.model}</div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {vehicle.parkingSpot && (
                                                    <span className="text-xs bg-blue-900/20 text-blue-400 px-2 py-1 rounded border border-blue-900/30 font-medium">
                                                        {vehicle.parkingSpot}
                                                    </span>
                                                )}
                                                <button
                                                    onClick={() =>
                                                        handleOpenDeleteConfirm(vehicle.id, vehicle.plate)
                                                    }
                                                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors"
                                                    title={t("residents.modals.vehicleManagement.actions.deleteVehicle")}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-4 border-2 border-dashed border-white/10 rounded-xl text-center text-slate-400 text-sm">
                                    {t("residents.modals.vehicleManagement.noVehicles")}
                                </div>
                            )}
                        </div>

                        {/* Add new vehicle form */}
                        <div className="pt-6 border-t border-white/5">
                            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                                <PlusCircle className="w-4 h-4" /> {t("residents.modals.vehicleManagement.addNewVehicle")}
                            </h3>
                            
                            {/* Row 1: License Plate (Digital Font) */}
                            <div className="space-y-1 mb-4">
                                <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                                    {t("residents.modals.vehicleManagement.labels.plate")}
                                </label>
                                <input
                                    type="text"
                                    value={displayPlate}
                                    onChange={(e) => handlePlateChange(e.target.value)}
                                    maxLength={11}
                                    className={`w-full bg-[#151821] border rounded-xl px-4 py-3 text-lg text-white focus:outline-none transition-colors placeholder-slate-500 font-mono tracking-wider ${
                                        plateError
                                            ? "border-red-500/50 focus:border-red-500"
                                            : "border-white/10 focus:border-[#3B82F6]"
                                    }`}
                                    placeholder="42 BER 69"
                                    style={{ fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace' }}
                                />
                                {plateError && (
                                    <p className="text-[10px] text-red-400 mt-1">{plateError}</p>
                                )}
                            </div>
                            
                            {/* Row 2: Brand and Model */}
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                {/* Brand */}
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                                        Marka
                                    </label>
                                    {!isCustomBrand ? (
                                        <div className="flex gap-2">
                                            <select
                                                value={vehicleForm.brandId}
                                                onChange={(e) => {
                                                    if (e.target.value === "__custom__") {
                                                        setIsCustomBrand(true);
                                                        setIsCustomModel(true); // Marka özel seçildiğinde model de manuel girişe geç
                                                        setVehicleForm({ ...vehicleForm, brandId: "", modelId: "", customModel: "" });
                                                    } else {
                                                        setIsCustomModel(false); // Normal marka seçildiğinde model dropdown'a dön
                                                        setVehicleForm({ ...vehicleForm, brandId: e.target.value, modelId: "", customModel: "" });
                                                    }
                                                }}
                                                disabled={loadingBrands}
                                                className="flex-1 bg-[#151821] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#3B82F6] transition-colors appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <option value="">
                                                    {loadingBrands ? "Yükleniyor..." : brandsError ? "Hata - Tekrar deneyin" : vehicleBrands.length === 0 ? "Marka bulunamadı" : "Marka Seçin"}
                                                </option>
                                                {vehicleBrands.length > 0 && vehicleBrands.map((brand) => (
                                                    <option key={brand.id} value={brand.id}>
                                                        {brand.name}
                                                    </option>
                                                ))}
                                                <option value="__custom__">+ Özel Giriş</option>
                                            </select>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={vehicleForm.customBrand}
                                                onChange={(e) => setVehicleForm({ ...vehicleForm, customBrand: e.target.value })}
                                                placeholder="Marka girin"
                                                className="flex-1 bg-[#151821] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#3B82F6] transition-colors placeholder-slate-500"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsCustomBrand(false);
                                                    setIsCustomModel(false); // Liste'ye dönünce model de dropdown'a dön
                                                    setVehicleForm({ ...vehicleForm, customBrand: "", customModel: "" });
                                                }}
                                                className="px-3 py-2.5 bg-[#1A1D26] hover:bg-[#20242F] text-slate-400 rounded-xl text-xs font-bold transition-colors border border-white/5"
                                            >
                                                Liste
                                            </button>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Model */}
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                                        Model
                                    </label>
                                    {!isCustomModel ? (
                                        <div className="flex gap-2">
                                            <select
                                                value={vehicleForm.modelId}
                                                onChange={(e) => {
                                                    if (e.target.value === "__custom__") {
                                                        setIsCustomModel(true);
                                                        setVehicleForm({ ...vehicleForm, modelId: "" });
                                                    } else {
                                                        setVehicleForm({ ...vehicleForm, modelId: e.target.value });
                                                    }
                                                }}
                                                disabled={(!vehicleForm.brandId && !isCustomBrand) || loadingModels}
                                                className="flex-1 bg-[#151821] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#3B82F6] transition-colors appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <option value="">
                                                    {isCustomBrand
                                                        ? "Model girin (manuel)"
                                                        : !vehicleForm.brandId
                                                        ? "Önce marka seçin"
                                                        : loadingModels
                                                        ? "Yükleniyor..."
                                                        : vehicleModels.length > 0
                                                        ? "Model Seçin"
                                                        : "Model Seçin veya Özel Giriş"}
                                                </option>
                                                {!isCustomBrand && vehicleModels.map((model) => (
                                                    <option key={model.id} value={model.id}>
                                                        {model.name}
                                                    </option>
                                                ))}
                                                {!isCustomBrand && vehicleModels.length > 0 && (
                                                    <option value="__custom__">+ Özel Giriş</option>
                                                )}
                                            </select>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={vehicleForm.customModel}
                                                onChange={(e) => setVehicleForm({ ...vehicleForm, customModel: e.target.value })}
                                                placeholder="Model girin"
                                                className="flex-1 bg-[#151821] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#3B82F6] transition-colors placeholder-slate-500"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsCustomModel(false);
                                                    setVehicleForm({ ...vehicleForm, customModel: "" });
                                                }}
                                                className="px-3 py-2.5 bg-[#1A1D26] hover:bg-[#20242F] text-slate-400 rounded-xl text-xs font-bold transition-colors border border-white/5"
                                            >
                                                Liste
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            {/* Row 3: Color and Fuel Type */}
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                {/* Color */}
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                                        Renk
                                    </label>
                                    <select
                                        value={vehicleForm.color}
                                        onChange={(e) => setVehicleForm({ ...vehicleForm, color: e.target.value })}
                                        className="w-full bg-[#151821] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#3B82F6] transition-colors appearance-none cursor-pointer"
                                    >
                                        <option value="">Renk Seçin (Opsiyonel)</option>
                                        {vehicleColors.map((color) => (
                                            <option key={color} value={color}>
                                                {color}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                {/* Fuel Type */}
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                                        Yakıt Türü
                                    </label>
                                    <select
                                        value={vehicleForm.fuelType}
                                        onChange={(e) => setVehicleForm({ ...vehicleForm, fuelType: e.target.value })}
                                        className="w-full bg-[#151821] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#3B82F6] transition-colors appearance-none cursor-pointer"
                                    >
                                        {fuelTypes.map((fuel) => (
                                            <option key={fuel} value={fuel}>
                                                {fuel}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            
                            {/* Row 4: Parking Spot */}
                            <div className="space-y-1 mb-4">
                                <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                                    {t("residents.modals.vehicleManagement.labels.parkingSpot")}
                                </label>
                                <select
                                    value={vehicleForm.parkingSpotId}
                                    onChange={(e) => {
                                        const selectedSpot = currentBlock?.parkingSpots?.find(s => s.id === e.target.value);
                                        setVehicleForm({ 
                                            ...vehicleForm, 
                                            parkingSpotId: e.target.value,
                                            parkingSpot: selectedSpot?.name || ""
                                        });
                                    }}
                                    className="w-full bg-[#151821] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#3B82F6] transition-colors appearance-none cursor-pointer"
                                >
                                    <option value="">{t("residents.modals.vehicleManagement.placeholders.parkingSpot")}</option>
                                    {currentBlock?.parkingSpots?.map((spot) => {
                                        // Check if spot is taken by any vehicle in activeBlock
                                        const isTaken = currentBlock?.units?.some((unit) =>
                                            unit.residents?.some((r) =>
                                                r.vehicles?.some((v) => v.parkingSpotId === spot.id || v.parkingSpot === spot.name)
                                            )
                                        ) || false;

                                        return (
                                            <option
                                                key={spot.id}
                                                value={spot.id}
                                                disabled={isTaken}
                                                className={isTaken ? "text-red-500" : ""}
                                            >
                                                {spot.name} {isTaken ? `(${t("residents.modals.vehicleManagement.actions.taken")})` : ""}
                                            </option>
                                        );
                                    }) || []}
                                </select>
                            </div>
                            
                            <button
                                onClick={handleAddVehicle}
                                disabled={!vehicleForm.plate || !!plateError}
                                className="w-full py-3 bg-[#3B82F6] hover:bg-[#2563EB] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-colors text-sm flex items-center justify-center gap-2"
                            >
                                <PlusCircle className="w-4 h-4" />
                                {t("residents.modals.vehicleManagement.actions.saveVehicle")}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={deleteConfirm.isOpen}
                onClose={() => setDeleteConfirm({ isOpen: false, vehicleId: "", plate: "" })}
                onConfirm={handleConfirmDelete}
                title={t("residents.modals.vehicleManagement.deleteConfirm.title")}
                message={
                    <p>
                        {t("residents.modals.vehicleManagement.deleteConfirm.message", {
                            plate: deleteConfirm.plate,
                        })}
                    </p>
                }
                variant="danger"
            />
        </>
    );
}
