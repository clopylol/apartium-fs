import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button, IconButton } from "@/components/shared/button";

export interface PaginationProps {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    onPageChange: (page: number) => void;
    className?: string;
    showInfo?: boolean;
    infoTextKey?: string;
}

export const Pagination: FC<PaginationProps> = ({
    totalItems,
    itemsPerPage,
    currentPage,
    onPageChange,
    className = "",
    showInfo = true,
    infoTextKey,
}) => {
    const { t } = useTranslation();
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    if (totalPages <= 1) return null;

    const getInfoText = () => {
        if (infoTextKey) {
            // Try to use custom translation key
            try {
                const showing = t(`${infoTextKey}.showing`) || t(`${infoTextKey}.total`) || t("common.pagination.showing");
                const of = t(`${infoTextKey}.of`);
                const records = t(`${infoTextKey}.records`) || t(`${infoTextKey}.showing`) || t("common.pagination.records");
                
                return (
                    <>
                        {showing}{" "}
                        <span className="text-ds-primary-light dark:text-ds-primary-dark font-bold">
                            {totalItems}
                        </span>{" "}
                        {of}{" "}
                        <span className="text-ds-primary-light dark:text-ds-primary-dark font-bold">
                            {startItem}-{endItem}
                        </span>{" "}
                        {records}
                    </>
                );
            } catch {
                // Fallback to common
            }
        }
        
        // Default: use common.pagination
        return (
            <>
                {t("common.pagination.showing")}{" "}
                <span className="text-ds-primary-light dark:text-ds-primary-dark font-bold">
                    {totalItems}
                </span>{" "}
                {t("common.pagination.of")}{" "}
                <span className="text-ds-primary-light dark:text-ds-primary-dark font-bold">
                    {startItem}-{endItem}
                </span>{" "}
                {t("common.pagination.records")}
            </>
        );
    };

    return (
        <div
            className={`flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-ds-border-light dark:border-ds-border-dark animate-in fade-in ${className}`}
        >
            {showInfo && (
                <div className="text-sm text-ds-muted-light dark:text-ds-muted-dark font-medium">
                    {getInfoText()}
                </div>
            )}

            <div className="flex items-center gap-2">
                <IconButton
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    icon={<ChevronLeft className="w-4 h-4" />}
                    ariaLabel={t("common.pagination.previous") || "Previous page"}
                    className="border border-ds-border-light dark:border-ds-border-dark bg-ds-card-light dark:bg-ds-card-dark"
                />

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first, last, and near current pages logic
                    if (totalPages > 7) {
                        if (
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                            return (
                                <Button
                                    key={page}
                                    onClick={() => onPageChange(page)}
                                    size="sm"
                                    variant={currentPage === page ? "primary" : "secondary"}
                                    className={
                                        currentPage === page
                                            ? "bg-ds-in-sky-600 shadow-lg shadow-ds-in-sky-900/20 w-8 h-8 p-0"
                                            : "w-8 h-8 p-0"
                                    }
                                >
                                    {page}
                                </Button>
                            );
                        } else if (page === currentPage - 2 || page === currentPage + 2) {
                            return (
                                <span
                                    key={page}
                                    className="text-ds-muted-light dark:text-ds-muted-dark"
                                >
                                    ...
                                </span>
                            );
                        }
                        return null;
                    }

                    return (
                        <Button
                            key={page}
                            onClick={() => onPageChange(page)}
                            size="sm"
                            variant={currentPage === page ? "primary" : "secondary"}
                            className={
                                currentPage === page
                                    ? "bg-ds-in-sky-600 shadow-lg shadow-ds-in-sky-900/20 w-8 h-8 p-0"
                                    : "w-8 h-8 p-0"
                            }
                        >
                            {page}
                        </Button>
                    );
                })}

                <IconButton
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    icon={<ChevronRight className="w-4 h-4" />}
                    ariaLabel={t("common.pagination.next") || "Next page"}
                    className="border border-ds-border-light dark:border-ds-border-dark bg-ds-card-light dark:bg-ds-card-dark"
                />
            </div>
        </div>
    );
};
