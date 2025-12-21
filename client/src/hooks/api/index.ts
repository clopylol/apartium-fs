import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from 'react-toastify';

// ==================== PAYMENTS ====================

export function usePayments(month: string, year: number) {
    return useQuery({
        queryKey: ['payments', month, year],
        queryFn: () => api.payments.getByPeriod(month, year),
        select: (data) => data.payments,
    });
}

export function useCreatePayment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payment: any) => api.payments.create(payment),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['payments'] });
            toast.success('Ödeme kaydı oluşturuldu');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Ödeme oluşturulamadı');
        },
    });
}

export function useUpdatePaymentStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: 'paid' | 'unpaid' }) =>
            api.payments.updateStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['payments'] });
            toast.success('Ödeme durumu güncellendi');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Ödeme durumu güncellenemedi');
        },
    });
}

// ==================== EXPENSES ====================

export function useExpenses(month: string, year: number) {
    return useQuery({
        queryKey: ['expenses', month, year],
        queryFn: () => api.expenses.getByPeriod(month, year),
        select: (data) => data.expenses,
    });
}

export function useCreateExpense() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (expense: any) => api.expenses.create(expense),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses'] });
            toast.success('Gider kaydı oluşturuldu');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Gider oluşturulamadı');
        },
    });
}

export function useDeleteExpense() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => api.expenses.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses'] });
            toast.success('Gider silindi');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Gider silinemedi');
        },
    });
}

// ==================== BUILDINGS ====================

export function useBuildings() {
    return useQuery({
        queryKey: ['buildings'],
        queryFn: () => api.buildings.getAll(),
        select: (data) => data.buildings,
    });
}
