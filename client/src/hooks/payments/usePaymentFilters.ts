import { useState, useEffect, useMemo } from 'react';
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
}

export const usePaymentFilters = (): UsePaymentFiltersReturn => {
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
    };
};
