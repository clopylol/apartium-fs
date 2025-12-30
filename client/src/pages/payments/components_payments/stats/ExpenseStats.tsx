import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingDown, CheckCircle, AlertTriangle, PartyPopper } from 'lucide-react';
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

    // Check if all debts are paid
    const allPaid = stats.pending === 0 && stats.total === stats.paid && stats.total > 0;

    return (
        <div className="space-y-6">
            {/* Celebration Banner - Show when all debts are paid */}
            {allPaid && (
                <div className="relative overflow-hidden rounded-2xl p-6 border border-ds-in-success-500/30 bg-gradient-to-br from-ds-in-success-900/50 via-ds-in-success-800/40 to-ds-in-success-950/50 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
                    {/* Background Decor */}
                    <div className="absolute -right-4 -bottom-4 opacity-10 transition-opacity">
                        <PartyPopper className="w-32 h-32 text-ds-in-success-500" />
                    </div>

                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                            <div className="p-3 rounded-xl bg-ds-in-success-500/20 border border-ds-in-success-500/30 shadow-inner">
                                <CheckCircle className="w-8 h-8 text-ds-in-success-400" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-ds-in-success-400 mb-1">
                                    {t('payments.stats.expenses.allPaid.title')}
                                </h3>
                                <p className="text-sm text-ds-muted-dark">
                                    {t('payments.stats.expenses.allPaid.message')}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-ds-background-dark/40 border border-ds-in-success-500/20">
                            <span className="text-sm font-medium text-ds-muted-dark">
                                {t('payments.stats.expenses.allPaid.totalPaid')}:
                            </span>
                            <span className="text-2xl font-bold text-ds-in-success-400">
                                ₺{stats.paid.toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats Cards */}
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
        </div>
    );
};
