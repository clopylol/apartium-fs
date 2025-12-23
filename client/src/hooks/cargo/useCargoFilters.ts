import { useMemo } from "react";
import type { CargoItem, ExpectedCargo, CourierVisit } from "@/types/cargo.types";

export interface UseCargoFiltersProps {
  cargoList: CargoItem[];
  expectedList: ExpectedCargo[];
  courierList: CourierVisit[];
  searchTerm: string;
  statusFilter: "all" | "received" | "delivered" | "returned";
  courierFilter: "all" | "pending" | "inside";
}

export interface UseCargoFiltersReturn {
  filteredCargo: CargoItem[];
  filteredExpected: ExpectedCargo[];
  filteredCouriers: CourierVisit[];
  cargoStats: {
    totalPending: number;
    todayIncoming: number;
    delivered: number;
  };
  courierStats: {
    inside: number;
    pending: number;
    todayTotal: number;
  };
}

export function useCargoFilters({
  cargoList,
  expectedList,
  courierList,
  searchTerm,
  statusFilter,
  courierFilter,
}: UseCargoFiltersProps): UseCargoFiltersReturn {
  const filteredCargo = useMemo(() => {
    return cargoList
      .filter((item) => {
        const matchesSearch =
          item.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.trackingNo.includes(searchTerm);
        const matchesStatus = statusFilter === "all" || item.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => new Date(b.arrivalDate).getTime() - new Date(a.arrivalDate).getTime());
  }, [cargoList, searchTerm, statusFilter]);

  const filteredExpected = useMemo(() => {
    return expectedList.filter(
      (item) =>
        item.residentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.trackingNo.includes(searchTerm)
    );
  }, [expectedList, searchTerm]);

  const filteredCouriers = useMemo(() => {
    return courierList
      .filter((item) => {
        const matchesSearch =
          item.residentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.plate && item.plate.toLowerCase().includes(searchTerm.toLowerCase()));

        if (courierFilter === "all") return matchesSearch;
        return matchesSearch && item.status === courierFilter;
      })
      .sort((a, b) => {
        // Status sort: Inside > Pending > Completed
        const order = { inside: 0, pending: 1, completed: 2 };
        return order[a.status] - order[b.status];
      });
  }, [courierList, searchTerm, courierFilter]);

  const cargoStats = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return {
      totalPending: cargoList.filter((c) => c.status === "received").length,
      todayIncoming: cargoList.filter((c) => c.arrivalDate === today).length,
      delivered: cargoList.filter((c) => c.status === "delivered").length,
    };
  }, [cargoList]);

  const courierStats = useMemo(() => {
    return {
      inside: courierList.filter((c) => c.status === "inside").length,
      pending: courierList.filter((c) => c.status === "pending").length,
      todayTotal: courierList.length,
    };
  }, [courierList]);

  return {
    filteredCargo,
    filteredExpected,
    filteredCouriers,
    cargoStats,
    courierStats,
  };
}

