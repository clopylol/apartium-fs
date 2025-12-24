import type { FC } from "react";
import { X, Edit2, Trash2, Copy, User, Mail, Calendar, Tag, FileText, CheckCircle, Clock, MessageSquare } from "lucide-react";
import type { CommunityRequest } from "@/types/community";
import { Button, IconButton } from "@/components/shared/button";
import { formatDateShort } from "@/utils/date";

interface RequestDetailModalProps {
    isOpen: boolean;
    request: CommunityRequest | null;
    onClose: () => void;
    onEdit?: (request: CommunityRequest) => void;
    onDelete: (id: string, title: string) => void;
    onDuplicate?: (request: CommunityRequest) => void;
    onConvertToSuggestion?: (id: string) => void;
    onConvertToPoll?: (request: CommunityRequest) => void;
}

const getTypeColor = (type: string): string => {
    switch (type) {
        case 'wish': return 'bg-ds-in-indigo-500/10 text-ds-in-indigo-400 border-ds-in-indigo-500/20';
        case 'suggestion': return 'bg-ds-in-violet-500/10 text-ds-in-violet-400 border-ds-in-violet-500/20';
        default: return 'bg-ds-card-light dark:bg-ds-card-dark text-ds-muted-light dark:text-ds-muted-dark';
    }
};

const getTypeLabel = (type: string): string => {
    switch (type) {
        case 'wish': return 'İstek';
        case 'suggestion': return 'Öneri';
        default: return type;
    }
};

const getStatusColor = (s: string): string => {
    switch (s) {
        case 'resolved': return 'bg-ds-in-success-500/20 text-ds-in-success-400';
        case 'in-progress': return 'bg-ds-in-warning-500/20 text-ds-in-warning-400';
        case 'pending': return 'bg-ds-card-light dark:bg-ds-card-dark text-ds-muted-light dark:text-ds-muted-dark';
        case 'rejected': return 'bg-ds-in-destructive-500/20 text-ds-in-destructive-400';
        default: return 'bg-ds-card-light dark:bg-ds-card-dark text-ds-muted-light dark:text-ds-muted-dark';
    }
};

const getStatusLabel = (s: string): string => {
    switch (s) {
        case 'resolved': return 'Çözüldü';
        case 'in-progress': return 'İşlemde';
        case 'pending': return 'Beklemede';
        case 'rejected': return 'Reddedildi';
        default: return s;
    }
};

export const RequestDetailModal: FC<RequestDetailModalProps> = ({
    isOpen,
    request,
    onClose,
    onEdit,
    onDelete,
    onDuplicate,
    onConvertToSuggestion,
    onConvertToPoll,
}) => {
    if (!isOpen || !request) return null;

    const handleDelete = (): void => {
        onDelete(request.id, request.title);
        onClose();
    };

    const handleDuplicate = (): void => {
        if (onDuplicate) {
            onDuplicate(request);
            onClose();
        }
    };

    const handleConvertToSuggestion = (): void => {
        if (onConvertToSuggestion && request.type === 'wish') {
            onConvertToSuggestion(request.id);
            onClose();
        }
    };

    const handleConvertToPoll = (): void => {
        if (onConvertToPoll && (request.type === 'suggestion' || request.type === 'wish')) {
            onConvertToPoll(request);
            onClose();
        }
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
                            {request.title}
                        </h2>
                        <p className="text-xs text-ds-muted-light dark:text-ds-muted-dark font-mono">
                            ID: {request.id}
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
                    {/* Description */}
                    <div className="bg-ds-background-light dark:bg-ds-background-dark rounded-xl p-4 border border-ds-border-light dark:border-ds-border-dark">
                        <div className="flex items-center gap-2 mb-3">
                            <FileText className="w-4 h-4 text-ds-in-sky-500" />
                            <p className="text-xs text-ds-muted-light dark:text-ds-muted-dark font-medium uppercase">
                                Açıklama
                            </p>
                        </div>
                        <p className="text-ds-primary-light dark:text-ds-primary-dark whitespace-pre-wrap leading-relaxed">
                            {request.description}
                        </p>
                    </div>

                    {/* Author Info */}
                    {(request.authorName || request.authorEmail) && (
                        <div className="bg-ds-background-light dark:bg-ds-background-dark rounded-xl p-4 border border-ds-border-light dark:border-ds-border-dark">
                            <div className="flex items-center gap-2 mb-3">
                                <User className="w-4 h-4 text-ds-in-sky-500" />
                                <p className="text-xs text-ds-muted-light dark:text-ds-muted-dark font-medium uppercase">
                                    Yazar Bilgileri
                                </p>
                            </div>
                            <div className="space-y-2">
                                {request.authorName && (
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4 text-ds-secondary-light dark:text-ds-secondary-dark" />
                                        <span className="text-ds-primary-light dark:text-ds-primary-dark font-medium">
                                            {request.authorName}
                                        </span>
                                    </div>
                                )}
                                {request.authorEmail && (
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-ds-secondary-light dark:text-ds-secondary-dark" />
                                        <span className="text-ds-secondary-light dark:text-ds-secondary-dark text-sm">
                                            {request.authorEmail}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-3 gap-4">
                        {/* Type */}
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Tag className="w-4 h-4 text-ds-in-sky-500" />
                                <p className="text-xs text-ds-muted-light dark:text-ds-muted-dark font-medium uppercase">
                                    Tip
                                </p>
                            </div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getTypeColor(request.type)}`}>
                                {getTypeLabel(request.type)}
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
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${getStatusColor(request.status)}`}>
                                {request.status === 'resolved' && <CheckCircle className="w-3 h-3" />}
                                {request.status === 'in-progress' && <Clock className="w-3 h-3" />}
                                {request.status === 'pending' && <MessageSquare className="w-3 h-3" />}
                                {getStatusLabel(request.status)}
                            </span>
                        </div>

                        {/* Request Date */}
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Calendar className="w-4 h-4 text-ds-in-sky-500" />
                                <p className="text-xs text-ds-muted-light dark:text-ds-muted-dark font-medium uppercase">
                                    Talep Tarihi
                                </p>
                            </div>
                            <p className="text-ds-primary-light dark:text-ds-primary-dark text-sm">
                                {request.requestDate ? formatDateShort(request.requestDate) : '-'}
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
                                {request.createdAt ? formatDateShort(request.createdAt) : '-'}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-ds-muted-light dark:text-ds-muted-dark font-medium uppercase mb-1">
                                Son Güncelleme
                            </p>
                            <p className="text-ds-secondary-light dark:text-ds-secondary-dark text-sm font-mono">
                                {request.updatedAt ? formatDateShort(request.updatedAt) : '-'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-ds-border-light dark:border-ds-border-dark bg-ds-background-light/50 dark:bg-ds-background-dark/50 flex gap-3 shrink-0 flex-wrap">
                    <Button
                        onClick={onClose}
                        variant="secondary"
                        className="flex-1 bg-ds-accent-light dark:bg-ds-accent-dark hover:bg-ds-muted-light dark:hover:bg-ds-muted-dark text-ds-primary-light dark:text-ds-primary-dark"
                    >
                        Kapat
                    </Button>
                    {onDuplicate && (
                        <Button
                            onClick={handleDuplicate}
                            leftIcon={<Copy className="w-4 h-4" />}
                            variant="secondary"
                            className="bg-ds-in-sky-600 hover:bg-ds-in-sky-500 text-white"
                        >
                            Kopyala
                        </Button>
                    )}
                    {onConvertToSuggestion && request.type === 'wish' && request.status !== 'resolved' && (
                        <Button
                            onClick={handleConvertToSuggestion}
                            variant="secondary"
                            className="bg-ds-in-violet-600 hover:bg-ds-in-violet-500 text-white"
                        >
                            Öneriye Çevir
                        </Button>
                    )}
                    {onConvertToPoll && (request.type === 'suggestion' || request.type === 'wish') && request.status !== 'resolved' && (
                        <Button
                            onClick={handleConvertToPoll}
                            leftIcon={<MessageSquare className="w-4 h-4" />}
                            className="bg-ds-in-indigo-600 hover:bg-ds-in-indigo-500 text-white shadow-lg shadow-ds-in-indigo-900/20"
                        >
                            Ankete Çevir
                        </Button>
                    )}
                    {onEdit && (
                        <Button
                            onClick={() => {
                                onEdit(request);
                                onClose();
                            }}
                            leftIcon={<Edit2 className="w-4 h-4" />}
                            className="bg-ds-in-warning-600 hover:bg-ds-in-warning-500 text-white shadow-lg shadow-ds-in-warning-900/20"
                        >
                            Düzenle
                        </Button>
                    )}
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

