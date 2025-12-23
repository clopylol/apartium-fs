import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { AnnouncementStats } from '@/types';

/**
 * Hook for fetching announcement statistics
 * Stats are independent of filters and always show total counts
 */
export function useAnnouncementStats() {
    const query = useQuery<AnnouncementStats>({
        queryKey: ['announcements', 'stats'],
        queryFn: () => api.announcements.getStats(),
        staleTime: 30000, // 30 seconds
    });

    return {
        stats: query.data,
        isLoading: query.isLoading,
        error: query.error,
        refetch: query.refetch,
    };
}

