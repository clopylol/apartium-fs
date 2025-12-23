import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Site } from "@/types/residents.types";

interface SitesResponse {
  sites: Site[];
}

/**
 * useSites Hook
 * 
 * Kullanıcının erişebileceği siteleri getirir
 * - Admin: Tüm siteler
 * - Manager/Staff: Atandığı siteler
 */
export function useSites() {
  const query = useQuery<SitesResponse>({
    queryKey: ["sites"],
    queryFn: () => api.sites.getAll(),
    staleTime: 5 * 60 * 1000, // 5 dakika
  });

  return {
    sites: query.data?.sites || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

