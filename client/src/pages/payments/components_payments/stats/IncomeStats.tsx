import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Wallet, AlertTriangle, DollarSign } from 'lucide-react';
import { StatCard } from '@/components/stat-card';
import type { IncomeStats as IncomeStatsType } from '@/types/payments';

interface IncomeStatsProps {
    stats: IncomeStatsType;
    isLoading: boolean;
    selectedMonth: string;
    selectedYear: string;
}

export const IncomeStats: FC<IncomeStatsProps> = ({ stats, isLoading, selectedMonth, selectedYear }) => {
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
                title={t('payments.stats.income.collected')}
                value={`₺${stats.collected.toLocaleString()}`}
                trend={`%${stats.rate}`}
                trendUp={stats.rate > 50}
                trendText={t('payments.stats.income.collectionRate')}
                variant="green"
                icon={Wallet}
            />
            <StatCard
                title={t('payments.stats.income.pending')}
                value={`₺${stats.pending.toLocaleString()}`}
                trend={`${stats.pending > 0 ? t('payments.stats.income.debtor') : '0'} ${t('payments.stats.income.person')}`}
                trendUp={false}
                trendText={t('payments.stats.income.notPaidYet')}
                variant="orange"
                icon={AlertTriangle}
            />
            <StatCard
                title={t('payments.stats.income.totalExpected')}
                value={`₺${stats.total.toLocaleString()}`}
                trend={selectedMonth}
                trendUp={true}
                trendText={t('payments.stats.income.budget', { year: selectedYear })}
                variant="blue"
                icon={DollarSign}
            />
        </div>
    );
};
