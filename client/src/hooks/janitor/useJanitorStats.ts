import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const useJanitorStats = () => {
    return useQuery({
        queryKey: ["janitor-stats"],
        queryFn: async () => {
            const data = await api.janitor.getStats();
            return data;
        },
    });
};
