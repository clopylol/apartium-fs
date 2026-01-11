import { useState, useMemo, useEffect } from 'react';
import type { Booking } from '@/types/bookings.types';
import { ITEMS_PER_PAGE } from '@/constants/bookings';

export interface UseBookingsFiltersReturn {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  status: string;
  setStatus: React.Dispatch<React.SetStateAction<string>>;
  dateFrom: string;
  setDateFrom: React.Dispatch<React.SetStateAction<string>>;
  dateTo: string;
  setDateTo: React.Dispatch<React.SetStateAction<string>>;
  filteredBookings: Booking[];
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  paginatedBookings: Booking[];
  totalPages: number;
  hasActiveFilters: boolean;
  clearFilters: () => void;
}

export const useBookingsFilters = (
  bookings: Booking[],
  viewMode: 'list' | 'calendar'
): UseBookingsFiltersReturn => {
  const [activeTab, setActiveTab] = useState<'all' | string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState<string>('all');

  // Default to current month
  // Default to current month with timezone correction
  const [dateFrom, setDateFrom] = useState(() => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const offset = now.getTimezoneOffset();
    const localFirstDay = new Date(firstDay.getTime() - (offset * 60 * 1000));
    return localFirstDay.toISOString().split('T')[0];
  });

  const [dateTo, setDateTo] = useState(() => {
    const now = new Date();
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const offset = now.getTimezoneOffset();
    const localLastDay = new Date(lastDay.getTime() - (offset * 60 * 1000));
    return localLastDay.toISOString().split('T')[0];
  });
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm, status, dateFrom, dateTo, viewMode]);

  const filteredBookings = useMemo(() => {
    console.log("useBookingsFilters - Input Bookings:", bookings.length);
    const result = bookings.filter(b => {
      // ... filters
      // Tab Filter (Facility)
      const matchesTab = activeTab === 'all' || b.facilityId === activeTab;

      // Search Filter
      const matchesSearch =
        b.residentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.unit.toLowerCase().includes(searchTerm.toLowerCase());

      // Status Filter
      const matchesStatus = status === 'all' || b.status === status;

      // Date Range Filter
      let matchesDate = true;
      if (dateFrom || dateTo) {
        const bookingDate = new Date(b.date).getTime();
        if (dateFrom) {
          matchesDate = matchesDate && bookingDate >= new Date(dateFrom).getTime();
        }
        if (dateTo) {
          // Add one day to dateTo to include the end date fully
          const endDate = new Date(dateTo);
          endDate.setHours(23, 59, 59, 999);
          matchesDate = matchesDate && bookingDate <= endDate.getTime();
        }
      }

      return matchesTab && matchesSearch && matchesStatus && matchesDate;
      return matchesTab && matchesSearch && matchesStatus && matchesDate;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    console.log("useBookingsFilters - Filtered Output:", result.length);
    return result;
  }, [bookings, activeTab, searchTerm, status, dateFrom, dateTo]);

  const paginatedBookings = useMemo(() => {
    if (viewMode === 'calendar') return filteredBookings;
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredBookings.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredBookings, currentPage, viewMode]);

  const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE);

  const hasActiveFilters = searchTerm !== '' || status !== 'all' || dateFrom !== '' || dateTo !== '';

  const clearFilters = () => {
    setSearchTerm('');
    setStatus('all');
    // Reset to current month with timezone correction
    const now = new Date();
    const offset = now.getTimezoneOffset();

    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const localFirstDay = new Date(firstDay.getTime() - (offset * 60 * 1000));
    setDateFrom(localFirstDay.toISOString().split('T')[0]);

    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const localLastDay = new Date(lastDay.getTime() - (offset * 60 * 1000));
    setDateTo(localLastDay.toISOString().split('T')[0]);
  };

  return {
    activeTab,
    setActiveTab,
    searchTerm,
    setSearchTerm,
    status,
    setStatus,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    filteredBookings,
    currentPage,
    setCurrentPage,
    paginatedBookings,
    totalPages,
    hasActiveFilters,
    clearFilters
  };
};

