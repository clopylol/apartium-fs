import type { FC } from "react";

export const ChartSkeleton: FC = () => {
    return (
        <div className="bg-ds-card-dark dark:bg-ds-card-dark border border-ds-border-dark dark:border-ds-border-dark rounded-2xl p-6 h-[380px] animate-pulse flex flex-col">
            <div className="flex justify-between items-center mb-8">
                <div className="h-6 w-48 bg-ds-muted-dark dark:bg-ds-muted-dark rounded" />
                <div className="h-8 w-8 bg-ds-muted-dark dark:bg-ds-muted-dark rounded" />
            </div>
            <div className="flex-1 w-full bg-ds-muted-dark/30 dark:bg-ds-muted-dark/30 rounded-xl" />
        </div>
    );
};
