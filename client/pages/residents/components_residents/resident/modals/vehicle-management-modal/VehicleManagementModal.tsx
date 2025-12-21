import { X, Car, Trash2, PlusCircle } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { Resident, Building, ResidentVehicle } from "@/types/residents.types";
import { ConfirmationModal } from "@/components/shared/modals";

interface VehicleManagementModalProps {
    isOpen: boolean;
    onClose: () => void;
    resident: Resident;
    blockId: string;
    unitId: string;
    buildings: Building[];
    onUpdateResident: (residentId: string, vehicles: ResidentVehicle[]) => void;
}

export function VehicleManagementModal({
    isOpen,
    onClose,
    resident,
    blockId,
    buildings,
    onUpdateResident,
}: VehicleManagementModalProps) {
    const { t } = useTranslation();
    const [vehicleForm, setVehicleForm] = useState({
        plate: "",
        model: "",
        parkingSpot: "",
    });

    const [deleteConfirm, setDeleteConfirm] = useState<{
        isOpen: boolean;
        vehicleId: string;
        plate: string;
    }>({
        isOpen: false,
        vehicleId: "",
        plate: "",
    });

    if (!isOpen) return null;

    const currentBlock = buildings.find((b) => b.id === blockId);

    const handleAddVehicle = () => {
        if (!vehicleForm.plate.trim()) return;

        const newVehicle: ResidentVehicle = {
            id: `vehicle-${Date.now()}`,
            plate: vehicleForm.plate,
            model: vehicleForm.model || "",
            parkingSpot: vehicleForm.parkingSpot || "",
        };

        const updatedVehicles = [...resident.vehicles, newVehicle];
        onUpdateResident(resident.id, updatedVehicles);

        // Reset form
        setVehicleForm({ plate: "", model: "", parkingSpot: "" });
    };

    const handleOpenDeleteConfirm = (vehicleId: string, plate: string) => {
        setDeleteConfirm({ isOpen: true, vehicleId, plate });
    };

    const handleConfirmDelete = () => {
        const updatedVehicles = resident.vehicles.filter((v) => v.id !== deleteConfirm.vehicleId);
        onUpdateResident(resident.id, updatedVehicles);
        setDeleteConfirm({ isOpen: false, vehicleId: "", plate: "" });
    };

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden relative z-50">
                    <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900">
                        <div>
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <Car className="w-5 h-5 text-blue-500" />
                                {t("residents.modals.vehicleManagement.title")}
                            </h2>
                            <p className="text-xs text-slate-500 mt-1">{t("residents.modals.vehicleManagement.residentLabel")} {resident.name}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* List of existing vehicles */}
                        <div>
                            <h3 className="text-sm font-bold text-white mb-3">{t("residents.modals.vehicleManagement.registeredVehicles")}</h3>
                            {resident.vehicles.length > 0 ? (
                                <div className="space-y-3">
                                    {resident.vehicles.map((vehicle) => (
                                        <div
                                            key={vehicle.id}
                                            className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl group"
                                        >
                                            <div>
                                                <div className="font-mono text-white font-bold tracking-wide">
                                                    {vehicle.plate}
                                                </div>
                                                <div className="text-xs text-slate-500">{vehicle.model}</div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {vehicle.parkingSpot && (
                                                    <span className="text-xs bg-blue-900/20 text-blue-400 px-2 py-1 rounded border border-blue-900/30 font-medium">
                                                        {vehicle.parkingSpot}
                                                    </span>
                                                )}
                                                <button
                                                    onClick={() =>
                                                        handleOpenDeleteConfirm(vehicle.id, vehicle.plate)
                                                    }
                                                    className="p-2 text-slate-600 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                                                    title={t("residents.modals.vehicleManagement.actions.deleteVehicle")}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-4 border-2 border-dashed border-slate-800 rounded-xl text-center text-slate-500 text-sm">
                                    {t("residents.modals.vehicleManagement.noVehicles")}
                                </div>
                            )}
                        </div>

                        {/* Add new vehicle form */}
                        <div className="pt-6 border-t border-slate-800">
                            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                                <PlusCircle className="w-4 h-4" /> {t("residents.modals.vehicleManagement.addNewVehicle")}
                            </h3>
                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase">
                                        {t("residents.modals.vehicleManagement.labels.plate")}
                                    </label>
                                    <input
                                        type="text"
                                        value={vehicleForm.plate}
                                        onChange={(e) =>
                                            setVehicleForm({
                                                ...vehicleForm,
                                                plate: e.target.value.toUpperCase(),
                                            })
                                        }
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-slate-600 font-mono"
                                        placeholder={t("residents.modals.vehicleManagement.placeholders.plate")}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase">
                                        {t("residents.modals.vehicleManagement.labels.model")}
                                    </label>
                                    <input
                                        type="text"
                                        value={vehicleForm.model}
                                        onChange={(e) =>
                                            setVehicleForm({ ...vehicleForm, model: e.target.value })
                                        }
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-slate-600"
                                        placeholder={t("residents.modals.vehicleManagement.placeholders.model")}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1 mb-4">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">
                                    {t("residents.modals.vehicleManagement.labels.parkingSpot")}
                                </label>
                                <select
                                    value={vehicleForm.parkingSpot}
                                    onChange={(e) =>
                                        setVehicleForm({ ...vehicleForm, parkingSpot: e.target.value })
                                    }
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer"
                                >
                                    <option value="">{t("residents.modals.vehicleManagement.placeholders.parkingSpot")}</option>
                                    {currentBlock?.parkingSpots.map((spot) => {
                                        const isTaken = buildings
                                            .flatMap((b) =>
                                                b.units.flatMap((u) =>
                                                    u.residents.flatMap((r) => r.vehicles)
                                                )
                                            )
                                            .some((v) => v.parkingSpot === spot.name);

                                        return (
                                            <option
                                                key={spot.id}
                                                value={spot.name}
                                                disabled={isTaken}
                                                className={isTaken ? "text-red-500" : ""}
                                            >
                                                {spot.name} {isTaken ? `(${t("residents.modals.vehicleManagement.actions.taken")})` : ""}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                            <button
                                onClick={handleAddVehicle}
                                disabled={!vehicleForm.plate}
                                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-lg shadow-blue-900/20 transition-colors text-sm"
                            >
                                {t("residents.modals.vehicleManagement.actions.saveVehicle")}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={deleteConfirm.isOpen}
                onClose={() => setDeleteConfirm({ isOpen: false, vehicleId: "", plate: "" })}
                onConfirm={handleConfirmDelete}
                title={t("residents.modals.vehicleManagement.deleteConfirm.title")}
                message={
                    <p>
                        {t("residents.modals.vehicleManagement.deleteConfirm.message", {
                            plate: deleteConfirm.plate,
                        })}
                    </p>
                }
                variant="danger"
            />
        </>
    );
}
