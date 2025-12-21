import { useState, useEffect, useMemo } from 'react';
import type { PaymentRecord } from '@/types/payments';

export interface UsePaymentFiltersReturn {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    statusFilter: 'all' | 'paid' | 'unpaid';
    setStatusFilter: (filter: 'all' | 'paid' | 'unpaid') => void;
    sortOrder: 'asc' | 'desc' | null;
    toggleSort: () => void;
    currentPage: number;
    setCurrentPage: (page: number) => void;
    filteredPayments: PaymentRecord[];
    paginatedPayments: PaymentRecord[];
    selectablePayments: PaymentRecord[];
    incomeStats: {
        total: number;
        collected: number;
        pending: number;
        rate: number;
    };
}

export const usePaymentFilters = (
    payments: PaymentRecord[],
    itemsPerPage: number = 20
): UsePaymentFiltersReturn => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'unpaid'>('all');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter]);

    const filteredPayments = useMemo(() => {
        let result = payments.filter(p =>
            p.residentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.unit.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (statusFilter === 'paid') {
            result = result.filter(p => p.status === 'paid');
        } else if (statusFilter === 'unpaid') {
            result = result.filter(p => p.status === 'unpaid');
        }

        if (sortOrder) {
            result.sort((a, b) => {
                if (a.status === b.status) return 0;
                const scoreA = a.status === 'paid' ? 1 : 0;
                const scoreB = b.status === 'paid' ? 1 : 0;
                return sortOrder === 'asc' ? (scoreB - scoreA) : (scoreA - scoreB);
            });
        }

        return result;
    }, [payments, searchTerm, statusFilter, sortOrder]);

    const paginatedPayments = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredPayments.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredPayments, currentPage, itemsPerPage]);

    const selectablePayments = useMemo(() => {
        return filteredPayments.filter(p => p.status === 'unpaid');
    }, [filteredPayments]);

    const incomeStats = useMemo(() => {
        const total = payments.reduce((acc, curr) => acc + curr.amount, 0);
        const collected = payments.filter(p => p.status === 'paid').reduce((acc, curr) => acc + curr.amount, 0);
        const pending = total - collected;
        const rate = total > 0 ? Math.round((collected / total) * 100) : 0;
        return { total, collected, pending, rate };
    }, [payments]);

    const toggleSort = () => {
        setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    };

    return {
        searchTerm,
        setSearchTerm,
        statusFilter,
        setStatusFilter,
        sortOrder,
        toggleSort,
        currentPage,
        setCurrentPage,
        filteredPayments,
        paginatedPayments,
        selectablePayments,
        incomeStats,
    };
};

