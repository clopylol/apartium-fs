import type { FC } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import type { ExpenseData } from "@/types/reports.types";

interface ExpenseDistributionChartProps {
    data: ExpenseData[];
}

const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-ds-card-dark dark:bg-ds-card-dark border border-ds-border-dark dark:border-ds-border-dark p-3 rounded-xl shadow-xl backdrop-blur-sm bg-opacity-95">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: data.color }} />
                    <span className="text-ds-primary-dark dark:text-ds-primary-dark font-medium text-sm">
                        {data.name}
                    </span>
                </div>
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-ds-primary-dark dark:text-ds-primary-dark">
                        %{data.value}
                    </span>
                    <span className="text-ds-secondary-dark dark:text-ds-secondary-dark text-xs">
                        ₺{data.amount.toLocaleString()}
                    </span>
                </div>
            </div>
        );
    }
    return null;
};

export const ExpenseDistributionChart: FC<ExpenseDistributionChartProps> = ({ data }) => {
    const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);

    return (
        <div className="bg-ds-card-dark dark:bg-ds-card-dark border border-ds-border-dark dark:border-ds-border-dark rounded-2xl p-6 flex flex-col h-[380px]">
            <h3 className="text-lg font-bold font-heading text-ds-primary-dark dark:text-ds-primary-dark mb-4 shrink-0">
                Gider Dağılımı
            </h3>

            <div className="flex-1 flex flex-col min-h-0">
                {/* Chart Container */}
                <div className="relative h-[180px] w-full flex items-center justify-center shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data as any}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={4}
                                dataKey="value"
                                stroke="none"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomPieTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>

                    {/* Centered Total */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-ds-secondary-dark dark:text-ds-secondary-dark text-xs font-medium uppercase tracking-wider">
                            Toplam
                        </span>
                        <span className="text-2xl font-bold text-ds-primary-dark dark:text-ds-primary-dark tracking-tight">
                            ₺{(totalAmount / 1000).toFixed(1)}k
                        </span>
                    </div>
                </div>

                {/* Custom Legend - Scrollable */}
                <div className="mt-4 space-y-3 overflow-y-auto custom-scrollbar flex-1 pr-2">
                    {data.map((item, index) => (
                        <div key={index} className="flex items-center justify-between text-sm group py-1">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-3 h-3 rounded-full shrink-0"
                                    style={{ backgroundColor: item.color }}
                                />
                                <span className="text-ds-secondary-light dark:text-ds-secondary-light font-medium group-hover:text-ds-primary-dark dark:group-hover:text-ds-primary-dark transition-colors truncate max-w-[120px]">
                                    {item.name}
                                </span>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                                <span className="text-ds-secondary-dark dark:text-ds-secondary-dark text-xs">
                                    ₺{item.amount.toLocaleString()}
                                </span>
                                <span className="text-ds-primary-light dark:text-ds-primary-light font-bold w-8 text-right">
                                    {item.value}%
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
