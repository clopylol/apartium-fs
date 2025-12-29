import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckSquare, Square, ArrowUpDown } from 'lucide-react';
import type { PaymentRecord } from '@/types/payments';
import { PaymentRow } from './PaymentRow';
import { PaymentRowSkeleton } from '../../skeletons';
import { Pagination } from '@/components/shared/pagination';

interface PaymentTableProps {
    payments: PaymentRecord[];
    selectedIds: string[];
    onToggleSelect: (id: string) => void;
    onToggleSelectAll: () => void;
    onTogglePayment: (id: string, status: 'paid' | 'unpaid') => void;
    onSendReminder: (id: string) => void;
    sortOrder: 'asc' | 'desc' | null;
    onToggleSort: () => void;
    isLoading: boolean;
    selectablePaymentsCount: number;
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

export const PaymentTable: FC<PaymentTableProps> = ({
    payments,
    selectedIds,
    onToggleSelect,
    onToggleSelectAll,
    onTogglePayment,
    onSendReminder,
    sortOrder,
    onToggleSort,
    isLoading,
    selectablePaymentsCount,
    totalItems,
    itemsPerPage,
    currentPage,
    onPageChange
}) => {
    const { t } = useTranslation();

    return (
        <>
            <div className="bg-ds-card-dark border border-ds-border-dark rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-ds-background-dark/50 border-b border-ds-border-dark text-xs uppercase text-ds-muted-light font-semibold tracking-wider">
                                <th className="px-6 py-4 w-12 text-center">
                                    <button
                                        onClick={onToggleSelectAll}
                                        className={`flex items-center justify-center ${selectablePaymentsCount === 0 ? 'opacity-50 cursor-not-allowed' : 'text-ds-muted-light hover:text-ds-secondary-light'}`}
                                        disabled={selectablePaymentsCount === 0}
                                    >
                                        {selectablePaymentsCount > 0 && selectedIds.length === selectablePaymentsCount ? <CheckSquare className="w-5 h-5 text-ds-in-indigo-light" /> : <Square className="w-5 h-5" />}
                                    </button>
                                </th>
                                <th className="px-6 py-4 w-48">{t('payments.table.columns.unit')}</th>
                                <th className="px-6 py-4">{t('payments.table.columns.resident')}</th>
                                <th className="px-6 py-4">{t('payments.table.columns.paymentType')}</th>
                                <th className="px-6 py-4">{t('payments.table.columns.amount')}</th>
                                <th className="px-6 py-4 cursor-pointer hover:text-ds-secondary-light transition-colors group select-none" onClick={onToggleSort}>
                                    <div className="flex items-center gap-1">{t('payments.table.columns.status')} <ArrowUpDown className={`w-3.5 h-3.5 transition-opacity ${sortOrder ? 'opacity-100 text-ds-in-indigo-light' : 'opacity-40 group-hover:opacity-100'}`} /></div>
                                </th>
                                <th className="px-6 py-4 text-right">{t('payments.table.columns.action')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-ds-border-dark/50">
                            {isLoading ? (
                                <>
                                    <PaymentRowSkeleton />
                                    <PaymentRowSkeleton />
                                    <PaymentRowSkeleton />
                                    <PaymentRowSkeleton />
                                    <PaymentRowSkeleton />
                                </>
                            ) : (
                                <>
                                    {payments.length > 0 ? (
                                        payments.map((payment) => (
                                            <PaymentRow
                                                key={payment.id}
                                                payment={payment}
                                                isSelected={selectedIds.includes(payment.id)}
                                                onToggleSelect={() => onToggleSelect(payment.id)}
                                                onTogglePayment={() => onTogglePayment(payment.id, payment.status)}
                                                onSendReminder={() => onSendReminder(payment.id)}
                                            />
                                        ))
                                    ) : (
                                        <tr><td colSpan={7} className="px-6 py-20 text-center text-ds-muted-light"><p>{t('payments.table.noResults')}</p></td></tr>
                                    )}
                                </>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {!isLoading && (
                <Pagination
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={onPageChange}
                    infoTextKey="payments.pagination"
                />
            )}
        </>
    );
};
