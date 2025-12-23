import { Home, Edit2, Trash2, Car, Plus, Key, MoreVertical } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Unit, Resident } from "@/types/residents.types";

interface ResidentCardProps {
    unit: Unit;
    blockId: string;
    onEditResident: (resident: Resident, blockId: string, unitId: string) => void;
    onDeleteResident: (residentId: string, blockId: string, unitId: string) => void;
    onManageVehicles: (resident: Resident, blockId: string, unitId: string) => void;
    onAddResident: (blockId: string, unitId: string) => void;
}

export function ResidentCard({
    unit,
    blockId,
    onEditResident,
    onDeleteResident,
    onManageVehicles,
    onAddResident,
}: ResidentCardProps) {
    const { t } = useTranslation();
    
    return (
        <div
            className={`group relative rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${unit.status === "occupied"
                    ? "bg-slate-900 border-slate-800 hover:border-blue-500/30"
                    : "bg-slate-900/50 border-slate-800 border-dashed hover:border-slate-600"
                }`}
        >
            {/* Card Header */}
            <div className="p-5 border-b border-slate-800/50 flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Home className="w-4 h-4 text-slate-500" /> {t("residents.messages.unitNumber")} {unit.number}
                    </h3>
                    <span className="text-xs text-slate-500 font-medium ml-6">{unit.floor}. {t("residents.messages.floor")}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div
                        className={`px-2 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${unit.status === "occupied"
                                ? "bg-emerald-500/10 text-emerald-500"
                                : "bg-slate-800 text-slate-500"
                            }`}
                    >
                        {unit.status === "occupied" ? t("residents.status.occupied") : t("residents.status.empty")}
                    </div>
                </div>
            </div>

            {/* Card Body */}
            <div className="p-5 min-h-[140px]">
                {unit.residents.length > 0 ? (
                    <div className="space-y-4">
                        {unit.residents.map((resident) => (
                            <div key={resident.id} className="flex flex-col gap-2 group/resident">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={resident.avatar}
                                            alt={resident.name}
                                            className="w-10 h-10 rounded-full border-2 border-slate-800 object-cover"
                                        />
                                        <div>
                                            <p className="text-sm font-medium text-slate-200">
                                                {resident.name}
                                            </p>
                                            <span
                                                className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${resident.type === "owner"
                                                        ? "bg-blue-500/20 text-blue-400"
                                                        : "bg-purple-500/20 text-purple-400"
                                                    }`}
                                            >
                                                {resident.type === "owner" ? t("residents.status.owner") : t("residents.status.tenant")}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => onManageVehicles(resident, blockId, unit.id)}
                                            className="p-1.5 text-slate-500 hover:text-blue-400 hover:bg-slate-800 rounded"
                                            title={t("residents.actions.manageVehiclesTooltip")}
                                        >
                                            <Car className="w-3 h-3" />
                                        </button>
                                        <button
                                            onClick={() => onEditResident(resident, blockId, unit.id)}
                                            className="p-1.5 text-slate-500 hover:text-white hover:bg-slate-800 rounded"
                                        >
                                            <Edit2 className="w-3 h-3" />
                                        </button>
                                        <button
                                            onClick={() =>
                                                onDeleteResident(resident.id, blockId, unit.id)
                                            }
                                            className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                                {resident.vehicles.length > 0 && (
                                    <div className="pl-12 space-y-1">
                                        {resident.vehicles.map((v) => (
                                            <div
                                                key={v.id}
                                                className="text-[10px] bg-slate-950/50 text-slate-400 px-2 py-1 rounded border border-slate-800/50 flex items-center justify-between"
                                            >
                                                <span className="font-mono">{v.plate}</span>
                                                {v.parkingSpot && (
                                                    <span className="text-blue-400">{v.parkingSpot}</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-2 py-4">
                        <Key className="w-8 h-8 opacity-20" />
                        <span className="text-sm font-medium">{t("residents.actions.noResidentsFound")}</span>
                    </div>
                )}
            </div>

            {/* Card Footer */}
            <div className="p-4 bg-slate-950/30 border-t border-slate-800/50 flex justify-between items-center opacity-60 group-hover:opacity-100 transition-opacity">
                <button className="text-xs font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-1">
                    <MoreVertical className="w-3 h-3" /> {t("residents.actions.details")}
                </button>
                <button
                    onClick={() => onAddResident(blockId, unit.id)}
                    className="text-xs font-bold text-blue-500 hover:text-blue-400 transition-colors bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1.5 rounded-lg flex items-center gap-1"
                >
                    <Plus className="w-3 h-3" /> {t("residents.actions.addResident")}
                </button>
            </div>
        </div>
    );
}
