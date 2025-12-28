import { useState, useRef, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

// Hooks
import {
    useResidentsState,
    useParkingState,
    useGuestState,
    useModalState,
    useResidentActions,
    useBuildingActions,
    useParkingActions,
    useGuestActions,
} from "@/hooks/residents";
import { useGuestMutations } from "@/hooks/residents/api";
import { useKeyboardShortcuts } from "@/hooks/residents/resident/useKeyboardShortcuts";

// Components
import { ResidentsHeader } from "./components_residents/shared/header";
import { ResidentsView, ParkingView, GuestsView } from "./components_residents/views";
import { ErrorBoundary } from "@/components/shared/error-boundary/ErrorBoundary";

// Modals
import { ConfirmationModal } from "@/components/shared/modals";
import { AddResidentModal } from "./components_residents/resident/modals/add-resident-modal";
import { EditBlockModal } from "./components_residents/resident/modals/edit-block-modal";
import { AddBlockModal } from "./components_residents/resident/modals/add-block-modal";
import { ParkingSpotModal } from "./components_residents/parking/modals/parking-spot-modal";
import { AddGuestModal } from "./components_residents/guests/modals/add-guest-modal";
import { VehicleManagementModal } from "./components_residents/resident/modals/vehicle-management-modal";
import { EditResidentModal } from "./components_residents/resident/modals/edit-resident-modal";
import { GuestDetailModal } from "./components_residents/guests/modals/guest-detail-modal";
import { EditGuestModal } from "./components_residents/guests/modals/edit-guest-modal";
import { formatLicensePlateForDisplay } from "@/utils/validation";
import { FloorManagementModal } from "./components_residents/parking/modals/floor-management-modal";
import { AssignVehicleModal } from "./components_residents/parking/modals/assign-vehicle-modal";

export function ResidentsPage() {
    const { t } = useTranslation();
    
    // Active Tab State
    const [activeTab, setActiveTab] = useState<"residents" | "parking" | "guests">("residents");

    // Search input ref for keyboard shortcuts
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Initialize State Hooks
    const residentsState = useResidentsState();
    const parkingState = useParkingState();
    const guestState = useGuestState(residentsState.debouncedSearchTerm);
    const modalState = useModalState();

    // Initialize Action Hooks
    const residentActions = useResidentActions({
        buildingId: residentsState.activeBlockId,
        openAddResidentModal: modalState.openAddResidentModal,
        closeAddResidentModal: modalState.closeAddResidentModal,
        openEditResidentModal: modalState.openEditResidentModal,
        closeEditResidentModal: modalState.closeEditResidentModal,
        openDeleteResidentConfirm: modalState.openDeleteResidentConfirm,
        closeDeleteResidentConfirm: modalState.closeDeleteResidentConfirm,
        openVehicleManager: modalState.openVehicleManager,
        closeVehicleManager: modalState.closeVehicleManager,
        deleteResidentConfirm: modalState.deleteResidentConfirm,
        editingResident: modalState.editingResident,
    });

    const buildingActions = useBuildingActions({
        buildings: residentsState.buildings,
        setBuildings: residentsState.setBuildings,
        setActiveBlockId: residentsState.setActiveBlockId,
        activeBlock: residentsState.activeBlock,
        openAddBlockModal: modalState.openAddBlockModal,
        closeAddBlockModal: modalState.closeAddBlockModal,
        openBuildingModal: modalState.openBuildingModal,
        closeBuildingModal: modalState.closeBuildingModal,
        openDeleteBuildingConfirm: modalState.openDeleteBuildingConfirm,
        closeDeleteBuildingConfirm: modalState.closeDeleteBuildingConfirm,
        deleteBuildingConfirm: modalState.deleteBuildingConfirm,
    });

    // Keyboard shortcuts
    const handleSearchFocus = useCallback(() => {
        searchInputRef.current?.focus();
    }, []);

    const handleToggleView = useCallback(() => {
        residentsState.setResidentViewMode(
            residentsState.residentViewMode === "grid" ? "list" : "grid"
        );
    }, [residentsState.residentViewMode, residentsState.setResidentViewMode]);

    const hasActiveFilters = useMemo(() => {
        return (
            residentsState.typeFilter !== "all" ||
            residentsState.unitStatusFilter !== "all" ||
            residentsState.vehicleFilter !== "all" ||
            residentsState.floorFilter !== "all" ||
            (residentsState.debouncedSearchTerm && residentsState.debouncedSearchTerm.length > 0)
        );
    }, [
        residentsState.typeFilter,
        residentsState.unitStatusFilter,
        residentsState.vehicleFilter,
        residentsState.floorFilter,
        residentsState.debouncedSearchTerm,
    ]);

    useKeyboardShortcuts({
        enabled: activeTab === "residents",
        onSearchFocus: handleSearchFocus,
        onClearFilters: residentsState.clearAllFilters,
        onToggleView: handleToggleView,
        hasActiveFilters,
    });

    const parkingActions = useParkingActions({
        buildings: residentsState.buildings,
        setBuildings: residentsState.setBuildings,
        activeBlockId: residentsState.activeBlockId,
        activeBlock: residentsState.activeBlock,
        activeParkingFloor: parkingState.activeParkingFloor,
        guestList: guestState.guestList,
        setGuestList: guestState.setGuestList,
        searchTerm: residentsState.debouncedSearchTerm,
        openAddSpotModal: modalState.openAddSpotModal,
        openEditSpotModal: modalState.openEditSpotModal,
        openDeleteSpotModal: modalState.openDeleteSpotModal,
        closeSpotModal: modalState.closeSpotModal,
        spotModalMode: modalState.spotModalMode,
        spotForm: modalState.spotForm,
    });

    const guestActions = useGuestActions({
        setCheckInConfirm: modalState.setCheckInConfirm,
        setCheckOutConfirm: modalState.setCheckOutConfirm,
        setDeleteGuestConfirm: modalState.setDeleteGuestConfirm,
        checkInConfirm: modalState.checkInConfirm,
        checkOutConfirm: modalState.checkOutConfirm,
        deleteGuestConfirm: modalState.deleteGuestConfirm,
        setSelectedGuest: modalState.setSelectedGuest,
        closeGuestModal: modalState.closeGuestModal,
    });

    const { updateGuest } = useGuestMutations();

    return (
        <div className="flex flex-col h-full bg-slate-950 overflow-hidden relative">
            {/* Header */}
            <ResidentsHeader
                ref={searchInputRef}
                sites={residentsState.sites}
                activeSiteId={residentsState.activeSiteId}
                onSiteChange={residentsState.setActiveSiteId}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                localSearchTerm={residentsState.localSearchTerm}
                onSearchChange={residentsState.setLocalSearchTerm}
            />

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Residents View */}
                    {activeTab === "residents" && (
                        <ErrorBoundary
                            onRetry={() => {
                                residentsState.clearAllFilters();
                                residentsState.setCurrentPage(1);
                            }}
                        >
                            <ResidentsView
                            buildings={residentsState.buildings}
                            activeBlockId={residentsState.activeBlockId}
                            activeBlock={residentsState.activeBlock}
                            paginatedUnits={residentsState.paginatedUnits}
                            filteredUnits={residentsState.filteredUnits}
                            currentPage={residentsState.currentPage}
                            stats={residentsState.stats}
                            residentViewMode={residentsState.residentViewMode}
                            isLoading={residentsState.loadingStates.residents}
                            typeFilter={residentsState.typeFilter}
                            onTypeChange={residentsState.setTypeFilter}
                            unitStatusFilter={residentsState.unitStatusFilter}
                            onUnitStatusChange={residentsState.setUnitStatusFilter}
                            vehicleFilter={residentsState.vehicleFilter}
                            onVehicleChange={residentsState.setVehicleFilter}
                            floorFilter={residentsState.floorFilter}
                            onFloorChange={residentsState.setFloorFilter}
                            availableFloors={residentsState.availableFloors}
                            debouncedSearchTerm={residentsState.debouncedSearchTerm}
                            onClearFilters={residentsState.clearAllFilters}
                            onBlockChange={residentsState.setActiveBlockId}
                            onAddBuilding={buildingActions.handleOpenAddBuilding}
                            onEditBuilding={buildingActions.handleOpenEditBuilding}
                            onDeleteBuilding={buildingActions.handleOpenDeleteBuilding}
                            onViewModeChange={residentsState.setResidentViewMode}
                            onPageChange={residentsState.setCurrentPage}
                            onAddResident={residentActions.handleOpenAddResident}
                            onEditResident={residentActions.handleOpenEditResident}
                            onDeleteResident={residentActions.handleOpenDeleteResident}
                            onManageVehicles={residentActions.handleOpenVehicleManager}
                        />
                        </ErrorBoundary>
                    )}

                    {/* Parking View */}
                    {activeTab === "parking" && (
                        <ParkingView
                            buildings={residentsState.buildings}
                            activeBlockId={residentsState.activeBlockId}
                            activeBlock={residentsState.activeBlock}
                            parkingGridData={parkingActions.parkingGridData}
                            activeParkingFloor={parkingState.activeParkingFloor}
                            availableFloors={parkingState.availableFloors}
                            onFloorChange={parkingState.setActiveParkingFloor}
                            onAddSpot={parkingActions.handleOpenAddSpot}
                            onEditSpot={parkingActions.handleOpenEditSpot}
                            onDeleteSpot={parkingActions.handleOpenDeleteSpot}
                            blockName={residentsState.activeBlock?.name || ""}
                            onManageFloors={() => parkingState.setShowFloorManager(true)}
                            allVehicles={parkingActions.allVehicles}
                            isLoading={residentsState.loadingStates.parking}
                            parkingStats={parkingActions.parkingStats}
                            onAssignVehicle={(spot) => modalState.openAssignVehicleModal(spot)}
                            onUnassignVehicle={parkingActions.handleUnassignVehicle}
                            onDeleteVehicle={parkingActions.handleDeleteVehicle}
                            onBlockChange={residentsState.setActiveBlockId}
                            onAddBuilding={buildingActions.handleOpenAddBuilding}
                            onEditBuilding={buildingActions.handleOpenEditBuilding}
                            onDeleteBuilding={buildingActions.handleOpenDeleteBuilding}
                        />
                    )}

                    {/* Guests View */}
                    {activeTab === "guests" && (
                        <GuestsView
                            buildings={residentsState.buildings}
                            activeBlockId={residentsState.activeBlockId}
                            activeBlock={residentsState.activeBlock}
                            guestStats={guestState.guestStats}
                            guestFilter={guestState.guestFilter}
                            onFilterChange={guestState.setGuestFilter}
                            onAddGuest={modalState.openGuestModal}
                            filteredGuests={guestState.filteredGuests}
                            onGuestSelect={modalState.setSelectedGuest}
                            onEditGuest={(guest) => {
                                // Only allow editing if status is pending
                                if (guest.status === 'pending') {
                                    modalState.openEditGuestModal(guest);
                                }
                            }}
                            onDeleteGuest={guestActions.handleDeleteGuest}
                            isLoading={residentsState.loadingStates.guests}
                            onBlockChange={residentsState.setActiveBlockId}
                            onAddBuilding={buildingActions.handleOpenAddBuilding}
                            onEditBuilding={buildingActions.handleOpenEditBuilding}
                            onDeleteBuilding={buildingActions.handleOpenDeleteBuilding}
                            dateRange={guestState.dateRange}
                            setDateRange={guestState.setDateRange}
                            sortBy={guestState.sortBy}
                            sortOrder={guestState.sortOrder}
                            onSortChange={(sortBy, sortOrder) => {
                                guestState.setSortBy(sortBy);
                                guestState.setSortOrder(sortOrder);
                            }}
                            currentPage={guestState.currentPage}
                            totalPages={guestState.totalPages}
                            totalItems={guestState.totalItems}
                            onPageChange={guestState.setCurrentPage}
                        />
                    )}
                </div>
            </div>

            {/* ===== MODALS ===== */}

            {/* Delete Resident Confirmation */}
            <ConfirmationModal
                isOpen={modalState.deleteResidentConfirm.isOpen}
                onClose={modalState.closeDeleteResidentConfirm}
                onConfirm={residentActions.handleConfirmDeleteResident}
                title={t("residents.modals.deleteResident.title")}
                message={
                    <p>
                        {t("residents.modals.deleteResident.message", {
                            name: modalState.deleteResidentConfirm.residentName,
                        })}
                    </p>
                }
                variant="danger"
            />

            {/* Delete Building Confirmation */}
            <ConfirmationModal
                isOpen={modalState.deleteBuildingConfirm.isOpen}
                onClose={modalState.closeDeleteBuildingConfirm}
                onConfirm={buildingActions.handleConfirmDeleteBuilding}
                title={t("residents.modals.deleteBuilding.title")}
                message={
                    <>
                        {t("residents.modals.deleteBuilding.message", {
                            name: modalState.deleteBuildingConfirm.buildingName,
                        })}
                        <br />
                        <br />
                        <span className="text-slate-400">{t("residents.modals.deleteBuilding.warning")}</span>
                    </>
                }
                variant="danger"
            />

            {/* Add Resident Modal */}
            <AddResidentModal
                isOpen={modalState.showAddModal}
                onClose={modalState.closeAddResidentModal}
                onSave={residentActions.handleSaveResident}
                sites={residentsState.sites}
                buildings={residentsState.buildings}
                activeBuildingData={residentsState.buildingData}
                initialSiteId={residentsState.activeSiteId || undefined}
                initialBlockId={modalState.addModalProps.blockId}
                initialUnitId={modalState.addModalProps.unitId}
            />

            {/* Edit Block Modal */}
            <EditBlockModal
                isOpen={modalState.showBuildingModal}
                onClose={modalState.closeBuildingModal}
                onSave={buildingActions.handleSaveBuilding}
                currentName={residentsState.activeBlock?.name || ""}
            />

            {/* Add Block Modal */}
            <AddBlockModal
                isOpen={modalState.showAddBlockModal}
                onClose={modalState.closeAddBlockModal}
                onSave={buildingActions.handleSaveNewBuilding}
            />

            {/* Parking Spot Modal */}
            <ParkingSpotModal
                isOpen={modalState.showSpotModal}
                mode={modalState.spotModalMode}
                spotData={modalState.spotForm}
                onClose={modalState.closeSpotModal}
                onSubmit={parkingActions.handleSpotSubmit}
                onSpotChange={modalState.setSpotForm}
            />

            {/* Add Guest Modal */}
            <AddGuestModal
                isOpen={modalState.showGuestModal}
                onClose={modalState.closeGuestModal}
                onSubmit={guestActions.handleAddGuest}
                sites={residentsState.sites}
                buildings={residentsState.buildings}
            />

            {/* Vehicle Management Modal */}
            {modalState.managingResident && (
                <VehicleManagementModal
                    isOpen={modalState.showVehicleManager}
                    onClose={modalState.closeVehicleManager}
                    resident={modalState.managingResident.resident}
                    blockId={modalState.managingResident.blockId}
                    unitId={modalState.managingResident.unitId}
                    buildings={residentsState.buildings}
                    activeBlock={residentsState.activeBlock}
                    onUpdateResident={residentActions.handleUpdateResidentVehicles}
                />
            )}

            {/* Edit Resident Modal */}
            {modalState.editingResident && (
                <EditResidentModal
                    isOpen={modalState.showEditResidentModal}
                    onClose={modalState.closeEditResidentModal}
                    onSave={residentActions.handleSaveEditResident}
                    resident={modalState.editingResident.resident}
                    blockId={modalState.editingResident.blockId}
                    unitId={modalState.editingResident.unitId}
                    sites={residentsState.sites}
                    buildings={residentsState.buildings}
                />
            )}

            {/* Guest Detail Modal */}
            {modalState.selectedGuest && (
                <GuestDetailModal
                    isOpen={!!modalState.selectedGuest}
                    onClose={() => modalState.setSelectedGuest(null)}
                    guest={modalState.selectedGuest}
                    onCheckIn={guestActions.handleCheckInClick}
                    onCheckOut={guestActions.handleCheckOutClick}
                    onEdit={(guest) => {
                        // Only allow editing if status is pending
                        if (guest.status === 'pending') {
                            modalState.setSelectedGuest(null);
                            modalState.openEditGuestModal(guest);
                        }
                    }}
                />
            )}

            {/* Edit Guest Modal */}
            {modalState.editingGuest && (
                <EditGuestModal
                    isOpen={modalState.showEditGuestModal}
                    onClose={modalState.closeEditGuestModal}
                    guest={modalState.editingGuest}
                    sites={residentsState.sites}
                    buildings={residentsState.buildings}
                    onSave={async (guestData) => {
                        try {
                            await updateGuest.mutateAsync({
                                id: guestData.id,
                                data: {
                                    unitId: guestData.unitId,
                                    guestName: guestData.guestName,
                                    plate: guestData.plate,
                                    model: guestData.model,
                                    color: guestData.color,
                                    durationDays: guestData.durationDays,
                                    note: guestData.note,
                                    parkingSpotId: guestData.parkingSpotId,
                                },
                            });
                            modalState.closeEditGuestModal();
                        } catch (error) {
                            showError(t("residents.guests.errors.failedToUpdate") || "Misafir güncellenemedi");
                            console.error('Failed to update guest:', error);
                        }
                    }}
                />
            )}

            {/* Delete Guest Confirmation */}
            <ConfirmationModal
                isOpen={modalState.deleteGuestConfirm.isOpen}
                onClose={() => modalState.setDeleteGuestConfirm({ isOpen: false, guestId: null })}
                onConfirm={guestActions.confirmDeleteGuest}
                title={t("residents.modals.deleteGuest.title") || "Misafir Kaydını Sil"}
                message={
                    <div className="flex flex-col items-center gap-2">
                        {(() => {
                            const guest = guestState.guestList.find((g) => g.id === modalState.deleteGuestConfirm.guestId);
                            if (!guest) return null;
                            return (
                                <>
                                    <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 w-full mb-2">
                                        <div className="text-xl font-bold text-white font-mono text-center tracking-wider">{formatLicensePlateForDisplay(guest.plate)}</div>
                                        <div className="text-sm text-slate-400 text-center mt-1">{guest.guestName || t("residents.messages.anonymousGuest")}</div>
                                    </div>
                                    <p>{t("residents.modals.deleteGuest.message") || "Bu misafir kaydını silmek istediğinizden emin misiniz?"}</p>
                                </>
                            );
                        })()}
                    </div>
                }
                variant="danger"
                confirmText={t("residents.modals.deleteGuest.confirmText") || "Sil"}
            />

            {/* Check In Confirmation */}
            <ConfirmationModal
                isOpen={modalState.checkInConfirm.isOpen}
                onClose={() => modalState.setCheckInConfirm({ isOpen: false, guestId: null })}
                onConfirm={guestActions.confirmCheckIn}
                title={t("residents.modals.checkIn.title")}
                message={
                    <div className="flex flex-col items-center gap-2">
                        {(() => {
                            const guest = guestState.guestList.find((g) => g.id === modalState.checkInConfirm.guestId);
                            if (!guest) return null;
                            return (
                                <>
                                    <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 w-full mb-2">
                                        <div className="text-xl font-bold text-white font-mono text-center tracking-wider">{formatLicensePlateForDisplay(guest.plate)}</div>
                                        <div className="text-sm text-slate-400 text-center mt-1">{guest.guestName || t("residents.messages.anonymousGuest")}</div>
                                    </div>
                                    <p>{t("residents.modals.checkIn.message")}</p>
                                </>
                            );
                        })()}
                    </div>
                }
                variant="info"
                confirmText={t("residents.modals.checkIn.confirmText")}
            />

            {/* Check Out Confirmation */}
            <ConfirmationModal
                isOpen={modalState.checkOutConfirm.isOpen}
                onClose={() => modalState.setCheckOutConfirm({ isOpen: false, guestId: null })}
                onConfirm={guestActions.confirmCheckOut}
                title={t("residents.modals.checkOut.title")}
                message={
                    <div className="flex flex-col items-center gap-2">
                        {(() => {
                            const guest = guestState.guestList.find((g) => g.id === modalState.checkOutConfirm.guestId);
                            if (!guest) return null;
                            return (
                                <>
                                    <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 w-full mb-2">
                                        <div className="text-xl font-bold text-white font-mono text-center tracking-wider">{formatLicensePlateForDisplay(guest.plate)}</div>
                                        <div className="text-sm text-slate-400 text-center mt-1">{guest.guestName || t("residents.messages.anonymousGuest")}</div>
                                    </div>
                                    <p>{t("residents.modals.checkOut.message")}</p>
                                </>
                            );
                        })()}
                    </div>
                }
                variant="danger"
                confirmText={t("residents.modals.checkOut.confirmText")}
            />

            {/* Floor Management Modal */}
            <FloorManagementModal
                isOpen={parkingState.showFloorManager}
                onClose={() => parkingState.setShowFloorManager(false)}
                floors={parkingState.availableFloors}
                onAddFloor={parkingState.handleAddFloor}
                onDeleteFloor={parkingState.handleDeleteFloor}
            />

            {/* Assign Vehicle Modal */}
            <AssignVehicleModal
                isOpen={modalState.showAssignVehicleModal}
                onClose={modalState.closeAssignVehicleModal}
                spot={modalState.assignVehicleSpot}
                vehicles={parkingActions.allVehicles}
                onAssign={parkingActions.handleAssignVehicle}
            />
        </div>
    );
}
