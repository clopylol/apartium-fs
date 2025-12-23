import React from 'react';

export const PollCardSkeleton: React.FC = () => (
    <div className="bg-ds-card-dark border border-ds-border-dark rounded-2xl p-6 animate-pulse h-[280px] flex flex-col">
        <div className="flex justify-between items-start mb-4">
            <div className="space-y-3 w-3/4">
                <div className="h-6 w-3/4 bg-ds-border-dark rounded" />
                <div className="h-4 w-full bg-ds-border-dark rounded" />
                <div className="h-4 w-2/3 bg-ds-border-dark rounded" />
            </div>
            <div className="h-6 w-16 bg-ds-border-dark rounded-full" />
        </div>
        <div className="flex-1 space-y-3 my-4">
            <div className="flex justify-between">
                <div className="h-4 w-12 bg-ds-border-dark rounded" />
                <div className="h-4 w-12 bg-ds-border-dark rounded" />
            </div>
            <div className="h-3 w-full bg-ds-border-dark rounded-full" />
            <div className="flex gap-3 pt-2">
                <div className="h-10 flex-1 bg-ds-border-dark rounded-lg" />
                <div className="h-10 flex-1 bg-ds-border-dark rounded-lg" />
            </div>
        </div>
        <div className="pt-4 border-t border-ds-border-dark flex justify-between">
            <div className="h-4 w-24 bg-ds-border-dark rounded" />
            <div className="h-4 w-24 bg-ds-border-dark rounded" />
            <div className="h-4 w-16 bg-ds-border-dark rounded" />
        </div>
    </div>
);

