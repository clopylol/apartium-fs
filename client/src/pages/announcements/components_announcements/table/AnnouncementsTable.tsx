import type { FC } from "react";
import { Edit2, Trash2, MoreVertical, CheckCircle, Clock, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

import type { Announcement } from "@/types/Announcement.types";
import { IconButton } from "@/components/shared/button";
import { AnnouncementSkeletonRow } from "../skeletons";
import { AnnouncementsEmptyState, NoResultsEmptyState } from "../empty-state";
import { formatDateShort } from "@/utils/date";

interface AnnouncementsTableProps {
    announcements: Announcement[];
    isLoading: boolean;
    onEdit: (announcement: Announcement) => void;
    onDelete: (id: string, title: string) => void;
    onAddNew: () => void;
    totalAnnouncements: number;
    onClearFilters: () => void;
    sortField: string | null;
    sortDirection: "asc" | "desc";
    onSort: (field: string) => void;
    selectedIds?: string[];
    onToggleSelect?: (id: string) => void;
    onToggleSelectAll?: () => void;
    onRowClick?: (announcement: Announcement) => void;
}

const getPriorityColor = (p: string): string => {
    switch (p) {
        case 'High': return 'bg-ds-in-destructive-500/10 text-ds-in-destructive-400 border-ds-in-destructive-500/20';
        case 'Medium': return 'bg-ds-in-warning-500/10 text-ds-in-warning-400 border-ds-in-warning-500/20';
        case 'Low': return 'bg-ds-in-success-500/10 text-ds-in-success-400 border-ds-in-success-500/20';
        default: return 'bg-ds-card-light dark:bg-ds-card-dark text-ds-muted-light dark:text-ds-muted-dark';
    }
};

const getStatusColor = (s: string): string => {
    switch (s) {
        case 'Published': return 'bg-ds-in-success-500/20 text-ds-in-success-400';
        case 'Scheduled': return 'bg-ds-in-violet-500/20 text-ds-in-violet-400';
        case 'Draft': return 'bg-ds-card-light dark:bg-ds-card-dark text-ds-muted-light dark:text-ds-muted-dark';
        default: return 'bg-ds-card-light dark:bg-ds-card-dark text-ds-muted-light dark:text-ds-muted-dark';
    }
};

export const AnnouncementsTable: FC<AnnouncementsTableProps> = ({
    announcements,
    isLoading,
    onEdit,
    onDelete,
    onAddNew,
    totalAnnouncements,
    onClearFilters,
    sortField,
    sortDirection,
    onSort,
    selectedIds = [],
    onToggleSelect,
    onToggleSelectAll,
    onRowClick,
}) => {
    // Helper function to render sort icon
    const renderSortIcon = (field: string) => {
        if (sortField !== field) {
            return <ArrowUpDown className="w-3 h-3 ml-1 opacity-50" />;
        }
        return sortDirection === "asc" 
            ? <ArrowUp className="w-3 h-3 ml-1 text-ds-in-sky-400" />
            : <ArrowDown className="w-3 h-3 ml-1 text-ds-in-sky-400" />;
    };

    const isAllSelected = announcements.length > 0 && selectedIds.length === announcements.length;
    const isIndeterminate = selectedIds.length > 0 && selectedIds.length < announcements.length;

    const handleRowClick = (announcement: Announcement, e: React.MouseEvent): void => {
        // Don't trigger row click if clicking on checkbox or action buttons
        const target = e.target as HTMLElement;
        if (
            target.closest('input[type="checkbox"]') ||
            target.closest('button') ||
            target.closest('[role="button"]')
        ) {
            return;
        }
        onRowClick?.(announcement);
    };

    const handleActionClick = (e: React.MouseEvent): void => {
        e.stopPropagation();
    };
    return (
        <div className="bg-ds-card-light dark:bg-ds-card-dark border border-ds-border-light dark:border-ds-border-dark rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-ds-border-light dark:border-ds-border-dark bg-ds-background-light/50 dark:bg-ds-background-dark/50 text-xs uppercase text-ds-muted-light dark:text-ds-muted-dark font-semibold tracking-wider">
                            <th className="px-6 py-4 w-10">
                                {onToggleSelectAll && (
                                    <input
                                        type="checkbox"
                                        checked={isAllSelected}
                                        ref={(input) => {
                                            if (input) input.indeterminate = isIndeterminate;
                                        }}
                                        onChange={onToggleSelectAll}
                                        className="rounded border-ds-border-light dark:border-ds-border-dark bg-ds-background-light dark:bg-ds-background-dark text-ds-in-sky-600 focus:ring-offset-ds-background-dark accent-ds-in-sky-600"
                                    />
                                )}
                            </th>
                            <th className="px-6 py-4">Başlık</th>
                            <th 
                                className="px-6 py-4 cursor-pointer hover:text-ds-primary-light dark:hover:text-ds-primary-dark transition-colors select-none"
                                onClick={() => onSort("author")}
                            >
                                <div className="flex items-center">
                                    Yazar
                                    {renderSortIcon("author")}
                                </div>
                            </th>
                            <th 
                                className="px-6 py-4 cursor-pointer hover:text-ds-primary-light dark:hover:text-ds-primary-dark transition-colors select-none"
                                onClick={() => onSort("priority")}
                            >
                                <div className="flex items-center">
                                    Öncelik
                                    {renderSortIcon("priority")}
                                </div>
                            </th>
                            <th 
                                className="px-6 py-4 cursor-pointer hover:text-ds-primary-light dark:hover:text-ds-primary-dark transition-colors select-none"
                                onClick={() => onSort("visibility")}
                            >
                                <div className="flex items-center">
                                    Görünürlük
                                    {renderSortIcon("visibility")}
                                </div>
                            </th>
                            <th 
                                className="px-6 py-4 cursor-pointer hover:text-ds-primary-light dark:hover:text-ds-primary-dark transition-colors select-none"
                                onClick={() => onSort("publishDate")}
                            >
                                <div className="flex items-center">
                                    Yayın Tarihi
                                    {renderSortIcon("publishDate")}
                                </div>
                            </th>
                            <th 
                                className="px-6 py-4 cursor-pointer hover:text-ds-primary-light dark:hover:text-ds-primary-dark transition-colors select-none"
                                onClick={() => onSort("status")}
                            >
                                <div className="flex items-center">
                                    Durum
                                    {renderSortIcon("status")}
                                </div>
                            </th>
                            <th className="px-6 py-4 text-right">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-ds-border-light/50 dark:divide-ds-border-dark/50">
                        {isLoading ? (
                            <>
                                <AnnouncementSkeletonRow />
                                <AnnouncementSkeletonRow />
                                <AnnouncementSkeletonRow />
                                <AnnouncementSkeletonRow />
                                <AnnouncementSkeletonRow />
                            </>
                        ) : (
                            <>
                                {announcements.length > 0 ? (
                                    announcements.map((ann) => {
                                        const isSelected = selectedIds.includes(ann.id);
                                        return (
                                        <tr
                                            key={ann.id}
                                            onClick={(e) => handleRowClick(ann, e)}
                                            className={`hover:bg-ds-background-light/30 dark:hover:bg-ds-background-dark/30 transition-colors group animate-in fade-in duration-300 cursor-pointer ${
                                                isSelected ? 'bg-ds-in-sky-500/10 dark:bg-ds-in-sky-500/10' : ''
                                            }`}
                                        >
                                            <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                                {onToggleSelect && (
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => onToggleSelect(ann.id)}
                                                        className="rounded border-ds-border-light dark:border-ds-border-dark bg-ds-background-light dark:bg-ds-background-dark text-ds-in-sky-600 focus:ring-offset-ds-background-dark accent-ds-in-sky-600"
                                                    />
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-ds-primary-light dark:text-ds-primary-dark">{ann.title}</div>
                                                <div className="text-xs text-ds-muted-light dark:text-ds-muted-dark mt-1 line-clamp-1 max-w-xs">{ann.content}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-ds-primary-light dark:text-ds-primary-dark font-medium">
                                                    {ann.authorName}
                                                </div>
                                                <div className="text-xs text-ds-muted-light dark:text-ds-muted-dark">
                                                    {ann.authorEmail}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getPriorityColor(ann.priority)}`}>
                                                    {ann.priority === 'High' ? 'Yüksek' : ann.priority === 'Medium' ? 'Orta' : 'Düşük'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-ds-muted-light dark:text-ds-muted-dark">
                                                {ann.visibility === 'All Residents' ? 'Tüm Sakinler' : ann.visibility}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-ds-muted-light dark:text-ds-muted-dark">
                                                {formatDateShort(ann.publishDate)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${getStatusColor(ann.status)}`}>
                                                    {ann.status === 'Published' && <CheckCircle className="w-3 h-3" />}
                                                    {ann.status === 'Scheduled' && <Clock className="w-3 h-3" />}
                                                    {ann.status === 'Draft' && <Edit2 className="w-3 h-3" />}
                                                    {ann.status === 'Published' ? 'Yayında' : ann.status === 'Scheduled' ? 'Planlandı' : 'Taslak'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right" onClick={handleActionClick}>
                                                <div className="flex items-center justify-end gap-2">
                                                    <IconButton
                                                        onClick={() => onEdit(ann)}
                                                        icon={<Edit2 className="w-4 h-4" />}
                                                        ariaLabel="Edit announcement"
                                                    />
                                                    <IconButton
                                                        onClick={() => onDelete(ann.id, ann.title)}
                                                        icon={<Trash2 className="w-4 h-4" />}
                                                        variant="destructive"
                                                        ariaLabel="Delete announcement"
                                                    />
                                                    <IconButton
                                                        onClick={() => onRowClick?.(ann)}
                                                        icon={<MoreVertical className="w-4 h-4" />}
                                                        ariaLabel="View details"
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-20 text-center text-ds-muted-light dark:text-ds-muted-dark">
                                            {totalAnnouncements === 0 ? (
                                                <AnnouncementsEmptyState onAddNew={onAddNew} />
                                            ) : (
                                                <NoResultsEmptyState onClearFilters={onClearFilters} />
                                            )}
                                        </td>
                                    </tr>
                                )}
                            </>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
