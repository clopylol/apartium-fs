import type { FC } from "react";
import { X, Edit2, Trash2, Copy, User, Mail, Calendar, Tag, Eye, FileText, CheckCircle, Clock } from "lucide-react";
import type { Announcement } from "@/types/Announcement.types";
import { Button, IconButton } from "@/components/shared/button";
import { formatDateShort } from "@/utils/date";

interface AnnouncementDetailModalProps {
    isOpen: boolean;
    announcement: Announcement | null;
    onClose: () => void;
    onEdit: (announcement: Announcement) => void;
    onDelete: (id: string, title: string) => void;
    onDuplicate: (announcement: Announcement) => void;
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

const getStatusLabel = (s: string): string => {
    switch (s) {
        case 'Published': return 'Yayında';
        case 'Scheduled': return 'Planlandı';
        case 'Draft': return 'Taslak';
        default: return s;
    }
};

const getPriorityLabel = (p: string): string => {
    switch (p) {
        case 'High': return 'Yüksek';
        case 'Medium': return 'Orta';
        case 'Low': return 'Düşük';
        default: return p;
    }
};

export const AnnouncementDetailModal: FC<AnnouncementDetailModalProps> = ({
    isOpen,
    announcement,
    onClose,
    onEdit,
    onDelete,
    onDuplicate,
}) => {
    if (!isOpen || !announcement) return null;

    const handleEdit = (): void => {
        onEdit(announcement);
        onClose();
    };

    const handleDelete = (): void => {
        onDelete(announcement.id, announcement.title);
        onClose();
    };

    const handleDuplicate = (): void => {
        onDuplicate(announcement);
        onClose();
    };

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ds-background-dark/80 dark:bg-ds-background-dark/80 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="bg-ds-card-light dark:bg-ds-card-dark border border-ds-border-light dark:border-ds-border-dark rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-ds-border-light dark:border-ds-border-dark bg-ds-card-light dark:bg-ds-card-dark flex justify-between items-start shrink-0">
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-ds-primary-light dark:text-ds-primary-dark mb-2">
                            {announcement.title}
                        </h2>
                        <p className="text-xs text-ds-muted-light dark:text-ds-muted-dark font-mono">
                            ID: {announcement.id}
                        </p>
                    </div>
                    <IconButton
                        onClick={onClose}
                        icon={<X className="w-5 h-5" />}
                        ariaLabel="Close modal"
                        className="text-ds-secondary-light dark:text-ds-secondary-dark hover:text-ds-primary-light dark:hover:text-ds-primary-dark bg-ds-accent-light dark:bg-ds-accent-dark"
                    />
                </div>

                {/* Content */}
                <div className="p-6 space-y-6 overflow-y-auto flex-1">
                    {/* Content */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <FileText className="w-4 h-4 text-ds-in-sky-500" />
                            <p className="text-xs text-ds-muted-light dark:text-ds-muted-dark font-medium uppercase">
                                İçerik
                            </p>
                        </div>
                        <p className="text-ds-primary-light dark:text-ds-primary-dark whitespace-pre-wrap">
                            {announcement.content}
                        </p>
                    </div>

                    {/* Author Info */}
                    <div className="bg-ds-background-light dark:bg-ds-background-dark rounded-xl p-4 border border-ds-border-light dark:border-ds-border-dark">
                        <div className="flex items-center gap-2 mb-3">
                            <User className="w-4 h-4 text-ds-in-sky-500" />
                            <p className="text-xs text-ds-muted-light dark:text-ds-muted-dark font-medium uppercase">
                                Yazar Bilgileri
                            </p>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-ds-secondary-light dark:text-ds-secondary-dark" />
                                <span className="text-ds-primary-light dark:text-ds-primary-dark font-medium">
                                    {announcement.authorName}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-ds-secondary-light dark:text-ds-secondary-dark" />
                                <span className="text-ds-secondary-light dark:text-ds-secondary-dark text-sm">
                                    {announcement.authorEmail}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Priority */}
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Tag className="w-4 h-4 text-ds-in-sky-500" />
                                <p className="text-xs text-ds-muted-light dark:text-ds-muted-dark font-medium uppercase">
                                    Öncelik
                                </p>
                            </div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getPriorityColor(announcement.priority)}`}>
                                {getPriorityLabel(announcement.priority)}
                            </span>
                        </div>

                        {/* Status */}
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <CheckCircle className="w-4 h-4 text-ds-in-sky-500" />
                                <p className="text-xs text-ds-muted-light dark:text-ds-muted-dark font-medium uppercase">
                                    Durum
                                </p>
                            </div>
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${getStatusColor(announcement.status)}`}>
                                {announcement.status === 'Published' && <CheckCircle className="w-3 h-3" />}
                                {announcement.status === 'Scheduled' && <Clock className="w-3 h-3" />}
                                {announcement.status === 'Draft' && <Edit2 className="w-3 h-3" />}
                                {getStatusLabel(announcement.status)}
                            </span>
                        </div>

                        {/* Visibility */}
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Eye className="w-4 h-4 text-ds-in-sky-500" />
                                <p className="text-xs text-ds-muted-light dark:text-ds-muted-dark font-medium uppercase">
                                    Görünürlük
                                </p>
                            </div>
                            <p className="text-ds-primary-light dark:text-ds-primary-dark text-sm">
                                {announcement.visibility === 'All Residents' ? 'Tüm Sakinler' : announcement.visibility}
                            </p>
                        </div>

                        {/* Publish Date */}
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Calendar className="w-4 h-4 text-ds-in-sky-500" />
                                <p className="text-xs text-ds-muted-light dark:text-ds-muted-dark font-medium uppercase">
                                    Yayın Tarihi
                                </p>
                            </div>
                            <p className="text-ds-primary-light dark:text-ds-primary-dark text-sm">
                                {announcement.publishDate ? formatDateShort(announcement.publishDate) : 'Belirtilmemiş'}
                            </p>
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-ds-border-light dark:border-ds-border-dark">
                        <div>
                            <p className="text-xs text-ds-muted-light dark:text-ds-muted-dark font-medium uppercase mb-1">
                                Oluşturulma Tarihi
                            </p>
                            <p className="text-ds-secondary-light dark:text-ds-secondary-dark text-sm font-mono">
                                {announcement.createdAt ? formatDateShort(announcement.createdAt) : '-'}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-ds-muted-light dark:text-ds-muted-dark font-medium uppercase mb-1">
                                Son Güncelleme
                            </p>
                            <p className="text-ds-secondary-light dark:text-ds-secondary-dark text-sm font-mono">
                                {announcement.updatedAt ? formatDateShort(announcement.updatedAt) : '-'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-ds-border-light dark:border-ds-border-dark bg-ds-background-light/50 dark:bg-ds-background-dark/50 flex gap-3 shrink-0">
                    <Button
                        onClick={onClose}
                        variant="secondary"
                        className="flex-1 bg-ds-accent-light dark:bg-ds-accent-dark hover:bg-ds-muted-light dark:hover:bg-ds-muted-dark text-ds-primary-light dark:text-ds-primary-dark"
                    >
                        Kapat
                    </Button>
                    <Button
                        onClick={handleDuplicate}
                        leftIcon={<Copy className="w-4 h-4" />}
                        variant="secondary"
                        className="bg-ds-in-sky-600 hover:bg-ds-in-sky-500 text-white"
                    >
                        Kopyala
                    </Button>
                    <Button
                        onClick={handleEdit}
                        leftIcon={<Edit2 className="w-4 h-4" />}
                        className="bg-ds-in-warning-600 hover:bg-ds-in-warning-500 text-white shadow-lg shadow-ds-in-warning-900/20"
                    >
                        Düzenle
                    </Button>
                    <Button
                        onClick={handleDelete}
                        leftIcon={<Trash2 className="w-4 h-4" />}
                        variant="destructive"
                        className="bg-ds-in-destructive-600 hover:bg-ds-in-destructive-500 text-white shadow-lg shadow-ds-in-destructive-900/20"
                    >
                        Sil
                    </Button>
                </div>
            </div>
        </div>
    );
};

