import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Facility, Booking } from '@/types/bookings.types';

export const useFacilities = (siteId?: string) => {
    return useQuery({
        queryKey: ['facilities', siteId],
        queryFn: async () => {
            // If no siteId, we might want to return empty or fetch all if allowed.
            // Assuming context provides siteId usually.
            if (!siteId) return [];
            const response = await api.bookings.getFacilities(siteId);
            return response.facilities as Facility[];
        },
        enabled: !!siteId,
    });
};

export const useBookings = (filters?: { facilityId?: string; siteId?: string }) => {
    return useQuery({
        queryKey: ['bookings', filters],
        queryFn: async () => {
            const response = await api.bookings.getBookings(filters);
            return response.bookings as Booking[];
        },
        enabled: !!(filters?.facilityId || filters?.siteId),
    });
};
