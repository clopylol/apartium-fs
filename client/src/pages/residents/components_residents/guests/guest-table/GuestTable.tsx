import { Clock, LogIn, LogOut, MoreVertical, Smartphone, CarFront, CalendarDays, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { GuestVisit } from "@/types/residents.types";
import { formatGuestVisitTime } from "@/utils/date";

interface GuestTableProps {
    guests: GuestVisit[];
    isLoading?: boolean;
    onGuestSelect: (guest: GuestVisit) => void;
}

export function GuestTable({ guests, isLoading, onGuestSelect }: GuestTableProps) {
    const { t } = useTranslation();
    if (isLoading) return null;

    // Helper function to get icon color based on guest status
    const getGuestIconColor = (status: string) => {
        if (status === "active") return "text-blue-400";
        if (status === "pending") return "text-amber-500";
        return "text-red-500"; // completed
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-slate-800 bg-slate-950/50 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                            <th className="px-6 py-4">{t("residents.guests.table.columns.plateVehicle")}</th>
                            <th className="px-6 py-4">{t("residents.guests.table.columns.host")}</th>
                            <th className="px-6 py-4">{t("residents.guests.table.columns.visitDate")}</th>
                            <th className="px-6 py-4">{t("residents.guests.table.columns.statusSource")}</th>
                            <th className="px-6 py-4 text-right">{t("residents.guests.table.columns.actions")}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {guests.length > 0 ? (
                            guests.map((guest) => (
                                <tr
                                    key={guest.id}
                                    onClick={() => onGuestSelect(guest)}
                                    className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors group cursor-pointer"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {/* Icon Box with Gradient based on status */}
                                            <div
                                                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-inner ${guest.status === 'active'
                                                    ? 'bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30'
                                                    : guest.status === 'pending'
                                                        ? 'bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30'
                                                        : 'bg-gradient-to-br from-red-500/20 to-red-600/10 border border-red-500/30'
                                                    }`}
                                            >
                                                <CarFront className={`w-5 h-5 ${getGuestIconColor(guest.status)}`} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-white mb-0.5">
                                                    {guest.guestName || t("residents.guests.table.guest")}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono text-xs text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 w-fit inline-block">
                                                        {guest.plate}
                                                    </span>
                                                    <span className="text-xs text-slate-500">
                                                        {guest.model}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-200 text-sm">
                                            {guest.hostName}
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            {guest.blockName} - Daire {guest.unitNumber}
                                        </div>
                                        {guest.note && (
                                            <div
                                                className="text-[10px] text-blue-300 mt-1 bg-blue-900/20 px-2 py-1 rounded w-fit max-w-[200px] truncate"
                                                title={guest.note}
                                            >
                                                <span className="font-bold mr-1">Not:</span>{" "}
                                                {guest.note}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col text-sm text-slate-300">
                                            <span className="flex items-center gap-2">
                                                <CalendarDays className="w-3.5 h-3.5 text-slate-500" />{" "}
                                                {guest.expectedDate}
                                            </span>
                                            <span className="text-xs text-slate-500 mt-0.5 ml-5">
                                                {guest.durationDays} {t("residents.guests.table.daysDuration")}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col items-start gap-1">
                                            {guest.status === "pending" && (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                                    <Clock className="w-3.5 h-3.5" /> {t("residents.guests.table.status.pending")}
                                                </span>
                                            )}
                                            {guest.status === "active" && (
                                                <div>
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 animate-pulse">
                                                        <LogIn className="w-3.5 h-3.5" /> {t("residents.guests.table.status.active")}
                                                    </span>
                                                    <div className="text-[10px] text-blue-400/60 mt-1 pl-1">
                                                        {t("residents.guests.table.entry")} {formatGuestVisitTime(guest.entryTime)}
                                                    </div>
                                                </div>
                                            )}
                                            {guest.status === "completed" && (
                                                <div>
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                                                        <LogOut className="w-3.5 h-3.5" /> {t("residents.guests.table.status.completed")}
                                                    </span>
                                                    <div className="text-[10px] text-slate-500 mt-1 pl-1">
                                                        {t("residents.guests.table.exit")} {formatGuestVisitTime(guest.exitTime)}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Source Indicator */}
                                            {guest.source === "app" ? (
                                                <div className="flex items-center gap-1 text-[10px] text-emerald-500 mt-1 font-medium bg-emerald-900/10 px-1.5 py-0.5 rounded border border-emerald-900/20">
                                                    <Smartphone className="w-3 h-3" /> {t("residents.guests.table.source.mobileNotification")}
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-1">
                                                    <User className="w-3 h-3" /> {t("residents.guests.table.source.manualRecord")}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onGuestSelect(guest);
                                            }}
                                            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                                        >
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="px-6 py-12 text-center text-slate-500"
                                >
                                    <CarFront className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                    <p>{t("residents.guests.table.noRecords")}</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
