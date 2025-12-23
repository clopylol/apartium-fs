import type { FC } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Filter } from "lucide-react";
import type { MonthlyData } from "@/types/reports.types";
import { CustomAreaTooltip } from "./CustomAreaTooltip";

interface IncomeExpenseChartProps {
    data: MonthlyData[];
}

export const IncomeExpenseChart: FC<IncomeExpenseChartProps> = ({ data }) => {
    return (
        <div className="lg:col-span-2 bg-ds-card-dark dark:bg-ds-card-dark border border-ds-border-dark dark:border-ds-border-dark rounded-2xl p-6 h-[380px]">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold font-heading text-ds-primary-dark dark:text-ds-primary-dark">
                    Gelir & Gider Analizi
                </h3>
                <button className="p-2 hover:bg-ds-muted-dark dark:hover:bg-ds-muted-dark rounded-lg text-ds-secondary-dark dark:text-ds-secondary-dark transition-colors">
                    <Filter className="w-4 h-4" />
                </button>
            </div>
            <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis
                            dataKey="name"
                            stroke="#64748b"
                            tick={{ fontSize: 12, fill: "#64748b" }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            stroke="#64748b"
                            tick={{ fontSize: 12, fill: "#64748b" }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(value) => `₺${value / 1000}k`}
                        />
                        <Tooltip
                            content={<CustomAreaTooltip />}
                            cursor={{ stroke: "#334155", strokeWidth: 1, strokeDasharray: "4 4" }}
                        />
                        <Legend iconType="circle" />
                        <Area
                            type="monotone"
                            dataKey="income"
                            name="Gelir"
                            stroke="#10b981"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorIncome)"
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                        <Area
                            type="monotone"
                            dataKey="expense"
                            name="Gider"
                            stroke="#ef4444"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorExpense)"
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
