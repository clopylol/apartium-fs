import type { MaintenanceRequest } from "@/types/maintenance.types";
import type { NewRequestFormData } from "./useMaintenanceModals";

export interface UseMaintenanceActionsProps {
  requests: MaintenanceRequest[];
  setRequests: React.Dispatch<React.SetStateAction<MaintenanceRequest[]>>;
  selectedRequest: MaintenanceRequest | null;
  setSelectedRequest: (request: MaintenanceRequest | null) => void;
  closeNewRequestModal: () => void;
}

export interface UseMaintenanceActionsReturn {
  handleStatusUpdate: (id: string, newStatus: MaintenanceRequest["status"]) => void;
  handleCreateRequest: (formData: NewRequestFormData) => void;
}

export function useMaintenanceActions({
  requests,
  setRequests,
  selectedRequest,
  setSelectedRequest,
  closeNewRequestModal,
}: UseMaintenanceActionsProps): UseMaintenanceActionsReturn {
  const handleStatusUpdate = (
    id: string,
    newStatus: MaintenanceRequest["status"]
  ) => {
    setRequests((prevRequests) =>
      prevRequests.map((req) =>
        req.id === id ? { ...req, status: newStatus } : req
      )
    );

    if (selectedRequest && selectedRequest.id === id) {
      setSelectedRequest({ ...selectedRequest, status: newStatus });
    }
  };

  const handleCreateRequest = (formData: NewRequestFormData) => {
    const newRequest: MaintenanceRequest = {
      id: `#${Date.now()}`,
      title: formData.title,
      user: "Yeni Kullanıcı",
      unit: "1A",
      category: formData.category,
      date: new Date().toISOString().split("T")[0],
      priority: formData.priority,
      status: "New",
      avatar: `https://ui-avatars.com/api/?name=Yeni+Kullanici&background=random&color=fff`,
    };

    setRequests((prev) => [newRequest, ...prev]);
    closeNewRequestModal();
  };

  return {
    handleStatusUpdate,
    handleCreateRequest,
  };
}

