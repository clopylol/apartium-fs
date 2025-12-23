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
} from "./components_maintenance";
import { TabToggle } from "@/components/shared/navigation/tab-toggle";
import { Pagination } from "@/components/shared/pagination";
import { InfoBanner } from "@/components/shared/info-banner";
import { Button } from "@/components/shared/button";
import { Wrench, Search, LayoutList, LayoutGrid } from "lucide-react";
import {
  useMaintenanceState,
  useMaintenanceModals,
  useMaintenanceActions,
} from "@/hooks/maintenance";
import type { MaintenanceRequest } from "@/types/maintenance.types";
import { INITIAL_REQUESTS, ITEMS_PER_PAGE } from "@/constants/maintenance";

export const MaintenancePage: FC = () => {
  const { t } = useTranslation();
  const [requests, setRequests] =
    useState<MaintenanceRequest[]>(INITIAL_REQUESTS);

  const state = useMaintenanceState(requests);
  const modals = useMaintenanceModals();
  const actions = useMaintenanceActions({
    requests,
    setRequests,
    selectedRequest: modals.selectedRequest,
    setSelectedRequest: modals.setSelectedRequest,
    closeNewRequestModal: modals.closeNewRequestModal,
  });

  const handleCreateRequest = () => {
    actions.handleCreateRequest(modals.newRequestFormData);
  };

  const handleStatusUpdate = (
    id: string,
    status: MaintenanceRequest["status"]
  ) => {
    actions.handleStatusUpdate(id, status);
  };

  const isEmpty = requests.length === 0;
  const hasNoResults =
    !isEmpty && state.filteredRequests.length === 0 && !state.isLoading;

  return (
    <div className="flex flex-col h-full overflow-hidden relative bg-ds-background-light dark:bg-ds-background-dark">
      <MaintenanceHeader
        searchTerm={state.searchTerm}
        onSearchChange={state.setSearchTerm}
        onNewRequest={modals.openNewRequestModal}
      />

      <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <MaintenanceStats isLoading={state.isLoading} requests={requests} />
          </div>

          <div className="flex flex-col gap-4">
            <MaintenanceFilters
              filterStatus={state.filterStatus as MaintenanceRequest["status"] | "All"}
              onStatusChange={state.setFilterStatus}
              filterPriority={state.filterPriority as MaintenanceRequest["priority"] | "All"}
              onPriorityChange={state.setFilterPriority}
              filterCategory={state.filterCategory as MaintenanceRequest["category"] | "All"}
              onCategoryChange={state.setFilterCategory}
              rightContent={
                <TabToggle
                  items={[
                    {
                      id: "list",
                      label: t("maintenance.viewMode.list"),
                      icon: <LayoutList className="w-4 h-4" />,
                    },
                    {
                      id: "grid",
                      label: t("maintenance.viewMode.grid"),
                      icon: <LayoutGrid className="w-4 h-4" />,
                    },
                  ]}
                  activeTab={state.viewMode}
                  onChange={state.setViewMode}
                />
              }
            />
          </div>

          {isEmpty && !state.isLoading ? (
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
              {state.viewMode === "list" ? (
                <MaintenanceTable
                  requests={state.paginatedRequests}
                  isLoading={state.isLoading}
                  sortOrder={state.sortOrder}
                  onSortToggle={() =>
                    state.setSortOrder(
                      state.sortOrder === "asc" ? "desc" : "asc"
                    )
                  }
                  onSelect={modals.setSelectedRequest}
                />
              ) : (
                <MaintenanceGridView
                  requests={state.paginatedRequests}
                  isLoading={state.isLoading}
                  onSelect={modals.setSelectedRequest}
                />
              )}

              {!state.isLoading && (
                <Pagination
                  totalItems={state.filteredRequests.length}
                  itemsPerPage={ITEMS_PER_PAGE}
                  currentPage={state.currentPage}
                  onPageChange={state.setCurrentPage}
                />
              )}
            </>
          )}
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
    </div>
  );
};

