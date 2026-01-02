import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";

export interface MaintenanceStats {
    totalCount: number;
    newCount: number;
    inProgressCount: number;
    completedCount: number;
    urgentCount: number;
}

export const useMaintenanceStats = () => {
    return useQuery<MaintenanceStats>({
        queryKey: ["maintenance-stats"],
        queryFn: async () => {
            return await api.maintenance.getStats();
        },
        staleTime: 1000 * 60, // 1 minute
    });
};
