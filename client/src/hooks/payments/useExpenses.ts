import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { api } from '@/lib/api';
import { showSuccess, showError } from '@/utils/toast';
import { formatDateShort, parseDisplayDateToISO } from '@/utils/date';
import type { ExpenseRecord, ExpenseRecordLegacy, ExpensesApiResponse, ExpenseFormData } from '@/types/payments';

// Format expense date with time for display
const formatExpenseDateTime = (dateString: string | null | undefined): string => {
    if (!dateString) return '-';
    
    try {
        // expenseDate is in YYYY-MM-DD format, we need to add time if available
        // If it's a full ISO string with time, use it directly
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

// Transform DB data to legacy format for components
const transformToLegacy = (expense: ExpenseRecord): ExpenseRecordLegacy => {
    return {
        id: expense.id,
        title: expense.title,
        category: expense.category,
        amount: typeof expense.amount === 'string' ? parseFloat(expense.amount) : expense.amount,
        date: formatExpenseDateTime(expense.expenseDate),
        status: expense.status,
        description: expense.description || undefined,
        attachment: expense.attachmentUrl || undefined,
        siteId: expense.siteId || undefined,
        buildingId: expense.buildingId || undefined,
        buildingName: expense.buildingName || undefined,
        distributionType: expense.distributionType || undefined,
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
    limit: number = 100, // Max limit allowed by backend (1-100)
    filters?: { search?: string; category?: string; siteId?: string; buildingId?: string },
    activeSiteId?: string,
    activeBuildingId?: string
): UseExpensesReturn => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();

    // Normalize filter values for queryKey (undefined -> null for consistent caching)
    const normalizedFilters = {
        search: filters?.search || null,
        category: filters?.category || null,
        siteId: filters?.siteId || null,
        buildingId: filters?.buildingId || null,
    };

    // Fetch expenses with React Query using API client
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery<ExpensesApiResponse>({
        queryKey: ['expenses', month, year, page, limit, normalizedFilters.search, normalizedFilters.category, normalizedFilters.siteId, normalizedFilters.buildingId],
        queryFn: () => api.expenses.getByPeriod(month, parseInt(year), page, limit, filters),
        staleTime: 0, // Always refetch when queryKey changes
        enabled: !!(month && year), // Only fetch when month and year are provided
    });

    // Mutation: Create expense
    const createMutation = useMutation({
        mutationFn: (data: ExpenseFormData) => api.expenses.create(data),
        onSuccess: (response: any) => {
            console.log('Expense create success response:', response);
            queryClient.invalidateQueries({ queryKey: ['expenses', month, year] });

            // Response'dan expense bilgisini al (API'den dönen expense objesi)
            const expense = response?.expense || response;
            const title = expense?.title || '';
            const amount = typeof expense?.amount === 'string' 
                ? parseFloat(expense.amount) 
                : expense?.amount || 0;
            
            // Detaylı toast mesajı
            const formattedAmount = amount.toLocaleString('tr-TR', { 
                minimumFractionDigits: 0, 
                maximumFractionDigits: 0 
            });
            showSuccess(
                t('payments.messages.expenseCreatedDetailed', { 
                    title, 
                    amount: formattedAmount 
                }) || 
                `"${title}" gideri (₺${formattedAmount}) başarıyla oluşturuldu`
            );
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
    const addExpense = useCallback((newExpense: Partial<ExpenseRecordLegacy> | Partial<ExpenseRecord>) => {
        // Eğer ExpenseRecord formatındaysa (siteId ve buildingId varsa) direkt kullan
        // Değilse ExpenseRecordLegacy formatındadır, activeSiteId ve activeBuildingId'yi kullan
        const expenseData: ExpenseFormData = {
            title: newExpense.title || '',
            category: (newExpense.category as ExpenseFormData['category']) || 'utilities',
            amount: typeof newExpense.amount === 'string' ? parseFloat(newExpense.amount) : (newExpense.amount || 0),
            expenseDate: (newExpense as ExpenseRecord).expenseDate || (newExpense as ExpenseRecordLegacy).date || new Date().toISOString().split('T')[0],
            status: (newExpense.status as ExpenseFormData['status']) || 'pending',
            description: (newExpense as ExpenseRecord).description || (newExpense as ExpenseRecordLegacy).description,
            siteId: (newExpense as ExpenseRecord).siteId !== undefined 
                ? (newExpense as ExpenseRecord).siteId 
                : (activeBuildingId ? undefined : (activeSiteId || undefined)),
            buildingId: (newExpense as ExpenseRecord).buildingId !== undefined 
                ? (newExpense as ExpenseRecord).buildingId 
                : (activeBuildingId || undefined),
            periodMonth: month,
            periodYear: parseInt(year),
        };

        createMutation.mutate(expenseData);
    }, [month, year, createMutation, activeSiteId, activeBuildingId]);

    const updateExpense = useCallback((id: string, newExpense: Partial<ExpenseRecordLegacy>) => {
        // Transform legacy format to API format
        const expenseData: Partial<ExpenseFormData> = {};
        if (newExpense.title !== undefined) expenseData.title = newExpense.title;
        if (newExpense.category !== undefined) expenseData.category = newExpense.category as ExpenseFormData['category'];
        if (newExpense.amount !== undefined) expenseData.amount = Number(newExpense.amount);
        if (newExpense.date !== undefined) {
            // Convert display date (DD.MM.YYYY - HH:mm) to ISO datetime (YYYY-MM-DDTHH:mm:ss)
            expenseData.expenseDate = parseDisplayDateToISO(newExpense.date);
        }
        if (newExpense.status !== undefined) expenseData.status = newExpense.status as ExpenseFormData['status'];
        if (newExpense.description !== undefined) expenseData.description = newExpense.description;

        updateMutation.mutate({ id, data: expenseData });
    }, [updateMutation]);

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
