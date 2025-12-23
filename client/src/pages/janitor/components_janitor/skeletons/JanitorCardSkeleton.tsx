import type { FC } from "react";

export const JanitorCardSkeleton: FC = () => (
  <div className="bg-ds-card-light dark:bg-ds-card-dark border border-ds-border-light dark:border-ds-border-dark rounded-2xl p-6 animate-pulse">
    <div className="flex items-start justify-between mb-6">
      <div className="flex gap-4">
        <div className="w-16 h-16 rounded-full bg-ds-accent-light dark:bg-ds-accent-dark" />
        <div className="space-y-2 pt-1">
          <div className="h-4 w-32 bg-ds-accent-light dark:bg-ds-accent-dark rounded" />
          <div className="h-3 w-24 bg-ds-accent-light dark:bg-ds-accent-dark rounded" />
        </div>
      </div>
      <div className="h-6 w-16 bg-ds-accent-light dark:bg-ds-accent-dark rounded-full" />
    </div>
    <div className="space-y-3">
      <div className="h-3 w-full bg-ds-accent-light dark:bg-ds-accent-dark rounded" />
      <div className="flex gap-2">
        <div className="h-6 w-12 bg-ds-accent-light dark:bg-ds-accent-dark rounded" />
        <div className="h-6 w-12 bg-ds-accent-light dark:bg-ds-accent-dark rounded" />
      </div>
    </div>
  </div>
);


