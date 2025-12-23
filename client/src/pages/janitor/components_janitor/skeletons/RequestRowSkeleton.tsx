import type { FC } from "react";

export const RequestRowSkeleton: FC = () => (
  <tr className="border-b border-ds-border-light/50 dark:border-ds-border-dark/50 animate-pulse">
    <td className="px-6 py-4">
      <div className="w-10 h-10 rounded-lg bg-ds-accent-light dark:bg-ds-accent-dark" />
    </td>
    <td className="px-6 py-4">
      <div className="space-y-2">
        <div className="h-4 w-32 bg-ds-accent-light dark:bg-ds-accent-dark rounded" />
        <div className="h-3 w-20 bg-ds-accent-light dark:bg-ds-accent-dark rounded" />
      </div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 w-24 bg-ds-accent-light dark:bg-ds-accent-dark rounded" />
    </td>
    <td className="px-6 py-4">
      <div className="h-4 w-20 bg-ds-accent-light dark:bg-ds-accent-dark rounded" />
    </td>
    <td className="px-6 py-4">
      <div className="h-6 w-16 bg-ds-accent-light dark:bg-ds-accent-dark rounded-full" />
    </td>
    <td className="px-6 py-4">
      <div className="h-8 w-8 bg-ds-accent-light dark:bg-ds-accent-dark rounded ml-auto" />
    </td>
  </tr>
);


