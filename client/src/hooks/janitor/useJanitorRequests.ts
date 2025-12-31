import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface UseJanitorRequestsParams {
    page: number;
    limit: number;
    search?: string;
    status?: string;
    type?: string;
    siteId?: string;
    buildingId?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export const useJanitorRequests = ({
    page,
    limit,
    search,
    status,
    type,
    siteId,
    buildingId,
    sortBy,
    sortOrder,
}: UseJanitorRequestsParams) => {
    return useQuery({
        queryKey: ["janitor-requests", page, limit, search, status, type, siteId, buildingId, sortBy, sortOrder],
        queryFn: async () => {
            return await api.janitor.getRequests(page, limit, {
                search,
                status,
                type,
                siteId,
                buildingId,
                sortBy,
                sortOrder,
            });
        },
        placeholderData: keepPreviousData,
    });
};
