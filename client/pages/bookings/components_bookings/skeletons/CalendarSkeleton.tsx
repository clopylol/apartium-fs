import type { FC } from 'react';

export const CalendarSkeleton: FC = () => (
  <div className="flex flex-col h-[600px] animate-pulse">
    <div className="flex border-b border-ds-border-light dark:border-ds-border-dark">
      <div className="w-16 shrink-0 border-r border-ds-border-light dark:border-ds-border-dark bg-ds-background-light/30 dark:bg-ds-background-dark/30 h-16"></div>
      {[1, 2, 3, 4, 5, 6, 7].map(i => (
        <div 
          key={i} 
          className="flex-1 border-r border-ds-border-light dark:border-ds-border-dark h-16 bg-ds-card-light/30 dark:bg-ds-card-dark/30 flex flex-col items-center justify-center gap-2"
        >
          <div className="h-3 w-10 bg-ds-border-light dark:bg-ds-border-dark rounded"></div>
          <div className="h-4 w-6 bg-ds-border-light dark:bg-ds-border-dark rounded"></div>
        </div>
      ))}
    </div>
    <div className="flex-1 relative overflow-hidden">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="flex border-b border-ds-border-light/50 dark:border-ds-border-dark/50 h-24">
          <div className="w-16 shrink-0 border-r border-ds-border-light dark:border-ds-border-dark bg-ds-background-light/20 dark:bg-ds-background-dark/20 flex items-center justify-center">
            <div className="h-3 w-8 bg-ds-border-light dark:bg-ds-border-dark rounded"></div>
          </div>
          <div className="flex-1 bg-ds-card-light/10 dark:bg-ds-card-dark/10"></div>
        </div>
      ))}
    </div>
  </div>
);

