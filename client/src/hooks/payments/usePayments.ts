import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import type { PaymentRecord, PaymentRecordLegacy, PaymentsApiResponse, PaymentStatusUpdateData, BulkAmountUpdateData } from '@/types/payments';

// API Functions
const fetchPayments = async (
    month: string,
    year: string,
    page: number,
    limit: number,
    filters?: { search?: string; status?: 'paid' | 'unpaid' }
): Promise<PaymentsApiResponse> => {
    const params = new URLSearchParams({
        month,
        year: year.toString(),
        page: page.toString(),
        limit: limit.toString(),
    });

    if (filters?.search && filters.search.trim().length >= 3) {
        params.append('search', filters.search.trim());
    }
    if (filters?.status) {
        params.append('status', filters.status);
    }

    const response = await fetch(`/api/payments?${params.toString()}`, {
        credentials: 'include',
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Ödemeler yüklenirken hata oluştu');
    }

    return response.json();
};

const updatePaymentStatus = async (
    id: string,
    data: PaymentStatusUpdateData
): Promise<{ payment: PaymentRecord }> => {
    const response = await fetch(`/api/payments/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Ödeme durumu güncellenemedi');
    }

    return response.json();
};

const updateBulkAmount = async (
    data: BulkAmountUpdateData
): Promise<{ message: string; updatedCount: number }> => {
    const response = await fetch('/api/payments/bulk-amount', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Aidat tutarları güncellenemedi');
    }

    return response.json();
};

// Transform DB data to legacy format for components
const transformToLegacy = (payment: PaymentRecord): PaymentRecordLegacy => {
    return {
        id: payment.id,
        unit: payment.unitNumber,
        residentName: payment.residentName,
        amount: typeof payment.amount === 'string' ? parseFloat(payment.amount) : payment.amount,
        status: payment.status,
        date: payment.paymentDate || undefined,
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
}

export const usePayments = (month: string, year: string): UsePaymentsReturn => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    // Fetch payments with React Query
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ['payments', month, year],
        queryFn: () => fetchPayments(month, year, 1, 1000), // Get all for now (no pagination in UI yet)
        staleTime: 30000, // 30 seconds
    });

    // Mutation: Update payment status
    const statusMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: PaymentStatusUpdateData }) =>
            updatePaymentStatus(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['payments', month, year] });
        },
    });

    // Mutation: Update bulk amount
    const bulkAmountMutation = useMutation({
        mutationFn: (data: BulkAmountUpdateData) => updateBulkAmount(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['payments', month, year] });
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

    const togglePaymentStatus = useCallback((
        id: string,
        status: 'paid' | 'unpaid',
        _month: string,
        _year: string
    ) => {
        const paymentDate = status === 'paid' ? new Date().toISOString() : undefined;
        statusMutation.mutate({
            id,
            data: { status, paymentDate },
        });
    }, [statusMutation]);

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
    };
};
