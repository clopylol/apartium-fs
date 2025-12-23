export function ResidentCardSkeleton() {
    return (
        <div className="rounded-2xl border border-ds-border-light dark:border-ds-border-dark bg-ds-card-light dark:bg-ds-card-dark h-[280px] animate-pulse flex flex-col shadow-lg">
            <div className="p-5 border-b border-ds-border-light dark:border-ds-border-dark flex justify-between">
                <div className="h-6 w-24 bg-ds-muted-light dark:bg-ds-muted-dark rounded"></div>
                <div className="h-6 w-16 bg-ds-muted-light dark:bg-ds-muted-dark rounded"></div>
            </div>
            <div className="p-5 flex-1 space-y-4">
                <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-ds-muted-light dark:bg-ds-muted-dark shrink-0"></div>
                    <div className="space-y-2 flex-1">
                        <div className="h-4 w-32 bg-ds-muted-light dark:bg-ds-muted-dark rounded"></div>
                        <div className="h-3 w-20 bg-ds-muted-light dark:bg-ds-muted-dark rounded"></div>
                    </div>
                </div>
                <div className="h-12 bg-ds-muted-light/50 dark:bg-ds-muted-dark/50 rounded-lg"></div>
            </div>
            <div className="p-4 border-t border-ds-border-light dark:border-ds-border-dark flex justify-between">
                <div className="h-4 w-20 bg-ds-muted-light dark:bg-ds-muted-dark rounded"></div>
                <div className="h-8 w-24 bg-ds-muted-light dark:bg-ds-muted-dark rounded"></div>
            </div>
        </div>
    );
}
