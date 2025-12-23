import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { PaymentRecord } from '@/types/payments';
import { MONTHS } from '@/constants/payments';

// --- Mock Data Generator ---
const generateMockData = (month: string, year: string): PaymentRecord[] => {
    const baseResidents = [
        { unit: 'A-1', name: 'Ahmet Yılmaz', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=64&h=64' },
        { unit: 'A-2', name: 'Mehmet Demir', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=64&h=64' },
        { unit: 'A-3', name: 'Ayşe Kaya', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&h=64' },
        { unit: 'A-4', name: 'Fatma Çelik', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=64&h=64' },
        { unit: 'B-1', name: 'Caner Erkin', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&h=64' },
        { unit: 'B-2', name: 'Zeynep Su', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=64&h=64' },
        { unit: 'B-3', name: 'Ali Veli', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=64&h=64' },
        { unit: 'C-1', name: 'Selin Yılmaz', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64' },
    ];

    const generatedResidents = Array.from({ length: 42 }, (_, i) => ({
        unit: `${['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)]}-${Math.floor(Math.random() * 15) + 1}`,
        name: `Sakin ${i + 9}`,
        avatar: `https://ui-avatars.com/api/?name=Sakin+${i + 9}&background=random&color=fff`
    }));

    const allResidents = [...baseResidents, ...generatedResidents];

    return allResidents.map((res, index) => {
        const isPaid = Math.random() > 0.4;
        const day = Math.floor(Math.random() * 28) + 1;
        const hour = String(Math.floor(Math.random() * 14) + 8).padStart(2, '0');
        const minute = String(Math.floor(Math.random() * 60)).padStart(2, '0');
        const dateStr = `${day} ${month} ${year} ${hour}:${minute}`;

        return {
            id: `pay-${index}-${month}-${year}`,
            unit: res.unit,
            residentName: res.name,
            avatar: res.avatar,
            amount: 1250,
            type: 'aidat',
            status: isPaid ? 'paid' : 'unpaid',
            date: isPaid ? dateStr : undefined,
            phone: `05${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 90) + 10}`
        };
    });
};

export interface UsePaymentsReturn {
    payments: PaymentRecord[];
    isLoading: boolean;
    error: string | null;
    selectedIds: string[];
    setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
    updatePayment: (id: string, updates: Partial<PaymentRecord>) => void;
    updatePaymentsAmount: (amount: number) => void;
    togglePaymentStatus: (id: string, status: 'paid' | 'unpaid', month: string, year: string) => void;
    refetch: () => void;
}

export const usePayments = (month: string, year: string): UsePaymentsReturn => {
    const { t } = useTranslation();
    const [payments, setPayments] = useState<PaymentRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const fetchPayments = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Simulate random error (10% chance)
            if (Math.random() < 0.1) {
                throw new Error(t('payments.errorState.loadError'));
            }
            
            const hasData = Math.random() > 0.2;
            const data = hasData ? generateMockData(month, year) : [];
            setPayments(data);
            setSelectedIds([]);
        } catch (err) {
            setError(err instanceof Error ? err.message : t('payments.errorState.unknownError'));
            setPayments([]);
        } finally {
            setIsLoading(false);
        }
    }, [month, year, t]);

    useEffect(() => {
        fetchPayments();
    }, [fetchPayments]);

    const updatePayment = useCallback((id: string, updates: Partial<PaymentRecord>) => {
        setPayments(prev => prev.map(p => 
            p.id === id ? { ...p, ...updates } : p
        ));
    }, []);

    const updatePaymentsAmount = useCallback((amount: number) => {
        setPayments(prev => prev.map(p => ({
            ...p,
            amount: amount,
        })));
    }, []);

    const togglePaymentStatus = useCallback((id: string, status: 'paid' | 'unpaid', month: string, year: string) => {
        const today = new Date();
        const hour = String(today.getHours()).padStart(2, '0');
        const minute = String(today.getMinutes()).padStart(2, '0');
        const dateStr = `${today.getDate()} ${month} ${year} ${hour}:${minute}`;

        setPayments(prev => prev.map(p => {
            if (p.id !== id) return p;
            if (status === 'paid') {
                return { ...p, status: 'paid', date: dateStr };
            } else {
                return { ...p, status: 'unpaid', date: undefined };
            }
        }));
    }, []);

    return {
        payments,
        isLoading,
        error,
        selectedIds,
        setSelectedIds,
        updatePayment,
        updatePaymentsAmount,
        togglePaymentStatus,
        refetch: fetchPayments,
    };
};

