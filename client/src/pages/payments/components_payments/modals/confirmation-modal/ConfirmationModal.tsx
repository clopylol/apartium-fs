import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Wallet, RefreshCcw, Bell } from 'lucide-react';
import type { PaymentRecord } from '@/types/payments';
import { ConfirmationModal as SharedConfirmationModal } from '@/components/shared/modals';

interface ConfirmationModalProps {
    isOpen: boolean;
    payment: PaymentRecord | null;
    actionType: 'pay' | 'cancel' | 'reminder' | 'bulkReminder';
    onConfirm: () => void;
    onCancel: () => void;
    bulkCount?: number; // For bulk reminder
}

export const ConfirmationModal: FC<ConfirmationModalProps> = ({ isOpen, payment, actionType, onConfirm, onCancel, bulkCount }) => {
    const { t } = useTranslation();
    
    if (!isOpen) return null;
    
    // For bulk reminder, payment can be null
    if (actionType !== 'bulkReminder' && !payment) return null;

    const amountValue = payment && typeof payment.amount === 'string' ? parseFloat(payment.amount) : (payment?.amount || 0);
    const amount = `₺${amountValue.toLocaleString()}`;

    const variant = actionType === 'pay' ? 'success' : actionType === 'reminder' || actionType === 'bulkReminder' ? 'warning' : 'danger';

    const customIcon = (
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border-2 ${
            actionType === 'pay' 
                ? 'bg-ds-in-success-500/20 border-ds-in-success-500/40 shadow-lg shadow-ds-in-success-500/20' 
                : actionType === 'reminder' || actionType === 'bulkReminder'
                ? 'bg-ds-warning/20 border-ds-warning/40 shadow-lg shadow-ds-warning/20'
                : 'bg-ds-in-destructive-500/30 border-ds-in-destructive-500/80 shadow-lg shadow-ds-in-destructive-500/40'
        }`}>
            {actionType === 'pay' ? (
                <Wallet className="w-8 h-8 text-ds-in-success-500" />
            ) : actionType === 'reminder' || actionType === 'bulkReminder' ? (
                <Bell className="w-8 h-8 text-ds-warning" />
            ) : (
                <RefreshCcw className="w-8 h-8 text-ds-in-destructive-500" />
            )}
        </div>
    );

    const customMessage = (
        <>
            {actionType === 'bulkReminder' ? (
                <>
                    <div className="inline-flex items-center justify-center px-5 py-3 rounded-xl my-3 bg-gradient-to-r from-ds-warning/30 via-ds-warning/30 to-ds-warning/30 border-2 border-ds-warning/60 shadow-lg shadow-ds-warning/20 backdrop-blur-sm">
                        <span className="font-extrabold text-4xl text-ds-warning drop-shadow-lg tracking-tight">
                            {bulkCount || 0}
                        </span>
                    </div>
                    <br />
                    {t('payments.modals.confirmation.message.bulkReminder', { count: bulkCount || 0 })}
                </>
            ) : (
                <>
                    <strong className="text-ds-secondary-light dark:text-ds-secondary-dark font-bold">{payment?.residentName}</strong> {t('payments.modals.confirmation.residentLabel')} <br />
                    {actionType !== 'reminder' && (
                        <>
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
                        </>
                    )}
                    {actionType === 'pay' 
                        ? t('payments.modals.confirmation.message.pay', { name: payment?.residentName || '' }) 
                        : actionType === 'reminder'
                        ? t('payments.modals.confirmation.message.reminder', { name: payment?.residentName || '' })
                        : t('payments.modals.confirmation.message.cancel', { name: payment?.residentName || '' })
                    }
                </>
            )}
        </>
    );

    return (
        <SharedConfirmationModal
            isOpen={isOpen}
            onClose={onCancel}
            onConfirm={onConfirm}
            title={
                actionType === 'pay' 
                    ? t('payments.modals.confirmation.title.pay') 
                    : actionType === 'reminder'
                    ? t('payments.modals.confirmation.title.reminder')
                    : actionType === 'bulkReminder'
                    ? t('payments.modals.confirmation.title.bulkReminder')
                    : t('payments.modals.confirmation.title.cancel')
            }
            message={customMessage}
            variant={variant}
            confirmText={
                actionType === 'pay' 
                    ? t('payments.modals.confirmation.buttons.confirm') 
                    : actionType === 'reminder'
                    ? t('payments.modals.confirmation.buttons.sendReminder')
                    : actionType === 'bulkReminder'
                    ? t('payments.modals.confirmation.buttons.sendBulkReminder')
                    : t('payments.modals.confirmation.buttons.cancelPayment')
            }
            icon={customIcon}
            maxWidth="sm"
        />
    );
};
