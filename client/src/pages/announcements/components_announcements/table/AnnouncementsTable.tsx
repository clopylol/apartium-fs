import type { FC } from "react";
import { Edit2, Trash2, MoreVertical, CheckCircle, Clock } from "lucide-react";

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
        case 'Scheduled': return 'bg-ds-in-sky-500/20 text-ds-in-sky-400';
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
}) => {
    return (
        <div className="bg-ds-card-light dark:bg-ds-card-dark border border-ds-border-light dark:border-ds-border-dark rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-ds-border-light dark:border-ds-border-dark bg-ds-background-light/50 dark:bg-ds-background-dark/50 text-xs uppercase text-ds-muted-light dark:text-ds-muted-dark font-semibold tracking-wider">
                            <th className="px-6 py-4 w-10">
                                <input
                                    type="checkbox"
                                    className="rounded border-ds-border-light dark:border-ds-border-dark bg-ds-background-light dark:bg-ds-background-dark text-ds-in-sky-600 focus:ring-offset-ds-background-dark accent-ds-in-sky-600"
                                />
                            </th>
                            <th className="px-6 py-4">Başlık</th>
                            <th className="px-6 py-4">Yazar</th>
                            <th className="px-6 py-4">Öncelik</th>
                            <th className="px-6 py-4">Görünürlük</th>
                            <th className="px-6 py-4">Yayın Tarihi</th>
                            <th className="px-6 py-4">Durum</th>
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
                                    announcements.map((ann) => (
                                        <tr
                                            key={ann.id}
                                            className="hover:bg-ds-background-light/30 dark:hover:bg-ds-background-dark/30 transition-colors group animate-in fade-in duration-300"
                                        >
                                            <td className="px-6 py-4">
                                                <input
                                                    type="checkbox"
                                                    className="rounded border-ds-border-light dark:border-ds-border-dark bg-ds-background-light dark:bg-ds-background-dark text-ds-in-sky-600 focus:ring-offset-ds-background-dark accent-ds-in-sky-600"
                                                />
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
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
                                                        icon={<MoreVertical className="w-4 h-4" />}
                                                        ariaLabel="More options"
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
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
