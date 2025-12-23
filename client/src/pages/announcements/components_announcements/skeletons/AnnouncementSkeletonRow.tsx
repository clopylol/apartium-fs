export const AnnouncementSkeletonRow = () => (
    <tr className="border-b border-ds-border-light/50 dark:border-ds-border-dark/50">
        <td className="px-6 py-4">
            <div className="w-4 h-4 bg-ds-border-light dark:bg-ds-border-dark rounded animate-pulse" />
        </td>
        <td className="px-6 py-4">
            <div className="space-y-2">
                <div className="h-4 w-48 bg-ds-border-light dark:bg-ds-border-dark rounded animate-pulse" />
                <div className="h-3 w-64 bg-ds-border-light/50 dark:bg-ds-border-dark/50 rounded animate-pulse" />
            </div>
        </td>
        <td className="px-6 py-4">
            <div className="h-6 w-20 bg-ds-border-light dark:bg-ds-border-dark rounded-full animate-pulse" />
        </td>
        <td className="px-6 py-4">
            <div className="h-4 w-32 bg-ds-border-light dark:bg-ds-border-dark rounded animate-pulse" />
        </td>
        <td className="px-6 py-4">
            <div className="h-4 w-24 bg-ds-border-light dark:bg-ds-border-dark rounded animate-pulse" />
        </td>
        <td className="px-6 py-4">
            <div className="h-7 w-24 bg-ds-border-light dark:bg-ds-border-dark rounded-md animate-pulse" />
        </td>
        <td className="px-6 py-4 text-right">
            <div className="flex justify-end gap-2">
                <div className="w-8 h-8 bg-ds-border-light dark:bg-ds-border-dark rounded-lg animate-pulse" />
                <div className="w-8 h-8 bg-ds-border-light dark:bg-ds-border-dark rounded-lg animate-pulse" />
            </div>
        </td>
    </tr>
);
