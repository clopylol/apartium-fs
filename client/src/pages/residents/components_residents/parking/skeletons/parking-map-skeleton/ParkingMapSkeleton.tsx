export function ParkingMapSkeleton() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
            <div className="lg:col-span-2 bg-ds-card-light dark:bg-ds-card-dark border border-ds-border-light dark:border-ds-border-dark rounded-2xl p-6 h-[600px]">
                <div className="flex justify-between mb-6">
                    <div className="h-6 w-48 bg-ds-muted-light dark:bg-ds-muted-dark rounded"></div>
                    <div className="h-6 w-32 bg-ds-muted-light dark:bg-ds-muted-dark rounded"></div>
                </div>
                <div className="flex gap-2 mb-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="h-8 w-24 bg-ds-muted-light dark:bg-ds-muted-dark rounded-full"
                        ></div>
                    ))}
                </div>
                <div className="grid grid-cols-5 gap-4">
                    {Array.from({ length: 15 }).map((_, i) => (
                        <div
                            key={i}
                            className="aspect-square bg-ds-muted-light/50 dark:bg-ds-muted-dark/50 rounded-xl border border-ds-border-light dark:border-ds-border-dark"
                        ></div>
                    ))}
                </div>
            </div>
            <div className="bg-ds-card-light dark:bg-ds-card-dark border border-ds-border-light dark:border-ds-border-dark rounded-2xl h-[600px] p-4 flex flex-col">
                <div className="h-12 w-full bg-ds-muted-light dark:bg-ds-muted-dark rounded-xl mb-4"></div>
                <div className="space-y-3 flex-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div
                            key={i}
                            className="h-24 bg-ds-muted-light/50 dark:bg-ds-muted-dark/50 rounded-xl"
                        ></div>
                    ))}
                </div>
            </div>
        </div>
    );
}
