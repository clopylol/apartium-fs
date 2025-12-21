import { ParkingMeter, Car, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ParkingStatsProps {
    totalSpots: number;
    occupiedSpots: number;
    availableSpots: number;
    occupancyRate: number;
    guestVehicles: number;
    isLoading?: boolean;
}

export function ParkingStats({
    totalSpots,
    occupiedSpots,
    availableSpots,
    occupancyRate,
    guestVehicles,
    isLoading,
}: ParkingStatsProps) {
    const { t } = useTranslation();
    
    if (isLoading) {
        return null;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {/* Toplam Park Alanı - Blue */}
            <div className="relative overflow-hidden rounded-2xl p-6 border border-blue-900/30 bg-gradient-to-br from-blue-950 to-blue-900/50 shadow-lg group">
                <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                    <ParkingMeter className="w-32 h-32 text-blue-500" />
                </div>

                <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm font-medium text-blue-200/60 mb-1">
                                {t("residents.parking.stats.totalSpots")}
                            </p>
                            <h3 className="text-4xl font-bold text-white">{totalSpots}</h3>
                        </div>

                        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 shadow-inner">
                            <ParkingMeter className="w-6 h-6 text-blue-400" />
                        </div>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30 w-fit">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                        {t("residents.parking.stats.allFloors")}
                    </div>
                </div>
            </div>

            {/* Dolu + Boş Park Alanları + Doluluk Oranı - Orange/Green Split */}
            <div className="relative overflow-hidden rounded-2xl p-6 border border-orange-900/30 bg-gradient-to-br from-orange-950 to-orange-900/50 shadow-lg group">
                <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                    <Car className="w-32 h-32 text-orange-500" />
                </div>

                <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-orange-200/60 mb-3">
                                {t("residents.parking.stats.occupiedAndAvailable")}
                            </p>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                                    <span className="text-xs text-orange-200/80">
                                        {t("residents.parking.stats.occupied")}:
                                    </span>
                                </div>
                                <span className="text-2xl font-bold text-white">{occupiedSpots}/{totalSpots}</span>
                            </div>
                        </div>

                        <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/30 shadow-inner">
                            <Car className="w-6 h-6 text-orange-400" />
                        </div>
                    </div>

                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-orange-500/20 text-orange-300 text-xs font-bold border border-orange-500/30 w-fit">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse"></div>
                        <span>{t("residents.parking.stats.currentStatus")}</span>
                        <span className="text-orange-200/70">•</span>
                        <span>%{occupancyRate}</span>
                    </div>
                </div>
            </div>

            {/* Misafir Araçları - Cyan */}
            <div className="relative overflow-hidden rounded-2xl p-6 border border-cyan-900/30 bg-gradient-to-br from-cyan-950 to-cyan-900/50 shadow-lg group">
                <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                    <Users className="w-32 h-32 text-cyan-500" />
                </div>

                <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm font-medium text-cyan-200/60 mb-1">
                                {t("residents.parking.stats.guestVehicles")}
                            </p>
                            <h3 className="text-4xl font-bold text-white">{guestVehicles}</h3>
                        </div>

                        <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border border-cyan-500/30 shadow-inner">
                            <Users className="w-6 h-6 text-cyan-400" />
                        </div>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30 w-fit">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></div>
                        {t("residents.parking.stats.activeGuests")}
                    </div>
                </div>
            </div>
        </div>
    );
}

