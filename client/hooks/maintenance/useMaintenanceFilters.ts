import { useMemo } from "react";
import type { MaintenanceRequest } from "@/types/maintenance.types";

export interface UseMaintenanceFiltersProps {
  requests: MaintenanceRequest[];
  searchTerm: string;
  filterCategory: string;
  filterPriority: string;
  filterStatus: string;
  sortOrder: "asc" | "desc";
}

export interface UseMaintenanceFiltersReturn {
  filteredRequests: MaintenanceRequest[];
  isFilterActive: boolean;
}

export function useMaintenanceFilters({
  requests,
  searchTerm,
  filterCategory,
  filterPriority,
  filterStatus,
  sortOrder,
}: UseMaintenanceFiltersProps): UseMaintenanceFiltersReturn {
  const filteredRequests = useMemo(() => {
    return requests
      .filter((req) => {
        const matchesSearch =
          req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          req.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
          req.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
          req.id.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory =
          filterCategory === "All" || req.category === filterCategory;
        const matchesPriority =
          filterPriority === "All" || req.priority === filterPriority;
        const matchesStatus =
          filterStatus === "All" || req.status === filterStatus;

        return (
          matchesSearch && matchesCategory && matchesPriority && matchesStatus
        );
      })
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      });
  }, [
    requests,
    searchTerm,
    filterCategory,
    filterPriority,
    filterStatus,
    sortOrder,
  ]);

  const isFilterActive = useMemo(() => {
    return (
      searchTerm !== "" ||
      filterStatus !== "All" ||
      filterPriority !== "All" ||
      filterCategory !== "All"
    );
  }, [searchTerm, filterStatus, filterPriority, filterCategory]);

  return {
    filteredRequests,
    isFilterActive,
  };
}

