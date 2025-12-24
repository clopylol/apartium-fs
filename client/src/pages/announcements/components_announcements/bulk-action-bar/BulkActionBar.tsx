import type { FC } from "react";
import { Trash2 } from "lucide-react";

interface BulkActionBarProps {
    selectedCount: number;
    onBulkDelete: () => void;
    onCancel: () => void;
}

export const BulkActionBar: FC<BulkActionBarProps> = ({ 
    selectedCount, 
    onBulkDelete, 
    onCancel 
}) => {
    if (selectedCount === 0) return null;

    return (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-ds-muted-dark text-white px-6 py-3 rounded-full shadow-2xl border border-ds-border-dark flex items-center gap-6 animate-in slide-in-from-bottom-5 z-40">
            <div className="flex items-center gap-3 border-r border-ds-border-dark pr-6">
                <div className="bg-ds-in-indigo-light text-xs font-bold rounded px-2 py-0.5">
                    {selectedCount}
                </div>
                <span className="text-sm font-medium">
                    Duyuru Seçildi
                </span>
            </div>
            <div className="flex items-center gap-3">
                <button 
                    onClick={onBulkDelete} 
                    className="flex items-center gap-2 text-sm font-bold text-ds-in-destructive-400 hover:text-ds-in-destructive-300 transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                    Toplu Sil
                </button>
                <button 
                    onClick={onCancel} 
                    className="text-sm text-ds-muted-light hover:text-ds-secondary-light ml-2"
                >
                    İptal
                </button>
            </div>
        </div>
    );
};

