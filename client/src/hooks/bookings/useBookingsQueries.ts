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
            console.log("Raw Bookings Response:", response); // DEBUG LOG

            // Handle different potential response structures
            // Some endpoints might return { bookings: [...] }, others { data: [...] } or just [...]
            const rawBookings = response?.bookings || response?.data || (Array.isArray(response) ? response : []);

            console.log("Raw Bookings Array:", rawBookings); // DEBUG LOG

            return (rawBookings as any[]).map(b => {
                const date = b.bookingDate || b.date;
                return {
                    ...b,
                    date: date ? new Date(date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
                };
            }) as Booking[];
        },
        enabled: !!(filters?.facilityId || filters?.siteId),
    });
};
