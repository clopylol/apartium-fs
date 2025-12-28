import { X, User, Phone, Mail, Home, Car, MapPin, Edit2 } from "lucide-react";
import { createPortal } from "react-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { Resident, Unit, Building } from "@/types/residents.types";
import { formatLicensePlateForDisplay, formatPhoneNumber } from "@/utils/validation";

interface ResidentDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    residents: Resident[];
    unit: Unit;
    block: Building | null;
    blockName: string;
    onEdit?: (resident: Resident) => void;
}

export function ResidentDetailModal({
    isOpen,
    onClose,
    residents,
    unit,
    block,
    blockName,
    onEdit,
}: ResidentDetailModalProps) {
    const { t } = useTranslation();
    const [selectedResidentIndex, setSelectedResidentIndex] = useState(0);

    // Don't render if not open or residents array is empty
    if (!isOpen || !residents || residents.length === 0) return null;

    // Get current resident based on selected index
    const currentResident = residents[selectedResidentIndex];

    // Helper function to get parking spot name from parkingSpotId
    const getParkingSpotName = (parkingSpotId: string | null | undefined): string | null => {
        if (!parkingSpotId || !block?.parkingSpots) return null;
        const spot = block.parkingSpots.find(s => s.id === parkingSpotId);
        return spot?.name || null;
    };

    const modalContent = (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={(e) => {
                // Close modal when clicking backdrop
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <div 
                className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[calc(100vh-8rem)] shadow-2xl overflow-hidden relative flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <User className="w-5 h-5 text-blue-400" />
                            {t("residents.modals.detail.title") || "Resident Details"}
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                            {blockName} - {t("residents.messages.unitNumber")} {unit.number}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors p-1 bg-slate-800 rounded-lg"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Tabs - Only show if more than one resident */}
                {residents.length > 1 && (
                    <div className="border-b border-slate-800 bg-slate-950/30 px-6">
                        <div className="flex gap-2 overflow-x-auto custom-scrollbar">
                            {residents.map((resident, index) => (
                                <button
                                    key={resident.id}
                                    onClick={() => setSelectedResidentIndex(index)}
                                    className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                                        index === selectedResidentIndex
                                            ? "border-blue-500 text-white"
                                            : "border-transparent text-slate-400 hover:text-white hover:border-slate-600"
                                    }`}
                                    aria-label={t("residents.modals.detail.tabLabel", { name: resident.name, index: index + 1 })}
                                    aria-selected={index === selectedResidentIndex}
                                    role="tab"
                                >
                                    <img
                                        src={resident.avatar}
                                        alt={resident.name}
                                        className="w-6 h-6 rounded-full border border-slate-700 object-cover"
                                    />
                                    <span className="text-sm font-medium">{resident.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Body */}
                <div className="p-6 space-y-6 flex-1 overflow-y-auto custom-scrollbar min-h-0">
                    {/* Resident Info */}
                    <div className="flex items-start gap-4">
                        <img
                            src={currentResident.avatar}
                            alt={currentResident.name}
                            className="w-20 h-20 rounded-full border-2 border-slate-700 object-cover"
                        />
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-white mb-1">{currentResident.name}</h3>
                            <span
                                className={`inline-block text-xs uppercase font-bold px-2 py-1 rounded ${
                                    currentResident.type === "owner"
                                        ? "bg-blue-500/20 text-blue-400"
                                        : "bg-purple-500/20 text-purple-400"
                                }`}
                            >
                                {currentResident.type === "owner" ? t("residents.status.owner") : t("residents.status.tenant")}
                            </span>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                            {t("residents.modals.detail.contactInfo") || "Contact Information"}
                        </h4>
                        <div className="bg-slate-950/50 rounded-xl p-4 space-y-3 border border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-slate-800 rounded-lg">
                                    <Phone className="w-4 h-4 text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">{t("residents.modals.detail.phone") || "Phone"}</p>
                                    <p className="text-sm font-medium text-white">{formatPhoneNumber(currentResident.phone)}</p>
                                </div>
                            </div>
                            {currentResident.email && (
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-800 rounded-lg">
                                        <Mail className="w-4 h-4 text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500">{t("residents.modals.detail.email") || "Email"}</p>
                                        <p className="text-sm font-medium text-white">{currentResident.email}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Unit Information */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                            {t("residents.modals.detail.unitInfo") || "Unit Information"}
                        </h4>
                        <div className="bg-slate-950/50 rounded-xl p-4 space-y-3 border border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-slate-800 rounded-lg">
                                    <Home className="w-4 h-4 text-blue-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-slate-500">{t("residents.messages.unitNumber")}</p>
                                    <p className="text-sm font-medium text-white">{unit.number}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">{t("residents.messages.floor")}</p>
                                    <p className="text-sm font-medium text-white">{unit.floor}. {t("residents.messages.floor")}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Vehicles */}
                    {currentResident.vehicles.length > 0 ? (
                        <div className="space-y-3">
                            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                                {t("residents.modals.vehicleManagement.registeredVehicles")}
                            </h4>
                            <div className="space-y-2">
                                {currentResident.vehicles.map((vehicle) => {
                                    const parkingSpotName = vehicle.parkingSpot || getParkingSpotName(vehicle.parkingSpotId);
                                    
                                    return (
                                        <div
                                            key={vehicle.id}
                                            className="bg-slate-950/50 rounded-xl p-4 border border-slate-800"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-slate-800 rounded-lg">
                                                        <Car className="w-4 h-4 text-blue-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-slate-500">{t("residents.modals.vehicleManagement.labels.plate")}</p>
                                                        <p className="text-sm font-bold text-white font-mono">
                                                            {formatLicensePlateForDisplay(vehicle.plate)}
                                                        </p>
                                                    </div>
                                                </div>
                                                {parkingSpotName && (
                                                    <div className="flex items-center gap-1.5 text-[10px] bg-blue-500/10 text-blue-400 px-2 py-1 rounded border border-blue-500/20">
                                                        <MapPin className="w-3 h-3" />
                                                        {parkingSpotName}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-start gap-4 mt-3">
                                                {vehicle.model && (
                                                    <div className="flex-1">
                                                        <p className="text-xs text-slate-500">{t("residents.modals.vehicleManagement.labels.model")}</p>
                                                        <p className="text-sm font-medium text-white">{vehicle.model}</p>
                                                    </div>
                                                )}
                                                {vehicle.color && (
                                                    <div className="flex-1">
                                                        <p className="text-xs text-slate-500">Renk</p>
                                                        <p className="text-sm font-medium text-white">{vehicle.color}</p>
                                                    </div>
                                                )}
                                                {vehicle.fuelType && (
                                                    <div className="flex-1">
                                                        <p className="text-xs text-slate-500">Yakıt Türü</p>
                                                        <p className="text-sm font-medium text-white">{vehicle.fuelType}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                                {t("residents.modals.vehicleManagement.registeredVehicles")}
                            </h4>
                            <div className="bg-slate-950/50 rounded-xl p-8 border border-slate-800 border-dashed text-center">
                                <Car className="w-8 h-8 mx-auto mb-2 text-slate-600 opacity-50" />
                                <p className="text-sm text-slate-500">
                                    {t("residents.modals.vehicleManagement.noVehicles")}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer with Edit Button */}
                {onEdit && (
                    <div className="p-6 border-t border-slate-800 bg-slate-950/50 flex justify-end w-full">
                        <button
                            onClick={() => {
                                onClose();
                                onEdit(currentResident);
                            }}
                            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors text-sm"
                        >
                            <Edit2 className="w-4 h-4" />
                            {t("residents.modals.detail.editButton") || "Düzenle"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );

    // Render modal to document.body using React Portal
    return createPortal(modalContent, document.body);
}

