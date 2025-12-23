// 1. External & React
import React from 'react';
import { useTranslation } from 'react-i18next';

// 4. Icons
import { MessageSquare } from 'lucide-react';

// 7. Types
import type { Request } from '@/types/community';

// 3. Components
import { RequestRow } from '../request-row';
import { RequestTableSkeleton } from '../request-table-skeleton';
import { Pagination } from '@/components/shared/pagination';

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
}

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
    onDelete
}) => {
    const { t } = useTranslation();

    return (
        <div className="space-y-4">
            <div className="bg-ds-card-dark border border-ds-border-dark rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-ds-border-dark bg-ds-background-dark/50 text-xs uppercase text-ds-muted-dark font-semibold tracking-wider">
                                <th className="px-6 py-4">{t('community.table.columns.subject')}</th>
                                <th className="px-6 py-4">{t('community.table.columns.type')}</th>
                                <th className="px-6 py-4">{t('community.table.columns.sender')}</th>
                                <th className="px-6 py-4">{t('community.table.columns.date')}</th>
                                <th className="px-6 py-4">{t('community.table.columns.status')}</th>
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
            {!isLoading && requests.length > 0 && (
                <Pagination
                    totalItems={filteredCount}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={onPageChange}
                    infoTextKey="community.pagination"
                />
            )}
        </div>
    );
};

