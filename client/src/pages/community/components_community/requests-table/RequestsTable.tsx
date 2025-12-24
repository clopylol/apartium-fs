// 1. External & React
import React from 'react';
import { useTranslation } from 'react-i18next';

// 4. Icons
import { MessageSquare, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

// 7. Types
import type { Request } from '@/types/community';

// 3. Components
import { RequestRow } from '../request-row';
import { RequestTableSkeleton } from '../request-table-skeleton';

interface RequestsTableProps {
    requests: Request[];
    paginatedRequests: Request[];
    filteredCount: number;
    currentPage: number;
    itemsPerPage: number;
    isLoading: boolean;
    onPageChange: (page: number) => void;
    onConvertToSuggestion: (id: string) => void;
    onConvertToPoll: (req: Request) => void;
    onDelete: (id: string) => void;
    sortField?: string | null;
    sortDirection?: "asc" | "desc";
    onSort?: (field: string) => void;
    onRowClick?: (request: Request) => void;
}

// Note: Pagination is now handled in CommunityPage, not here

export const RequestsTable: React.FC<RequestsTableProps> = ({
    requests,
    paginatedRequests,
    filteredCount,
    currentPage,
    itemsPerPage,
    isLoading,
    onPageChange,
    onConvertToSuggestion,
    onConvertToPoll,
    onDelete,
    sortField = null,
    sortDirection = "asc",
    onSort,
    onRowClick,
}) => {
    const { t } = useTranslation();

    // Helper function to render sort icon
    const renderSortIcon = (field: string) => {
        if (!onSort) return null;
        if (sortField !== field) {
            return <ArrowUpDown className="w-3 h-3 ml-1 opacity-50" />;
        }
        return sortDirection === "asc" 
            ? <ArrowUp className="w-3 h-3 ml-1 text-ds-in-sky-400" />
            : <ArrowDown className="w-3 h-3 ml-1 text-ds-in-sky-400" />;
    };

    return (
        <div className="bg-ds-card-dark border border-ds-border-dark rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-ds-border-dark bg-ds-background-dark/50 text-xs uppercase text-ds-muted-dark font-semibold tracking-wider">
                            <th 
                                className={`px-6 py-4 ${onSort ? 'cursor-pointer hover:text-ds-primary-dark transition-colors select-none' : ''}`}
                                onClick={() => onSort?.('subject')}
                            >
                                <div className="flex items-center">
                                    {t('community.table.columns.subject')}
                                    {renderSortIcon('subject')}
                                </div>
                            </th>
                            <th 
                                className={`px-6 py-4 ${onSort ? 'cursor-pointer hover:text-ds-primary-dark transition-colors select-none' : ''}`}
                                onClick={() => onSort?.('type')}
                            >
                                <div className="flex items-center">
                                    {t('community.table.columns.type')}
                                    {renderSortIcon('type')}
                                </div>
                            </th>
                            <th 
                                className={`px-6 py-4 ${onSort ? 'cursor-pointer hover:text-ds-primary-dark transition-colors select-none' : ''}`}
                                onClick={() => onSort?.('sender')}
                            >
                                <div className="flex items-center">
                                    {t('community.table.columns.sender')}
                                    {renderSortIcon('sender')}
                                </div>
                            </th>
                            <th 
                                className={`px-6 py-4 ${onSort ? 'cursor-pointer hover:text-ds-primary-dark transition-colors select-none' : ''}`}
                                onClick={() => onSort?.('date')}
                            >
                                <div className="flex items-center">
                                    {t('community.table.columns.date')}
                                    {renderSortIcon('date')}
                                </div>
                            </th>
                            <th 
                                className={`px-6 py-4 ${onSort ? 'cursor-pointer hover:text-ds-primary-dark transition-colors select-none' : ''}`}
                                onClick={() => onSort?.('status')}
                            >
                                <div className="flex items-center">
                                    {t('community.table.columns.status')}
                                    {renderSortIcon('status')}
                                </div>
                            </th>
                            <th className="px-6 py-4 text-right">{t('community.table.columns.actions')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-ds-border-dark/50">
                        {isLoading ? (
                            <RequestTableSkeleton />
                        ) : paginatedRequests.length > 0 ? (
                            paginatedRequests.map(req => (
                                <RequestRow
                                    key={req.id}
                                    request={req}
                                    onConvertToSuggestion={onConvertToSuggestion}
                                    onConvertToPoll={onConvertToPoll}
                                    onDelete={onDelete}
                                    onRowClick={onRowClick}
                                />
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-ds-muted-dark">
                                    <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                    <p>{t('community.table.noRecords')}</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

