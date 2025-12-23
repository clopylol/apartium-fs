import type { FC } from 'react';

export const PaymentRowSkeleton: FC = () => (
    <tr className="border-b border-ds-border-dark animate-pulse">
        <td className="px-6 py-4 text-center"><div className="w-5 h-5 bg-ds-muted-dark rounded mx-auto" /></td>
        <td className="px-6 py-4"><div className="h-6 w-12 bg-ds-muted-dark rounded" /></td>
        <td className="px-6 py-4">
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-ds-muted-dark shrink-0" />
                <div className="space-y-2">
                    <div className="h-4 w-32 bg-ds-muted-dark rounded" />
                    <div className="h-3 w-20 bg-ds-muted-dark rounded" />
                </div>
            </div>
        </td>
        <td className="px-6 py-4"><div className="h-4 w-16 bg-ds-muted-dark rounded" /></td>
        <td className="px-6 py-4"><div className="h-5 w-20 bg-ds-muted-dark rounded" /></td>
        <td className="px-6 py-4"><div className="h-6 w-24 bg-ds-muted-dark rounded-full" /></td>
        <td className="px-6 py-4 text-right"><div className="h-8 w-8 bg-ds-muted-dark rounded ml-auto" /></td>
    </tr>
);
