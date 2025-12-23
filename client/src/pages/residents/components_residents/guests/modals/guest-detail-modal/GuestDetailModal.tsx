import { X, Clock, LogIn, LogOut, CarFront, Home, Phone, CalendarDays, MessageSquare } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { GuestVisit } from "@/types/residents.types";

interface GuestDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    guest: GuestVisit;
    onCheckIn: (guestId: string) => void;
    onCheckOut: (guestId: string) => void;
}

export function GuestDetailModal({ isOpen, onClose, guest, onCheckIn, onCheckOut }: GuestDetailModalProps) {
    const { t } = useTranslation();
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden relative" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="p-6 border-b border-slate-800 bg-slate-900 flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            {t("residents.guests.modals.detail.title")}
                        </h2>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">{guest.id}</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-1 bg-slate-800 rounded-lg">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">

                    {/* Status Badge & Actions */}
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            {guest.status === 'pending' && <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {t("residents.guests.modals.detail.status.pending")}</span>}
                            {guest.status === 'active' && <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1 animate-pulse"><LogIn className="w-3.5 h-3.5" /> {t("residents.guests.modals.detail.status.active")}</span>}
                            {guest.status === 'completed' && <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20 flex items-center gap-1"><LogOut className="w-3.5 h-3.5" /> {t("residents.guests.modals.detail.status.completed")}</span>}
                        </div>
                        <div className="text-xs text-slate-500 font-mono">
                            {guest.source === 'app' ? t("residents.guests.modals.detail.source.mobileNotification") : t("residents.guests.modals.detail.source.manualRecord")}
                        </div>
                    </div>

                    {/* Vehicle Card */}
                    <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                            <CarFront className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold font-mono text-lg tracking-wide">{guest.plate}</h3>
                            <p className="text-slate-400 text-sm">{guest.model || t("residents.guests.modals.detail.placeholders.noModel")} {guest.color && `• ${guest.color}`}</p>
                            <p className="text-slate-500 text-xs mt-1">{guest.guestName || t("residents.guests.modals.detail.placeholders.anonymousGuest")}</p>
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Host Info */}
                        <div className="bg-slate-800/20 p-4 rounded-xl border border-slate-800">
                            <p className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1"><Home className="w-3 h-3" /> {t("residents.guests.modals.detail.labels.host")}</p>
                            <p className="text-slate-200 font-bold text-sm">{guest.hostName}</p>
                            <p className="text-slate-400 text-xs mt-1">{guest.blockName} - Daire {guest.unitNumber}</p>
                            {/* Mock Phone */}
                            <p className="text-slate-500 text-xs mt-2 flex items-center gap-1"><Phone className="w-3 h-3" /> 5XX XXX XX XX</p>
                        </div>

                        {/* Visit Info */}
                        <div className="bg-slate-800/20 p-4 rounded-xl border border-slate-800">
                            <p className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1"><CalendarDays className="w-3 h-3" /> {t("residents.guests.modals.detail.labels.visit")}</p>
                            <p className="text-slate-200 font-bold text-sm">{guest.expectedDate}</p>
                            <p className="text-slate-400 text-xs mt-1">{guest.durationDays} {t("residents.guests.modals.detail.labels.daysDuration")}</p>
                            {guest.entryTime && <p className="text-blue-400 text-xs mt-2">{t("residents.guests.modals.detail.labels.entry")} {guest.entryTime}</p>}
                            {guest.exitTime && <p className="text-slate-500 text-xs">{t("residents.guests.modals.detail.labels.exit")} {guest.exitTime}</p>}
                        </div>
                    </div>

                    {/* Note */}
                    {guest.note && (
                        <div className="bg-blue-900/10 border border-blue-900/20 p-4 rounded-xl">
                            <p className="text-xs font-bold text-blue-400 uppercase mb-1 flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {t("residents.guests.modals.detail.labels.note")}</p>
                            <p className="text-sm text-blue-100 italic">"{guest.note}"</p>
                        </div>
                    )}

                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex gap-3">
                    <button onClick={onClose} className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors text-sm">
                        {t("residents.guests.modals.detail.buttons.close")}
                    </button>

                    {guest.status === 'pending' && (
                        <button
                            onClick={() => onCheckIn(guest.id)}
                            className="flex-[2] px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-900/20 transition-colors text-sm flex items-center justify-center gap-2"
                        >
                            <LogIn className="w-4 h-4" /> {t("residents.guests.modals.detail.buttons.checkIn")}
                        </button>
                    )}

                    {guest.status === 'active' && (
                        <button
                            onClick={() => onCheckOut(guest.id)}
                            className="flex-[2] px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold shadow-lg shadow-red-900/20 transition-colors text-sm flex items-center justify-center gap-2"
                        >
                            <LogOut className="w-4 h-4" /> {t("residents.guests.modals.detail.buttons.checkOut")}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
