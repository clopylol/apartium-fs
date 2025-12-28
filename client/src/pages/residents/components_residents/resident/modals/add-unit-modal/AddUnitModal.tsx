import { Plus, X, Home } from "lucide-react";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useBuildingData } from "@/hooks/residents/api";
import type { UnitWithResidents } from "@/types/residents.types";

interface AddUnitModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (buildingId: string, number: string, floor: number) => void;
    buildingId: string;
    buildingName?: string;
}

export function AddUnitModal({ isOpen, onClose, onSave, buildingId, buildingName }: AddUnitModalProps) {
    const { t } = useTranslation();
    const [number, setNumber] = useState("");
    const [floor, setFloor] = useState<number | "">("");
    const [validationError, setValidationError] = useState<string>("");

    // Fetch building data to check for existing units
    const { data: buildingData } = useBuildingData(buildingId);

    // Get existing units from building data
    const existingUnits = useMemo((): UnitWithResidents[] => {
        return buildingData?.units || [];
    }, [buildingData]);

    // Check if unit with same number and floor already exists
    const checkDuplicate = useMemo(() => {
        if (!number.trim() || floor === "") return null;
        const floorNumber = typeof floor === "number" ? floor : parseInt(String(floor), 10);
        if (isNaN(floorNumber)) return null;

        const duplicate = existingUnits.find(
            (unit) => unit.number.trim().toLowerCase() === number.trim().toLowerCase() && unit.floor === floorNumber
        );
        return duplicate;
    }, [number, floor, existingUnits]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setValidationError("");

        const trimmedNumber = number.trim();
        const floorNumber = typeof floor === "number" ? floor : parseInt(String(floor), 10);

        if (!trimmedNumber || isNaN(floorNumber) || floorNumber < 0) {
            return;
        }

        // Check for duplicate
        if (checkDuplicate) {
            setValidationError(
                t("residents.modals.addUnit.duplicateError", {
                    floor: floorNumber,
                    number: trimmedNumber,
                }) || `Bu blokta ${floorNumber}. katta ${trimmedNumber} numaralı daire zaten mevcut.`
            );
            return;
        }

        onSave(buildingId, trimmedNumber, floorNumber);
        setNumber("");
        setFloor("");
        setValidationError("");
        onClose();
    };

    const handleFloorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === "") {
            setFloor("");
        } else {
            const numValue = parseInt(value, 10);
            if (!isNaN(numValue) && numValue >= 0) {
                setFloor(numValue);
            }
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-ds-background-light/80 dark:bg-ds-background-dark/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-ds-card-light dark:bg-[#0F111A] border border-ds-border-light dark:border-white/10 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-ds-border-light dark:border-white/5 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-ds-primary-light dark:text-white flex items-center gap-2">
                        <Home className="w-5 h-5 text-[#3B82F6]" />
                        {t("residents.modals.addUnit.title")}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-ds-muted-light dark:text-ds-muted-dark hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {buildingName && (
                        <div className="text-xs text-ds-muted-light dark:text-ds-muted-dark mb-2">
                            {t("residents.modals.addUnit.buildingLabel")}: <span className="text-white font-medium">{buildingName}</span>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-ds-muted-light dark:text-ds-muted-dark uppercase tracking-wider">
                            {t("residents.modals.addUnit.numberLabel")}
                        </label>
                        <input
                            type="text"
                            value={number}
                            onChange={(e) => setNumber(e.target.value)}
                            className="w-full bg-ds-background-light dark:bg-[#1A1D26] border border-ds-border-light dark:border-white/10 rounded-xl px-4 py-3 text-ds-primary-light dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6] transition-all"
                            placeholder={t("residents.modals.addUnit.numberPlaceholder")}
                            autoFocus
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-ds-muted-light dark:text-ds-muted-dark uppercase tracking-wider">
                            {t("residents.modals.addUnit.floorLabel")}
                        </label>
                        <input
                            type="number"
                            value={floor}
                            onChange={handleFloorChange}
                            min="0"
                            className="w-full bg-ds-background-light dark:bg-[#1A1D26] border border-ds-border-light dark:border-white/10 rounded-xl px-4 py-3 text-ds-primary-light dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6] transition-all"
                            placeholder={t("residents.modals.addUnit.floorPlaceholder")}
                        />
                    </div>

                    {validationError && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl">
                            {validationError}
                        </div>
                    )}

                    {checkDuplicate && !validationError && (
                        <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm px-4 py-3 rounded-xl">
                            {t("residents.modals.addUnit.duplicateWarning", {
                                floor: typeof floor === "number" ? floor : parseInt(String(floor), 10),
                                number: number.trim(),
                            }) || `Bu blokta ${typeof floor === "number" ? floor : parseInt(String(floor), 10)}. katta ${number.trim()} numaralı daire zaten mevcut.`}
                        </div>
                    )}

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 bg-ds-muted-light/10 dark:bg-white/5 hover:bg-ds-muted-light/20 dark:hover:bg-white/10 text-ds-primary-light dark:text-white rounded-xl font-medium transition-colors text-sm"
                        >
                            {t("residents.modals.addUnit.cancel")}
                        </button>
                        <button
                            type="submit"
                            disabled={!number.trim() || floor === "" || (typeof floor === "number" && floor < 0) || !!checkDuplicate}
                            className="flex-1 px-4 py-2.5 bg-[#3B82F6] hover:bg-[#2563EB] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all text-sm"
                        >
                            {t("residents.modals.addUnit.save")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

