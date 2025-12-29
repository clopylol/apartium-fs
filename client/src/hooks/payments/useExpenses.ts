import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { api } from '@/lib/api';
import { showSuccess, showError } from '@/utils/toast';
import type { ExpenseRecord, ExpenseRecordLegacy, ExpensesApiResponse, ExpenseFormData } from '@/types/payments';

// Transform DB data to legacy format for components
const transformToLegacy = (expense: ExpenseRecord): ExpenseRecordLegacy => {
    return {
        id: expense.id,
        title: expense.title,
        category: expense.category,
        amount: typeof expense.amount === 'string' ? parseFloat(expense.amount) : expense.amount,
        date: expense.expenseDate,
        status: expense.status,
        description: expense.description || undefined,
        attachment: expense.attachmentUrl || undefined,
    };
};

export interface UseExpensesReturn {
    expenses: ExpenseRecordLegacy[];
    isLoading: boolean;
    error: string | null;
    addExpense: (expense: Partial<ExpenseRecordLegacy>) => void;
    updateExpense: (id: string, expense: Partial<ExpenseRecordLegacy>) => void;
    deleteExpense: (id: string) => void;
    refetch: () => void;
    stats: {
        total: number;
        paid: number;
        pending: number;
    };
}

export const useExpenses = (
    month: string,
    year: string,
    page: number = 1,
    limit: number = 1000,
    filters?: { search?: string; category?: string; siteId?: string; buildingId?: string }
): UseExpensesReturn => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();

    // Fetch expenses with React Query using API client
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery<ExpensesApiResponse>({
        queryKey: ['expenses', month, year, page, limit, filters],
        queryFn: () => api.expenses.getByPeriod(month, parseInt(year), page, limit, filters),
        staleTime: 30000, // 30 seconds
        enabled: !!(month && year), // Only fetch when month and year are provided
    });

    // Mutation: Create expense
    const createMutation = useMutation({
        mutationFn: (data: ExpenseFormData) => api.expenses.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses', month, year] });
            showSuccess(t('payments.messages.expenseCreated') || 'Gider başarıyla oluşturuldu');
        },
        onError: (error: Error) => {
            showError(error.message || t('payments.messages.expenseCreateFailed') || 'Gider oluşturulamadı');
        },
    });

    // Mutation: Update expense
    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<ExpenseFormData> }) =>
            api.expenses.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses', month, year] });
            showSuccess(t('payments.messages.expenseUpdated') || 'Gider başarıyla güncellendi');
        },
        onError: (error: Error) => {
            showError(error.message || t('payments.messages.expenseUpdateFailed') || 'Gider güncellenemedi');
        },
    });

    // Mutation: Delete expense
    const deleteMutation = useMutation({
        mutationFn: (id: string) => api.expenses.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses', month, year] });
            showSuccess(t('payments.messages.expenseDeleted') || 'Gider başarıyla silindi');
        },
        onError: (error: Error) => {
            showError(error.message || t('payments.messages.expenseDeleteFailed') || 'Gider silinemedi');
        },
    });

    // Transform to legacy format
    const expenses = data?.expenses.map(transformToLegacy) || [];

    // Legacy methods for compatibility
    const addExpense = useCallback((newExpense: Partial<ExpenseRecordLegacy>) => {
        // Transform legacy format to API format
        const expenseData: ExpenseFormData = {
            title: newExpense.title || '',
            category: newExpense.category as any,
            amount: Number(newExpense.amount),
            expenseDate: newExpense.date || new Date().toISOString().split('T')[0],
            status: newExpense.status as any,
            description: newExpense.description,
            periodMonth: month,
            periodYear: parseInt(year),
        };

        createMutation.mutate(expenseData);
    }, [month, year, createMutation, t]);

    const updateExpense = useCallback((id: string, newExpense: Partial<ExpenseRecordLegacy>) => {
        // Transform legacy format to API format
        const expenseData: Partial<ExpenseFormData> = {};
        if (newExpense.title !== undefined) expenseData.title = newExpense.title;
        if (newExpense.category !== undefined) expenseData.category = newExpense.category as any;
        if (newExpense.amount !== undefined) expenseData.amount = Number(newExpense.amount);
        if (newExpense.date !== undefined) expenseData.expenseDate = newExpense.date;
        if (newExpense.status !== undefined) expenseData.status = newExpense.status as any;
        if (newExpense.description !== undefined) expenseData.description = newExpense.description;

        updateMutation.mutate({ id, data: expenseData });
    }, [updateMutation, t]);

    const deleteExpense = useCallback((id: string) => {
        deleteMutation.mutate(id);
    }, [deleteMutation, t]);

    return {
        expenses,
        isLoading,
        error: error ? (error as Error).message : null,
        addExpense,
        updateExpense,
        deleteExpense,
        refetch,
        stats: data?.stats || { total: 0, paid: 0, pending: 0 },
    };
};
