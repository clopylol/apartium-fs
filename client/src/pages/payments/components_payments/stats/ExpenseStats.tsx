import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingDown, CheckCircle, AlertTriangle } from 'lucide-react';
import { StatCard } from '@/components/stat-card';
import type { ExpenseStats as ExpenseStatsType } from '@/types/payments';

interface ExpenseStatsProps {
    stats: ExpenseStatsType;
    isLoading: boolean;
    selectedMonth: string;
    pendingCount: number; // Added this prop to match original functionality
}

export const ExpenseStats: FC<ExpenseStatsProps> = ({ stats, isLoading, selectedMonth, pendingCount }) => {
    const { t } = useTranslation();
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="relative overflow-hidden rounded-2xl p-6 border border-ds-border-dark bg-ds-card-dark h-full min-h-[160px] shadow-lg animate-pulse">
                    <div className="flex justify-between items-start">
                        <div className="space-y-3 w-full">
                            <div className="h-4 w-24 bg-ds-muted-dark rounded" />
                            <div className="h-8 w-32 bg-ds-muted-dark rounded" />
                        </div>
                        <div className="w-12 h-12 bg-ds-muted-dark rounded-xl shrink-0" />
                    </div>
                    <div className="mt-6 flex gap-2">
                        <div className="h-6 w-16 bg-ds-muted-dark rounded-full" />
                        <div className="h-6 w-24 bg-ds-muted-dark rounded" />
                    </div>
                </div>
                <div className="relative overflow-hidden rounded-2xl p-6 border border-ds-border-dark bg-ds-card-dark h-full min-h-[160px] shadow-lg animate-pulse">
                    <div className="flex justify-between items-start">
                        <div className="space-y-3 w-full">
                            <div className="h-4 w-24 bg-ds-muted-dark rounded" />
                            <div className="h-8 w-32 bg-ds-muted-dark rounded" />
                        </div>
                        <div className="w-12 h-12 bg-ds-muted-dark rounded-xl shrink-0" />
                    </div>
                    <div className="mt-6 flex gap-2">
                        <div className="h-6 w-16 bg-ds-muted-dark rounded-full" />
                        <div className="h-6 w-24 bg-ds-muted-dark rounded" />
                    </div>
                </div>
                <div className="relative overflow-hidden rounded-2xl p-6 border border-ds-border-dark bg-ds-card-dark h-full min-h-[160px] shadow-lg animate-pulse">
                    <div className="flex justify-between items-start">
                        <div className="space-y-3 w-full">
                            <div className="h-4 w-24 bg-ds-muted-dark rounded" />
                            <div className="h-8 w-32 bg-ds-muted-dark rounded" />
                        </div>
                        <div className="w-12 h-12 bg-ds-muted-dark rounded-xl shrink-0" />
                    </div>
                    <div className="mt-6 flex gap-2">
                        <div className="h-6 w-16 bg-ds-muted-dark rounded-full" />
                        <div className="h-6 w-24 bg-ds-muted-dark rounded" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
                title={t('payments.stats.expenses.total')}
                value={`₺${stats.total.toLocaleString()}`}
                trend={selectedMonth}
                trendUp={false}
                trendText={t('payments.stats.expenses.totalInvoice')}
                variant="blue"
                icon={TrendingDown}
            />
            <StatCard
                title={t('payments.stats.expenses.paid')}
                value={`₺${stats.paid.toLocaleString()}`}
                trend="%100"
                trendUp={true}
                trendText={t('payments.stats.expenses.paidSuccessfully')}
                variant="green"
                icon={CheckCircle}
            />
            <StatCard
                title={t('payments.stats.expenses.toPay')}
                value={`₺${stats.pending.toLocaleString()}`}
                trend={`${pendingCount} ${t('payments.stats.expenses.items')}`}
                trendUp={false}
                trendText={t('payments.stats.expenses.pendingInvoice')}
                variant="orange"
                icon={AlertTriangle}
            />
        </div>
    );
};
