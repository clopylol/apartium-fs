import type { FC } from 'react';

export const FacilityCardSkeleton: FC = () => (
  <div className="relative overflow-hidden rounded-2xl border border-ds-border-light dark:border-ds-border-dark bg-ds-card-light dark:bg-ds-card-dark h-[320px] animate-pulse shadow-lg">
    <div className="h-40 bg-ds-border-light dark:bg-ds-border-dark" />
    <div className="p-4 flex flex-col justify-between h-[160px]">
      <div className="space-y-3">
        <div className="h-6 w-3/4 bg-ds-border-light dark:bg-ds-border-dark rounded" />
        <div className="h-4 w-1/2 bg-ds-border-light dark:bg-ds-border-dark rounded" />
        <div className="h-4 w-1/3 bg-ds-border-light dark:bg-ds-border-dark rounded" />
      </div>
      <div className="pt-3 border-t border-ds-border-light dark:border-ds-border-dark flex justify-between items-center">
        <div className="h-4 w-16 bg-ds-border-light dark:bg-ds-border-dark rounded" />
        <div className="h-4 w-20 bg-ds-border-light dark:bg-ds-border-dark rounded" />
      </div>
    </div>
  </div>
);
