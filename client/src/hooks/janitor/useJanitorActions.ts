import { useTranslation } from "react-i18next";
import type { Janitor, JanitorRequest } from "@/types/janitor.types";
import type { StaffFormData, RequestFormData } from "./useJanitorModals";
import { useJanitorMutations } from "./useJanitorMutations";

import type { ConfirmationVariant } from "@/components/shared/modals";

export interface UseJanitorActionsProps {
  janitors: Janitor[];
  isEditing: boolean;
  selectedRequest: JanitorRequest | null;
  setSelectedRequest: (request: JanitorRequest | null) => void;
  setConfirmModal: React.Dispatch<
    React.SetStateAction<{
      isOpen: boolean;
      title: string;
      message: string;
      variant: ConfirmationVariant;
      onConfirm: () => void;
    }>
  >;
  closeAddModal: () => void;
  closeRequestModal: () => void;
  closeConfirmModal: () => void;
}

export interface UseJanitorActionsReturn {
  getJanitor: (id?: string) => Janitor | undefined;
  handleBlockToggle: (block: string) => void;
  handleSaveClick: (formData: StaffFormData) => void;
  handleDeleteClick: (id: string, name: string) => void;
  handleCompleteRequest: (id: string, request?: JanitorRequest | null) => void;
  handleSaveRequest: (data: RequestFormData) => void;
}

export function useJanitorActions({
  janitors,
  isEditing,
  selectedRequest,
  setSelectedRequest,
  setConfirmModal,
  closeAddModal,
  closeRequestModal,
  closeConfirmModal,
}: UseJanitorActionsProps): UseJanitorActionsReturn {
  const { t } = useTranslation();
  const mutations = useJanitorMutations();

  const getJanitor = (id?: string): Janitor | undefined => {
    return janitors.find((j) => j.id === id);
  };

  const handleBlockToggle = (_block: string) => {
    // This will be handled by parent component or form state
  };

  const processSave = (data: StaffFormData) => {
    if (isEditing && data.id) {
      const updateData = {
        name: data.name,
        phone: data.phone,
        assignedBlocks: data.assignedBlocks,
        status: data.status,
      };
      mutations.updateJanitor.mutate({
        id: data.id,
        data: updateData
      });
    } else {
      const createData = {
        name: data.name,
        phone: data.phone,
        status: data.status,
        assignedBlocks: data.assignedBlocks,
      };
      mutations.createJanitor.mutate(createData);
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
      variant: "success",
      onConfirm: () => processSave(data),
    });
  };

  const processDelete = (id: string) => {
    mutations.deleteJanitor.mutate(id);
    closeConfirmModal();
  };

  const handleDeleteClick = (id: string, name: string) => {
    setConfirmModal({
      isOpen: true,
      title: t("janitor.staff.modals.confirmations.delete.title"),
      message: t("janitor.staff.modals.confirmations.delete.message", { name }),
      variant: "danger",
      onConfirm: () => processDelete(id),
    });
  };

  const handleCompleteRequest = (id: string, request?: JanitorRequest | null) => {
    // We assume backend sets tasksCompleted increment
    mutations.updateRequestStatus.mutate(
      { id, status: "completed" },
      {
        onSuccess: () => {
          if (request && selectedRequest && selectedRequest.id === id) {
            setSelectedRequest(null);
          }
        }
      }
    );
  };
  const handleSaveRequest = (data: RequestFormData) => {
    mutations.createRequest.mutate(data);
    closeRequestModal();
  };

  return {
    getJanitor,
    handleBlockToggle,
    handleSaveClick,
    handleDeleteClick,
    handleCompleteRequest,
    handleSaveRequest,
  };
}

