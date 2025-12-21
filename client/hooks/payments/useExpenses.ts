import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { ExpenseRecord } from '@/types/payments';

// --- Mock Data Generator ---
const generateMockExpenses = (month: string, year: string): ExpenseRecord[] => {
    return [
        { id: 'exp-1', title: 'Asansör Bakımı', category: 'maintenance', amount: 3500, date: `5 ${month} ${year}`, status: 'paid' },
        { id: 'exp-2', title: 'Ortak Elektrik', category: 'utilities', amount: 8450, date: `12 ${month} ${year}`, status: 'pending' },
        { id: 'exp-3', title: 'Güvenlik Personeli', category: 'personnel', amount: 24000, date: `1 ${month} ${year}`, status: 'paid' },
        { id: 'exp-4', title: 'Su Faturası', category: 'utilities', amount: 1200, date: `14 ${month} ${year}`, status: 'paid' },
        { id: 'exp-5', title: 'Bahçe Düzenlemesi', category: 'maintenance', amount: 1500, date: `20 ${month} ${year}`, status: 'pending' },
        { id: 'exp-6', title: 'Kırtasiye', category: 'general', amount: 450, date: `8 ${month} ${year}`, status: 'paid' },
    ];
};

export interface UseExpensesReturn {
    expenses: ExpenseRecord[];
    isLoading: boolean;
    error: string | null;
    addExpense: (expense: Partial<ExpenseRecord>) => void;
    deleteExpense: (id: string) => void;
    refetch: () => void;
}

export const useExpenses = (month: string, year: string): UseExpensesReturn => {
    const { t } = useTranslation();
    const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchExpenses = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Simulate random error (10% chance)
            if (Math.random() < 0.1) {
                throw new Error(t('payments.errorState.expenseLoadError'));
            }
            
            const data = generateMockExpenses(month, year);
            setExpenses(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : t('payments.errorState.unknownError'));
            setExpenses([]);
        } finally {
            setIsLoading(false);
        }
    }, [month, year, t]);

    useEffect(() => {
        fetchExpenses();
    }, [fetchExpenses]);

    const addExpense = useCallback((newExpense: Partial<ExpenseRecord>) => {
        const expense: ExpenseRecord = {
            id: `new-exp-${Date.now()}`,
            title: newExpense.title || '',
            category: newExpense.category as any,
            amount: Number(newExpense.amount),
            date: newExpense.date || `${new Date().getDate()} ${month} ${year}`,
            status: newExpense.status as any,
            attachment: newExpense.attachment
        };
        setExpenses(prev => [...prev, expense]);
    }, [month, year]);

    const deleteExpense = useCallback((id: string) => {
        setExpenses(prev => prev.filter(e => e.id !== id));
    }, []);

    return {
        expenses,
        isLoading,
        error,
        addExpense,
        deleteExpense,
        refetch: fetchExpenses,
    };
};

