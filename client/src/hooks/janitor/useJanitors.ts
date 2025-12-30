import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface UseJanitorsFilters {
    siteId?: string;
}

export const useJanitors = (filters?: UseJanitorsFilters) => {
    return useQuery({
        queryKey: ["janitors", filters],
        queryFn: async () => {
            const { janitors } = await api.janitor.getJanitors(filters);
            return janitors as any[]; // Temporary cast if needed, but the issue is the import
        },
    });
};
