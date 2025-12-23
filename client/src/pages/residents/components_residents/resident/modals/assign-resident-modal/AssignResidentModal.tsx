import { X } from "lucide-react";
import { useState } from "react";
import type { Resident } from "@/types/residents.types";

interface AssignResidentModalProps {
    isOpen: boolean;
    onClose: () => void;
    spotId: string | null;
    residents: Resident[];
    onAssign: (spotId: string, residentId: string) => void;
}

export function AssignResidentModal({ isOpen, onClose, spotId, residents, onAssign }: AssignResidentModalProps) {
    const [selectedResident, setSelectedResident] = useState<string>("");

    if (!isOpen || !spotId) return null;

    const handleConfirm = () => {
        if (selectedResident) {
            onAssign(spotId, selectedResident);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative">
                <div className="p-6 border-b border-slate-800 bg-slate-900 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-white">Park Yeri Atama</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-1 bg-slate-800 rounded-lg">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <p className="text-slate-200">Park yeri <span className="font-medium">{spotId}</span> için bir sakin seçin:</p>
                    <select
                        value={selectedResident}
                        onChange={(e) => setSelectedResident(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                        <option value="">-- Sakin Seçin --</option>
                        {residents.map((res) => (
                            <option key={res.id} value={res.id}>
                                {res.name}
                            </option>
                        ))}
                    </select>
                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            onClick={onClose}
                            className="px-4 py-2.5 bg-slate-600 hover:bg-slate-500 text-white rounded-xl font-bold transition-colors"
                        >
                            İptal
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={!selectedResident}
                            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-colors"
                        >
                            Atama Yap
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
