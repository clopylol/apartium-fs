import { useEffect, useState } from 'react';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Building2, Hash } from 'lucide-react';
import { api } from '@/lib/api';
import type { ExpenseAllocation, ExpenseRecordLegacy } from '@/types/payments';
import { FormModal } from '@/components/shared/modals';

interface ExpenseDetailModalProps {
    isOpen: boolean;
    expense: ExpenseRecordLegacy | null;
    onClose: () => void;
}

export const ExpenseDetailModal: FC<ExpenseDetailModalProps> = ({
    isOpen,
    expense,
    onClose,
}) => {
    const { t } = useTranslation();
    const [allocations, setAllocations] = useState<ExpenseAllocation[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && expense?.id) {
            setIsLoading(true);
            setError(null);
            api.expenses.getAllocations(expense.id)
                .then((response: any) => {
                    setAllocations(response?.allocations || []);
                })
                .catch((err: Error) => {
                    setError(err.message || 'Dağıtımlar yüklenemedi');
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else {
            setAllocations([]);
        }
    }, [isOpen, expense?.id]);

    if (!expense) return null;

    const totalAllocated = allocations.reduce((sum, alloc) => {
        const amount = typeof alloc.allocatedAmount === 'string' 
            ? parseFloat(alloc.allocatedAmount) 
            : alloc.allocatedAmount;
        return sum + amount;
    }, 0);

    const expenseAmount = typeof expense.amount === 'string' 
        ? parseFloat(expense.amount) 
        : expense.amount;

    const isValid = Math.abs(totalAllocated - expenseAmount) < 0.01;

    return (
        <FormModal
            isOpen={isOpen}
            onClose={onClose}
            title={t('payments.modals.expenseDetail.title', { defaultValue: 'Gider Dağıtım Detayları' })}
            titleIcon={<Building2 />}
            maxWidth="lg"
        >
            <div className="space-y-6">
                {/* Expense Info */}
                <div className="bg-ds-card-light dark:bg-ds-card-dark border border-ds-border-light dark:border-ds-border-dark rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-lg text-ds-secondary-light dark:text-ds-secondary-dark">
                            {expense.title}
                        </h3>
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                            expense.status === 'paid'
                                ? 'bg-ds-in-success-500/20 text-ds-in-success-500'
                                : 'bg-ds-in-warning-500/20 text-ds-in-warning-500'
                        }`}>
                            {expense.status === 'paid' 
                                ? t('payments.modals.addExpense.status.paid', { defaultValue: 'Ödendi' })
                                : t('payments.modals.addExpense.status.pending', { defaultValue: 'Beklemede' })
                            }
                        </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-ds-muted-light dark:text-ds-muted-dark">
                        <span className="font-semibold text-ds-secondary-light dark:text-ds-secondary-dark">
                            {t('payments.modals.expenseDetail.totalAmount', { defaultValue: 'Toplam Tutar' })}:
                        </span>
                        <span className="font-bold text-lg text-ds-primary-light dark:text-ds-primary-dark">
                            ₺{expenseAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                    </div>
                </div>

                {/* Allocations List */}
                {isLoading ? (
                    <div className="text-center py-8 text-ds-muted-light dark:text-ds-muted-dark">
                        {t('payments.modals.expenseDetail.loading', { defaultValue: 'Yükleniyor...' })}
                    </div>
                ) : error ? (
                    <div className="text-center py-8 text-ds-destructive-light dark:text-ds-destructive-dark">
                        {error}
                    </div>
                ) : allocations.length === 0 ? (
                    <div className="text-center py-8 text-ds-muted-light dark:text-ds-muted-dark">
                        {t('payments.modals.expenseDetail.noAllocations', { defaultValue: 'Bu gider için dağıtım yapılmamış' })}
                    </div>
                ) : (
                    <>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {allocations.map((allocation) => {
                                const amount = typeof allocation.allocatedAmount === 'string'
                                    ? parseFloat(allocation.allocatedAmount)
                                    : allocation.allocatedAmount;
                                
                                return (
                                    <div
                                        key={allocation.id}
                                        className="bg-ds-card-light dark:bg-ds-card-dark border border-ds-border-light dark:border-ds-border-dark rounded-lg p-4 flex items-center justify-between hover:bg-ds-muted-dark/10 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-ds-muted-dark/20 flex items-center justify-center">
                                                <Hash className="w-5 h-5 text-ds-muted-light dark:text-ds-muted-dark" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-ds-secondary-light dark:text-ds-secondary-dark">
                                                    {allocation.buildingName && (
                                                        <span className="text-ds-muted-light dark:text-ds-muted-dark">
                                                            {allocation.buildingName} -{' '}
                                                        </span>
                                                    )}
                                                    {allocation.unitNumber || t('payments.modals.expenseDetail.unknownUnit', { defaultValue: 'Bilinmeyen Daire' })}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="font-bold text-ds-primary-light dark:text-ds-primary-dark">
                                            ₺{amount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Summary */}
                        <div className="bg-ds-card-light dark:bg-ds-card-dark border border-ds-border-light dark:border-ds-border-dark rounded-xl p-4">
                            <div className="flex items-center justify-between">
                                <span className="font-semibold text-ds-secondary-light dark:text-ds-secondary-dark">
                                    {t('payments.modals.expenseDetail.totalAllocated', { defaultValue: 'Toplam Dağıtılan' })}:
                                </span>
                                <div className="flex items-center gap-3">
                                    <span className={`font-bold text-lg ${
                                        isValid
                                            ? 'text-ds-in-success-500'
                                            : 'text-ds-destructive-light dark:text-ds-destructive-dark'
                                    }`}>
                                        ₺{totalAllocated.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                    {!isValid && (
                                        <span className="text-xs text-ds-destructive-light dark:text-ds-destructive-dark">
                                            ({t('payments.modals.expenseDetail.mismatch', { defaultValue: 'Eşleşmiyor' })})
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="mt-2 text-xs text-ds-muted-light dark:text-ds-muted-dark">
                                {t('payments.modals.expenseDetail.allocationCount', { 
                                    defaultValue: '{{count}} daireye dağıtıldı',
                                    count: allocations.length 
                                })}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </FormModal>
    );
};

