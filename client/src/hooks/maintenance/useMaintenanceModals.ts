import { useState } from "react";
import type { MaintenanceRequest } from "@/types/maintenance.types";

export interface NewRequestFormData {
  title: string;
  description: string;
  priority: MaintenanceRequest["priority"];
  category: MaintenanceRequest["category"];
  photo?: string;
}

export interface UseMaintenanceModalsReturn {
  showNewRequestModal: boolean;
  setShowNewRequestModal: (show: boolean) => void;
  selectedRequest: MaintenanceRequest | null;
  setSelectedRequest: (request: MaintenanceRequest | null) => void;
  newRequestFormData: NewRequestFormData;
  setNewRequestFormData: React.Dispatch<
    React.SetStateAction<NewRequestFormData>
  >;
  openNewRequestModal: () => void;
  closeNewRequestModal: () => void;
}

export function useMaintenanceModals(): UseMaintenanceModalsReturn {
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [selectedRequest, setSelectedRequest] =
    useState<MaintenanceRequest | null>(null);
  const [newRequestFormData, setNewRequestFormData] =
    useState<NewRequestFormData>({
      title: "",
      description: "",
      priority: "Low",
      category: "Genel",
    });

  const openNewRequestModal = () => {
    setNewRequestFormData({
      title: "",
      description: "",
      priority: "Low",
      category: "Genel",
    });
    setShowNewRequestModal(true);
  };

  const closeNewRequestModal = () => {
    setShowNewRequestModal(false);
  };

  return {
    showNewRequestModal,
    setShowNewRequestModal,
    selectedRequest,
    setSelectedRequest,
    newRequestFormData,
    setNewRequestFormData,
    openNewRequestModal,
    closeNewRequestModal,
  };
}

