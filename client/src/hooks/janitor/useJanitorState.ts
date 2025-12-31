import { useState, useMemo, useEffect } from "react";
import { ITEMS_PER_PAGE } from "@/constants/janitor";
import { useJanitors } from "./useJanitors";
import { useJanitorRequests } from "./useJanitorRequests";
import { useJanitorStats } from "./useJanitorStats";
import { useSites } from "@/hooks/residents/site";
import { useBuildings } from "@/hooks/residents/api";
import type { Janitor, JanitorRequest } from "@/types/janitor.types";
import type { Building, Site } from "@/types/residents.types";

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
  requestStatusFilter: "pending" | "completed" | "all";
  setRequestStatusFilter: (filter: "pending" | "completed" | "all") => void;
  requestSortField: string | null;
  requestSortDirection: "asc" | "desc";
  handleRequestSort: (field: string) => void;
  filteredJanitors: Janitor[];
  paginatedJanitors: Janitor[];
  filteredRequests: JanitorRequest[];
  paginatedRequests: JanitorRequest[];
  stats: {
    onDuty: number;
    activeRequests: number;
    averageCompletionTime: number;
    totalStaff: number;
  };
  // New props for dynamic location data
  sites: Site[];
  activeSiteId: string | null;
  setActiveSiteId: (id: string) => void;
  buildings: Building[];
  activeBlockId: string | null;
  setActiveBlockId: (id: string | null) => void;
}

export function useJanitorState(): UseJanitorStateReturn {
  // UI State
  const [searchTerm, setSearchTerm] = useState("");
  const [staffPage, setStaffPage] = useState(1);
  const [requestPage, setRequestPage] = useState(1);
  const [staffViewMode, setStaffViewMode] = useState<"grid" | "list">("grid");
  const [requestViewMode, setRequestViewMode] = useState<"list" | "grid">("list");
  const [requestTypeFilter, setRequestTypeFilter] = useState<
    "all" | "trash" | "market" | "cleaning" | "bread"
  >("all");
  const [requestStatusFilter, setRequestStatusFilter] = useState<
    "pending" | "completed" | "all"
  >("pending");
  const [requestSortField, setRequestSortField] = useState<string | null>("openedAt");
  const [requestSortDirection, setRequestSortDirection] = useState<"asc" | "desc">("desc");

  // Location State
  const [activeSiteId, setActiveSiteId] = useState<string | null>(null);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);

  useEffect(() => {
    setStaffPage(1);
  }, [searchTerm, activeSiteId, activeBlockId]);

  useEffect(() => {
    setRequestPage(1);
  }, [searchTerm, requestTypeFilter, requestStatusFilter, requestSortField, requestSortDirection]);

  // Data Fetching
  const { sites, isLoading: isLoadingSites } = useSites();
  const { data: buildingsData, isLoading: isLoadingBuildings } = useBuildings();
  const allBuildings = buildingsData?.buildings || [];

  // Set default site
  useEffect(() => {
    if (sites.length > 0 && !activeSiteId) {
      setActiveSiteId(sites[0].id);
    }
  }, [sites, activeSiteId]);

  // Compute buildings for active site
  const buildings = useMemo(() => {
    if (!activeSiteId) return [];
    return allBuildings.filter((b: Building) => b.siteId === activeSiteId);
  }, [allBuildings, activeSiteId]);

  // Reset active block when site changes
  useEffect(() => {
    setActiveBlockId(null);
  }, [activeSiteId]);

  // Fetch Janitors filtered by Site
  // Assuming useJanitors hook handles the filters.siteId logic
  const { data: janitors = [], isLoading: isLoadingJanitors } = useJanitors({
    siteId: activeSiteId || undefined
  });

  const { data: requestsData, isLoading: isLoadingRequests } = useJanitorRequests({
    page: requestPage,
    limit: ITEMS_PER_PAGE,
    search: searchTerm,
    status: requestStatusFilter,
    type: requestTypeFilter,
    sortBy: requestSortField || undefined,
    sortOrder: requestSortDirection,
  });

  const { data: statsData, isLoading: isLoadingStats } = useJanitorStats();

  const requests = (requestsData?.requests || []) as JanitorRequest[];

  const handleRequestSort = (field: string) => {
    if (requestSortField === field) {
      setRequestSortDirection(requestSortDirection === "asc" ? "desc" : "asc");
    } else {
      setRequestSortField(field);
      setRequestSortDirection("desc");
    }
    setRequestPage(1);
  };

  // Derived State for Janitors (Client-side filtering for Block & Search)
  const filteredJanitors = useMemo(() => {
    let result = janitors;

    // Filter by Block
    if (activeBlockId) {
      const activeBlock = buildings.find((b: Building) => b.id === activeBlockId);
      if (activeBlock) {
        result = result.filter((j: Janitor) =>
          j.assignedBlocks.some((b: any) => b.id === activeBlockId)
        );
      }
    }

    // Filter by Search
    if (searchTerm) {
      result = result.filter((j: Janitor) =>
        j.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return result;
  }, [janitors, searchTerm, activeBlockId, buildings]);

  const paginatedJanitors = useMemo(() => {
    const startIndex = (staffPage - 1) * ITEMS_PER_PAGE;
    return filteredJanitors.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredJanitors, staffPage]);

  // Derived State for Requests API
  const paginatedRequests = requests;
  const filteredRequests = requests;

  const stats = useMemo(() => {
    if (statsData) return statsData;
    return {
      onDuty: 0,
      activeRequests: 0,
      totalStaff: 0,
    };
  }, [statsData]);

  const isLoading = isLoadingJanitors || isLoadingRequests || isLoadingStats || isLoadingSites || isLoadingBuildings;

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
    requestStatusFilter,
    setRequestStatusFilter,
    requestSortField,
    requestSortDirection,
    handleRequestSort,
    filteredJanitors,
    paginatedJanitors,
    filteredRequests,
    paginatedRequests,
    stats,
    // Location Data
    sites,
    activeSiteId,
    setActiveSiteId,
    buildings,
    activeBlockId,
    setActiveBlockId,
  };
}
