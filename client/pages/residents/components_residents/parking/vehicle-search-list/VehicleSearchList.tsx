import { Phone, User, MapPin, Smartphone, Search, Maximize2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { VehicleSearchItem } from "@/types/residents.types";
import { VehicleSearchModal } from "../modals/vehicle-search-modal";

interface VehicleSearchListProps {
    vehicles: VehicleSearchItem[];
}

export function VehicleSearchList({ vehicles }: VehicleSearchListProps) {
    const { t } = useTranslation();
    const [showModal, setShowModal] = useState(false);

    // Helper function to get icon color based on status
    const getVehicleIconColor = (vehicle: VehicleSearchItem) => {
        if (vehicle.isGuest) {
            return vehicle.status === "active" ? "text-blue-400" : "text-amber-500";
        }
        return "text-slate-500";
    };

    return (
        <>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col w-full h-full max-h-[calc(100vh-12rem)]">
                <div className="p-4 border-b border-slate-800 bg-slate-950/50 flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-white mb-1">{t("residents.parking.vehicleSearch.title")}</h3>
                            <div className="text-xs text-slate-500">
                                {t("residents.parking.vehicleSearch.subtitle", { count: vehicles.length })}
                            </div>
                        </div>
                        <button
                            onClick={() => setShowModal(true)}
                            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                            title={t("residents.parking.vehicleSearch.expand")}
                        >
                            <Maximize2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 min-h-0">
                {vehicles.length > 0 ? (
                    vehicles.map((vehicle) => (
                        <div
                            key={vehicle.id}
                            className={`p-3 mb-2 rounded-xl border transition-colors cursor-pointer group ${vehicle.isGuest
                                ? "bg-amber-900/10 border-amber-900/30 hover:bg-amber-900/20"
                                : "bg-slate-950/30 border-slate-800 hover:bg-slate-800/50"
                                }`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="font-bold text-white font-mono bg-slate-900 px-2 py-1 rounded border border-slate-700 shadow-sm">
                                    {vehicle.plate}
                                </div>
                                <span
                                    className={`text-[10px] font-bold px-2 py-1 rounded ${vehicle.isGuest
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
                            <div className="text-sm text-slate-300 font-medium mb-1">
                                {vehicle.vehicleModel || t("residents.parking.vehicleSearch.noModel")}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <User className="w-3 h-3" /> {vehicle.name}
                                {!vehicle.isGuest && (
                                    <>
                                        <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                                        <Phone className="w-3 h-3" /> {vehicle.phone}
                                    </>
                                )}
                            </div>
                            {vehicle.parkingSpot && (
                                <div
                                    className={`mt-2 text-[10px] px-2 py-1 rounded w-fit border font-bold flex items-center gap-1 ${vehicle.isGuest
                                        ? "text-amber-500 bg-amber-500/10 border-amber-500/20"
                                        : "text-emerald-500 bg-emerald-900/10 border-emerald-900/20"
                                        }`}
                                >
                                    <MapPin className={`w-3 h-3 ${getVehicleIconColor(vehicle)}`} /> {t("residents.parking.vehicleSearch.parkingSpot")} {vehicle.parkingSpot}
                                </div>
                            )}
                            {vehicle.source === "app" && (
                                <div className="mt-2 flex items-center gap-1 text-[10px] text-blue-400">
                                    <Smartphone className="w-3 h-3" /> {t("residents.parking.vehicleSearch.mobileNotification")}
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 text-slate-500">
                        <Search className="w-8 h-8 mx-auto mb-2 opacity-20" />
                        <p className="text-sm">{t("residents.parking.vehicleSearch.noResults")}</p>
                    </div>
                )}
            </div>
            </div>

            {/* Vehicle Search Modal */}
            <VehicleSearchModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                vehicles={vehicles}
            />
        </>
    );
}
