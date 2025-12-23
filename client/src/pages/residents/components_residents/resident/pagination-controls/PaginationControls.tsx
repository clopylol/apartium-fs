import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

export function PaginationControls({
    totalItems,
    itemsPerPage,
    currentPage,
    onPageChange,
}: PaginationProps) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    if (totalPages <= 1) return null;

    return (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-ds-border-light dark:border-ds-border-dark animate-in fade-in">
            <div className="text-sm text-ds-muted-light dark:text-ds-muted-dark font-medium">
                Toplam{" "}
                <span className="text-ds-secondary-light dark:text-ds-secondary-dark font-bold">
                    {totalItems}
                </span>{" "}
                kayıttan{" "}
                <span className="text-ds-primary-light dark:text-ds-primary-dark font-bold">
                    {startItem}-{endItem}
                </span>{" "}
                arası gösteriliyor
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-ds-border-light dark:border-ds-border-dark bg-ds-card-light dark:bg-ds-card-dark text-ds-muted-light dark:text-ds-muted-dark hover:text-ds-primary-light dark:hover:text-ds-primary-dark hover:border-ds-border-light/50 dark:hover:border-ds-border-dark/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                        return (
                            <button
                                key={page}
                                onClick={() => onPageChange(page)}
                                className={`w-8 h-8 rounded-lg text-sm font-bold transition-all ${currentPage === page
                                        ? "bg-ds-in-teal-light dark:bg-ds-in-teal-dark text-ds-primary-light dark:text-ds-primary-dark shadow-lg"
                                        : "bg-ds-card-light dark:bg-ds-card-dark border border-ds-border-light dark:border-ds-border-dark text-ds-muted-light dark:text-ds-muted-dark hover:border-ds-border-light/50 dark:hover:border-ds-border-dark/50 hover:text-ds-primary-light dark:hover:text-ds-primary-dark"
                                    }`}
                            >
                                {page}
                            </button>
                        );
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                        return (
                            <span key={page} className="text-ds-muted-light/50 dark:text-ds-muted-dark/50">
                                ...
                            </span>
                        );
                    }
                    return null;
                })}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-ds-border-light dark:border-ds-border-dark bg-ds-card-light dark:bg-ds-card-dark text-ds-muted-light dark:text-ds-muted-dark hover:text-ds-primary-light dark:hover:text-ds-primary-dark hover:border-ds-border-light/50 dark:hover:border-ds-border-dark/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
