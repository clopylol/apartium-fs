import type { FC } from "react";

export const DonutChartSkeleton: FC = () => {
    return (
        <div className="bg-ds-card-dark dark:bg-ds-card-dark border border-ds-border-dark dark:border-ds-border-dark rounded-2xl p-6 h-[380px] animate-pulse flex flex-col">
            <div className="h-6 w-32 bg-ds-muted-dark dark:bg-ds-muted-dark rounded mb-6" />
            <div className="flex-1 flex items-center justify-center">
                <div className="w-40 h-40 rounded-full border-8 border-ds-muted-dark dark:border-ds-muted-dark bg-transparent" />
            </div>
            <div className="mt-6 space-y-3">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex justify-between">
                        <div className="flex gap-2 items-center">
                            <div className="w-3 h-3 rounded-full bg-ds-muted-dark dark:bg-ds-muted-dark" />
                            <div className="h-3 w-20 bg-ds-muted-dark dark:bg-ds-muted-dark rounded" />
                        </div>
                        <div className="h-3 w-12 bg-ds-muted-dark dark:bg-ds-muted-dark rounded" />
                    </div>
                ))}
            </div>
        </div>
    );
};
