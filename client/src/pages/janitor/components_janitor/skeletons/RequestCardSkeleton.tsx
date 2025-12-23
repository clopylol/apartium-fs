import type { FC } from "react";

export const RequestCardSkeleton: FC = () => (
  <div className="bg-ds-card-light dark:bg-ds-card-dark border border-ds-border-light dark:border-ds-border-dark rounded-2xl p-5 animate-pulse">
    <div className="flex justify-between items-start mb-4">
      <div className="w-10 h-10 rounded-lg bg-ds-accent-light dark:bg-ds-accent-dark" />
      <div className="h-6 w-20 bg-ds-accent-light dark:bg-ds-accent-dark rounded-full" />
    </div>
    <div className="space-y-2 mb-4">
      <div className="h-4 w-32 bg-ds-accent-light dark:bg-ds-accent-dark rounded" />
      <div className="h-3 w-24 bg-ds-accent-light dark:bg-ds-accent-dark rounded" />
    </div>
    <div className="pt-4 border-t border-ds-border-light dark:border-ds-border-dark flex justify-between items-center">
      <div className="h-3 w-16 bg-ds-accent-light dark:bg-ds-accent-dark rounded" />
      <div className="h-8 w-8 bg-ds-accent-light dark:bg-ds-accent-dark rounded" />
    </div>
  </div>
);


