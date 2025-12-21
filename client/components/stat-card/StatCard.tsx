// 1. External & React
import React from 'react';
import { LineChart, Line, ResponsiveContainer, AreaChart, Area } from 'recharts';

// 4. Icons
import { ArrowUpRight, ArrowDownRight, type LucideIcon } from 'lucide-react';

// 8. Constants
import { CHART_DATA_INCOME, CHART_DATA_OCCUPANCY } from '@/constants';


interface StatCardProps {
    title: string;
    value: string;
    trend: string;
    trendUp: boolean;
    trendText: string;
    variant: 'green' | 'orange' | 'blue' | 'red' | 'purple';
    hasChart?: boolean;
    icon?: LucideIcon;
}

export const StatCard: React.FC<StatCardProps> = ({
    title, value, trend, trendUp, trendText, variant, hasChart, icon: Icon
}) => {

    const getTheme = () => {
        switch (variant) {
            case 'green': return {
                bg: 'bg-gradient-to-br from-ds-in-success-900/50 to-ds-in-success-950/50 border-ds-in-success-500/20',
                text: 'text-ds-in-success-400',
                icon: 'text-ds-in-success-500',
                chartStroke: '#05DF72',
                chartFill: '#05DF72'
            };
            case 'orange': return {
                bg: 'bg-gradient-to-br from-ds-in-orange-900/50 to-ds-in-orange-950/50 border-ds-in-orange-500/20',
                text: 'text-ds-in-orange-400',
                icon: 'text-ds-in-orange-500',
                chartStroke: '#FB7B40',
                chartFill: '#FB7B40'
            };
            case 'blue': return {
                bg: 'bg-gradient-to-br from-ds-in-sky-900/50 to-ds-in-sky-950/50 border-ds-in-sky-500/20',
                text: 'text-ds-in-sky-400',
                icon: 'text-ds-in-sky-500',
                chartStroke: '#00BCFF',
                chartFill: '#00BCFF'
            };
            case 'purple': return {
                bg: 'bg-gradient-to-br from-ds-in-violet-900/50 to-ds-in-violet-950/50 border-ds-in-violet-500/20',
                text: 'text-ds-in-violet-400',
                icon: 'text-ds-in-violet-500',
                chartStroke: '#A684FF',
                chartFill: '#A684FF'
            };
            case 'red': return {
                bg: 'bg-gradient-to-br from-ds-in-destructive-900/50 to-ds-in-destructive-950/50 border-ds-in-destructive-500/20',
                text: 'text-ds-in-destructive-400',
                icon: 'text-ds-in-destructive-500',
                chartStroke: '#EF4749',
                chartFill: '#EF4749'
            };
            default: return {
                bg: 'bg-ds-card-dark border-ds-border-dark',
                text: 'text-ds-muted-dark',
                icon: 'text-ds-muted-dark',
                chartStroke: '#94a3b8',
                chartFill: '#94a3b8'
            };
        }
    };

    const theme = getTheme();

    return (
        <div className={`relative overflow-hidden rounded-2xl p-6 border ${theme.bg} shadow-lg backdrop-blur-sm group transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl`}>

            {/* Background Decor */}
            {Icon && (
                <div className={`absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500`}>
                    <Icon className={`w-32 h-32 ${theme.icon}`} />
                </div>
            )}

            <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-sm font-medium text-ds-muted-dark mb-1">{title}</h3>
                        <div className="text-3xl font-bold text-ds-primary-dark tracking-tight">{value}</div>
                    </div>

                    <div className={`p-3 rounded-xl bg-ds-background-dark/30 border border-white/5 shadow-inner`}>
                        {Icon && <Icon className={`w-6 h-6 ${theme.icon}`} />}
                    </div>
                </div>

                {/* Charts */}
                {hasChart && variant === 'green' && (
                    <div className="absolute left-0 right-0 bottom-10 h-16 opacity-50 pointer-events-none">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={CHART_DATA_INCOME}>
                                <Line type="monotone" dataKey="value" stroke={theme.chartStroke} strokeWidth={3} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {hasChart && variant === 'orange' && (
                    <div className="absolute left-0 right-0 bottom-0 h-24 opacity-30 pointer-events-none">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={CHART_DATA_OCCUPANCY}>
                                <Area type="monotone" dataKey="value" stroke={theme.chartStroke} fill={theme.chartFill} fillOpacity={0.4} strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                )}

                <div className="flex items-center gap-2 text-sm mt-4">
                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${trendUp ? 'bg-ds-in-success-500/10 text-ds-in-success-400' : 'bg-ds-in-destructive-500/10 text-ds-in-destructive-400'} border border-white/5`}>
                        {trendUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                        <span className="font-semibold">{trend}</span>
                    </div>
                    <span className="text-ds-muted-dark text-xs">{trendText}</span>
                </div>
            </div>
        </div>
    );
};
