import type { FC } from 'react';

export const FacilityCardSkeleton: FC = () => {
    return (
        <div className="relative overflow-hidden rounded-2xl border border-ds-border-light dark:border-ds-border-dark bg-ds-card-light dark:bg-ds-card-dark h-[320px] shadow-lg">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Image Skeleton */}
            <div className="h-40 bg-ds-muted-light/20 dark:bg-ds-muted-dark/20 animate-pulse" />

            <div className="p-4 flex flex-col h-[160px]">
                {/* Title Skeleton */}
                <div className="h-7 w-3/4 bg-ds-muted-light/20 dark:bg-ds-muted-dark/20 rounded-md animate-pulse mb-3" />

                {/* Info Rows Skeleton */}
                <div className="space-y-2 mb-auto">
                    <div className="flex items-center gap-2">
                        <div className="w-3.5 h-3.5 rounded-full bg-ds-muted-light/20 dark:bg-ds-muted-dark/20 animate-pulse" />
                        <div className="h-4 w-1/2 bg-ds-muted-light/20 dark:bg-ds-muted-dark/20 rounded animate-pulse" />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3.5 h-3.5 rounded-full bg-ds-muted-light/20 dark:bg-ds-muted-dark/20 animate-pulse" />
                        <div className="h-4 w-1/3 bg-ds-muted-light/20 dark:bg-ds-muted-dark/20 rounded animate-pulse" />
                    </div>
                </div>

                {/* Footer Skeleton */}
                <div className="pt-3 border-t border-ds-border-light dark:border-ds-border-dark flex justify-between items-center mt-4">
                    <div className="h-4 w-16 bg-ds-muted-light/20 dark:bg-ds-muted-dark/20 rounded animate-pulse" />
                    <div className="h-4 w-20 bg-ds-muted-light/20 dark:bg-ds-muted-dark/20 rounded animate-pulse" />
                </div>
            </div>
        </div>
    );
};
