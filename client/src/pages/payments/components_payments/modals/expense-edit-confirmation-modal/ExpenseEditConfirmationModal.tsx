import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Edit } from 'lucide-react';
import type { ExpenseRecordLegacy, ExpenseRecord } from '@/types/payments';
import { ConfirmationModal } from '@/components/shared/modals';
import { EXPENSE_CATEGORIES } from '@/constants/payments';

interface ExpenseEditConfirmationModalProps {
    isOpen: boolean;
    oldExpense: ExpenseRecordLegacy;
    newExpense: Partial<ExpenseRecord>;
    onConfirm: () => void;
    onCancel: () => void;
}

export const ExpenseEditConfirmationModal: FC<ExpenseEditConfirmationModalProps> = ({ 
    isOpen, 
    oldExpense, 
    newExpense, 
    onConfirm, 
    onCancel 
}) => {
    const { t } = useTranslation();
    
    if (!isOpen || !oldExpense || !newExpense) return null;

    // Get changed fields
    const getChangedFields = (): Array<{ field: string; fieldLabel: string; oldValue: string; newValue: string }> => {
        const changes: Array<{ field: string; fieldLabel: string; oldValue: string; newValue: string }> = [];
        
        // Title
        if (newExpense.title && newExpense.title !== oldExpense.title) {
            changes.push({ 
                field: 'title', 
                fieldLabel: t('payments.modals.addExpense.labels.title'),
                oldValue: oldExpense.title, 
                newValue: newExpense.title 
            });
        }
        
        // Amount
        const oldAmount = typeof oldExpense.amount === 'string' ? parseFloat(oldExpense.amount) : (typeof oldExpense.amount === 'number' ? oldExpense.amount : 0);
        const newAmount = typeof newExpense.amount === 'string' ? parseFloat(newExpense.amount) : (typeof newExpense.amount === 'number' ? newExpense.amount : 0);
        if (newExpense.amount !== undefined && Math.abs(newAmount - oldAmount) > 0.01) {
            changes.push({ 
                field: 'amount', 
                fieldLabel: t('payments.modals.addExpense.labels.amount'),
                oldValue: `₺${oldAmount.toLocaleString('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`, 
                newValue: `₺${newAmount.toLocaleString('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}` 
            });
        }
        
        // Category
        if (newExpense.category && newExpense.category !== oldExpense.category) {
            const oldCategory = EXPENSE_CATEGORIES.find(c => c.id === oldExpense.category);
            const newCategory = EXPENSE_CATEGORIES.find(c => c.id === newExpense.category);
            changes.push({ 
                field: 'category', 
                fieldLabel: t('payments.modals.addExpense.labels.category'),
                oldValue: oldCategory ? t(`payments.categories.${oldCategory.id}`) : oldExpense.category, 
                newValue: newCategory ? t(`payments.categories.${newCategory.id}`) : newExpense.category 
            });
        }
        
        // Status
        if (newExpense.status && newExpense.status !== oldExpense.status) {
            changes.push({ 
                field: 'status', 
                fieldLabel: t('payments.modals.addExpense.labels.status'),
                oldValue: oldExpense.status === 'paid' 
                    ? t('payments.modals.addExpense.status.paid') 
                    : t('payments.modals.addExpense.status.pending'), 
                newValue: newExpense.status === 'paid' 
                    ? t('payments.modals.addExpense.status.paid') 
                    : t('payments.modals.addExpense.status.pending') 
            });
        }
        
        // Description
        const oldDesc = oldExpense.description || '';
        const newDesc = newExpense.description || '';
        if (newDesc !== oldDesc) {
            changes.push({ 
                field: 'description', 
                fieldLabel: t('payments.modals.addExpense.labels.notes'),
                oldValue: oldDesc || '-', 
                newValue: newDesc || '-' 
            });
        }
        
        return changes;
    };

    const changedFields = getChangedFields();

    const customIcon = (
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border-2 bg-ds-warning/20 border-ds-warning/40 shadow-lg shadow-ds-warning/20">
            <Edit className="w-8 h-8 text-ds-warning" />
        </div>
    );

    const customMessage = (
        <div className="space-y-4">
            <p className="text-sm text-ds-secondary-light dark:text-ds-secondary-dark">
                {t('payments.modals.editExpense.message', { defaultValue: 'Aşağıdaki değişiklikleri yapmak istediğinize emin misiniz?' })}
            </p>
            
            {changedFields.length === 0 ? (
                <p className="text-xs text-ds-muted-light dark:text-ds-muted-dark italic">
                    {t('payments.modals.editExpense.noChanges', { defaultValue: 'Değişiklik yapılmadı' })}
                </p>
            ) : (
                <div className="space-y-3">
                    {changedFields.map((change, index) => (
                        <div key={index} className="bg-ds-card-light dark:bg-ds-card-dark border border-ds-border-light dark:border-ds-border-dark rounded-lg p-3">
                            <div className="text-xs font-bold uppercase text-ds-muted-light dark:text-ds-muted-dark mb-2">
                                {change.fieldLabel}
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <span className="line-through text-ds-muted-light dark:text-ds-muted-dark opacity-60">
                                    {change.oldValue}
                                </span>
                                <span className="text-ds-warning font-bold">{'---->>'}</span>
                                <span className="font-bold text-ds-secondary-light dark:text-ds-secondary-dark">
                                    {change.newValue}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <ConfirmationModal
            isOpen={isOpen}
            onClose={onCancel}
            onConfirm={onConfirm}
            title={t('payments.modals.editExpense.title', { defaultValue: 'Gider Düzenlemeyi Onayla' })}
            message={customMessage}
            variant="warning"
            confirmText={t('payments.modals.editExpense.buttons.confirm', { defaultValue: 'Onayla' })}
            cancelText={t('payments.modals.editExpense.buttons.cancel', { defaultValue: 'İptal' })}
            icon={customIcon}
            maxWidth="md"
        />
    );
};

