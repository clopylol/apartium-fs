import { useState, useEffect, useMemo } from "react";
import type { MaintenanceRequest, MaintenanceStatus, MaintenancePriority, MaintenanceCategory } from "@/types/maintenance.types";
import { ITEMS_PER_PAGE } from "@/constants/maintenance";

export interface UseMaintenanceStateReturn {
  isLoading: boolean;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterCategory: MaintenanceCategory | "All";
  setFilterCategory: (value: MaintenanceCategory | "All") => void;
  filterPriority: MaintenancePriority | "All";
  setFilterPriority: (value: MaintenancePriority | "All") => void;
  filterStatus: MaintenanceStatus | "All";
  setFilterStatus: (value: MaintenanceStatus | "All") => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (value: "asc" | "desc") => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  viewMode: "list" | "grid";
  setViewMode: (mode: "list" | "grid") => void;
  filteredRequests: MaintenanceRequest[];
  paginatedRequests: MaintenanceRequest[];
}

export function useMaintenanceState(
  requests: MaintenanceRequest[]
): UseMaintenanceStateReturn {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<MaintenanceCategory | "All">("All");
  const [filterPriority, setFilterPriority] = useState<MaintenancePriority | "All">("All");
  const [filterStatus, setFilterStatus] = useState<MaintenanceStatus | "All">("All");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterCategory, filterPriority, filterStatus]);

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

  const paginatedRequests = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRequests.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredRequests, currentPage]);

  return {
    isLoading,
    searchTerm,
    setSearchTerm,
    filterCategory,
    setFilterCategory,
    filterPriority,
    setFilterPriority,
    filterStatus,
    setFilterStatus,
    sortOrder,
    setSortOrder,
    currentPage,
    setCurrentPage,
    viewMode,
    setViewMode,
    filteredRequests,
    paginatedRequests,
  };
}

