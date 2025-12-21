import type { FC } from "react";

export const MaintenanceCardSkeleton: FC = () => (
  <div className="bg-ds-card-light dark:bg-ds-card-dark border border-ds-border-light dark:border-ds-border-dark rounded-2xl p-5 flex flex-col justify-between h-[220px] animate-pulse">
    <div>
      <div className="flex justify-between items-start mb-4">
        <div className="h-6 w-20 bg-ds-muted-light dark:bg-ds-muted-dark rounded-full" />
        <div className="h-6 w-16 bg-ds-muted-light dark:bg-ds-muted-dark rounded" />
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-6 w-3/4 bg-ds-muted-light dark:bg-ds-muted-dark rounded" />
        <div className="h-4 w-1/3 bg-ds-muted-light dark:bg-ds-muted-dark rounded" />
      </div>
      <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-ds-background-light dark:bg-ds-background-dark border border-ds-border-light dark:border-ds-border-dark">
        <div className="w-10 h-10 rounded-full bg-ds-muted-light dark:bg-ds-muted-dark shrink-0" />
        <div className="space-y-2 w-full">
          <div className="h-4 w-24 bg-ds-muted-light dark:bg-ds-muted-dark rounded" />
          <div className="h-3 w-16 bg-ds-muted-light dark:bg-ds-muted-dark rounded" />
        </div>
      </div>
    </div>
    <div className="flex items-center justify-between pt-4 border-t border-ds-border-light dark:border-ds-border-dark">
      <div className="h-4 w-20 bg-ds-muted-light dark:bg-ds-muted-dark rounded" />
      <div className="h-6 w-12 bg-ds-muted-light dark:bg-ds-muted-dark rounded" />
    </div>
  </div>
);

