import { useState } from "react";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import {
  MaintenanceHeader,
  MaintenanceStats,
  MaintenanceFilters,
  MaintenanceTable,
  MaintenanceGridView,
  NewRequestModal,
  RequestDetailModal,
  TestRequestModal,
} from "./components_maintenance";
// import { TabToggle } from "@/components/shared/navigation/tab-toggle";
import { Pagination } from "@/components/shared/pagination";
import { InfoBanner } from "@/components/shared/info-banner";
import { Button } from "@/components/shared/button";
import { Wrench, Search, LayoutList, LayoutGrid } from "lucide-react";
import {
  useMaintenanceModals,
  useMaintenanceRequests,
  useMaintenanceStats,
  useUpdateMaintenanceStatus,
  useCreateMaintenanceRequest,
} from "@/hooks/maintenance";
import type { MaintenanceRequest } from "@/types/maintenance.types";
import { ITEMS_PER_PAGE } from "@/constants/maintenance";

export const MaintenancePage: FC = () => {
  const { t } = useTranslation();

  // View & Filter State
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [filterPriority, setFilterPriority] = useState<string>("All");
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  // Modals
  const [showTestModal, setShowTestModal] = useState(false);

  const modals = useMaintenanceModals();

  // API Queries
  const {
    data: requestsData,
    isLoading,
    isFetching,
  } = useMaintenanceRequests({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    search: searchTerm || undefined,
    status: filterStatus === "All" ? undefined : filterStatus,
    priority: filterPriority === "All" ? undefined : filterPriority,
    category: filterCategory === "All" ? undefined : filterCategory,
    sortBy: "requestDate",
    sortOrder,
  });

  const { data: statsData, isLoading: isStatsLoading } = useMaintenanceStats();

  // Mutations
  const updateStatusMutation = useUpdateMaintenanceStatus();
  const createRequestMutation = useCreateMaintenanceRequest();

  // Transform API data to match component requirements
  const requests: MaintenanceRequest[] = (requestsData?.requests || []).map(
    (req: any) => ({
      id: req.id,
      title: req.title,
      user: req.residentName || "Bilinmeyen",
      unit: req.unitNumber || "",
      category: req.category,
      date:
        req.requestDate instanceof Date
          ? req.requestDate.toISOString().split("T")[0]
          : typeof req.requestDate === "string"
            ? req.requestDate.split("T")[0]
            : new Date().toISOString().split("T")[0],
      priority: req.priority,
      status: req.status,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(req.residentName || "U")}&background=random&color=fff`,
      description: req.description,
      attachmentUrl: req.attachmentUrl,
      buildingName: req.buildingName,
    })
  );

  const totalItems = requestsData?.total || 0;

  const handleCreateRequest = () => {
    // TODO: Get current user's residentId and unitId from context
    // For now, this won't work without proper auth context integration
    createRequestMutation.mutate(
      {
        residentId: "", // Will be populated from auth context
        unitId: "", // Will be populated from auth context
        title: modals.newRequestFormData.title,
        description: modals.newRequestFormData.description,
        category: modals.newRequestFormData.category,
        priority: modals.newRequestFormData.priority,
      },
      {
        onSuccess: () => {
          modals.closeNewRequestModal();
        },
      }
    );
  };

  const handleStatusUpdate = (
    id: string,
    status: MaintenanceRequest["status"]
  ) => {
    const completedDate =
      status === "Completed" ? new Date().toISOString() : undefined;
    updateStatusMutation.mutate(
      { id, status, completedDate },
      {
        onSuccess: () => {
          if (modals.selectedRequest && modals.selectedRequest.id === id) {
            modals.setSelectedRequest(null);
          }
        },
      }
    );
  };

  const isEmpty = !isLoading && requests.length === 0 && !searchTerm;
  const hasNoResults =
    !isLoading && requests.length === 0 && (searchTerm || filterStatus !== "All");

  // Stats for display
  const stats = {
    totalCount: statsData?.totalCount || 0,
    newCount: statsData?.newCount || 0,
    inProgressCount: statsData?.inProgressCount || 0,
    completedCount: statsData?.completedCount || 0,
    urgentCount: statsData?.urgentCount || 0,
  };

  return (
    <div className="flex flex-col h-full overflow-hidden relative bg-ds-background-light dark:bg-ds-background-dark">
      <MaintenanceHeader
        searchTerm={searchTerm}
        onSearchChange={(value) => {
          setSearchTerm(value);
          setCurrentPage(1); // Reset page on search
        }}
        onNewRequest={modals.openNewRequestModal}
      />

      <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <MaintenanceStats isLoading={isStatsLoading} requests={requests} stats={stats} />
          </div>

          <div className="flex flex-col gap-4">
            <MaintenanceFilters
              filterStatus={filterStatus as MaintenanceRequest["status"] | "All"}
              onStatusChange={(value) => {
                setFilterStatus(value);
                setCurrentPage(1);
              }}
              filterPriority={filterPriority as MaintenanceRequest["priority"] | "All"}
              onPriorityChange={(value) => {
                setFilterPriority(value);
                setCurrentPage(1);
              }}
              filterCategory={filterCategory as MaintenanceRequest["category"] | "All"}
              onCategoryChange={(value) => {
                setFilterCategory(value);
                setCurrentPage(1);
              }}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
          </div>

          {isEmpty ? (
            <div className="flex flex-col items-center justify-center p-12 text-ds-muted-light dark:text-ds-muted-dark border-2 border-dashed border-ds-border-light dark:border-ds-border-dark rounded-2xl bg-ds-card-light dark:bg-ds-card-dark">
              <Wrench className="w-12 h-12 mb-4 opacity-20" />
              <h3 className="text-ds-primary-light dark:text-ds-primary-dark font-bold text-lg mb-1">
                {t("maintenance.emptyState.title")}
              </h3>
              <p className="text-ds-secondary-light dark:text-ds-secondary-dark mb-6 max-w-sm text-center">
                {t("maintenance.emptyState.description")}
              </p>
              <Button onClick={modals.openNewRequestModal}>
                {t("maintenance.emptyState.createButton")}
              </Button>
            </div>
          ) : hasNoResults ? (
            <InfoBanner
              icon={<Search className="w-5 h-5" />}
              title={t("maintenance.noResults.title")}
              description={t("maintenance.noResults.description")}
              variant="warning"
            />
          ) : (
            <>
              {viewMode === "list" ? (
                <MaintenanceTable
                  requests={requests}
                  isLoading={isLoading || isFetching}
                  sortOrder={sortOrder}
                  onSortToggle={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                  onSelect={modals.setSelectedRequest}
                />
              ) : (
                <MaintenanceGridView
                  requests={requests}
                  isLoading={isLoading || isFetching}
                  onSelect={modals.setSelectedRequest}
                />
              )}

              {!isLoading && (
                <Pagination
                  totalItems={totalItems}
                  itemsPerPage={ITEMS_PER_PAGE}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                />
              )}

            </>
          )}

          <div className="flex justify-center pt-8 border-t border-ds-border-light dark:border-ds-border-dark mt-8">
            <Button
              variant="ghost"
              onClick={() => setShowTestModal(true)}
              className="text-xs text-ds-muted-light dark:text-ds-muted-dark hover:text-ds-in-sky-500 transition-colors"
            >
              <Wrench className="w-3 h-3 mr-2" />
              Test Talebi Oluştur (Yönetici)
            </Button>
          </div>
        </div>
      </div>

      <NewRequestModal
        isOpen={modals.showNewRequestModal}
        onClose={modals.closeNewRequestModal}
        formData={modals.newRequestFormData}
        onChange={modals.setNewRequestFormData}
        onSave={handleCreateRequest}
      />

      <RequestDetailModal
        isOpen={!!modals.selectedRequest}
        request={modals.selectedRequest}
        onClose={() => modals.setSelectedRequest(null)}
        onStatusUpdate={handleStatusUpdate}
      />

      <TestRequestModal
        isOpen={showTestModal}
        onClose={() => setShowTestModal(false)}
      />
    </div>
  );
};
