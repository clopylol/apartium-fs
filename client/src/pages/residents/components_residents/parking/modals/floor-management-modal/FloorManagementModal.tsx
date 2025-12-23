import { X, Plus, Trash2, Layers } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ConfirmationModal } from "@/components/shared/modals";

interface FloorManagementModalProps {
    isOpen: boolean;
    onClose: () => void;
    floors: number[];
    onAddFloor: (floor: number) => void;
    onDeleteFloor: (floor: number) => void;
}

export function FloorManagementModal({ isOpen, onClose, floors, onAddFloor, onDeleteFloor }: FloorManagementModalProps) {
    const { t } = useTranslation();
    const [newFloor, setNewFloor] = useState<string>("");
    const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; floor: number | null }>({ isOpen: false, floor: null });

    if (!isOpen) return null;

    const getFloorLabel = (floor: number) => {
        if (floor === 0) {
            return t("residents.parking.floorManagement.floorLabels.ground");
        }
        return t("residents.parking.floorManagement.floorLabels.basement", { floor: Math.abs(floor) });
    };

    const handleAdd = () => {
        const floorNum = parseInt(newFloor);
        if (!isNaN(floorNum) && !floors.includes(floorNum)) {
            onAddFloor(floorNum);
            setNewFloor("");
        }
    };

    const handleConfirmDelete = () => {
        if (deleteConfirm.floor !== null) {
            onDeleteFloor(deleteConfirm.floor);
        }
        setDeleteConfirm({ isOpen: false, floor: null });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative">
                <div className="p-6 border-b border-slate-800 bg-slate-900 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Layers className="w-5 h-5 text-blue-500" />
                        {t("residents.parking.floorManagement.title")}
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-1 bg-slate-800 rounded-lg">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Add New Floor */}
                    <div className="flex gap-3">
                        <input
                            type="number"
                            value={newFloor}
                            onChange={(e) => setNewFloor(e.target.value)}
                            placeholder={t("residents.parking.floorManagement.floorNumberPlaceholder")}
                            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <button
                            onClick={handleAdd}
                            disabled={!newFloor}
                            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-colors flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" /> {t("residents.parking.floorManagement.addFloor")}
                        </button>
                    </div>

                    {/* Floor List */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-bold text-slate-500 uppercase">{t("residents.parking.floorManagement.currentFloors")}</h3>
                        <div className="space-y-2">
                            {floors.sort((a, b) => b - a).map((floor) => (
                                <div key={floor} className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 font-bold text-xs">
                                            {floor}
                                        </div>
                                        <span className="text-slate-200 font-medium">{getFloorLabel(floor)}</span>
                                    </div>
                                    <button
                                        onClick={() => setDeleteConfirm({ isOpen: true, floor })}
                                        className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                        title={t("residents.parking.floorManagement.deleteFloor")}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={deleteConfirm.isOpen}
                onClose={() => setDeleteConfirm({ isOpen: false, floor: null })}
                onConfirm={handleConfirmDelete}
                title={t("residents.parking.floorManagement.deleteConfirm.title")}
                message={t("residents.parking.floorManagement.deleteConfirm.message")}
                variant="danger"
                confirmText={t("common.buttons.delete")}
                cancelText={t("common.buttons.cancel")}
            />
        </div>
    );
}
