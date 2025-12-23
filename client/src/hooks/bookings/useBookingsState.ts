import { useState, useEffect } from 'react';
import type { Facility, Booking } from '@/types/bookings.types';
import { INITIAL_FACILITIES, INITIAL_BOOKINGS } from '@/constants/bookings';

export interface UseBookingsStateReturn {
  facilities: Facility[];
  setFacilities: React.Dispatch<React.SetStateAction<Facility[]>>;
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  isLoading: boolean;
  viewMode: 'list' | 'calendar';
  setViewMode: React.Dispatch<React.SetStateAction<'list' | 'calendar'>>;
  calendarWeekStart: Date;
  setCalendarWeekStart: React.Dispatch<React.SetStateAction<Date>>;
}

export const useBookingsState = (): UseBookingsStateReturn => {
  const [facilities, setFacilities] = useState<Facility[]>(INITIAL_FACILITIES);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [calendarWeekStart, setCalendarWeekStart] = useState(new Date());

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return {
    facilities,
    setFacilities,
    bookings,
    setBookings,
    isLoading,
    viewMode,
    setViewMode,
    calendarWeekStart,
    setCalendarWeekStart,
  };
};

