import { useTranslation } from "react-i18next";
import type { Janitor, JanitorRequest } from "@/types/janitor.types";
import type { StaffFormData } from "./useJanitorModals";

export interface UseJanitorActionsProps {
  janitors: Janitor[];
  setJanitors: React.Dispatch<React.SetStateAction<Janitor[]>>;
  setRequests: React.Dispatch<React.SetStateAction<JanitorRequest[]>>;
  isEditing: boolean;
  selectedRequest: JanitorRequest | null;
  setSelectedRequest: (request: JanitorRequest | null) => void;
  setConfirmModal: React.Dispatch<
    React.SetStateAction<{
      isOpen: boolean;
      title: string;
      message: string;
      type: "approve" | "danger";
      onConfirm: () => void;
    }>
  >;
  closeAddModal: () => void;
  closeConfirmModal: () => void;
}

export interface UseJanitorActionsReturn {
  getJanitor: (id?: string) => Janitor | undefined;
  handleBlockToggle: (block: string) => void;
  handleSaveClick: (formData: StaffFormData) => void;
  handleDeleteClick: (id: string, name: string) => void;
  handleCompleteRequest: (id: string) => void;
}

export function useJanitorActions({
  janitors,
  setJanitors,
  setRequests,
  isEditing,
  selectedRequest,
  setSelectedRequest,
  setConfirmModal,
  closeAddModal,
  closeConfirmModal,
}: UseJanitorActionsProps): UseJanitorActionsReturn {
  const { t } = useTranslation();

  const getJanitor = (id?: string): Janitor | undefined => {
    return janitors.find((j) => j.id === id);
  };

  const handleBlockToggle = (_block: string) => {
    // This will be handled by parent component
  };

  const processSave = (data: StaffFormData) => {
    if (isEditing && data.id) {
      setJanitors((prev) =>
        prev.map((j) => (j.id === data.id ? { ...j, ...data } : j))
      );
    } else {
      const newJanitor: Janitor = {
        id: `j-${Date.now()}`,
        name: data.name,
        phone: data.phone,
        assignedBlocks: data.assignedBlocks,
        status: data.status,
        tasksCompleted: 0,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=random&color=fff`,
      };
      setJanitors((prev) => [...prev, newJanitor]);
    }
    closeAddModal();
    closeConfirmModal();
  };

  const handleSaveClick = (data: StaffFormData) => {
    if (!data.name || data.assignedBlocks.length === 0) return;

    setConfirmModal({
      isOpen: true,
      title: isEditing
        ? t("janitor.staff.modals.confirmations.edit.title")
        : t("janitor.staff.modals.confirmations.add.title"),
      message: isEditing
        ? t("janitor.staff.modals.confirmations.edit.message", { name: data.name })
        : t("janitor.staff.modals.confirmations.add.message", { name: data.name }),
      type: "approve",
      onConfirm: () => processSave(data),
    });
  };

  const processDelete = (id: string) => {
    setJanitors((prev) => prev.filter((j) => j.id !== id));
    closeConfirmModal();
  };

  const handleDeleteClick = (id: string, name: string) => {
    setConfirmModal({
      isOpen: true,
      title: t("janitor.staff.modals.confirmations.delete.title"),
      message: t("janitor.staff.modals.confirmations.delete.message", { name }),
      type: "danger",
      onConfirm: () => processDelete(id),
    });
  };

  const handleCompleteRequest = (id: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "completed",
              completedAt: new Date().toLocaleTimeString("tr-TR", {
                hour: "2-digit",
                minute: "2-digit",
              }),
              assignedJanitorId: "j1",
            }
          : r
      )
    );

    if (selectedRequest && selectedRequest.id === id) {
      setSelectedRequest({
        ...selectedRequest,
        status: "completed",
        completedAt: new Date().toLocaleTimeString("tr-TR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        assignedJanitorId: "j1",
      });
    }
  };

  return {
    getJanitor,
    handleBlockToggle,
    handleSaveClick,
    handleDeleteClick,
    handleCompleteRequest,
  };
}

