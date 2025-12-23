import { Plus, Edit2, Trash2, X, AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ParkingSpotModalProps {
    isOpen: boolean;
    mode: "add" | "edit" | "delete";
    spotData: { id: string; name: string; floor: number };
    onClose: () => void;
    onSubmit: () => void;
    onSpotChange: (spot: { id: string; name: string; floor: number }) => void;
}

export function ParkingSpotModal({
    isOpen,
    mode,
    spotData,
    onClose,
    onSubmit,
    onSpotChange,
}: ParkingSpotModalProps) {
    const { t } = useTranslation();
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        {mode === "add" && (
                            <>
                                <Plus className="w-5 h-5 text-blue-500" /> {t("residents.parking.spotModal.add.title")}
                            </>
                        )}
                        {mode === "edit" && (
                            <>
                                <Edit2 className="w-5 h-5 text-blue-500" /> {t("residents.parking.spotModal.edit.title")}
                            </>
                        )}
                        {mode === "delete" && (
                            <>
                                <Trash2 className="w-5 h-5 text-red-500" /> {t("residents.parking.spotModal.delete.title")}
                            </>
                        )}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {mode === "delete" ? (
                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                                <AlertTriangle className="w-6 h-6 text-red-500" />
                            </div>
                            <p className="text-slate-300 mb-2">
                                {t("residents.parking.spotModal.delete.message", { name: spotData.name })}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-slate-400 uppercase">
                                    {t("residents.parking.spotModal.labels.floor")}
                                </label>
                                <select
                                    value={spotData.floor}
                                    onChange={(e) =>
                                        onSpotChange({
                                            ...spotData,
                                            floor: Number(e.target.value),
                                        })
                                    }
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                                >
                                    <option value="0">{t("residents.parking.spotModal.floorOptions.ground")}</option>
                                    <option value="-1">{t("residents.parking.spotModal.floorOptions.basement1")}</option>
                                    <option value="-2">{t("residents.parking.spotModal.floorOptions.basement2")}</option>
                                    <option value="1">{t("residents.parking.spotModal.floorOptions.floor1")}</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-slate-400 uppercase">
                                    {t("residents.parking.spotModal.labels.spotName")}
                                </label>
                                <input
                                    type="text"
                                    value={spotData.name}
                                    onChange={(e) =>
                                        onSpotChange({
                                            ...spotData,
                                            name: e.target.value.toUpperCase(),
                                        })
                                    }
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder={t("residents.parking.spotModal.placeholders.spotName")}
                                    autoFocus
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors text-sm"
                    >
                        {t("residents.parking.spotModal.buttons.cancel")}
                    </button>
                    <button
                        onClick={onSubmit}
                        className={`flex-1 px-4 py-2 text-white rounded-xl font-medium shadow-lg transition-colors text-sm ${mode === "delete"
                            ? "bg-red-600 hover:bg-red-500 shadow-red-900/20"
                            : "bg-blue-600 hover:bg-blue-500 shadow-blue-900/20"
                            }`}
                    >
                        {mode === "delete" ? t("residents.parking.spotModal.buttons.delete") : t("residents.parking.spotModal.buttons.save")}
                    </button>
                </div>
            </div>
        </div>
    );
}
