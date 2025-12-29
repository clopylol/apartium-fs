import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Wallet, RefreshCcw } from 'lucide-react';
import type { PaymentRecord } from '@/types/payments';
import { ConfirmationModal as SharedConfirmationModal } from '@/components/shared/modals';

interface ConfirmationModalProps {
    isOpen: boolean;
    payment: PaymentRecord | null;
    actionType: 'pay' | 'cancel';
    onConfirm: () => void;
    onCancel: () => void;
}

export const ConfirmationModal: FC<ConfirmationModalProps> = ({ isOpen, payment, actionType, onConfirm, onCancel }) => {
    const { t } = useTranslation();
    
    if (!isOpen || !payment) return null;

    const amount = `₺${payment.amount.toLocaleString()}`;

    const variant = actionType === 'pay' ? 'success' : 'danger';

    const customIcon = (
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border-2 ${
            actionType === 'pay' 
                ? 'bg-ds-in-success-500/20 border-ds-in-success-500/40 shadow-lg shadow-ds-in-success-500/20' 
                : 'bg-ds-in-destructive-500/30 border-ds-in-destructive-500/80 shadow-lg shadow-ds-in-destructive-500/40'
        }`}>
            {actionType === 'pay' ? (
                <Wallet className="w-8 h-8 text-ds-in-success-500" />
            ) : (
                <RefreshCcw className="w-8 h-8 text-ds-in-destructive-500" />
            )}
        </div>
    );

    const customMessage = (
        <>
            <strong className="text-ds-secondary-light dark:text-ds-secondary-dark font-bold">{payment.residentName}</strong> {t('payments.modals.confirmation.residentLabel')} <br />
            <div className={`inline-flex items-center justify-center px-5 py-3 rounded-xl my-3 ${
                actionType === 'pay'
                    ? 'bg-gradient-to-r from-ds-in-success-500/30 via-ds-success/30 to-ds-in-success-500/30 border-2 border-ds-in-success-500/60 shadow-lg shadow-ds-in-success-500/20'
                    : 'bg-gradient-to-r from-ds-in-destructive-500/30 via-ds-destructive/30 to-ds-in-destructive-500/30 border-2 border-ds-in-destructive-500/60 shadow-lg shadow-ds-in-destructive-500/20'
            } backdrop-blur-sm`}>
                <span className={`font-extrabold text-4xl ${
                    actionType === 'pay' ? 'text-ds-in-success-500' : 'text-ds-in-destructive-500'
                } drop-shadow-lg tracking-tight`}>
                    {amount}
                </span>
            </div>
            <br />
            {actionType === 'pay' ? t('payments.modals.confirmation.message.pay', { name: payment.residentName }) : t('payments.modals.confirmation.message.cancel', { name: payment.residentName })}
        </>
    );

    return (
        <SharedConfirmationModal
            isOpen={isOpen}
            onClose={onCancel}
            onConfirm={onConfirm}
            title={actionType === 'pay' ? t('payments.modals.confirmation.title.pay') : t('payments.modals.confirmation.title.cancel')}
            message={customMessage}
            variant={variant}
            confirmText={actionType === 'pay' ? t('payments.modals.confirmation.buttons.confirm') : t('payments.modals.confirmation.buttons.cancelPayment')}
            icon={customIcon}
            maxWidth="sm"
        />
    );
};
