import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { FilterChip } from '@/components/shared/inputs/filter-chip';

interface PaymentFiltersProps {
    activeFilter: 'all' | 'paid' | 'unpaid';
    onFilterChange: (filter: 'all' | 'paid' | 'unpaid') => void;
}

export const PaymentFilters: FC<PaymentFiltersProps> = ({ activeFilter, onFilterChange }) => {
    const { t } = useTranslation();

    return (
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
    );
};

