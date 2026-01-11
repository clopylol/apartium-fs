import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Calendar,
    Filter,
    X,
    CheckCircle,
    Clock,
    XCircle,
    LayoutGrid
} from 'lucide-react';
import { Button } from '@/components/shared/button';
import { ButtonGroup } from '@/components/shared/button';

export interface BookingsFiltersProps {
    status: string;
    onStatusChange: (status: string) => void;
    dateFrom: string;
    onDateFromChange: (date: string) => void;
    dateTo: string;
    onDateToChange: (date: string) => void;
    onClearFilters: () => void;
    hasActiveFilters: boolean;
}

export const BookingsFilters: FC<BookingsFiltersProps> = ({
    status,
    onStatusChange,
    dateFrom,
    onDateFromChange,
    dateTo,
    onDateToChange,
    onClearFilters,
    hasActiveFilters,
}) => {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 p-4 mb-6 bg-ds-card-light dark:bg-ds-card-dark rounded-xl border border-ds-border-light dark:border-ds-border-dark shadow-sm">
            <div className="flex items-center gap-3 text-ds-muted-light dark:text-ds-muted-dark font-medium text-sm">
                <Filter className="w-4 h-4" />
                {t('common.filters', 'Filtreler')}
            </div>

            <div className="h-8 w-px bg-ds-border-light dark:bg-ds-border-dark hidden lg:block"></div>

            {/* Date Range */}
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-2 bg-ds-background-light dark:bg-ds-background-dark rounded-lg border border-ds-border-light dark:border-ds-border-dark shadow-sm">
                    <Calendar className="w-4 h-4 text-ds-muted-light dark:text-ds-muted-dark" />
                    <input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => onDateFromChange(e.target.value)}
                        className="bg-transparent text-sm focus:outline-none text-ds-primary-light dark:text-ds-primary-dark w-32 [color-scheme:dark]"
                        placeholder={t('common.startDate', 'Başlangıç')}
                    />
                </div>
                <span className="text-ds-muted-light dark:text-ds-muted-dark">-</span>
                <div className="flex items-center gap-2 px-3 py-2 bg-ds-background-light dark:bg-ds-background-dark rounded-lg border border-ds-border-light dark:border-ds-border-dark shadow-sm">
                    <input
                        type="date"
                        value={dateTo}
                        onChange={(e) => onDateToChange(e.target.value)}
                        className="bg-transparent text-sm focus:outline-none text-ds-primary-light dark:text-ds-primary-dark w-32 [color-scheme:dark]"
                        placeholder={t('common.endDate', 'Bitiş')}
                    />
                </div>
            </div>

            <div className="h-8 w-px bg-ds-border-light dark:bg-ds-border-dark hidden lg:block"></div>

            {/* Status Filter */}
            <div className="flex-1 overflow-x-auto">
                <ButtonGroup
                    items={[
                        { id: 'all', label: t('common.all', 'Tümü'), icon: <LayoutGrid className="w-4 h-4" /> },
                        { id: 'confirmed', label: t('bookings.status.confirmed', 'Onaylandı'), icon: <CheckCircle className="w-4 h-4" /> },
                        { id: 'pending', label: t('bookings.status.pending', 'Bekliyor'), icon: <Clock className="w-4 h-4" /> },
                        { id: 'cancelled', label: t('bookings.status.cancelled', 'İptal'), icon: <XCircle className="w-4 h-4" /> },
                    ]}
                    activeId={status}
                    onChange={onStatusChange}
                />
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClearFilters}
                    leftIcon={<X className="w-4 h-4" />}
                    className="text-ds-destructive-light dark:text-ds-destructive-dark hover:bg-ds-destructive-light/10 dark:hover:bg-ds-destructive-dark/10 shrink-0"
                >
                    {t('common.clearFilters', 'Temizle')}
                </Button>
            )}
        </div>
    );
};
