export const StatCardSkeleton = () => (
    <div className="relative overflow-hidden rounded-2xl p-6 border border-ds-border-light dark:border-ds-border-dark bg-ds-card-light dark:bg-ds-card-dark h-full min-h-[160px] shadow-lg">
        <div className="flex justify-between items-start">
            <div className="space-y-3 w-full">
                <div className="h-4 w-24 bg-ds-border-light dark:bg-ds-border-dark rounded animate-pulse" />
                <div className="h-8 w-32 bg-ds-border-light dark:bg-ds-border-dark rounded animate-pulse" />
            </div>
            <div className="w-12 h-12 bg-ds-border-light dark:bg-ds-border-dark rounded-xl animate-pulse shrink-0" />
        </div>
        <div className="mt-6 flex gap-2">
            <div className="h-6 w-16 bg-ds-border-light dark:bg-ds-border-dark rounded-full animate-pulse" />
            <div className="h-6 w-24 bg-ds-border-light dark:bg-ds-border-dark rounded animate-pulse" />
        </div>
    </div>
);
