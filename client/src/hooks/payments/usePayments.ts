import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { api } from '@/lib/api';
import { showSuccess, showError } from '@/utils/toast';
import { formatDateShort } from '@/utils/date';

// Format payment date with time for display
const formatPaymentDateTime = (dateString: string | null | undefined): string | undefined => {
    if (!dateString) return undefined;
    
    try {
        const date = new Date(dateString);
        const dateStr = date.toLocaleDateString('tr-TR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        const timeStr = date.toLocaleTimeString('tr-TR', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
        return `${dateStr} - ${timeStr}`;
    } catch {
        return formatDateShort(dateString);
    }
};
import type { PaymentRecord, PaymentRecordLegacy, PaymentsApiResponse, PaymentStatusUpdateData, BulkAmountUpdateData } from '@/types/payments';

// Transform DB data to legacy format for components
const transformToLegacy = (payment: PaymentRecord): PaymentRecordLegacy => {
    // Handle placeholder payment records (id is null)
    // For placeholder records, we need to generate a temporary ID
    // Format: "placeholder-{residentId}-{unitId}"
    const id = payment.id || `placeholder-${payment.residentId}-${payment.unitId}`;
    
    // Format unit display: "Blok Adı - Unit No" (e.g., "A Blok - 101")
    const unitDisplay = payment.buildingName 
        ? `${payment.buildingName} - ${payment.unitNumber}`
        : payment.unitNumber;
    
    return {
        id,
        unit: unitDisplay,
        residentName: payment.residentName,
        amount: typeof payment.amount === 'string' ? parseFloat(payment.amount) : payment.amount,
        status: payment.status,
        date: formatPaymentDateTime(payment.paymentDate),
        avatar: payment.residentAvatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(payment.residentName),
        type: payment.type,
        phone: payment.residentPhone,
    };
};

export interface UsePaymentsReturn {
    payments: PaymentRecordLegacy[];
    isLoading: boolean;
    error: string | null;
    selectedIds: string[];
    setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
    updatePayment: (id: string, updates: Partial<PaymentRecordLegacy>) => void;
    updatePaymentsAmount: (amount: number) => void;
    togglePaymentStatus: (id: string, status: 'paid' | 'unpaid', month: string, year: string) => void;
    refetch: () => void;
    total: number;
    stats: {
        total: number;
        collected: number;
        pending: number;
        rate: number;
    };
}

export const usePayments = (
    month: string,
    year: string,
    page: number = 1,
    limit: number = 1000,
    filters?: { search?: string; status?: 'paid' | 'unpaid'; siteId?: string; buildingId?: string }
): UsePaymentsReturn => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    // Fetch payments with React Query using API client
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery<PaymentsApiResponse>({
        queryKey: ['payments', month, year, page, limit, filters],
        queryFn: () => api.payments.getByPeriod(month, parseInt(year), page, limit, filters),
        staleTime: 30000, // 30 seconds
        enabled: !!(month && year), // Only fetch when month and year are provided
    });

    // Mutation: Update payment status
    const statusMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: PaymentStatusUpdateData }) =>
            api.payments.updateStatus(id, data.status, data.paymentDate),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['payments', month, year] });
            showSuccess(t('payments.messages.statusUpdated') || 'Ödeme durumu güncellendi');
        },
        onError: (error: Error) => {
            showError(error.message || t('payments.messages.statusUpdateFailed') || 'Ödeme durumu güncellenemedi');
        },
    });

    // Mutation: Update bulk amount
    const bulkAmountMutation = useMutation({
        mutationFn: (data: BulkAmountUpdateData) => api.payments.bulkAmountUpdate(data.month, data.year, data.amount),
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ['payments', month, year] });
            showSuccess(
                t('payments.messages.bulkAmountUpdated', { count: response.updatedCount }) ||
                `${response.updatedCount} ödeme tutarı güncellendi`
            );
        },
        onError: (error: Error) => {
            showError(error.message || t('payments.messages.bulkAmountUpdateFailed') || 'Aidat tutarları güncellenemedi');
        },
    });

    // Transform to legacy format
    const payments = data?.payments.map(transformToLegacy) || [];

    // Legacy methods for compatibility
    const updatePayment = useCallback((id: string, updates: Partial<PaymentRecordLegacy>) => {
        // This is a local update only - not persisted to DB
        // In a real scenario, you'd want to add a mutation for this
        console.warn('updatePayment is a local-only operation');
    }, []);

    const updatePaymentsAmount = useCallback((amount: number) => {
        bulkAmountMutation.mutate({
            month,
            year: parseInt(year),
            amount,
        });
    }, [month, year, bulkAmountMutation]);

    // Mutation: Create payment record (for placeholder records)
    const createPaymentMutation = useMutation({
        mutationFn: (paymentData: {
            residentId: string;
            unitId: string;
            amount: string;
            type: 'aidat' | 'demirbas' | 'yakit';
            status: 'paid' | 'unpaid';
            paymentDate?: string;
            periodMonth: string;
            periodYear: number;
        }) => api.payments.create(paymentData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['payments', month, year] });
            showSuccess(t('payments.messages.statusUpdated') || 'Ödeme durumu güncellendi');
        },
        onError: (error: Error) => {
            showError(error.message || t('payments.messages.statusUpdateFailed') || 'Ödeme durumu güncellenemedi');
        },
    });

    const togglePaymentStatus = useCallback((
        id: string,
        status: 'paid' | 'unpaid',
        _month: string,
        _year: string
    ) => {
        const paymentDate = status === 'paid' ? new Date().toISOString() : undefined;
        
        // Check if this is a placeholder payment record
        if (id.startsWith('placeholder-')) {
            // Extract residentId and unitId from placeholder ID
            const parts = id.split('-');
            if (parts.length >= 3) {
                const residentId = parts[1];
                const unitId = parts[2];
                
                // Find the original payment data to get amount and type
                const originalPayment = data?.payments.find(p => 
                    p.residentId === residentId && p.unitId === unitId
                );
                
                if (originalPayment) {
                    // Create new payment record
                    createPaymentMutation.mutate({
                        residentId: originalPayment.residentId,
                        unitId: originalPayment.unitId,
                        amount: typeof originalPayment.amount === 'string' ? originalPayment.amount : originalPayment.amount.toString(),
                        type: originalPayment.type,
                        status,
                        paymentDate,
                        periodMonth: month,
                        periodYear: parseInt(year),
                    });
                    return;
                }
            }
            showError('Placeholder payment record bilgileri bulunamadı');
            return;
        }
        
        // Regular payment record update
        statusMutation.mutate({
            id,
            data: { status, paymentDate },
        });
    }, [statusMutation, createPaymentMutation, data, month, year]);

    return {
        payments,
        isLoading,
        error: error ? (error as Error).message : null,
        selectedIds,
        setSelectedIds,
        updatePayment,
        updatePaymentsAmount,
        togglePaymentStatus,
        refetch,
        total: data?.total || 0,
        stats: data?.stats || { total: 0, collected: 0, pending: 0, rate: 0 },
    };
};
