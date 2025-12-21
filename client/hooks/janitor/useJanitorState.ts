import { useState, useEffect, useMemo } from "react";
import type { Janitor, JanitorRequest } from "@/types/janitor.types";
import { ITEMS_PER_PAGE } from "@/constants/janitor";

export interface UseJanitorStateReturn {
  isLoading: boolean;
  janitors: Janitor[];
  requests: JanitorRequest[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  staffPage: number;
  setStaffPage: (page: number) => void;
  requestPage: number;
  setRequestPage: (page: number) => void;
  staffViewMode: "grid" | "list";
  setStaffViewMode: (mode: "grid" | "list") => void;
  requestViewMode: "list" | "grid";
  setRequestViewMode: (mode: "list" | "grid") => void;
  requestTypeFilter: "all" | "trash" | "market" | "cleaning" | "bread";
  setRequestTypeFilter: (filter: "all" | "trash" | "market" | "cleaning" | "bread") => void;
  requestStatusSort: "pending_first" | "completed_first";
  setRequestStatusSort: (sort: "pending_first" | "completed_first") => void;
  filteredJanitors: Janitor[];
  paginatedJanitors: Janitor[];
  filteredRequests: JanitorRequest[];
  paginatedRequests: JanitorRequest[];
  stats: {
    onDuty: number;
    activeRequests: number;
    totalStaff: number;
  };
}

export function useJanitorState(
  janitors: Janitor[],
  requests: JanitorRequest[]
): UseJanitorStateReturn {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [staffPage, setStaffPage] = useState(1);
  const [requestPage, setRequestPage] = useState(1);
  const [staffViewMode, setStaffViewMode] = useState<"grid" | "list">("grid");
  const [requestViewMode, setRequestViewMode] = useState<"list" | "grid">("list");
  const [requestTypeFilter, setRequestTypeFilter] = useState<
    "all" | "trash" | "market" | "cleaning" | "bread"
  >("all");
  const [requestStatusSort, setRequestStatusSort] = useState<
    "pending_first" | "completed_first"
  >("pending_first");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setStaffPage(1);
  }, [searchTerm]);

  useEffect(() => {
    setRequestPage(1);
  }, [searchTerm, requestTypeFilter, requestStatusSort]);

  const filteredJanitors = useMemo(() => {
    return janitors.filter((j) =>
      j.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [janitors, searchTerm]);

  const paginatedJanitors = useMemo(() => {
    const startIndex = (staffPage - 1) * ITEMS_PER_PAGE;
    return filteredJanitors.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredJanitors, staffPage]);

  const filteredRequests = useMemo(() => {
    let result = requests.filter(
      (r) =>
        r.residentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.unit.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (requestTypeFilter !== "all") {
      result = result.filter((r) => r.type === requestTypeFilter);
    }

    result.sort((a, b) => {
      if (requestStatusSort === "pending_first") {
        const statusA = a.status === "pending" ? 0 : 1;
        const statusB = b.status === "pending" ? 0 : 1;
        return statusA - statusB;
      } else {
        const statusA = a.status === "completed" ? 0 : 1;
        const statusB = b.status === "completed" ? 0 : 1;
        return statusA - statusB;
      }
    });

    return result;
  }, [requests, searchTerm, requestTypeFilter, requestStatusSort]);

  const paginatedRequests = useMemo(() => {
    const startIndex = (requestPage - 1) * ITEMS_PER_PAGE;
    return filteredRequests.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredRequests, requestPage]);

  const stats = useMemo(() => {
    return {
      onDuty: janitors.filter((j) => j.status === "on-duty").length,
      activeRequests: requests.filter((r) => r.status === "pending").length,
      totalStaff: janitors.length,
    };
  }, [janitors, requests]);

  return {
    isLoading,
    janitors,
    requests,
    searchTerm,
    setSearchTerm,
    staffPage,
    setStaffPage,
    requestPage,
    setRequestPage,
    staffViewMode,
    setStaffViewMode,
    requestViewMode,
    setRequestViewMode,
    requestTypeFilter,
    setRequestTypeFilter,
    requestStatusSort,
    setRequestStatusSort,
    filteredJanitors,
    paginatedJanitors,
    filteredRequests,
    paginatedRequests,
    stats,
  };
}

