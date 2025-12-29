import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { FilterChip } from '@/components/shared/inputs/filter-chip';

interface PaymentFiltersProps {
    activeFilter: 'all' | 'paid' | 'unpaid';
    onFilterChange: (filter: 'all' | 'paid' | 'unpaid') => void;
    paidCount: number;
    unpaidCount: number;
}

export const PaymentFilters: FC<PaymentFiltersProps> = ({ activeFilter, onFilterChange, paidCount, unpaidCount }) => {
    const { t } = useTranslation();

    return (
        <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-3 overflow-x-auto pb-2 custom-scrollbar">
                <FilterChip
                    label={t('payments.filters.all')}
                    isActive={activeFilter === 'all'}
                    onClick={() => onFilterChange('all')}
                    className="px-4 py-2.5 text-sm rounded-xl"
                />
                <FilterChip
                    label={t('payments.filters.paid')}
                    isActive={activeFilter === 'paid'}
                    onClick={() => onFilterChange('paid')}
                    variant="success"
                    icon={<CheckCircle className="w-4 h-4" />}
                    className="px-4 py-2.5 text-sm rounded-xl"
                />
                <FilterChip
                    label={t('payments.filters.unpaid')}
                    isActive={activeFilter === 'unpaid'}
                    onClick={() => onFilterChange('unpaid')}
                    variant="destructive"
                    icon={<AlertCircle className="w-4 h-4" />}
                    className="px-4 py-2.5 text-sm rounded-xl"
                />
            </div>

            {/* Stats Display */}
            <div className="flex items-center gap-4 text-xs font-medium">
                <div className="flex items-center gap-2 text-ds-muted-light dark:text-ds-muted-dark">
                    <div className="w-2.5 h-2.5 rounded-full bg-ds-success"></div>
                    {t('payments.stats.paid')}: <span className="text-white font-bold text-sm">{paidCount}</span>
                </div>
                <div className="flex items-center gap-2 text-ds-muted-light dark:text-ds-muted-dark">
                    <div className="w-2.5 h-2.5 rounded-full bg-ds-destructive"></div>
                    {t('payments.stats.unpaid')}: <span className="text-white font-bold text-sm">{unpaidCount}</span>
                </div>
            </div>
        </div>
    );
};

