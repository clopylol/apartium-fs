import { useState, useCallback } from 'react';
import type { PaymentRecord } from '@/types/payments';

export interface UsePaymentModalsReturn {
    // Dues Modal
    showDuesModal: boolean;
    openDuesModal: () => void;
    closeDuesModal: () => void;
    
    // Add Expense Modal
    showAddExpenseModal: boolean;
    openAddExpenseModal: () => void;
    closeAddExpenseModal: () => void;
    
    // Confirmation Modal
    showConfirmModal: boolean;
    pendingToggleId: string | null;
    actionType: 'pay' | 'cancel';
    targetPayment: PaymentRecord | null;
    openConfirmModal: (paymentId: string, action: 'pay' | 'cancel') => void;
    closeConfirmModal: () => void;
}

export const usePaymentModals = (payments: PaymentRecord[]): UsePaymentModalsReturn => {
    const [showDuesModal, setShowDuesModal] = useState(false);
    const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [pendingToggleId, setPendingToggleId] = useState<string | null>(null);
    const [actionType, setActionType] = useState<'pay' | 'cancel'>('pay');

    const openDuesModal = useCallback(() => {
        setShowDuesModal(true);
    }, []);

    const closeDuesModal = useCallback(() => {
        setShowDuesModal(false);
    }, []);

    const openAddExpenseModal = useCallback(() => {
        setShowAddExpenseModal(true);
    }, []);

    const closeAddExpenseModal = useCallback(() => {
        setShowAddExpenseModal(false);
    }, []);

    const openConfirmModal = useCallback((paymentId: string, action: 'pay' | 'cancel') => {
        setPendingToggleId(paymentId);
        setActionType(action);
        setShowConfirmModal(true);
    }, []);

    const closeConfirmModal = useCallback(() => {
        setShowConfirmModal(false);
        setPendingToggleId(null);
    }, []);

    const targetPayment = pendingToggleId 
        ? payments.find(p => p.id === pendingToggleId) || null
        : null;

    return {
        showDuesModal,
        openDuesModal,
        closeDuesModal,
        showAddExpenseModal,
        openAddExpenseModal,
        closeAddExpenseModal,
        showConfirmModal,
        pendingToggleId,
        actionType,
        targetPayment,
        openConfirmModal,
        closeConfirmModal,
    };
};

