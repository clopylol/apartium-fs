import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { FilterChip } from '@/components/shared/inputs/filter-chip';

interface ExpenseFiltersProps {
    activeFilter: 'all' | 'paid' | 'pending';
    onFilterChange: (filter: 'all' | 'paid' | 'pending') => void;
    paidCount: number;
    pendingCount: number;
}

export const ExpenseFilters: FC<ExpenseFiltersProps> = ({ activeFilter, onFilterChange, paidCount, pendingCount }) => {
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
                    label={t('payments.modals.addExpense.status.paid')}
                    isActive={activeFilter === 'paid'}
                    onClick={() => onFilterChange('paid')}
                    variant="success"
                    icon={<CheckCircle className="w-4 h-4" />}
                    className="px-4 py-2.5 text-sm rounded-xl"
                />
                <FilterChip
                    label={t('payments.modals.addExpense.status.pending')}
                    isActive={activeFilter === 'pending'}
                    onClick={() => onFilterChange('pending')}
                    variant="destructive"
                    icon={<AlertCircle className="w-4 h-4" />}
                    className="px-4 py-2.5 text-sm rounded-xl"
                />
            </div>

            {/* Stats Display */}
            <div className="flex items-center gap-4 text-xs font-medium">
                <div className="flex items-center gap-2 text-ds-muted-light dark:text-ds-muted-dark">
                    <div className="w-2.5 h-2.5 rounded-full bg-ds-success"></div>
                    {t('payments.modals.addExpense.status.paid')}: <span className="text-white font-bold text-sm">{paidCount}</span>
                </div>
                <div className="flex items-center gap-2 text-ds-muted-light dark:text-ds-muted-dark">
                    <div className="w-2.5 h-2.5 rounded-full bg-ds-destructive"></div>
                    {t('payments.modals.addExpense.status.pending')}: <span className="text-white font-bold text-sm">{pendingCount}</span>
                </div>
            </div>
        </div>
    );
};

