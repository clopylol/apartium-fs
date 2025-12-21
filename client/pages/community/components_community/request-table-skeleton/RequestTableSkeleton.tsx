import React from 'react';

export const RequestTableSkeleton: React.FC = () => (
    <>
        {[1, 2, 3, 4, 5].map((i) => (
            <tr key={i} className="border-b border-ds-border-dark/50 animate-pulse">
                <td className="px-6 py-4">
                    <div className="space-y-2">
                        <div className="h-5 w-32 bg-ds-border-dark rounded" />
                        <div className="h-3 w-48 bg-ds-border-dark rounded" />
                    </div>
                </td>
                <td className="px-6 py-4">
                    <div className="h-6 w-16 bg-ds-border-dark rounded-md" />
                </td>
                <td className="px-6 py-4">
                    <div className="space-y-2">
                        <div className="h-4 w-24 bg-ds-border-dark rounded" />
                        <div className="h-3 w-16 bg-ds-border-dark rounded" />
                    </div>
                </td>
                <td className="px-6 py-4">
                    <div className="h-4 w-20 bg-ds-border-dark rounded" />
                </td>
                <td className="px-6 py-4">
                    <div className="h-6 w-20 bg-ds-border-dark rounded-md" />
                </td>
                <td className="px-6 py-4 text-right">
                    <div className="h-8 w-24 bg-ds-border-dark rounded-lg ml-auto" />
                </td>
            </tr>
        ))}
    </>
);

