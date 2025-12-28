import { Home, Edit2, Trash2, Car, Plus, Key, Phone, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Unit, Resident } from "@/types/residents.types";
import { formatLicensePlateForDisplay } from "@/utils/validation";

interface ResidentTableProps {
    units: Unit[];
    blockId: string;
    onEditResident: (resident: Resident, blockId: string, unitId: string) => void;
    onDeleteResident: (residentId: string, blockId: string, unitId: string) => void;
    onManageVehicles: (resident: Resident, blockId: string, unitId: string) => void;
    onAddResident: (blockId: string, unitId: string) => void;
}

export function ResidentTable({
    units,
    blockId,
    onEditResident,
    onDeleteResident,
    onManageVehicles,
    onAddResident,
}: ResidentTableProps) {
    const { t } = useTranslation();
    
    return (
        <div className="bg-ds-card-light dark:bg-[#0F111A] border border-ds-border-light dark:border-white/5 rounded-3xl overflow-hidden shadow-xl animate-in fade-in duration-300">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-ds-border-light dark:border-white/5 bg-ds-background-light/50 dark:bg-[#151821] text-[10px] uppercase text-ds-muted-light dark:text-ds-muted-dark/60 font-bold tracking-wider">
                            <th className="px-6 py-4 w-32">{t("residents.table.columnsUppercase.unit")}</th>
                            <th className="px-6 py-4 w-32">{t("residents.table.columnsUppercase.status")}</th>
                            <th className="px-6 py-4 w-1/4">{t("residents.table.columnsUppercase.residents")}</th>
                            <th className="px-6 py-4 w-1/5">{t("residents.table.columnsUppercase.contact")}</th>
                            <th className="px-6 py-4 w-1/5">{t("residents.table.columnsUppercase.vehicles")}</th>
                            <th className="px-6 py-4 text-right w-24">{t("residents.table.columnsUppercase.actions")}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-ds-border-light/50 dark:divide-white/5">
                        {units.length > 0 ? (
                            units.map((unit) => (
                                <tr
                                    key={unit.id}
                                    className="hover:bg-ds-muted-light/5 dark:hover:bg-white/5 transition-colors group"
                                >
                                    <td className="px-6 py-6 align-top">
                                        <div className="flex flex-col">
                                            <span className="text-base font-bold text-ds-primary-light dark:text-white mb-0.5">
                                                {t("residents.messages.unitNumber")} {unit.number}
                                            </span>
                                            <span className="text-[10px] text-ds-muted-light dark:text-ds-muted-dark/60 font-medium">
                                                {unit.floor}. {t("residents.messages.floor")}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 align-top">
                                        <div
                                            className={`inline-flex items-center px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${unit.status === "occupied"
                                                ? "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20"
                                                : "bg-ds-muted-light/10 text-ds-muted-light dark:text-ds-muted-dark border-ds-muted-light/20 dark:border-ds-muted-dark/20"
                                                }`}
                                        >
                                            {unit.status === "occupied" ? t("residents.table.statusUppercase.occupied") : t("residents.table.statusUppercase.empty")}
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 align-top">
                                        {unit.residents.length > 0 ? (
                                            <div className="space-y-6">
                                                {unit.residents.map((r) => (
                                                    <div
                                                        key={r.id}
                                                        className="flex items-start justify-between gap-4 group/item min-h-[40px]"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <img
                                                                src={r.avatar}
                                                                className="w-9 h-9 rounded-full object-cover ring-2 ring-white/5"
                                                                alt=""
                                                            />
                                                            <div>
                                                                <div className="text-sm font-bold text-ds-primary-light dark:text-white leading-tight">
                                                                    {r.name}
                                                                </div>
                                                                <div
                                                                    className={`text-[9px] uppercase font-bold mt-1 ${r.type === "owner"
                                                                        ? "text-[#3B82F6]"
                                                                        : "text-[#8B5CF6]"
                                                                        }`}
                                                                >
                                                                    {r.type === "owner" ? t("residents.table.typeUppercase.owner") : t("residents.table.typeUppercase.tenant")}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={() => onManageVehicles(r, blockId, unit.id)}
                                                                className="p-1.5 hover:bg-white/10 rounded text-ds-muted-light dark:text-ds-muted-dark hover:text-white transition-colors"
                                                                title={t("residents.actions.manageVehicles")}
                                                            >
                                                                <Car className="w-3.5 h-3.5" />
                                                            </button>
                                                            <button
                                                                onClick={() => onEditResident(r, blockId, unit.id)}
                                                                className="p-1.5 hover:bg-white/10 rounded text-ds-muted-light dark:text-ds-muted-dark hover:text-white transition-colors"
                                                                title={t("residents.actions.edit")}
                                                            >
                                                                <Edit2 className="w-3.5 h-3.5" />
                                                            </button>
                                                            <button
                                                                onClick={() => onDeleteResident(r.id, blockId, unit.id)}
                                                                className="p-1.5 hover:bg-red-500/10 rounded text-ds-muted-light dark:text-ds-muted-dark hover:text-red-400 transition-colors"
                                                                title={t("residents.actions.delete")}
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-xs text-ds-muted-light/40 dark:text-ds-muted-dark/40 flex items-center gap-2 font-medium">
                                                <Key className="w-4 h-4 opacity-50" /> {t("residents.actions.noResidents")}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-6 align-top text-xs">
                                        {unit.residents.length > 0 ? (
                                            unit.residents.map((r) => (
                                                <div key={r.id} className="mb-6 last:mb-0 min-h-[40px] flex flex-col justify-center">
                                                    <div className="flex items-center gap-2 text-ds-secondary-light dark:text-ds-secondary-dark/80 mb-1">
                                                        <Phone className="w-3 h-3 text-ds-muted-light dark:text-ds-muted-dark/50" />{" "}
                                                        {r.phone}
                                                    </div>
                                                    {r.email && (
                                                        <div className="flex items-center gap-2 text-ds-muted-light dark:text-ds-muted-dark/60">
                                                            <Mail className="w-3 h-3 text-ds-muted-light/50 dark:text-ds-muted-dark/30" />{" "}
                                                            {r.email}
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <span className="text-ds-muted-light/30 dark:text-ds-muted-dark/30">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-6 align-top text-xs">
                                        {unit.residents.length > 0 ? (
                                            unit.residents.map((r) => (
                                                <div key={r.id} className="mb-6 last:mb-0 min-h-[40px] flex flex-col justify-center">
                                                    {r.vehicles.length > 0 ? (
                                                        <div className="space-y-2">
                                                            {r.vehicles.map((v) => (
                                                                <div key={v.id} className="flex items-center gap-3">
                                                                    <div className="flex items-center gap-2 text-ds-secondary-light dark:text-ds-secondary-dark/80 font-mono text-[10px]">
                                                                        <Car className="w-3 h-3 text-ds-muted-light dark:text-ds-muted-dark/50" />{" "}
                                                                        {formatLicensePlateForDisplay(v.plate)}
                                                                    </div>
                                                                    {v.parkingSpot && (
                                                                        <div className="text-[9px] font-bold bg-[#1A1D26] text-ds-muted-light dark:text-ds-muted-dark px-1.5 py-0.5 rounded border border-white/10">
                                                                            {t("residents.messages.parkingSpot")} {v.parkingSpot}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <span className="text-ds-muted-light/30 dark:text-ds-muted-dark/30 text-xs pl-5">
                                                            -
                                                        </span>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <span className="text-ds-muted-light/30 dark:text-ds-muted-dark/30">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-6 align-top text-right">
                                        {/* Unit Actions Placeholder - or just Add Resident if empty */}
                                        {unit.status === "empty" && (
                                            <button
                                                onClick={() => onAddResident(blockId, unit.id)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#3B82F6]/10 hover:bg-[#3B82F6]/20 text-[#3B82F6] rounded-lg text-[10px] font-bold transition-colors"
                                            >
                                                <Plus className="w-3 h-3" /> {t("residents.actions.addResident")}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-6 py-12 text-center text-ds-muted-light dark:text-ds-muted-dark"
                                >
                                    <Home className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                    <p>{t("residents.table.noRecords")}</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
