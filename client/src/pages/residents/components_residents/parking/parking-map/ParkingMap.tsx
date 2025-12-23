import { Car, Plus, Edit2, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { ParkingSpotDefinition } from "@/types/residents.types";

interface ParkingMapProps {
    parkingGridData: Array<
        ParkingSpotDefinition & { occupant?: any; plate?: string; unitNumber?: string }
    >;
    activeParkingFloor: number;
    availableParkingFloors: number[];
    onFloorChange: (floor: number) => void;
    onAddSpot: () => void;
    onEditSpot: (spot: any) => void;
    onDeleteSpot: (spot: any) => void;
    blockName: string;
    onManageFloors: () => void;
    onAssignResident: (spot: ParkingSpotDefinition) => void;
}

export function ParkingMap({
    parkingGridData,
    activeParkingFloor,
    availableParkingFloors,
    onFloorChange,
    onAddSpot,
    onEditSpot,
    onDeleteSpot,
    blockName,
    onManageFloors,
    onAssignResident,
}: ParkingMapProps) {
    const { t } = useTranslation();
    const getFloorLabel = (floor: number) => {
        if (floor === 0) {
            return t("residents.parking.map.floorLabels.ground");
        }
        return t("residents.parking.map.floorLabels.basement", { floor: Math.abs(floor) });
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
                            <div className="border border-blue-500 rounded w-4 h-4 flex items-center justify-center text-[10px] font-bold">P</div>
                        </div>
                        {t("residents.parking.map.title")} ({blockName})
                    </h3>
                    <p className="text-slate-500 text-sm">{t("residents.parking.map.subtitle", { floor: getFloorLabel(activeParkingFloor) })}</p>
                </div>
                <div className="flex gap-3 text-xs font-medium">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-slate-800 border border-slate-700 rounded"></div>
                        <span className="text-slate-400">{t("residents.parking.map.empty")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500/20 border border-blue-500/50 rounded"></div>
                        <span className="text-slate-400">{t("residents.parking.map.occupied")}</span>
                    </div>
                </div>
            </div>

            {/* Floor Switcher */}
            {availableParkingFloors.length > 0 && (
                <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
                    {availableParkingFloors.map((floor) => (
                        <button
                            key={floor}
                            onClick={() => onFloorChange(floor)}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border whitespace-nowrap ${activeParkingFloor === floor
                                ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/20"
                                : "bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200"
                                }`}
                        >
                            {getFloorLabel(floor)}
                        </button>
                    ))}
                    <button
                        onClick={onManageFloors}
                        className="p-1.5 rounded-full bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors ml-1"
                        title={t("residents.parking.map.manageFloors")}
                    >
                        <Edit2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            )}

            {/* Visual Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {parkingGridData.length > 0 ? (
                    parkingGridData.map((spot) => (
                        <div
                            key={spot.id}
                            className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center p-2 relative group transition-all ${spot.occupant
                                ? "bg-blue-900/10 border-blue-500/40 hover:bg-blue-900/20 hover:border-blue-500"
                                : "bg-slate-950/50 border-slate-800 border-dashed hover:border-slate-600"
                                }`}
                        >
                            {/* Edit/Delete Controls for Spot */}
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex gap-1 z-10 transition-opacity">
                                <button
                                    onClick={() => onEditSpot(spot)}
                                    className="p-1 bg-slate-800 hover:bg-blue-600 text-white rounded"
                                >
                                    <Edit2 className="w-3 h-3" />
                                </button>
                                <button
                                    onClick={() => onDeleteSpot(spot)}
                                    className="p-1 bg-slate-800 hover:bg-red-600 text-white rounded"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>

                            <span className="absolute top-2 left-2 text-[10px] font-bold text-slate-500">{spot.name}</span>

                            {spot.occupant ? (
                                <>
                                    <Car className="w-8 h-8 text-blue-400 mb-2" />
                                    <div className="text-center w-full">
                                        <div className="font-bold text-white text-sm bg-slate-900 rounded px-1.5 py-0.5 border border-slate-700 truncate">
                                            {spot.occupant.plate}
                                        </div>
                                        <div className="text-[10px] text-slate-400 mt-1 truncate">{t("residents.parking.map.unit")} {spot.occupant.unitNumber}</div>
                                        <div className="text-[10px] text-slate-500 truncate">{spot.occupant.name}</div>
                                    </div>
                                </>
                            ) : (
                                <button
                                    onClick={() => onAssignResident(spot)}
                                    className="flex items-center gap-1 text-slate-500 hover:text-white transition-colors"
                                >
                                    <Plus className="w-4 h-4" /> {t("residents.parking.map.assign")}
                                </button>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-12 text-slate-500 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/20">
                        <div className="p-1.5 rounded-lg bg-slate-800/50 mb-2">
                            <div className="border border-slate-600 rounded w-10 h-10 flex items-center justify-center text-sm font-bold opacity-20">P</div>
                        </div>
                        <p className="text-sm">{t("residents.parking.map.noSpots")}</p>
                    </div>
                )}

                {/* Add New Spot Button */}
                <button
                    onClick={onAddSpot}
                    className="aspect-square rounded-xl border-2 border-dashed border-slate-800 flex flex-col items-center justify-center p-2 hover:bg-slate-900/50 hover:border-slate-600 transition-all text-slate-600 hover:text-white group"
                >
                    <Plus className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold">{t("residents.parking.map.addSpot")}</span>
                </button>
            </div>
        </div>
    );
}
