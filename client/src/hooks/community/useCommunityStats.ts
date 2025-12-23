import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { CommunityStats } from '@/types';

/**
 * Hook for fetching community statistics
 * Stats are independent of filters and always show total counts
 */
export function useCommunityStats() {
    const query = useQuery<CommunityStats>({
        queryKey: ['community', 'stats'],
        queryFn: () => api.community.getStats(),
        staleTime: 30000, // 30 seconds
    });

    return {
        stats: query.data,
        isLoading: query.isLoading,
        error: query.error,
        refetch: query.refetch,
    };
}

