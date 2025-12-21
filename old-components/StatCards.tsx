import React from 'react';
import { ArrowUpRight, ArrowDownRight, LucideIcon } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { CHART_DATA_INCOME, CHART_DATA_OCCUPANCY } from '../constants';

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

const StatCard: React.FC<StatCardProps> = ({ 
  title, value, trend, trendUp, trendText, variant, hasChart, icon: Icon 
}) => {
  
  const getTheme = () => {
    switch (variant) {
      case 'green': return {
        bg: 'bg-gradient-to-br from-emerald-900/50 to-emerald-950/50 border-emerald-500/20',
        text: 'text-emerald-400',
        icon: 'text-emerald-500',
        chartStroke: '#10b981',
        chartFill: '#10b981'
      };
      case 'orange': return {
        bg: 'bg-gradient-to-br from-orange-900/50 to-orange-950/50 border-orange-500/20',
        text: 'text-orange-400',
        icon: 'text-orange-500',
        chartStroke: '#f97316',
        chartFill: '#f97316'
      };
      case 'blue': return {
        bg: 'bg-gradient-to-br from-blue-900/50 to-blue-950/50 border-blue-500/20',
        text: 'text-blue-400',
        icon: 'text-blue-500',
        chartStroke: '#3b82f6',
        chartFill: '#3b82f6'
      };
      case 'purple': return {
        bg: 'bg-gradient-to-br from-purple-900/50 to-purple-950/50 border-purple-500/20',
        text: 'text-purple-400',
        icon: 'text-purple-500',
        chartStroke: '#a855f7',
        chartFill: '#a855f7'
      };
      case 'red': return {
        bg: 'bg-gradient-to-br from-rose-900/50 to-rose-950/50 border-rose-500/20',
        text: 'text-rose-400',
        icon: 'text-rose-500',
        chartStroke: '#f43f5e',
        chartFill: '#f43f5e'
      };
      default: return {
        bg: 'bg-slate-900 border-slate-800',
        text: 'text-slate-400',
        icon: 'text-slate-500',
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
            <h3 className="text-sm font-medium text-slate-400 mb-1">{title}</h3>
            <div className="text-3xl font-bold text-white tracking-tight">{value}</div>
          </div>
          
          <div className={`p-3 rounded-xl bg-slate-950/30 border border-white/5 shadow-inner`}>
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
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${trendUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'} border border-white/5`}>
            {trendUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            <span className="font-semibold">{trend}</span>
          </div>
          <span className="text-slate-500 text-xs">{trendText}</span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;