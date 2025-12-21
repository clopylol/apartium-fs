import type { FC } from "react";

export const TransactionRowSkeleton: FC = () => {
    return (
        <tr className="border-b border-ds-border-dark/50 dark:border-ds-border-dark/50 animate-pulse">
            <td className="px-6 py-4">
                <div className="space-y-2">
                    <div className="h-4 w-48 bg-ds-muted-dark dark:bg-ds-muted-dark rounded" />
                    <div className="h-3 w-24 bg-ds-muted-dark dark:bg-ds-muted-dark rounded" />
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="h-6 w-24 bg-ds-muted-dark dark:bg-ds-muted-dark rounded-lg" />
            </td>
            <td className="px-6 py-4">
                <div className="h-3 w-24 bg-ds-muted-dark dark:bg-ds-muted-dark rounded" />
            </td>
            <td className="px-6 py-4 text-right">
                <div className="h-5 w-20 bg-ds-muted-dark dark:bg-ds-muted-dark rounded ml-auto" />
            </td>
            <td className="px-6 py-4 text-center">
                <div className="h-6 w-20 bg-ds-muted-dark dark:bg-ds-muted-dark rounded-full mx-auto" />
            </td>
            <td className="px-6 py-4 text-center">
                <div className="h-8 w-8 bg-ds-muted-dark dark:bg-ds-muted-dark rounded-lg mx-auto" />
            </td>
        </tr>
    );
};
