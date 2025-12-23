import { useState, useEffect } from "react";
import type { CargoItem, ExpectedCargo, CourierVisit } from "@/types/cargo.types";

export interface UseCargoStateReturn {
  isLoading: boolean;
  activeCategory: "cargo" | "courier";
  setActiveCategory: (category: "cargo" | "courier") => void;
  activeTab: "inventory" | "expected";
  setActiveTab: (tab: "inventory" | "expected") => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: "all" | "received" | "delivered" | "returned";
  setStatusFilter: (filter: "all" | "received" | "delivered" | "returned") => void;
  courierFilter: "all" | "pending" | "inside";
  setCourierFilter: (filter: "all" | "pending" | "inside") => void;
}

export function useCargoState(): UseCargoStateReturn {
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<"cargo" | "courier">("cargo");
  const [activeTab, setActiveTab] = useState<"inventory" | "expected">("inventory");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "received" | "delivered" | "returned">("all");
  const [courierFilter, setCourierFilter] = useState<"all" | "pending" | "inside">("all");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return {
    isLoading,
    activeCategory,
    setActiveCategory,
    activeTab,
    setActiveTab,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    courierFilter,
    setCourierFilter,
  };
}

