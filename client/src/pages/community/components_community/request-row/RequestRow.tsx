// 1. External & React
import React from 'react';
import { useTranslation } from 'react-i18next';

// 4. Icons
import { Trash2, RefreshCw, BarChart2 } from 'lucide-react';

// 7. Types
import type { Request } from '@/types/community';

// 3. Components
import { Button, IconButton } from '@/components/shared/button';
import { RequestStatusBadge } from '../request-status-badge';

interface RequestRowProps {
    request: Request;
    onConvertToSuggestion: (id: string) => void;
    onConvertToPoll: (req: Request) => void;
    onDelete: (id: string) => void;
    onRowClick?: (request: Request) => void;
}

export const RequestRow: React.FC<RequestRowProps> = ({
    request,
    onConvertToSuggestion,
    onConvertToPoll,
    onDelete,
    onRowClick,
}) => {
    const { t } = useTranslation();

    const handleRowClick = (e: React.MouseEvent): void => {
        // Don't trigger row click if clicking on action buttons
        const target = e.target as HTMLElement;
        if (
            target.closest('button') ||
            target.closest('[role="button"]')
        ) {
            return;
        }
        onRowClick?.(request);
    };

    const handleActionClick = (e: React.MouseEvent): void => {
        e.stopPropagation();
    };

    return (
        <tr 
            onClick={onRowClick ? handleRowClick : undefined}
            className={`hover:bg-ds-border-dark/30 transition-colors group ${onRowClick ? 'cursor-pointer' : ''}`}
        >
            <td className="px-6 py-4">
                <div className="font-medium text-ds-primary-dark">{request.title}</div>
                <div className="text-xs text-ds-muted-dark mt-1 max-w-md truncate">{request.description}</div>
            </td>
            <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${request.type === 'wish'
                    ? 'bg-ds-in-violet-500/10 text-ds-in-violet-400 border-ds-in-violet-500/20'
                    : 'bg-ds-in-sky-500/10 text-ds-in-sky-400 border-ds-in-sky-500/20'
                    }`}>
                    {request.type === 'wish' ? t('community.types.wish') : t('community.types.suggestion')}
                </span>
            </td>
            <td className="px-6 py-4">
                <div className="text-sm text-ds-secondary-dark">{request.author}</div>
                <div className="text-xs text-ds-muted-dark">{t('community.table.unit')} {request.unit}</div>
            </td>
            <td className="px-6 py-4 text-sm text-ds-muted-dark">{request.date}</td>
            <td className="px-6 py-4">
                <RequestStatusBadge status={request.status} />
            </td>
            <td className="px-6 py-4 text-right" onClick={handleActionClick}>
                <div className="flex items-center justify-end gap-2">
                    {/* Convert Wish to Suggestion */}
                    {request.type === 'wish' && request.status !== 'resolved' && (
                        <IconButton
                            onClick={() => onConvertToSuggestion(request.id)}
                            icon={<RefreshCw className="w-4 h-4" />}
                            ariaLabel={t('community.requestRow.convertToSuggestion')}
                            className="text-ds-in-violet-400 hover:bg-ds-in-violet-500/10 border border-ds-in-violet-500/20"
                        />
                    )}

                    {/* Convert to Poll */}
                    {(request.type === 'suggestion' || request.type === 'wish') && request.status !== 'resolved' && (
                        <Button
                            onClick={() => onConvertToPoll(request)}
                            size="sm"
                            leftIcon={<BarChart2 className="w-3 h-3" />}
                            className="bg-ds-in-indigo-600 hover:bg-ds-in-indigo-500 shadow-lg shadow-ds-in-indigo-900/20"
                        >
                            {t('community.requestRow.convertToPoll')}
                        </Button>
                    )}
                    <IconButton
                        onClick={() => onDelete(request.id)}
                        icon={<Trash2 className="w-4 h-4" />}
                        variant="destructive"
                        ariaLabel="Delete request"
                    />
                </div>
            </td>
        </tr>
    );
};

