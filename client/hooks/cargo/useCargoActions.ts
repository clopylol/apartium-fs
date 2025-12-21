import type { CargoItem, ExpectedCargo, CourierVisit } from "@/types/cargo.types";
import type { CargoFormData, CourierFormData } from "./useCargoModals";

export interface UseCargoActionsProps {
  cargoList: CargoItem[];
  setCargoList: React.Dispatch<React.SetStateAction<CargoItem[]>>;
  expectedList: ExpectedCargo[];
  setExpectedList: React.Dispatch<React.SetStateAction<ExpectedCargo[]>>;
  courierList: CourierVisit[];
  setCourierList: React.Dispatch<React.SetStateAction<CourierVisit[]>>;
  convertingId: string | null;
  setConvertingId: (id: string | null) => void;
  closeCargoModal: () => void;
  closeCourierModal: () => void;
  closeConfirmModal: () => void;
}

export interface UseCargoActionsReturn {
  handleAddCargo: (formData: CargoFormData) => void;
  handleDeliverCargo: (id: string) => void;
  handleReturnCargo: (id: string) => void;
  handleAddCourier: (formData: CourierFormData) => void;
  handleCourierEntry: (id: string) => void;
  handleCourierExit: (id: string) => void;
  getTargetItemName: (action: "cargo_deliver" | "cargo_return" | "courier_in" | "courier_out" | null, id: string | null) => string;
}

export function useCargoActions({
  cargoList,
  setCargoList,
  expectedList,
  setExpectedList,
  courierList,
  setCourierList,
  convertingId,
  setConvertingId,
  closeCargoModal,
  closeCourierModal,
  closeConfirmModal,
}: UseCargoActionsProps): UseCargoActionsReturn {
  const handleAddCargo = (formData: CargoFormData) => {
    if (!formData.recipientName || !formData.unit) return;

    const today = new Date();
    const item: CargoItem = {
      id: `crg-${Date.now()}`,
      trackingNo: formData.trackingNo || "Belirtilmedi",
      carrier: formData.carrier || "Diğer",
      recipientName: formData.recipientName,
      unit: formData.unit,
      arrivalDate: today.toISOString().split("T")[0],
      arrivalTime: `${String(today.getHours()).padStart(2, "0")}:${String(today.getMinutes()).padStart(2, "0")}`,
      status: "received",
      type: formData.type,
    };

    setCargoList((prev) => [item, ...prev]);

    if (convertingId) {
      setExpectedList((prev) => prev.filter((e) => e.id !== convertingId));
      setConvertingId(null);
    }

    closeCargoModal();
  };

  const handleDeliverCargo = (id: string) => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    setCargoList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "delivered", deliveredDate: dateStr } : item))
    );
    closeConfirmModal();
  };

  const handleReturnCargo = (id: string) => {
    setCargoList((prev) => prev.map((item) => (item.id === id ? { ...item, status: "returned" } : item)));
    closeConfirmModal();
  };

  const handleAddCourier = (formData: CourierFormData) => {
    if (!formData.company || !formData.residentName || !formData.unit) return;

    const item: CourierVisit = {
      id: `cour-${Date.now()}`,
      company: formData.company,
      residentName: formData.residentName,
      unit: formData.unit,
      status: "inside", // Manual entry starts as inside
      entryTime: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
      method: "manual",
      note: formData.note,
      plate: formData.plate ? formData.plate.toUpperCase() : "",
    };

    setCourierList((prev) => [item, ...prev]);
    closeCourierModal();
  };

  const handleCourierEntry = (id: string) => {
    setCourierList((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: "inside",
              entryTime: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
            }
          : c
      )
    );
    closeConfirmModal();
  };

  const handleCourierExit = (id: string) => {
    setCourierList((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: "completed",
              exitTime: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
            }
          : c
      )
    );
    closeConfirmModal();
  };

  const getTargetItemName = (action: "cargo_deliver" | "cargo_return" | "courier_in" | "courier_out" | null, id: string | null): string => {
    if (!id || !action) return "";

    if (action.startsWith("cargo")) {
      const item = cargoList.find((c) => c.id === id);
      return item ? `${item.recipientName} (${item.carrier})` : "";
    }

    if (action.startsWith("courier")) {
      const item = courierList.find((c) => c.id === id);
      return item ? `${item.company} Kuryesi - ${item.residentName}` : "";
    }

    return "";
  };

  return {
    handleAddCargo,
    handleDeliverCargo,
    handleReturnCargo,
    handleAddCourier,
    handleCourierEntry,
    handleCourierExit,
    getTargetItemName,
  };
}

