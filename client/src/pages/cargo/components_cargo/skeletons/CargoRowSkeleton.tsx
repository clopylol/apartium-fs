import type { FC } from "react";

export const CargoRowSkeleton: FC = () => (
  <tr className="border-b border-ds-border-light dark:border-ds-border-dark animate-pulse">
    <td className="px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-ds-muted-light dark:bg-ds-muted-dark shrink-0" />
        <div className="space-y-2">
          <div className="h-4 w-20 bg-ds-muted-light dark:bg-ds-muted-dark rounded" />
          <div className="h-3 w-32 bg-ds-muted-light dark:bg-ds-muted-dark rounded" />
        </div>
      </div>
    </td>
    <td className="px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-ds-muted-light dark:bg-ds-muted-dark shrink-0" />
        <div className="space-y-2">
          <div className="h-4 w-24 bg-ds-muted-light dark:bg-ds-muted-dark rounded" />
          <div className="h-3 w-16 bg-ds-muted-light dark:bg-ds-muted-dark rounded" />
        </div>
      </div>
    </td>
    <td className="px-6 py-4">
      <div className="space-y-2">
        <div className="h-4 w-24 bg-ds-muted-light dark:bg-ds-muted-dark rounded" />
        <div className="h-3 w-16 bg-ds-muted-light dark:bg-ds-muted-dark rounded" />
      </div>
    </td>
    <td className="px-6 py-4">
      <div className="h-6 w-20 bg-ds-muted-light dark:bg-ds-muted-dark rounded-md" />
    </td>
    <td className="px-6 py-4 text-right">
      <div className="h-8 w-8 bg-ds-muted-light dark:bg-ds-muted-dark rounded ml-auto" />
    </td>
  </tr>
);

