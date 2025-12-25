import { X, Car, Trash2, PlusCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { Resident, Building, ResidentVehicle } from "@/types/residents.types";
import { ConfirmationModal } from "@/components/shared/modals";
import {
    formatLicensePlateForDisplay,
    cleanLicensePlate,
    getLicensePlateError,
} from "@/utils/validation";
import { showError } from "@/utils/toast";

interface VehicleManagementModalProps {
    isOpen: boolean;
    onClose: () => void;
    resident: Resident;
    blockId: string;
    unitId: string;
    buildings: Building[];
    onUpdateResident: (residentId: string, vehicles: ResidentVehicle[]) => void;
}

export function VehicleManagementModal({
    isOpen,
    onClose,
    resident,
    blockId,
    buildings,
    onUpdateResident,
}: VehicleManagementModalProps) {
    const { t } = useTranslation();
    const [vehicleForm, setVehicleForm] = useState({
        plate: "",
        brand: "",
        model: "",
        color: "",
        fuelType: "Benzinli",
        parkingSpot: "",
    });
    
    // Display plate (with spaces) - separate from actual value
    const [displayPlate, setDisplayPlate] = useState("");
    
    // For brand/model dropdowns - allow custom input
    const [isCustomBrand, setIsCustomBrand] = useState(false);
    const [isCustomModel, setIsCustomModel] = useState(false);
    
    const [plateError, setPlateError] = useState<string | null>(null);
    
    // Vehicle brands and models
    const vehicleBrands = [
        "BMW", "Mercedes-Benz", "Audi", "Volkswagen", "Toyota", "Honda", 
        "Ford", "Renault", "Peugeot", "Fiat", "Opel", "Hyundai", "Kia",
        "Nissan", "Mazda", "Volvo", "Skoda", "Seat", "Citroen", "Dacia",
        "Chevrolet", "Mitsubishi", "Suzuki", "Mini", "Jaguar", "Land Rover",
        "Porsche", "Tesla", "Alfa Romeo", "Jeep", "Subaru", "Lexus", "Infiniti"
    ];
    
    const vehicleModels: Record<string, string[]> = {
        "BMW": ["1 Series", "2 Series", "3 Series", "4 Series", "5 Series", "6 Series", "7 Series", "X1", "X3", "X5", "X7", "iX", "i4"],
        "Mercedes-Benz": ["A-Class", "B-Class", "C-Class", "E-Class", "S-Class", "GLA", "GLB", "GLC", "GLE", "GLS", "CLA", "CLS", "AMG GT"],
        "Audi": ["A1", "A3", "A4", "A5", "A6", "A7", "A8", "Q3", "Q5", "Q7", "Q8", "e-tron", "TT", "R8"],
        "Volkswagen": ["Polo", "Golf", "Passat", "Tiguan", "Touareg", "Jetta", "Arteon", "T-Cross", "T-Roc", "ID.3", "ID.4"],
        "Toyota": ["Corolla", "Camry", "RAV4", "Highlander", "Prius", "Yaris", "C-HR", "Land Cruiser", "Hilux", "Auris"],
        "Honda": ["Civic", "Accord", "CR-V", "HR-V", "Pilot", "Fit", "City", "BR-V"],
        "Ford": ["Focus", "Fiesta", "Mondeo", "Kuga", "Edge", "Explorer", "Ranger", "Transit", "Mustang"],
        "Renault": ["Clio", "Megane", "Fluence", "Captur", "Kadjar", "Talisman", "Koleos", "Duster", "Symbol", "Twingo"],
        "Peugeot": ["208", "308", "508", "2008", "3008", "5008", "Partner", "Expert", "Rifter"],
        "Fiat": ["500", "Punto", "Egea", "Tipo", "Doblo", "Panda", "Linea", "Palio", "Albea"],
        "Opel": ["Corsa", "Astra", "Insignia", "Crossland", "Grandland", "Mokka", "Combo", "Vivaro"],
        "Hyundai": ["i20", "i30", "Elantra", "Tucson", "Santa Fe", "Kona", "Accent", "Sonata", "Ioniq", "Palisade"],
        "Kia": ["Rio", "Ceed", "Optima", "Sportage", "Sorento", "Stonic", "Picanto", "Cerato", "Niro", "EV6"],
        "Nissan": ["Micra", "Sentra", "Altima", "Qashqai", "X-Trail", "Pathfinder", "Navara", "Juke", "Leaf"],
        "Mazda": ["Mazda2", "Mazda3", "Mazda6", "CX-3", "CX-5", "CX-9", "MX-5"],
        "Volvo": ["S60", "S90", "V40", "V60", "V90", "XC40", "XC60", "XC90"],
        "Skoda": ["Octavia", "Superb", "Kamiq", "Karoq", "Kodiaq", "Fabia", "Scala", "Enyaq", "Enyaq iV"],
        "Seat": ["Ibiza", "Leon", "Ateca", "Tarraco", "Arona", "Formentor", "Cupra"],
        "Citroen": ["C3", "C4", "C5", "Berlingo", "Cactus", "C-Elysee", "Jumper"],
        "Dacia": ["Sandero", "Logan", "Duster", "Lodgy", "Dokker", "Spring"],
        "Chevrolet": ["Cruze", "Malibu", "Trax", "Equinox", "Tahoe", "Silverado", "Spark"],
        "Mitsubishi": ["L200", "Outlander", "ASX", "Eclipse Cross", "Pajero", "Space Star"],
        "Suzuki": ["Swift", "Vitara", "S-Cross", "Jimny", "SX4", "Grand Vitara", "Baleno"],
        "Mini": ["Cooper", "Countryman", "Clubman", "Paceman", "Convertible"],
        "Jaguar": ["XE", "XF", "XJ", "F-Pace", "E-Pace", "I-Pace"],
        "Land Rover": ["Discovery", "Discovery Sport", "Range Rover", "Range Rover Sport", "Range Rover Evoque", "Defender"],
        "Porsche": ["911", "Cayenne", "Macan", "Panamera", "Boxster", "Cayman", "Taycan"],
        "Tesla": ["Model 3", "Model S", "Model X", "Model Y"],
        "Alfa Romeo": ["Giulia", "Stelvio", "Tonale", "4C"],
        "Jeep": ["Wrangler", "Grand Cherokee", "Cherokee", "Compass", "Renegade"],
        "Subaru": ["Impreza", "Legacy", "Outback", "Forester", "XV"],
        "Lexus": ["ES", "IS", "LS", "NX", "RX", "GX", "LX", "UX"],
        "Infiniti": ["Q50", "Q60", "QX50", "QX60", "QX80"],
    };
    
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

    if (!isOpen) return null;

    // Safe access with null checks
    const currentBlock = buildings?.find((b) => b.id === blockId);

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

        // Build model string: "Brand Model" or just "Model" if no brand
        let modelString = "";
        if (vehicleForm.brand && vehicleForm.model) {
            modelString = `${vehicleForm.brand} ${vehicleForm.model}`;
        } else if (vehicleForm.model) {
            modelString = vehicleForm.model;
        } else if (vehicleForm.brand) {
            modelString = vehicleForm.brand;
        }
        
        const newVehicle: ResidentVehicle = {
            id: `vehicle-${Date.now()}`,
            plate: cleanedPlate,
            model: modelString,
            color: vehicleForm.color || undefined,
            fuelType: vehicleForm.fuelType || "Benzinli",
            parkingSpot: vehicleForm.parkingSpot || undefined,
        };

        const updatedVehicles = [...(resident.vehicles || []), newVehicle];
        onUpdateResident(resident.id, updatedVehicles);

        // Reset form
        setVehicleForm({ plate: "", brand: "", model: "", color: "", fuelType: "Benzinli", parkingSpot: "" });
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
                                                value={vehicleForm.brand}
                                                onChange={(e) => {
                                                    if (e.target.value === "__custom__") {
                                                        setIsCustomBrand(true);
                                                        setVehicleForm({ ...vehicleForm, brand: "" });
                                                    } else {
                                                        setVehicleForm({ ...vehicleForm, brand: e.target.value });
                                                    }
                                                }}
                                                className="flex-1 bg-[#151821] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#3B82F6] transition-colors appearance-none cursor-pointer"
                                            >
                                                <option value="">Marka Seçin</option>
                                                {vehicleBrands.map((brand) => (
                                                    <option key={brand} value={brand}>
                                                        {brand}
                                                    </option>
                                                ))}
                                                <option value="__custom__">+ Özel Giriş</option>
                                            </select>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={vehicleForm.brand}
                                                onChange={(e) => setVehicleForm({ ...vehicleForm, brand: e.target.value })}
                                                placeholder="Marka girin"
                                                className="flex-1 bg-[#151821] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#3B82F6] transition-colors placeholder-slate-500"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsCustomBrand(false);
                                                    setVehicleForm({ ...vehicleForm, brand: "" });
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
                                                value={vehicleForm.model}
                                                onChange={(e) => {
                                                    if (e.target.value === "__custom__") {
                                                        setIsCustomModel(true);
                                                        setVehicleForm({ ...vehicleForm, model: "" });
                                                    } else {
                                                        setVehicleForm({ ...vehicleForm, model: e.target.value });
                                                    }
                                                }}
                                                disabled={!vehicleForm.brand}
                                                className="flex-1 bg-[#151821] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#3B82F6] transition-colors appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <option value="">
                                                    {vehicleForm.brand
                                                        ? vehicleModels[vehicleForm.brand]
                                                            ? "Model Seçin"
                                                            : "Model Seçin veya Özel Giriş"
                                                        : "Önce marka seçin"}
                                                </option>
                                                {vehicleForm.brand && vehicleModels[vehicleForm.brand]?.map((model) => (
                                                    <option key={model} value={model}>
                                                        {model}
                                                    </option>
                                                ))}
                                                {vehicleForm.brand && (
                                                    <option value="__custom__">+ Özel Giriş</option>
                                                )}
                                            </select>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={vehicleForm.model}
                                                onChange={(e) => setVehicleForm({ ...vehicleForm, model: e.target.value })}
                                                placeholder="Model girin"
                                                className="flex-1 bg-[#151821] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#3B82F6] transition-colors placeholder-slate-500"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsCustomModel(false);
                                                    setVehicleForm({ ...vehicleForm, model: "" });
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
                                    value={vehicleForm.parkingSpot}
                                    onChange={(e) =>
                                        setVehicleForm({ ...vehicleForm, parkingSpot: e.target.value })
                                    }
                                    className="w-full bg-[#151821] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#3B82F6] transition-colors appearance-none cursor-pointer"
                                >
                                    <option value="">{t("residents.modals.vehicleManagement.placeholders.parkingSpot")}</option>
                                    {currentBlock?.parkingSpots?.map((spot) => {
                                        const allVehicles = (buildings
                                            ?.flatMap((b) =>
                                                b.units?.flatMap((u) =>
                                                    u.residents?.flatMap((r) => (r.vehicles || []) as ResidentVehicle[]) || []
                                                ) || []
                                            ) || []) as ResidentVehicle[];
                                        const isTaken = allVehicles.some((v) => v.parkingSpot === spot.name);

                                        return (
                                            <option
                                                key={spot.id}
                                                value={spot.name}
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
