import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface UseJanitorRequestsParams {
    page: number;
    limit: number;
    search?: string;
    status?: string;
    siteId?: string;
    buildingId?: string;
}

export const useJanitorRequests = ({
    page,
    limit,
    search,
    status,
    siteId,
    buildingId,
}: UseJanitorRequestsParams) => {
    return useQuery({
        queryKey: ["janitor-requests", page, limit, search, status, siteId, buildingId],
        queryFn: async () => {
            return await api.janitor.getRequests(page, limit, {
                search,
                status,
                siteId,
                buildingId,
            });
        },
        placeholderData: keepPreviousData,
    });
};
