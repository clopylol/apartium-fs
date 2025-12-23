import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2 } from 'lucide-react';
import type { ExpenseRecord } from '@/types/payments';
import { ConfirmationModal } from '@/components/shared/modals';

interface ExpenseConfirmationModalProps {
    isOpen: boolean;
    expense: ExpenseRecord | null;
    onConfirm: () => void;
    onCancel: () => void;
}

export const ExpenseConfirmationModal: FC<ExpenseConfirmationModalProps> = ({ isOpen, expense, onConfirm, onCancel }) => {
    const { t } = useTranslation();
    
    if (!isOpen || !expense) return null;

    const amount = `₺${expense.amount.toLocaleString()}`;

    const customIcon = (
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border-2 bg-ds-in-destructive-500/30 border-ds-in-destructive-500/80 shadow-lg shadow-ds-in-destructive-500/40">
            <Trash2 className="w-8 h-8 text-ds-in-destructive-500" />
        </div>
    );

    const customMessage = (
        <>
            <strong className="text-ds-secondary-light dark:text-ds-secondary-dark font-bold">{expense.title}</strong> <br />
            <strong className="font-bold text-lg text-ds-in-destructive-500">{amount}</strong> <br />
            {t('payments.modals.expenseDelete.message')}
        </>
    );

    return (
        <ConfirmationModal
            isOpen={isOpen}
            onClose={onCancel}
            onConfirm={onConfirm}
            title={t('payments.modals.expenseDelete.title')}
            message={customMessage}
            variant="danger"
            confirmText={t('payments.modals.expenseDelete.buttons.delete')}
            icon={customIcon}
            maxWidth="sm"
        />
    );
};

