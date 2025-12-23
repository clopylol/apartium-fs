import type { FC } from "react";
import { Filter } from "lucide-react";

interface NoResultsEmptyStateProps {
    onClearFilters: () => void;
}

export const NoResultsEmptyState: FC<NoResultsEmptyStateProps> = ({ onClearFilters }) => {
    return (
        <div className="flex flex-col items-center animate-in fade-in duration-300">
            <Filter className="w-12 h-12 mx-auto mb-3 text-ds-muted-light dark:text-ds-muted-dark opacity-20" />
            <p className="text-lg font-medium text-ds-muted-light dark:text-ds-muted-dark mb-4">
                Aradığınız kriterlere uygun duyuru bulunamadı.
            </p>
            <button
                onClick={onClearFilters}
                className="text-ds-in-sky-400 hover:text-ds-in-sky-300 underline font-medium transition-colors"
            >
                Filtreleri Temizle
            </button>
        </div>
    );
};
