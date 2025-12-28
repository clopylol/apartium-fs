import { X, Search, User, Phone, MapPin, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { VehicleSearchItem } from "@/types/residents.types";
import { FilterChip } from "@/components/shared/inputs/filter-chip";
import { ConfirmationModal } from "@/components/shared/modals";
import { formatLicensePlateForDisplay } from "@/utils/validation";

interface VehicleSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    vehicles: VehicleSearchItem[];
    onDeleteVehicle?: (vehicleId: string, isGuest: boolean) => void;
}

export function VehicleSearchModal({
    isOpen,
    onClose,
    vehicles,
    onDeleteVehicle,
}: VehicleSearchModalProps) {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState("");
    const [vehicleFilter, setVehicleFilter] = useState<"all" | "resident" | "guest">("all");
    const [deleteConfirm, setDeleteConfirm] = useState<{
        isOpen: boolean;
        vehicleId: string;
        plate: string;
        isGuest: boolean;
    }>({
        isOpen: false,
        vehicleId: "",
        plate: "",
        isGuest: false,
    });

    if (!isOpen) return null;

    const filteredVehicles = vehicles.filter((vehicle) => {
        // Filter by type
        if (vehicleFilter === "resident" && vehicle.isGuest) return false;
        if (vehicleFilter === "guest" && !vehicle.isGuest) return false;

        // Filter by search term
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
            vehicle.plate.toLowerCase().includes(term) ||
            vehicle.name.toLowerCase().includes(term) ||
            vehicle.unitNumber.includes(term) ||
            (vehicle.vehicleModel?.toLowerCase().includes(term) ?? false)
        );
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-6xl shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-6 border-b border-slate-800 bg-slate-900 flex justify-between items-center flex-shrink-0">
                    <div>
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            {t("residents.parking.vehicleSearch.title")}
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                            {t("residents.parking.vehicleSearch.subtitle", { count: vehicles.length })}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors p-1 bg-slate-800 rounded-lg"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-hidden flex flex-col min-h-0">
                    {/* Search and Filters */}
                    <div className="p-4 border-b border-slate-800 bg-slate-900/50 space-y-3 flex-shrink-0">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder={t("residents.parking.assignVehicle.searchPlaceholder")}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-slate-600"
                            />
                        </div>
                        
                        {/* Filter Chips */}
                        <div className="flex items-center gap-3 overflow-x-auto pb-2 custom-scrollbar">
                            <FilterChip
                                label={t("residents.parking.assignVehicle.filters.all")}
                                isActive={vehicleFilter === "all"}
                                onClick={() => setVehicleFilter("all")}
                                variant="primary"
                                className="px-4 py-2.5 text-sm rounded-xl"
                            />
                            <FilterChip
                                label={t("residents.parking.assignVehicle.filters.resident")}
                                isActive={vehicleFilter === "resident"}
                                onClick={() => setVehicleFilter("resident")}
                                variant="info"
                                className="px-4 py-2.5 text-sm rounded-xl"
                            />
                            <FilterChip
                                label={t("residents.parking.assignVehicle.filters.guest")}
                                isActive={vehicleFilter === "guest"}
                                onClick={() => setVehicleFilter("guest")}
                                variant="warning"
                                className="px-4 py-2.5 text-sm rounded-xl"
                            />
                        </div>

                        <p className="text-xs text-slate-500">
                            {t("residents.parking.assignVehicle.vehicleCount", {
                                count: filteredVehicles.length,
                                total: vehicles.length,
                            })}
                        </p>
                    </div>

                    {/* Vehicle Grid */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                        {filteredVehicles.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                {filteredVehicles.map((vehicle) => {
                                    const hasParkingSpot = !!vehicle.parkingSpot;

                                    return (
                                        <div
                                            key={vehicle.id}
                                            className={`rounded-xl border transition-all group relative overflow-hidden ${
                                                hasParkingSpot
                                                    ? "bg-slate-950/30 border-slate-800 opacity-50"
                                                    : "bg-slate-950/30 border-slate-800 hover:bg-slate-800/50 hover:border-slate-700"
                                            } ${vehicle.isGuest
                                                    ? "bg-amber-900/10 border-amber-900/30"
                                                    : ""
                                                }`}
                                        >
                                            {/* Delete Button */}
                                            {onDeleteVehicle && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setDeleteConfirm({
                                                            isOpen: true,
                                                            vehicleId: vehicle.id,
                                                            plate: vehicle.plate,
                                                            isGuest: vehicle.isGuest,
                                                        });
                                                    }}
                                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 rounded border border-red-500/30 hover:border-red-500/50 z-10"
                                                    title={t("residents.modals.vehicleManagement.actions.deleteVehicle")}
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                            <div className="flex flex-col gap-2 p-3">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <div className="font-bold text-white font-mono px-2 py-1 rounded border shadow-sm text-xs bg-slate-900 border-slate-700">
                                                        {formatLicensePlateForDisplay(vehicle.plate)}
                                                    </div>
                                                    <span
                                                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                                            vehicle.isGuest
                                                                ? "bg-amber-500/20 text-amber-500"
                                                                : "bg-blue-900/20 text-blue-400"
                                                        }`}
                                                    >
                                                        {vehicle.isGuest
                                                            ? vehicle.status === "pending"
                                                                ? t("residents.parking.vehicleSearch.guestStatus.pending")
                                                                : t("residents.parking.vehicleSearch.guestStatus.active")
                                                            : `${vehicle.blockName} - ${vehicle.unitNumber}`}
                                                    </span>
                                                </div>
                                                <div className="text-xs text-slate-300 font-medium truncate">
                                                    {vehicle.vehicleModel || t("residents.parking.vehicleSearch.noModel")}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 flex-wrap">
                                                    <User className="w-3 h-3 flex-shrink-0" /> 
                                                    <span className="truncate">{vehicle.name}</span>
                                                    {!vehicle.isGuest && (
                                                        <>
                                                            <span className="w-1 h-1 rounded-full bg-slate-600 flex-shrink-0"></span>
                                                            <Phone className="w-3 h-3 flex-shrink-0" /> 
                                                            <span className="truncate">{vehicle.phone}</span>
                                                        </>
                                                    )}
                                                </div>
                                                {vehicle.parkingSpot && (
                                                    <div className="text-[10px] px-2 py-0.5 rounded w-fit border font-bold flex items-center gap-1 text-amber-500 bg-amber-500/10 border-amber-500/20">
                                                        <MapPin className="w-2.5 h-2.5" />{" "}
                                                        {t("residents.parking.vehicleSearch.parkingSpot")}{" "}
                                                        {vehicle.parkingSpot}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-10 text-slate-500">
                                <Search className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                <p className="text-sm">{t("residents.parking.vehicleSearch.noResults")}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={deleteConfirm.isOpen}
                onClose={() => setDeleteConfirm({ isOpen: false, vehicleId: "", plate: "", isGuest: false })}
                onConfirm={async () => {
                    if (onDeleteVehicle) {
                        try {
                            await onDeleteVehicle(deleteConfirm.vehicleId, deleteConfirm.isGuest);
                            // Wait a bit for cache to update before closing modal
                            await new Promise(resolve => setTimeout(resolve, 300));
                        } catch (error) {
                            // Error already handled in handleDeleteVehicle
                        }
                    }
                    setDeleteConfirm({ isOpen: false, vehicleId: "", plate: "", isGuest: false });
                }}
                title={t("residents.modals.vehicleManagement.deleteConfirm.title")}
                message={
                    <div className="flex flex-col items-center gap-2">
                        <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 w-full mb-2">
                            <div className="text-xl font-bold text-white font-mono text-center tracking-wider">
                                {formatLicensePlateForDisplay(deleteConfirm.plate)}
                            </div>
                        </div>
                        <p>{t("residents.modals.vehicleManagement.deleteConfirm.message", {
                            plate: formatLicensePlateForDisplay(deleteConfirm.plate),
                        })}</p>
                    </div>
                }
                variant="danger"
            />
        </div>
    );
}

