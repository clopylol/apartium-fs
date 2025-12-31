import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "react-hot-toast";

export const useJanitorMutations = () => {
    const queryClient = useQueryClient();

    const createJanitor = useMutation({
        mutationFn: api.janitor.createJanitor,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["janitors"] });
            queryClient.invalidateQueries({ queryKey: ["janitor-stats"] });
            toast.success("Kapıcı başarıyla oluşturuldu");
        },
        onError: () => {
            toast.error("Kapıcı oluşturulurken bir hata oluştu");
        },
    });

    const updateJanitor = useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) =>
            api.janitor.updateJanitor(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["janitors"] });
            toast.success("Kapıcı başarıyla güncellendi");
        },
        onError: () => {
            toast.error("Kapıcı güncellenirken bir hata oluştu");
        },
    });

    const deleteJanitor = useMutation({
        mutationFn: api.janitor.deleteJanitor,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["janitors"] });
            queryClient.invalidateQueries({ queryKey: ["janitor-stats"] });
            toast.success("Kapıcı başarıyla silindi");
        },
        onError: () => {
            toast.error("Kapıcı silinirken bir hata oluştu");
        },
    });

    const createRequest = useMutation({
        mutationFn: api.janitor.createRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["janitor-requests"] });
            queryClient.invalidateQueries({ queryKey: ["janitor-stats"] });
            toast.success("Talep başarıyla oluşturuldu");
        },
        onError: () => {
            toast.error("Talep oluşturulurken bir hata oluştu");
        },
    });

    const updateRequestStatus = useMutation({
        mutationFn: ({ id, status, completedAt, completionNote }: { id: string; status: string; completedAt?: string; completionNote?: string }) =>
            api.janitor.updateRequestStatus(id, status, completedAt, completionNote),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["janitor-requests"] });
            queryClient.invalidateQueries({ queryKey: ["janitor-stats"] });
            toast.success("Talep durumu güncellendi");
        },
        onError: () => {
            toast.error("Talep durumu güncellenirken bir hata oluştu");
        },
    });

    const deleteRequest = useMutation({
        mutationFn: api.janitor.deleteRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["janitor-requests"] });
            queryClient.invalidateQueries({ queryKey: ["janitor-stats"] });
            toast.success("Talep başarıyla silindi");
        },
        onError: () => {
            toast.error("Talep silinirken bir hata oluştu");
        },
    });

    const assignToBuilding = useMutation({
        mutationFn: ({ janitorId, buildingId }: { janitorId: string; buildingId: string }) =>
            api.janitor.assignToBuilding(janitorId, buildingId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["janitors"] });
            toast.success("Görevlendirme yapıldı");
        },
        onError: () => {
            toast.error("Görevlendirme yapılırken bir hata oluştu");
        },
    });

    const unassignFromBuilding = useMutation({
        mutationFn: ({ janitorId, buildingId }: { janitorId: string; buildingId: string }) =>
            api.janitor.unassignFromBuilding(janitorId, buildingId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["janitors"] });
            toast.success("Görevlendirme kaldırıldı");
        },
        onError: () => {
            toast.error("Görevlendirme kaldırılırken bir hata oluştu");
        },
    });

    return {
        createJanitor,
        updateJanitor,
        deleteJanitor,
        createRequest,
        updateRequestStatus,
        deleteRequest,
        assignToBuilding,
        unassignFromBuilding
    };
};
