import { useState } from "react";
import type { Janitor, JanitorRequest } from "@/types/janitor.types";

export interface StaffFormData {
  id: string;
  name: string;
  phone: string;
  assignedBlocks: string[];
  status: "on-duty" | "off-duty" | "passive";
}

export interface UseJanitorModalsReturn {
  showAddModal: boolean;
  setShowAddModal: (show: boolean) => void;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  formData: StaffFormData;
  setFormData: React.Dispatch<React.SetStateAction<StaffFormData>>;
  selectedRequest: JanitorRequest | null;
  setSelectedRequest: (request: JanitorRequest | null) => void;
  confirmModal: {
    isOpen: boolean;
    title: string;
    message: string;
    type: "approve" | "danger";
    onConfirm: () => void;
  };
  setConfirmModal: React.Dispatch<
    React.SetStateAction<{
      isOpen: boolean;
      title: string;
      message: string;
      type: "approve" | "danger";
      onConfirm: () => void;
    }>
  >;
  completeRequestConfirm: {
    isOpen: boolean;
    requestId: string | null;
    requestName: string;
  };
  setCompleteRequestConfirm: React.Dispatch<
    React.SetStateAction<{
      isOpen: boolean;
      requestId: string | null;
      requestName: string;
    }>
  >;
  openCompleteRequestConfirm: (requestId: string, requestName: string) => void;
  closeCompleteRequestConfirm: () => void;
  openAddModal: () => void;
  openEditModal: (janitor: Janitor) => void;
  closeAddModal: () => void;
  closeConfirmModal: () => void;
}

export function useJanitorModals(): UseJanitorModalsReturn {
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<StaffFormData>({
    id: "",
    name: "",
    phone: "",
    assignedBlocks: [],
    status: "on-duty",
  });
  const [selectedRequest, setSelectedRequest] = useState<JanitorRequest | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "approve" | "danger";
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    type: "approve",
    onConfirm: () => {},
  });
  const [completeRequestConfirm, setCompleteRequestConfirm] = useState<{
    isOpen: boolean;
    requestId: string | null;
    requestName: string;
  }>({
    isOpen: false,
    requestId: null,
    requestName: "",
  });

  const openAddModal = () => {
    setIsEditing(false);
    setFormData({
      id: "",
      name: "",
      phone: "",
      assignedBlocks: [],
      status: "on-duty",
    });
    setShowAddModal(true);
  };

  const openEditModal = (janitor: Janitor) => {
    setIsEditing(true);
    setFormData({
      id: janitor.id,
      name: janitor.name,
      phone: janitor.phone,
      assignedBlocks: janitor.assignedBlocks,
      status: janitor.status,
    });
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
  };

  const closeConfirmModal = () => {
    setConfirmModal((prev) => ({ ...prev, isOpen: false }));
  };

  const openCompleteRequestConfirm = (requestId: string, requestName: string) => {
    setCompleteRequestConfirm({
      isOpen: true,
      requestId,
      requestName,
    });
  };

  const closeCompleteRequestConfirm = () => {
    setCompleteRequestConfirm({
      isOpen: false,
      requestId: null,
      requestName: "",
    });
  };

  return {
    showAddModal,
    setShowAddModal,
    isEditing,
    setIsEditing,
    formData,
    setFormData,
    selectedRequest,
    setSelectedRequest,
    confirmModal,
    setConfirmModal,
    completeRequestConfirm,
    setCompleteRequestConfirm,
    openAddModal,
    openEditModal,
    closeAddModal,
    closeConfirmModal,
    openCompleteRequestConfirm,
    closeCompleteRequestConfirm,
  };
}

