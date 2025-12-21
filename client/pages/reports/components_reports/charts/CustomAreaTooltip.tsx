import type { FC } from "react";

interface CustomAreaTooltipProps {
    active?: boolean;
    payload?: Array<{
        name: string;
        value: number;
        color: string;
    }>;
    label?: string;
}

export const CustomAreaTooltip: FC<CustomAreaTooltipProps> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-ds-card-dark dark:bg-ds-card-dark border border-ds-border-dark dark:border-ds-border-dark p-4 rounded-xl shadow-2xl">
                <p className="text-ds-secondary-dark dark:text-ds-secondary-dark text-xs font-medium mb-2">
                    {label} 2024
                </p>
                <div className="space-y-1">
                    {payload.map((entry, index) => (
                        <div key={index} className="flex items-center gap-3 min-w-[120px]">
                            <div
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: entry.color }}
                            />
                            <span className="text-ds-secondary-light dark:text-ds-secondary-light text-sm font-medium flex-1">
                                {entry.name}
                            </span>
                            <span className="text-ds-primary-dark dark:text-ds-primary-dark text-sm font-bold">
                                ₺{entry.value.toLocaleString()}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return null;
};
