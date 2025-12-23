import { X, Car, MapPin, User, Phone, Search, Check } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { VehicleSearchItem, ParkingSpotDefinition } from "@/types/residents.types";
import { FilterChip } from "@/components/shared/inputs/filter-chip";

interface AssignVehicleModalProps {
    isOpen: boolean;
    onClose: () => void;
    spot: ParkingSpotDefinition | null;
    vehicles: VehicleSearchItem[];
    onAssign: (spotId: string, vehicleId: string) => void;
}

export function AssignVehicleModal({
    isOpen,
    onClose,
    spot,
    vehicles,
    onAssign,
}: AssignVehicleModalProps) {
    const { t } = useTranslation();
    const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [vehicleFilter, setVehicleFilter] = useState<"all" | "resident" | "guest">("all");

    if (!isOpen || !spot) return null;

    const getFloorLabel = (floor: number) => {
        if (floor === 0) {
            return t("residents.parking.map.floorLabels.ground");
        }
        return t("residents.parking.map.floorLabels.basement", { floor: Math.abs(floor) });
    };

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

    const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId);

    const handleAssign = () => {
        if (selectedVehicleId) {
            onAssign(spot.id, selectedVehicleId);
            setSelectedVehicleId(null);
            setSearchTerm("");
            setVehicleFilter("all");
            onClose();
        }
    };

    const getVehicleIconColor = (vehicle: VehicleSearchItem) => {
        if (vehicle.isGuest) {
            return vehicle.status === "active" ? "text-blue-400" : "text-amber-500";
        }
        return "text-slate-500";
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden relative">
                {/* Header */}
                <div className="p-6 border-b border-slate-800 bg-slate-900 flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <Car className="w-5 h-5 text-blue-500" />
                            {t("residents.parking.assignVehicle.title")}
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                            {t("residents.parking.assignVehicle.subtitle")}
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
                <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Spot Info */}
                    <div className="lg:col-span-1">
                        <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 space-y-4">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-400 uppercase">
                                        {t("residents.parking.assignVehicle.spotInfo.title")}
                                    </h3>
                                    <p className="text-lg font-bold text-white font-mono">{spot.name}</p>
                                </div>
                            </div>
                            <div className="space-y-2 pt-4 border-t border-slate-800">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-slate-500">
                                        {t("residents.parking.assignVehicle.spotInfo.floor")}
                                    </span>
                                    <span className="text-sm font-bold text-white">
                                        {getFloorLabel(spot.floor)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-slate-500">
                                        {t("residents.parking.assignVehicle.spotInfo.status")}
                                    </span>
                                    <span className="text-xs font-bold px-2 py-1 rounded bg-slate-800 text-slate-400 border border-slate-700">
                                        {t("residents.parking.map.empty")}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Selected Vehicle Preview */}
                        {selectedVehicle && (
                            <div className="mt-4 bg-slate-950 border border-blue-500/30 rounded-xl p-4">
                                <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">
                                    {t("residents.parking.assignVehicle.selectedVehicle.title")}
                                </h4>
                                <div className="space-y-2">
                                    <div className="font-bold text-white font-mono bg-slate-900 px-2 py-1 rounded border border-slate-700 text-center">
                                        {selectedVehicle.plate}
                                    </div>
                                    <div className="text-sm text-slate-300 font-medium">
                                        {selectedVehicle.vehicleModel || t("residents.parking.vehicleSearch.noModel")}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                        <User className="w-3 h-3" /> {selectedVehicle.name}
                                    </div>
                                    {!selectedVehicle.isGuest && (
                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                            <Phone className="w-3 h-3" /> {selectedVehicle.phone}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Vehicle List */}
                    <div className="lg:col-span-2">
                        <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-[500px]">
                            {/* Search Bar */}
                            <div className="p-4 border-b border-slate-800 bg-slate-900/50 space-y-3">
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

                            {/* Vehicle List */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                                {filteredVehicles.length > 0 ? (
                                    <div className="grid grid-cols-2 gap-3">
                                        {filteredVehicles.map((vehicle) => {
                                            const isSelected = vehicle.id === selectedVehicleId;
                                            const hasParkingSpot = !!vehicle.parkingSpot;

                                            return (
                                                <button
                                                    key={vehicle.id}
                                                    onClick={() => {
                                                        if (!hasParkingSpot) {
                                                            setSelectedVehicleId(
                                                                isSelected ? null : vehicle.id
                                                            );
                                                        }
                                                    }}
                                                    disabled={hasParkingSpot}
                                                    className={`w-full rounded-xl border transition-all text-left group relative overflow-hidden ${
                                                        isSelected
                                                            ? vehicle.isGuest
                                                                ? "bg-amber-500/10 border-amber-500 ring-4 ring-amber-500/40 shadow-lg shadow-amber-500/20 scale-[1.02]"
                                                                : "bg-blue-600/10 border-blue-500 ring-4 ring-blue-500/40 shadow-lg shadow-blue-500/20 scale-[1.02]"
                                                            : hasParkingSpot
                                                            ? "bg-slate-950/30 border-slate-800 opacity-50 cursor-not-allowed"
                                                            : "bg-slate-950/30 border-slate-800 hover:bg-slate-800/50 hover:border-slate-700 cursor-pointer"
                                                    } ${vehicle.isGuest && !isSelected
                                                            ? "bg-amber-900/10 border-amber-900/30"
                                                            : ""
                                                        }`}
                                                >
                                                    {/* Selected Accent Bar */}
                                                    {isSelected && (
                                                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                                                            vehicle.isGuest ? "bg-amber-500" : "bg-blue-500"
                                                        }`}></div>
                                                    )}
                                                    
                                                    <div className={`flex flex-col gap-2 ${
                                                        isSelected ? "pl-4 pr-3 py-3" : "p-3"
                                                    }`}>
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <div className={`font-bold text-white font-mono px-2 py-1 rounded border shadow-sm text-xs ${
                                                                isSelected
                                                                    ? vehicle.isGuest
                                                                        ? "bg-amber-500/20 border-amber-500/50"
                                                                        : "bg-blue-500/20 border-blue-500/50"
                                                                    : "bg-slate-900 border-slate-700"
                                                            }`}>
                                                                {vehicle.plate}
                                                            </div>
                                                            {isSelected && (
                                                                <div className={`p-1 rounded-full shadow-lg animate-in zoom-in duration-200 flex-shrink-0 ${
                                                                    vehicle.isGuest
                                                                        ? "bg-amber-500 shadow-amber-500/50"
                                                                        : "bg-blue-500 shadow-blue-500/50"
                                                                }`}>
                                                                    <Check className="w-3 h-3 text-white" />
                                                                </div>
                                                            )}
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
                                                </button>
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
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors text-sm"
                    >
                        {t("residents.parking.spotModal.buttons.cancel")}
                    </button>
                    <button
                        onClick={handleAssign}
                        disabled={!selectedVehicleId}
                        className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium shadow-lg shadow-blue-900/20 transition-colors text-sm"
                    >
                        {t("residents.parking.assignVehicle.assignButton")}
                    </button>
                </div>
            </div>
        </div>
    );
}

