import { useQuery, keepPreviousData } from "@tanstack/react-query";

import { api } from "@/lib/api";

export interface UseMaintenanceRequestsParams {
    page: number;
    limit: number;
    search?: string;
    status?: string;
    priority?: string;
    category?: string;
    siteId?: string;
    buildingId?: string;
    dateFrom?: string;
    dateTo?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

export const useMaintenanceRequests = ({
    page,
    limit,
    search,
    status,
    priority,
    category,
    siteId,
    buildingId,
    dateFrom,
    dateTo,
    sortBy,
    sortOrder,
}: UseMaintenanceRequestsParams) => {
    return useQuery({
        queryKey: [
            "maintenance-requests",
            page,
            limit,
            search,
            status,
            priority,
            category,
            siteId,
            buildingId,
            dateFrom,
            dateTo,
            sortBy,
            sortOrder,
        ],
        queryFn: async () => {
            return await api.maintenance.getRequests(page, limit, {
                search,
                status,
                priority,
                category,
                siteId,
                buildingId,
                dateFrom,
                dateTo,
                sortBy,
                sortOrder,
            });
        },
        placeholderData: keepPreviousData,
    });
};
