// 1. External & React
import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';

// 4. Icons
import { Plus, Wallet, Wrench, UserPlus, Calendar as CalendarIcon, Filter, ArrowUpRight } from 'lucide-react';

// 3. Components
import { StatCard } from '@/components/stat-card';
import { RecentPaymentsList, MaintenanceList, BookingsList, TenantsList } from './components_dashboard';

// 8. Constants
import { CHART_DATA_INCOME } from '@/constants';


// --- Skeleton Components ---
const StatCardSkeleton = () => (
    <div className="relative overflow-hidden rounded-2xl p-6 border border-ds-border-dark bg-ds-card-dark h-full min-h-[160px] shadow-lg">
        <div className="flex justify-between items-start">
            <div className="space-y-3 w-full">
                <div className="h-4 w-24 bg-ds-border-dark rounded animate-pulse" />
                <div className="h-8 w-32 bg-ds-border-dark rounded animate-pulse" />
            </div>
            <div className="w-12 h-12 bg-ds-border-dark rounded-xl animate-pulse shrink-0" />
        </div>
        <div className="mt-6 flex gap-2">
            <div className="h-6 w-16 bg-ds-border-dark rounded-full animate-pulse" />
            <div className="h-6 w-24 bg-ds-border-dark rounded animate-pulse" />
        </div>
    </div>
);

const ChartSkeleton = () => (
    <div className="bg-ds-card-dark border border-ds-border-dark rounded-2xl p-6 h-[420px] shadow-xl relative overflow-hidden">
        <div className="flex justify-between mb-8">
            <div className="space-y-3">
                <div className="h-6 w-48 bg-ds-border-dark rounded animate-pulse" />
                <div className="h-4 w-32 bg-ds-border-dark rounded animate-pulse" />
            </div>
            <div className="w-8 h-8 bg-ds-border-dark rounded animate-pulse" />
        </div>
        <div className="w-full h-[280px] flex items-end gap-4 px-2">
            <div className="w-full h-[40%] bg-ds-border-dark/30 rounded-t animate-pulse" style={{ animationDelay: '0.1s' }} />
            <div className="w-full h-[60%] bg-ds-border-dark/30 rounded-t animate-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="w-full h-[30%] bg-ds-border-dark/30 rounded-t animate-pulse" style={{ animationDelay: '0.3s' }} />
            <div className="w-full h-[70%] bg-ds-border-dark/30 rounded-t animate-pulse" style={{ animationDelay: '0.4s' }} />
            <div className="w-full h-[50%] bg-ds-border-dark/30 rounded-t animate-pulse" style={{ animationDelay: '0.5s' }} />
            <div className="w-full h-[80%] bg-ds-border-dark/30 rounded-t animate-pulse" style={{ animationDelay: '0.6s' }} />
            <div className="w-full h-[45%] bg-ds-border-dark/30 rounded-t animate-pulse" style={{ animationDelay: '0.7s' }} />
        </div>
    </div>
);

const ListSkeleton = () => (
    <div className="bg-ds-card-dark border border-ds-border-dark rounded-2xl h-[380px] flex flex-col shadow-lg overflow-hidden">
        <div className="p-6 border-b border-ds-border-dark flex justify-between items-center bg-ds-background-dark/30">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-ds-border-dark rounded-lg animate-pulse" />
                <div className="h-6 w-32 bg-ds-border-dark rounded animate-pulse" />
            </div>
            <div className="h-4 w-16 bg-ds-border-dark rounded animate-pulse" />
        </div>
        <div className="p-2 space-y-1">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex items-center justify-between p-3">
                    <div className="flex items-center gap-4 w-full">
                        <div className="w-10 h-10 rounded-full bg-ds-border-dark animate-pulse shrink-0" />
                        <div className="space-y-2 w-full">
                            <div className="h-4 w-32 bg-ds-border-dark rounded animate-pulse" />
                            <div className="h-3 w-24 bg-ds-border-dark rounded animate-pulse" />
                        </div>
                    </div>
                    <div className="h-4 w-12 bg-ds-border-dark rounded animate-pulse shrink-0" />
                </div>
            ))}
        </div>
    </div>
);

const PromoSkeleton = () => (
    <div className="bg-ds-card-dark border border-ds-border-dark rounded-2xl p-6 h-[180px] flex flex-col justify-between relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-ds-border-dark/30 rounded-full -mr-10 -mt-10 animate-pulse" />
        <div className="space-y-3 relative z-10">
            <div className="h-6 w-32 bg-ds-border-dark rounded animate-pulse" />
            <div className="h-4 w-48 bg-ds-border-dark rounded animate-pulse" />
        </div>
        <div className="h-10 w-32 bg-ds-border-dark rounded-xl animate-pulse relative z-10" />
    </div>
);

export const DashboardPage = () => {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(true);
    const currentDate = new Date().toLocaleDateString('tr-TR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const months = t('dashboard.chart.months', { returnObjects: true }) as string[];

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="max-w-[1600px] mx-auto space-y-8 relative z-10">
            {/* Background Gradient Spotlights */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-ds-in-sky-600/5 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-ds-in-success-600/5 rounded-full blur-3xl pointer-events-none translate-x-1/3"></div>

            {/* Hero & Quick Actions */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 pb-2">
                <div>
                    {isLoading ? (
                        <div className="space-y-2">
                            <div className="h-8 w-64 bg-ds-border-dark rounded animate-pulse" />
                            <div className="h-5 w-40 bg-ds-border-dark rounded animate-pulse" />
                        </div>
                    ) : (
                        <>
                            <h1 className="text-3xl font-bold font-heading text-ds-primary-dark tracking-tight mb-2 animate-in fade-in slide-in-from-bottom-2 duration-500">{t('dashboard.welcome.greeting', { name: 'Ahmet Bey' })}</h1>
                            <p className="text-ds-muted-dark font-medium flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-700">
                                <CalendarIcon className="w-4 h-4 text-ds-in-sky-500" />
                                {t('dashboard.welcome.dateLabel', { date: currentDate })}
                            </p>
                        </>
                    )}
                </div>

                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-ds-background-dark border border-ds-border-dark hover:border-ds-muted-dark text-ds-muted-dark rounded-xl text-sm font-medium transition-all hover:text-ds-primary-dark group">
                        <div className="p-1 rounded-md bg-ds-border-dark group-hover:bg-ds-in-sky-600 transition-colors">
                            <Plus className="w-3 h-3 text-white" />
                        </div>
                        {t('common.actions.quickAction')}
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-ds-in-sky-600 hover:bg-ds-in-sky-500 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-ds-in-sky-900/20 hover:shadow-ds-in-sky-900/40 hover:-translate-y-0.5">
                        <Wallet className="w-4 h-4" />
                        {t('dashboard.actions.receivePayment')}
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {isLoading ? (
                    <>
                        <StatCardSkeleton />
                        <StatCardSkeleton />
                        <StatCardSkeleton />
                        <StatCardSkeleton />
                    </>
                ) : (
                    <>
                        <StatCard
                            title={t('dashboard.stats.totalIncome')}
                            value="₺452.318"
                            trend="+12.5%"
                            trendUp={true}
                            trendText={t('dashboard.statsLabels.lastMonth')}
                            variant="green"
                            hasChart={true}
                            icon={Wallet}
                        />
                        <StatCard
                            title={t('dashboard.stats.occupancyRate')}
                            value="%92"
                            trend="-1.2%"
                            trendUp={false}
                            trendText={t('dashboard.statsLabels.lastMonth')}
                            variant="orange"
                            hasChart={true}
                            icon={UserPlus}
                        />
                        <StatCard
                            title={t('dashboard.stats.openRequests')}
                            value="14"
                            trend="+5"
                            trendUp={true}
                            trendText={t('dashboard.statsLabels.thisWeek')}
                            variant="blue"
                            icon={Wrench}
                        />
                        <StatCard
                            title={t('dashboard.stats.upcomingEvents')}
                            value="8"
                            trend={t('common.status.new')}
                            trendUp={true}
                            trendText={t('dashboard.statsLabels.thisMonthReservation')}
                            variant="purple"
                            icon={CalendarIcon}
                        />
                    </>
                )}
            </div>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column (Charts & Financials) - Spans 2 cols */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Main Revenue Chart */}
                    {isLoading ? (
                        <ChartSkeleton />
                    ) : (
                        <div className="bg-ds-card-dark border border-ds-border-dark rounded-2xl p-6 shadow-xl relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-lg font-bold text-ds-primary-dark">{t('dashboard.chart.title')}</h3>
                                    <p className="text-sm text-ds-muted-dark">{t('dashboard.chart.description')}</p>
                                </div>
                                <button className="p-2 hover:bg-ds-background-dark rounded-lg text-ds-muted-dark transition-colors border border-transparent hover:border-ds-border-dark">
                                    <Filter className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={CHART_DATA_INCOME} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorIncomeMain" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                        <XAxis
                                            dataKey="value"
                                            stroke="#475569"
                                            tick={{ fontSize: 12, fill: '#64748b' }}
                                            axisLine={false}
                                            tickLine={false}
                                            tickFormatter={(i) => months[i] || ''}
                                        />
                                        <YAxis
                                            stroke="#475569"
                                            tick={{ fontSize: 12, fill: '#64748b' }}
                                            axisLine={false}
                                            tickLine={false}
                                            tickFormatter={(value) => `₺${value / 1000}k`}
                                        />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#f8fafc' }}
                                            itemStyle={{ color: '#3b82f6' }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="value"
                                            stroke="#3b82f6"
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#colorIncomeMain)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}

                    {/* Secondary Lists (Side by Side) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {isLoading ? (
                            <>
                                <ListSkeleton />
                                <ListSkeleton />
                            </>
                        ) : (
                            <>
                                <div className="animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
                                    <RecentPaymentsList />
                                </div>
                                <div className="animate-in fade-in slide-in-from-bottom-5 duration-700 delay-200">
                                    <MaintenanceList />
                                </div>
                            </>
                        )}
                    </div>

                </div>

                {/* Right Column (Activity & Notifications) */}
                <div className="space-y-6">
                    {/* Quick Status Card */}
                    {isLoading ? (
                        <PromoSkeleton />
                    ) : (
                        <div className="bg-gradient-to-br from-ds-in-indigo-600 to-ds-in-sky-700 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden animate-in fade-in slide-in-from-right-4 duration-700">
                            <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                                <UserPlus className="w-48 h-48" />
                            </div>
                            <h3 className="text-lg font-bold mb-1 relative z-10">{t('dashboard.promo.newTenantTitle')}</h3>
                            <p className="text-indigo-100 text-sm mb-4 relative z-10">{t('dashboard.promo.newTenantDescription')}</p>
                            <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all relative z-10 flex items-center gap-2">
                                {t('common.actions.viewDetails')} <ArrowUpRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {isLoading ? (
                        <>
                            <ListSkeleton />
                            <ListSkeleton />
                        </>
                    ) : (
                        <>
                            <div className="animate-in fade-in slide-in-from-right-5 duration-700 delay-100">
                                <BookingsList />
                            </div>
                            <div className="animate-in fade-in slide-in-from-right-5 duration-700 delay-200">
                                <TenantsList />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
