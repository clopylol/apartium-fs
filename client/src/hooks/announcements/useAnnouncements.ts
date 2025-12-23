import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { AnnouncementsResponse } from '@/types';

/**
 * Hook for fetching paginated announcements
 * @param page - Current page number (1-based)
 * @param limit - Number of items per page
 */
export function useAnnouncements(page: number, limit: number) {
    const query = useQuery<AnnouncementsResponse>({
        queryKey: ['announcements', page, limit],
        queryFn: () => api.announcements.getAll(page, limit),
        staleTime: 30000, // 30 seconds
    });

    return {
        announcements: query.data?.announcements || [],
        total: query.data?.total || 0,
        isLoading: query.isLoading,
        error: query.error,
        refetch: query.refetch,
    };
}

