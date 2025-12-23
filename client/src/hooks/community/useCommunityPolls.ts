import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Poll } from '@/types';

/**
 * Hook for fetching paginated polls with votes
 * @param page - Current page number (1-based)
 * @param limit - Number of items per page
 * @param search - Optional search term
 * @param status - Optional status filter
 */
export function useCommunityPolls(
    page: number,
    limit: number,
    search?: string,
    status?: 'active' | 'closed'
) {
    const query = useQuery<{ polls: Poll[]; total: number }>({
        queryKey: ['community', 'polls', page, limit, search, status],
        queryFn: () => api.community.getPolls(page, limit, { search, status }),
        staleTime: 30000, // 30 seconds
    });

    return {
        polls: query.data?.polls || [],
        total: query.data?.total || 0,
        isLoading: query.isLoading,
        error: query.error,
        refetch: query.refetch,
    };
}

