import { useState } from "react";
import type { FC } from "react";
import type { JanitorRequest } from "@/types/janitor.types";
import {
  useJanitorState,
  useJanitorModals,
  useJanitorActions,
} from "@/hooks/janitor";
import {
  JanitorHeader,
  JanitorStats,
  JanitorStaffView,
  JanitorRequestsView,
} from "./components_janitor";
import { StaffFormModal } from "./components_janitor/staff/modals";
import { RequestDetailModal } from "./components_janitor/requests/modals";
import { ConfirmationModal } from "@/components/shared/modals";
import { useTranslation } from "react-i18next";

export const JanitorPage: FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"staff" | "requests">("staff");

  const state = useJanitorState();
  const modals = useJanitorModals();
  const actions = useJanitorActions({
    janitors: state.janitors,
    isEditing: modals.isEditing,
    selectedRequest: modals.selectedRequest,
    setSelectedRequest: modals.setSelectedRequest,
    setConfirmModal: modals.setConfirmModal,
    closeAddModal: modals.closeAddModal,
    closeConfirmModal: modals.closeConfirmModal,
  });

  const handleSave = (data: typeof modals.formData) => {
    actions.handleSaveClick(data);
  };

  const handleCompleteRequest = (request: JanitorRequest | null) => {
    if (!request) return;
    const requestTypeLabel = t(`janitor.requests.types.${request.type}` as any);
    modals.openCompleteRequestConfirm(request.id, `${request.residentName} - ${requestTypeLabel}`);
  };

  const handleConfirmCompleteRequest = () => {
    if (modals.completeRequestConfirm.requestId) {
      actions.handleCompleteRequest(modals.completeRequestConfirm.requestId);
      modals.closeCompleteRequestConfirm();
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden relative">
      <JanitorHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchTerm={state.searchTerm}
        onSearchChange={state.setSearchTerm}
        activeRequestsCount={state.stats.activeRequests}
        sites={state.sites}
        activeSiteId={state.activeSiteId}
        onSiteChange={state.setActiveSiteId}
      />

      <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <JanitorStats
              isLoading={state.isLoading}
              totalStaff={state.stats.totalStaff}
              onDuty={state.stats.onDuty}
              activeRequests={state.stats.activeRequests}
            />
          </div>

          {activeTab === "staff" && (
            <JanitorStaffView
              janitors={state.paginatedJanitors}
              isLoading={state.isLoading}
              viewMode={state.staffViewMode}
              onViewModeChange={state.setStaffViewMode}
              onAdd={modals.openAddModal}
              onEdit={modals.openEditModal}
              onDelete={actions.handleDeleteClick}
              totalItems={state.filteredJanitors.length}
              currentPage={state.staffPage}
              onPageChange={state.setStaffPage}
              buildings={state.buildings}
              activeBlockId={state.activeBlockId}
              onBlockChange={state.setActiveBlockId}
            />
          )}

          {activeTab === "requests" && (
            <JanitorRequestsView
              requests={state.paginatedRequests}
              isLoading={state.isLoading}
              viewMode={state.requestViewMode}
              onViewModeChange={state.setRequestViewMode}
              typeFilter={state.requestTypeFilter}
              onTypeFilterChange={state.setRequestTypeFilter}
              statusSort={state.requestStatusSort}
              onStatusSortChange={state.setRequestStatusSort}
              getJanitor={actions.getJanitor}
              onSelect={modals.setSelectedRequest}
              onCompleteRequest={handleCompleteRequest}
              totalItems={state.filteredRequests.length}
              currentPage={state.requestPage}
              onPageChange={state.setRequestPage}
            />
          )}
        </div>
      </div>

      <StaffFormModal
        isOpen={modals.showAddModal}
        isEditing={modals.isEditing}
        formData={modals.formData}
        onClose={modals.closeAddModal}
        onSave={handleSave}
        onChange={modals.setFormData}
        buildings={state.buildings}
      />

      <RequestDetailModal
        isOpen={!!modals.selectedRequest}
        request={modals.selectedRequest}
        assignedJanitor={actions.getJanitor(modals.selectedRequest?.assignedJanitorId)}
        onClose={() => modals.setSelectedRequest(null)}
        onComplete={handleCompleteRequest}
      />

      <ConfirmationModal
        isOpen={modals.confirmModal.isOpen}
        onClose={modals.closeConfirmModal}
        onConfirm={modals.confirmModal.onConfirm}
        title={modals.confirmModal.title}
        message={<p>{modals.confirmModal.message}</p>}
        variant={modals.confirmModal.variant}
      />

      <ConfirmationModal
        isOpen={modals.completeRequestConfirm.isOpen}
        onClose={modals.closeCompleteRequestConfirm}
        onConfirm={handleConfirmCompleteRequest}
        title={t("janitor.requests.modals.completeConfirm.title")}
        message={
          <p>
            {t("janitor.requests.modals.completeConfirm.message", {
              name: modals.completeRequestConfirm.requestName.split(" - ")[0],
              type: modals.completeRequestConfirm.requestName.split(" - ")[1] || "",
            })}
          </p>
        }
        variant="success"
      />
    </div>
  );
};

