import { useState, useEffect } from 'react';
import { useFacilities, useBookings } from './useBookingsQueries';
import { useAuth } from '@/contexts/auth/useAuth';
import { useSites } from '@/hooks/residents/site/useSites';
import type { Facility, Booking } from '@/types/bookings.types';
import type { Site } from '@/types/residents.types';

export interface UseBookingsStateReturn {
  facilities: Facility[];
  bookings: Booking[];
  sites: Site[];
  activeSiteId: string | null;
  setActiveSiteId: React.Dispatch<React.SetStateAction<string | null>>;
  isLoading: boolean;
  viewMode: 'list' | 'calendar';
  setViewMode: React.Dispatch<React.SetStateAction<'list' | 'calendar'>>;
  calendarWeekStart: Date;
  setCalendarWeekStart: React.Dispatch<React.SetStateAction<Date>>;
}

export const useBookingsState = (): UseBookingsStateReturn => {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [calendarWeekStart, setCalendarWeekStart] = useState(new Date());

  // Site selection state - default to user's site
  const [activeSiteId, setActiveSiteId] = useState<string | null>(user?.siteId || null);

  // Sync activeSiteId with user.siteId when user loads
  useEffect(() => {
    if (user?.siteId && !activeSiteId) {
      setActiveSiteId(user.siteId);
    }
  }, [user?.siteId, activeSiteId]);

  const { sites = [] } = useSites();

  // Auto-select site if only one exists or none selected
  useEffect(() => {
    console.log("useBookingsState - Sites:", sites.length, "ActiveSiteId:", activeSiteId);
    if (!activeSiteId && sites.length > 0) {
      console.log("Setting default site:", sites[0].id);
      setActiveSiteId(sites[0].id);
    }
  }, [sites, activeSiteId]);
  const { data: facilities = [], isLoading: isLoadingFacilities } = useFacilities(activeSiteId || undefined);
  const { data: bookings = [], isLoading: isLoadingBookings } = useBookings({ siteId: activeSiteId || undefined });

  return {
    facilities,
    bookings,
    sites,
    activeSiteId,
    setActiveSiteId,
    isLoading: isLoadingFacilities || isLoadingBookings,
    viewMode,
    setViewMode,
    calendarWeekStart,
    setCalendarWeekStart,
  };
};
