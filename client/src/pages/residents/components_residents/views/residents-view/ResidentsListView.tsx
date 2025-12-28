import type { Building, Resident, Unit } from "@/types/residents.types";
import { Car, Phone, Mail, Key, Edit2, Trash2, Plus, Home } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { formatLicensePlateForDisplay } from "@/utils/validation";
import { ResidentDetailModal } from "../../resident/modals/resident-detail-modal";

export interface ResidentsListViewProps {
    paginatedUnits: Building["units"];
    activeBlockId: string;
    activeBlock?: Building | null;
    onAddResident: (blockId?: string, unitId?: string) => void;
    onEditResident: (resident: Resident, blockId: string, unitId: string) => void;
    onDeleteResident: (residentId: string, residentName: string, blockId: string, unitId: string) => void;
    onManageVehicles: (resident: Resident, blockId: string, unitId: string) => void;
}

export function ResidentsListView({
    paginatedUnits,
    activeBlockId,
    activeBlock,
    onAddResident,
    onEditResident,
    onDeleteResident,
    onManageVehicles,
}: ResidentsListViewProps) {
    const { t } = useTranslation();
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

    const handleShowDetails = (unit: Unit) => {
        if (unit.residents.length > 0) {
            setSelectedUnit(unit);
            setShowDetailModal(true);
        }
    };

    const handleCloseDetailModal = () => {
        setShowDetailModal(false);
        setSelectedUnit(null);
    };
    
    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl animate-in fade-in duration-300">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-slate-800 bg-slate-950/50 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                            <th className="px-6 py-4 w-24">{t("residents.table.columnsUppercase.unit")}</th>
                            <th className="px-6 py-4 w-24">{t("residents.table.columnsUppercase.status")}</th>
                            <th className="px-6 py-4">{t("residents.table.columnsUppercase.residents")}</th>
                            <th className="px-6 py-4">{t("residents.table.columnsUppercase.contact")}</th>
                            <th className="px-6 py-4">{t("residents.table.columnsUppercase.vehicles")}</th>
                            <th className="px-6 py-4 text-right">{t("residents.table.columnsUppercase.actions")}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {paginatedUnits.length > 0 ? (
                            paginatedUnits.map((unit) => (
                                <tr key={unit.id} className="hover:bg-slate-800/30 transition-colors group">
                                    {/* Unit Number */}
                                    <td className="px-6 py-4 align-top">
                                        <div className="flex flex-col">
                                            <span className="text-lg font-bold text-white">No: {unit.number}</span>
                                            <span className="text-xs text-slate-500">{unit.floor}. {t("residents.messages.floor")}</span>
                                        </div>
                                    </td>

                                    {/* Status */}
                                    <td className="px-6 py-4 align-top">
                                        <div
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold uppercase tracking-wider ${unit.status === "occupied"
                                                    ? "bg-emerald-500/10 text-emerald-500"
                                                    : "bg-slate-800 text-slate-500"
                                                }`}
                                        >
                                            {unit.status === "occupied" ? t("residents.status.occupied") : t("residents.status.empty")}
                                        </div>
                                    </td>

                                    {/* Residents */}
                                    <td className="px-6 py-4 align-top">
                                        {unit.residents.length > 0 ? (
                                            <div className="space-y-3">
                                                {unit.residents.map((r) => (
                                                    <div
                                                        key={r.id}
                                                        onClick={() => handleShowDetails(unit)}
                                                        className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                                                    >
                                                        <img
                                                            src={r.avatar}
                                                            className="w-8 h-8 rounded-full border border-slate-700 object-cover"
                                                            alt=""
                                                        />
                                                        <div>
                                                            <div className="text-sm font-medium text-slate-200">{r.name}</div>
                                                            <div
                                                                className={`text-[10px] uppercase font-bold ${r.type === "owner" ? "text-blue-400" : "text-purple-400"
                                                                    }`}
                                                            >
                                                                {r.type === "owner" ? t("residents.status.owner") : t("residents.status.tenant")}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-sm text-slate-600 flex items-center gap-2">
                                                <Key className="w-4 h-4" /> {t("residents.actions.noResidents")}
                                            </span>
                                        )}
                                    </td>

                                    {/* Contact Info */}
                                    <td className="px-6 py-4 align-top text-sm">
                                        {unit.residents.length > 0 ? (
                                            unit.residents.map((r) => (
                                                <div key={r.id} className="mb-3 last:mb-0">
                                                    <div className="flex items-center gap-2 text-slate-300">
                                                        <Phone className="w-3 h-3 text-slate-500" /> {r.phone}
                                                    </div>
                                                    {r.email && (
                                                        <div className="flex items-center gap-2 text-slate-400 text-xs mt-0.5">
                                                            <Mail className="w-3 h-3 text-slate-600" /> {r.email}
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <span className="text-slate-600">-</span>
                                        )}
                                    </td>

                                    {/* Vehicles */}
                                    <td className="px-6 py-4 align-top text-sm">
                                        {unit.residents.length > 0 ? (
                                            unit.residents.map((r) => (
                                                <div key={r.id} className="mb-3 last:mb-0 min-h-[20px]">
                                                    {r.vehicles.length > 0 ? (
                                                        <div className="space-y-1">
                                                            {r.vehicles.map((v) => (
                                                                <div key={v.id}>
                                                                    <div className="flex items-center gap-2 text-slate-300 font-mono text-xs">
                                                                        <Car className="w-3 h-3 text-slate-500" /> {formatLicensePlateForDisplay(v.plate)}
                                                                    </div>
                                                                    {v.parkingSpot && (
                                                                        <div className="text-[10px] bg-slate-800 text-blue-300 px-1.5 py-0.5 rounded w-fit mt-0.5 border border-slate-700 ml-5">
                                                                            {t("residents.messages.parkingSpot")} {v.parkingSpot}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <span className="text-slate-700 text-xs">-</span>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <span className="text-slate-600">-</span>
                                        )}
                                    </td>

                                    {/* Actions */}
                                    <td className="px-6 py-4 align-top text-right">
                                        <div className="flex flex-col gap-2 items-end">
                                            {unit.residents.map((r) => (
                                                <div key={r.id} className="flex gap-1">
                                                    <button
                                                        onClick={() => onManageVehicles(r, activeBlockId, unit.id)}
                                                        className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-blue-400 rounded transition-colors"
                                                        title={t("residents.actions.manageVehicles")}
                                                    >
                                                        <Car className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => onEditResident(r, activeBlockId, unit.id)}
                                                        className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded transition-colors"
                                                        title={t("residents.actions.edit")}
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            onDeleteResident(r.id, r.name, activeBlockId, unit.id);
                                                        }}
                                                        className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-red-400 rounded transition-colors"
                                                        title={t("residents.actions.delete")}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                onClick={() => onAddResident(activeBlockId, unit.id)}
                                                className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-blue-400 rounded transition-colors"
                                                title={t("residents.actions.addResident")}
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                    <Home className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                    <p>{t("residents.table.noRecords")}</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Resident Detail Modal */}
            {showDetailModal && selectedUnit && selectedUnit.residents.length > 0 && (
                <ResidentDetailModal
                    isOpen={showDetailModal}
                    onClose={handleCloseDetailModal}
                    residents={selectedUnit.residents}
                    unit={selectedUnit}
                    block={activeBlock || null}
                    blockName={activeBlock?.name || ""}
                    onEdit={(resident) => {
                        handleCloseDetailModal();
                        onEditResident(resident, activeBlockId, selectedUnit.id);
                    }}
                />
            )}
        </div>
    );
}
