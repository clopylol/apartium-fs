import { useState, useEffect, useMemo } from 'react';
import type { PaymentRecordLegacy } from '@/types/payments';
import { useDebounce } from '@/hooks/useDebounce';

const MIN_SEARCH_LENGTH = 3;
const DEBOUNCE_DELAY = 500; // 500ms

export interface UsePaymentFiltersReturn {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    debouncedSearchTerm: string;
    effectiveSearchTerm: string | undefined; // undefined if < 3 chars
    statusFilter: 'all' | 'paid' | 'unpaid';
    setStatusFilter: (filter: 'all' | 'paid' | 'unpaid') => void;
    sortOrder: 'asc' | 'desc' | null;
    toggleSort: () => void;
    currentPage: number;
    setCurrentPage: (page: number) => void;
    filteredPayments: PaymentRecordLegacy[];
    paginatedPayments: PaymentRecordLegacy[];
    selectablePayments: PaymentRecordLegacy[];
    incomeStats: {
        total: number;
        collected: number;
        pending: number;
        rate: number;
    };
}

export const usePaymentFilters = (
    payments: PaymentRecordLegacy[],
    itemsPerPage: number = 20
): UsePaymentFiltersReturn => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'unpaid'>('all');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    // Debounce search term - 500ms sonra işle
    const debouncedSearchTerm = useDebounce(searchTerm, DEBOUNCE_DELAY);

    // Minimum karakter kontrolü: 3 karakterden az ise undefined döndür
    const effectiveSearchTerm = useMemo(() => {
        const trimmed = debouncedSearchTerm.trim();
        return trimmed.length >= MIN_SEARCH_LENGTH ? trimmed : undefined;
    }, [debouncedSearchTerm]);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [effectiveSearchTerm, statusFilter]);

    // Client-side filtering (for local data)
    // Note: When using API, filtering is done server-side
    const filteredPayments = useMemo(() => {
        let result = payments;

        // Apply search filter (only if >= 3 chars)
        if (effectiveSearchTerm) {
            const searchLower = effectiveSearchTerm.toLowerCase();
            result = result.filter(p =>
                p.residentName.toLowerCase().includes(searchLower) ||
                p.unit.toLowerCase().includes(searchLower)
            );
        }

        // Apply status filter
        if (statusFilter === 'paid') {
            result = result.filter(p => p.status === 'paid');
        } else if (statusFilter === 'unpaid') {
            result = result.filter(p => p.status === 'unpaid');
        }

        // Apply sorting
        if (sortOrder) {
            result = [...result].sort((a, b) => {
                if (a.status === b.status) return 0;
                const scoreA = a.status === 'paid' ? 1 : 0;
                const scoreB = b.status === 'paid' ? 1 : 0;
                return sortOrder === 'asc' ? (scoreB - scoreA) : (scoreA - scoreB);
            });
        }

        return result;
    }, [payments, effectiveSearchTerm, statusFilter, sortOrder]);

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
        debouncedSearchTerm,
        effectiveSearchTerm,
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
