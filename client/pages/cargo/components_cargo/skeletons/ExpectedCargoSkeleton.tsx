import type { FC } from "react";

export const ExpectedCargoSkeleton: FC = () => (
  <div className="bg-ds-card-light dark:bg-ds-card-dark border border-ds-border-light dark:border-ds-border-dark rounded-2xl p-5 animate-pulse h-[220px] flex flex-col">
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-ds-muted-light dark:bg-ds-muted-dark shrink-0" />
        <div className="space-y-2">
          <div className="h-4 w-32 bg-ds-muted-light dark:bg-ds-muted-dark rounded" />
          <div className="h-3 w-20 bg-ds-muted-light dark:bg-ds-muted-dark rounded" />
        </div>
      </div>
    </div>
    <div className="flex-1 space-y-3 mb-5">
      <div className="p-3 bg-ds-background-light dark:bg-ds-background-dark rounded-xl border border-ds-border-light dark:border-ds-border-dark space-y-2">
        <div className="h-3 w-full bg-ds-muted-light dark:bg-ds-muted-dark rounded" />
        <div className="h-3 w-3/4 bg-ds-muted-light dark:bg-ds-muted-dark rounded" />
      </div>
    </div>
    <div className="flex justify-between items-center pt-3 border-t border-ds-border-light dark:border-ds-border-dark">
      <div className="h-3 w-24 bg-ds-muted-light dark:bg-ds-muted-dark rounded" />
      <div className="h-8 w-28 bg-ds-muted-light dark:bg-ds-muted-dark rounded-lg" />
    </div>
  </div>
);

