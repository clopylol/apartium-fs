import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

export const PaginationControls: FC<PaginationProps> = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
    const { t } = useTranslation();
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    if (totalPages <= 1) return null;

    return (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-ds-border-dark animate-in fade-in">
            <div className="text-sm text-ds-muted-light font-medium">
                {t('payments.pagination.total')} <span className="text-ds-secondary-dark font-bold">{totalItems}</span> {t('payments.pagination.of')} <span className="text-ds-secondary-light font-bold">{startItem}-{endItem}</span> {t('payments.pagination.showing')}
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-ds-border-dark bg-ds-card-dark text-ds-muted-light hover:text-ds-secondary-light hover:border-ds-muted-light disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    if (totalPages > 7) {
                        if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                            return (
                                <button
                                    key={page}
                                    onClick={() => onPageChange(page)}
                                    className={`w-8 h-8 rounded-lg text-sm font-bold transition-all ${currentPage === page
                                            ? 'bg-ds-in-indigo-light text-ds-secondary-light shadow-lg shadow-ds-in-indigo-dark/20'
                                            : 'bg-ds-card-dark border border-ds-border-dark text-ds-muted-light hover:border-ds-muted-light hover:text-ds-secondary-light'
                                        }`}
                                >
                                    {page}
                                </button>
                            );
                        } else if (page === currentPage - 2 || page === currentPage + 2) {
                            return <span key={page} className="text-ds-muted-light">...</span>;
                        }
                        return null;
                    }

                    return (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`w-8 h-8 rounded-lg text-sm font-bold transition-all ${currentPage === page
                                    ? 'bg-ds-in-indigo-light text-ds-secondary-light shadow-lg shadow-ds-in-indigo-dark/20'
                                    : 'bg-ds-card-dark border border-ds-border-dark text-ds-muted-light hover:border-ds-muted-light hover:text-ds-secondary-light'
                                }`}
                        >
                            {page}
                        </button>
                    );
                })}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-ds-border-dark bg-ds-card-dark text-ds-muted-light hover:text-ds-secondary-light hover:border-ds-muted-light disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};
