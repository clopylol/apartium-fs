import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import type { ExpenseRecord, ExpenseRecordLegacy, ExpensesApiResponse, ExpenseFormData } from '@/types/payments';

// API Functions
const fetchExpenses = async (
    month: string,
    year: string,
    page: number,
    limit: number,
    filters?: { search?: string; category?: string }
): Promise<ExpensesApiResponse> => {
    const params = new URLSearchParams({
        month,
        year: year.toString(),
        page: page.toString(),
        limit: limit.toString(),
    });

    if (filters?.search && filters.search.trim().length >= 3) {
        params.append('search', filters.search.trim());
    }
    if (filters?.category) {
        params.append('category', filters.category);
    }

    const response = await fetch(`/api/expenses?${params.toString()}`, {
        credentials: 'include',
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Giderler yüklenirken hata oluştu');
    }

    return response.json();
};

const createExpense = async (data: ExpenseFormData): Promise<{ expense: ExpenseRecord }> => {
    const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Gider oluşturulamadı');
    }

    return response.json();
};

const deleteExpenseApi = async (id: string): Promise<{ message: string }> => {
    const response = await fetch(`/api/expenses/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Gider silinemedi');
    }

    return response.json();
};

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
    deleteExpense: (id: string) => void;
    refetch: () => void;
}

export const useExpenses = (month: string, year: string): UseExpensesReturn => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();

    // Fetch expenses with React Query
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ['expenses', month, year],
        queryFn: () => fetchExpenses(month, year, 1, 1000), // Get all for now (no pagination in UI yet)
        staleTime: 30000, // 30 seconds
    });

    // Mutation: Create expense
    const createMutation = useMutation({
        mutationFn: (data: ExpenseFormData) => createExpense(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses', month, year] });
        },
        onError: (error: Error) => {
            console.error('Create expense error:', error);
        },
    });

    // Mutation: Delete expense
    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteExpenseApi(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses', month, year] });
        },
        onError: (error: Error) => {
            console.error('Delete expense error:', error);
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
    }, [month, year, createMutation]);

    const deleteExpense = useCallback((id: string) => {
        deleteMutation.mutate(id);
    }, [deleteMutation]);

    return {
        expenses,
        isLoading,
        error: error ? (error as Error).message : null,
        addExpense,
        deleteExpense,
        refetch,
    };
};
