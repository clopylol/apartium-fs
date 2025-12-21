import type { FC } from 'react';

export const ExpenseGroupSkeleton: FC = () => (
    <div className="bg-ds-card-dark border border-ds-border-dark rounded-2xl overflow-hidden shadow-sm animate-pulse">
        <div className="p-4 bg-ds-background-dark/50 border-b border-ds-border-dark flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-ds-muted-dark" />
                <div className="h-5 w-32 bg-ds-muted-dark rounded" />
            </div>
            <div className="h-4 w-20 bg-ds-muted-dark rounded" />
        </div>
        <div className="divide-y divide-ds-border-dark/50">
            {[1, 2].map(i => (
                <div key={i} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-ds-muted-dark" />
                        <div className="space-y-2">
                            <div className="h-4 w-40 bg-ds-muted-dark rounded" />
                            <div className="h-3 w-24 bg-ds-muted-dark rounded" />
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="space-y-2 text-right">
                            <div className="h-5 w-20 bg-ds-muted-dark rounded ml-auto" />
                            <div className="h-3 w-12 bg-ds-muted-dark rounded ml-auto" />
                        </div>
                        <div className="w-8 h-8 bg-ds-muted-dark rounded" />
                    </div>
                </div>
            ))}
        </div>
    </div>
);
