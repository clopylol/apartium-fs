import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const useBuildings = (siteId?: string) => {
    return useQuery({
        queryKey: ["buildings", siteId],
        queryFn: async () => {
            if (siteId) {
                return await api.buildings.getBySiteId(siteId);
            }
            return await api.buildings.getAll();
        },
        // Only run if siteId is provided or if we want all buildings (logic can be adjusted)
        // For now, if no siteId, we fetch all.
    });
};
