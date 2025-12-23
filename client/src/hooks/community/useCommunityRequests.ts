import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { CommunityRequest } from '@/types';

/**
 * Hook for fetching paginated community requests
 * @param page - Current page number (1-based)
 * @param limit - Number of items per page
 * @param search - Optional search term
 * @param status - Optional status filter
 * @param type - Optional type filter
 */
export function useCommunityRequests(
    page: number,
    limit: number,
    search?: string,
    status?: string,
    type?: 'wish' | 'suggestion'
) {
    const query = useQuery<{ requests: CommunityRequest[]; total: number }>({
        queryKey: ['community', 'requests', page, limit, search, status, type],
        queryFn: () => api.community.getRequests(page, limit, { search, status, type }),
        staleTime: 30000, // 30 seconds
    });

    return {
        requests: query.data?.requests || [],
        total: query.data?.total || 0,
        isLoading: query.isLoading,
        error: query.error,
        refetch: query.refetch,
    };
}

