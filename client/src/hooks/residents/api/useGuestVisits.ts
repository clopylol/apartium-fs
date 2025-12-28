import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { api } from '@/lib/api';
import type { GuestVisitsPaginatedResponse, GuestVisit } from '@/types/residents.types';

export function useGuestVisits(
    page: number,
    limit: number,
    filters?: { status?: string; search?: string }
) {
    const query = useQuery<GuestVisitsPaginatedResponse>({
        queryKey: ['guest-visits', page, limit, filters],
        queryFn: () => api.residents.getGuestVisits(page, limit, filters),
        staleTime: 30000, // 30 seconds
    });

    // ✅ Parse dates with useMemo (performance optimization)
    const parsedVisits = useMemo(() => {
        if (!query.data?.visits) return [];
        
        return query.data.visits.map(visit => ({
            ...visit,
            entryTime: visit.entryTime ? new Date(visit.entryTime) : null,
            exitTime: visit.exitTime ? new Date(visit.exitTime) : null,
            // Use JOIN fields from backend
            hostName: visit.hostName || '',
            unitNumber: visit.unitNumber || '',
            blockName: visit.blockName || '',
            parkingSpot: visit.parkingSpot || undefined,
        })) as GuestVisit[];
    }, [query.data?.visits]);

    return {
        visits: parsedVisits,
        total: query.data?.total || 0,
        page: query.data?.page || 1,
        limit: query.data?.limit || 10,
        isLoading: query.isLoading,
        error: query.error,
        refetch: query.refetch,
    };
}

