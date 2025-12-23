import type { FC } from "react";

export const MaintenanceRowSkeleton: FC = () => (
  <tr className="border-b border-ds-border-light dark:border-ds-border-dark animate-pulse">
    <td className="p-4">
      <div className="h-4 w-12 bg-ds-muted-light dark:bg-ds-muted-dark rounded" />
    </td>
    <td className="p-4">
      <div className="h-5 w-48 bg-ds-muted-light dark:bg-ds-muted-dark rounded" />
    </td>
    <td className="p-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-ds-muted-light dark:bg-ds-muted-dark shrink-0" />
        <div className="space-y-1">
          <div className="h-4 w-24 bg-ds-muted-light dark:bg-ds-muted-dark rounded" />
          <div className="h-3 w-16 bg-ds-muted-light dark:bg-ds-muted-dark rounded" />
        </div>
      </div>
    </td>
    <td className="p-4">
      <div className="h-4 w-20 bg-ds-muted-light dark:bg-ds-muted-dark rounded" />
    </td>
    <td className="p-4">
      <div className="h-4 w-24 bg-ds-muted-light dark:bg-ds-muted-dark rounded" />
    </td>
    <td className="p-4">
      <div className="h-6 w-20 bg-ds-muted-light dark:bg-ds-muted-dark rounded-full" />
    </td>
    <td className="p-4">
      <div className="h-6 w-20 bg-ds-muted-light dark:bg-ds-muted-dark rounded-full" />
    </td>
    <td className="p-4 text-right">
      <div className="h-8 w-8 bg-ds-muted-light dark:bg-ds-muted-dark rounded ml-auto" />
    </td>
  </tr>
);

