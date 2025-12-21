import { CarFront, Clock, History } from "lucide-react";
import { useTranslation } from "react-i18next";

interface GuestStatsProps {
    active: number;
    pending: number;
    completedToday: number;
    isLoading?: boolean;
}

export function GuestStats({ active, pending, completedToday, isLoading }: GuestStatsProps) {
    const { t } = useTranslation();
    if (isLoading) {
        return null;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Active Guests - Blue */}
            <div className="relative overflow-hidden rounded-2xl p-6 border border-blue-900/30 bg-gradient-to-br from-blue-950 to-blue-900/50 shadow-lg group">
                {/* Large Background Icon */}
                <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                    <CarFront className="w-32 h-32 text-blue-500" />
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm font-medium text-blue-200/60 mb-1">
                                {t("residents.guests.stats.activeGuests")}
                            </p>
                            <h3 className="text-4xl font-bold text-white">{active}</h3>
                        </div>

                        {/* Icon Box */}
                        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 shadow-inner">
                            <CarFront className="w-6 h-6 text-blue-400" />
                        </div>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30 w-fit">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></div>
                        {t("residents.guests.stats.active")}
                        <span className="font-normal opacity-70 ml-1">{t("residents.guests.stats.vehicleParked")}</span>
                    </div>
                </div>
            </div>

            {/* Pending Guests - Orange/Brown */}
            <div className="relative overflow-hidden rounded-2xl p-6 border border-orange-900/30 bg-gradient-to-br from-orange-950 to-orange-900/50 shadow-lg group">
                {/* Large Background Icon */}
                <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                    <Clock className="w-32 h-32 text-orange-500" />
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm font-medium text-orange-200/60 mb-1">
                                {t("residents.guests.stats.expectedVehicle")}
                            </p>
                            <h3 className="text-4xl font-bold text-white">{pending}</h3>
                        </div>

                        {/* Icon Box */}
                        <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/30 shadow-inner">
                            <Clock className="w-6 h-6 text-orange-400" />
                        </div>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-500/20 text-orange-300 text-xs font-bold border border-orange-500/30 w-fit">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div>
                        {t("residents.guests.stats.request")}
                        <span className="font-normal opacity-70 ml-1">{t("residents.guests.stats.willEnter")}</span>
                    </div>
                </div>
            </div>

            {/* Completed Visits - Green */}
            <div className="relative overflow-hidden rounded-2xl p-6 border border-emerald-900/30 bg-gradient-to-br from-emerald-950 to-emerald-900/50 shadow-lg group">
                {/* Large Background Icon */}
                <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                    <History className="w-32 h-32 text-emerald-500" />
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm font-medium text-emerald-200/60 mb-1">
                                {t("residents.guests.stats.todayEntries")}
                            </p>
                            <h3 className="text-4xl font-bold text-white">{completedToday}</h3>
                        </div>

                        {/* Icon Box */}
                        <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 shadow-inner">
                            <History className="w-6 h-6 text-emerald-400" />
                        </div>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 w-fit">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                        {t("residents.guests.stats.completed")}
                        <span className="font-normal opacity-70 ml-1">{t("residents.guests.stats.visit")}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
