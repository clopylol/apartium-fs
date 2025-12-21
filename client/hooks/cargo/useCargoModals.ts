import { useState } from "react";
import type { CargoItem, ExpectedCargo, CourierVisit, MockResident } from "@/types/cargo.types";

export interface CargoFormData {
  trackingNo: string;
  carrier: string;
  recipientName: string;
  unit: string;
  type: "Small" | "Medium" | "Large";
}

export interface CourierFormData {
  company: string;
  residentName: string;
  unit: string;
  note: string;
  plate: string;
}

export interface UseCargoModalsReturn {
  showCargoModal: boolean;
  setShowCargoModal: (show: boolean) => void;
  showCourierModal: boolean;
  setShowCourierModal: (show: boolean) => void;
  showConfirmModal: boolean;
  setShowConfirmModal: (show: boolean) => void;
  confirmAction: "cargo_deliver" | "cargo_return" | "courier_in" | "courier_out" | null;
  setConfirmAction: (action: "cargo_deliver" | "cargo_return" | "courier_in" | "courier_out" | null) => void;
  targetId: string | null;
  setTargetId: (id: string | null) => void;
  convertingId: string | null;
  setConvertingId: (id: string | null) => void;
  newCargo: CargoFormData;
  setNewCargo: React.Dispatch<React.SetStateAction<CargoFormData>>;
  newCourier: CourierFormData;
  setNewCourier: React.Dispatch<React.SetStateAction<CourierFormData>>;
  selectedResidentId: string;
  setSelectedResidentId: (id: string) => void;
  isManualCourier: boolean;
  setIsManualCourier: (manual: boolean) => void;
  openCargoModal: (expected?: ExpectedCargo) => void;
  closeCargoModal: () => void;
  openCourierModal: () => void;
  closeCourierModal: () => void;
  openConfirmModal: (action: "cargo_deliver" | "cargo_return" | "courier_in" | "courier_out", id: string) => void;
  closeConfirmModal: () => void;
}

export function useCargoModals(): UseCargoModalsReturn {
  const [showCargoModal, setShowCargoModal] = useState(false);
  const [showCourierModal, setShowCourierModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<"cargo_deliver" | "cargo_return" | "courier_in" | "courier_out" | null>(null);
  const [targetId, setTargetId] = useState<string | null>(null);
  const [convertingId, setConvertingId] = useState<string | null>(null);
  const [newCargo, setNewCargo] = useState<CargoFormData>({
    trackingNo: "",
    carrier: "Yurtiçi Kargo",
    recipientName: "",
    unit: "",
    type: "Small",
  });
  const [newCourier, setNewCourier] = useState<CourierFormData>({
    company: "Getir",
    residentName: "",
    unit: "",
    note: "",
    plate: "",
  });
  const [selectedResidentId, setSelectedResidentId] = useState<string>("");
  const [isManualCourier, setIsManualCourier] = useState(false);

  const openCargoModal = (expected?: ExpectedCargo) => {
    if (expected) {
      setNewCargo({
        trackingNo: expected.trackingNo,
        carrier: expected.carrier,
        recipientName: expected.residentName,
        unit: expected.unit,
        type: "Medium",
      });
      setConvertingId(expected.id);
    } else {
      setNewCargo({
        trackingNo: "",
        carrier: "Yurtiçi Kargo",
        recipientName: "",
        unit: "",
        type: "Small",
      });
      setConvertingId(null);
    }
    setShowCargoModal(true);
  };

  const closeCargoModal = () => {
    setShowCargoModal(false);
    setNewCargo({
      trackingNo: "",
      carrier: "Yurtiçi Kargo",
      recipientName: "",
      unit: "",
      type: "Small",
    });
    setConvertingId(null);
  };

  const openCourierModal = () => {
    setShowCourierModal(true);
  };

  const closeCourierModal = () => {
    setShowCourierModal(false);
    setNewCourier({
      company: "Getir",
      residentName: "",
      unit: "",
      note: "",
      plate: "",
    });
    setSelectedResidentId("");
    setIsManualCourier(false);
  };

  const openConfirmModal = (action: "cargo_deliver" | "cargo_return" | "courier_in" | "courier_out", id: string) => {
    setConfirmAction(action);
    setTargetId(id);
    setShowConfirmModal(true);
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
    setTargetId(null);
    setConfirmAction(null);
  };

  return {
    showCargoModal,
    setShowCargoModal,
    showCourierModal,
    setShowCourierModal,
    showConfirmModal,
    setShowConfirmModal,
    confirmAction,
    setConfirmAction,
    targetId,
    setTargetId,
    convertingId,
    setConvertingId,
    newCargo,
    setNewCargo,
    newCourier,
    setNewCourier,
    selectedResidentId,
    setSelectedResidentId,
    isManualCourier,
    setIsManualCourier,
    openCargoModal,
    closeCargoModal,
    openCourierModal,
    closeCourierModal,
    openConfirmModal,
    closeConfirmModal,
  };
}

