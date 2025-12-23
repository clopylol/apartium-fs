import { useState, useMemo, useEffect } from 'react';
import type { Booking } from '@/types/bookings.types';
import { ITEMS_PER_PAGE } from '@/constants/bookings';

export interface UseBookingsFiltersReturn {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  filteredBookings: Booking[];
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  paginatedBookings: Booking[];
  totalPages: number;
}

export const useBookingsFilters = (
  bookings: Booking[],
  viewMode: 'list' | 'calendar'
): UseBookingsFiltersReturn => {
  const [activeTab, setActiveTab] = useState<'all' | string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm, viewMode]);

  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      const matchesTab = activeTab === 'all' || b.facilityId === activeTab;
      const matchesSearch = 
        b.residentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        b.unit.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesTab && matchesSearch;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [bookings, activeTab, searchTerm]);

  const paginatedBookings = useMemo(() => {
    if (viewMode === 'calendar') return filteredBookings;
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredBookings.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredBookings, currentPage, viewMode]);

  const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE);

  return {
    activeTab,
    setActiveTab,
    searchTerm,
    setSearchTerm,
    filteredBookings,
    currentPage,
    setCurrentPage,
    paginatedBookings,
    totalPages,
  };
};

