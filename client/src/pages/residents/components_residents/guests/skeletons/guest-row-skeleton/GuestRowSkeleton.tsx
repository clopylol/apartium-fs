export function GuestRowSkeleton() {
    return (
        <tr className="border-b border-ds-border-light/50 dark:border-ds-border-dark/50">
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-ds-muted-light dark:bg-ds-muted-dark rounded-lg animate-pulse" />
                    <div className="space-y-2">
                        <div className="h-4 w-32 bg-ds-muted-light dark:bg-ds-muted-dark rounded animate-pulse" />
                        <div className="h-3 w-20 bg-ds-muted-light dark:bg-ds-muted-dark rounded animate-pulse" />
                    </div>
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="space-y-2">
                    <div className="h-4 w-24 bg-ds-muted-light dark:bg-ds-muted-dark rounded animate-pulse" />
                    <div className="h-3 w-32 bg-ds-muted-light dark:bg-ds-muted-dark rounded animate-pulse" />
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="h-4 w-24 bg-ds-muted-light dark:bg-ds-muted-dark rounded animate-pulse" />
            </td>
            <td className="px-6 py-4">
                <div className="h-6 w-20 bg-ds-muted-light dark:bg-ds-muted-dark rounded-full animate-pulse" />
            </td>
            <td className="px-6 py-4 text-right">
                <div className="h-8 w-8 bg-ds-muted-light dark:bg-ds-muted-dark rounded ml-auto animate-pulse" />
            </td>
        </tr>
    );
}
