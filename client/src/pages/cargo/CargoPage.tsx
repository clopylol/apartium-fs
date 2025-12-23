import { useState } from "react";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import {
  INITIAL_CARGO,
  INITIAL_EXPECTED,
  INITIAL_COURIERS,
} from "@/constants/cargo";
import type {
  CargoItem,
  ExpectedCargo,
  CourierVisit,
} from "@/types/cargo.types";
import {
  useCargoState,
  useCargoModals,
  useCargoActions,
  useCargoFilters,
} from "@/hooks/cargo";
import {
  CargoHeader,
  CargoStats,
  CargoInventoryTable,
  CargoInventoryControls,
  ExpectedCargoCards,
  CargoTabToggle,
  CourierTable,
  CargoFormModal,
  CourierFormModal,
} from "./components_cargo";
import { ConfirmationModal } from "@/components/shared/modals";
import { Button } from "@/components/shared/button";
import { Plus, LogIn, LogOut, CheckCircle, RotateCcw } from "lucide-react";

export const CargoPage: FC = () => {
  const { t } = useTranslation();
  const [cargoList, setCargoList] = useState<CargoItem[]>(INITIAL_CARGO);
  const [expectedList, setExpectedList] =
    useState<ExpectedCargo[]>(INITIAL_EXPECTED);
  const [courierList, setCourierList] =
    useState<CourierVisit[]>(INITIAL_COURIERS);

  const state = useCargoState();
  const modals = useCargoModals();
  const filters = useCargoFilters({
    cargoList,
    expectedList,
    courierList,
    searchTerm: state.searchTerm,
    statusFilter: state.statusFilter,
    courierFilter: state.courierFilter,
  });

  const actions = useCargoActions({
    cargoList,
    setCargoList,
    expectedList,
    setExpectedList,
    courierList,
    setCourierList,
    convertingId: modals.convertingId,
    setConvertingId: modals.setConvertingId,
    closeCargoModal: modals.closeCargoModal,
    closeCourierModal: modals.closeCourierModal,
    closeConfirmModal: modals.closeConfirmModal,
  });

  const handleAddCargo = () => {
    modals.openCargoModal();
  };

  const handleQuickAccept = (expected: ExpectedCargo) => {
    modals.openCargoModal(expected);
  };

  const handleConfirmAction = () => {
    if (!modals.targetId || !modals.confirmAction) return;

    if (modals.confirmAction === "cargo_deliver") {
      actions.handleDeliverCargo(modals.targetId);
    } else if (modals.confirmAction === "cargo_return") {
      actions.handleReturnCargo(modals.targetId);
    } else if (modals.confirmAction === "courier_in") {
      actions.handleCourierEntry(modals.targetId);
    } else if (modals.confirmAction === "courier_out") {
      actions.handleCourierExit(modals.targetId);
    }
  };

  const getConfirmModalContent = () => {
    if (!modals.confirmAction || !modals.targetId)
      return {
        title: "",
        message: "",
        variant: "default" as const,
        icon: null,
      };

    const itemName = actions.getTargetItemName(
      modals.confirmAction,
      modals.targetId
    );

    switch (modals.confirmAction) {
      case "cargo_deliver":
        return {
          title: t("cargo.modals.confirmations.deliver.title"),
          message: (
            <p>
              <strong className="text-ds-primary-light dark:text-ds-primary-dark block mb-1">
                {itemName}
              </strong>
              {t("cargo.modals.confirmations.deliver.message")}
            </p>
          ),
          variant: "success" as const,
          icon: <CheckCircle className="w-8 h-8 text-ds-in-success-500" />,
        };
      case "cargo_return":
        return {
          title: t("cargo.modals.confirmations.return.title"),
          message: (
            <p>
              <strong className="text-ds-primary-light dark:text-ds-primary-dark block mb-1">
                {itemName}
              </strong>
              {t("cargo.modals.confirmations.return.message")}
            </p>
          ),
          variant: "danger" as const,
          icon: <RotateCcw className="w-8 h-8 text-ds-in-destructive-500" />,
        };
      case "courier_in":
        return {
          title: t("cargo.modals.confirmations.courierIn.title"),
          message: (
            <p>
              <strong className="text-ds-primary-light dark:text-ds-primary-dark block mb-1">
                {itemName}
              </strong>
              {t("cargo.modals.confirmations.courierIn.message")}
            </p>
          ),
          variant: "info" as const,
          icon: <LogIn className="w-8 h-8 text-ds-in-sky-500" />,
        };
      case "courier_out":
        return {
          title: t("cargo.modals.confirmations.courierOut.title"),
          message: (
            <p>
              <strong className="text-ds-primary-light dark:text-ds-primary-dark block mb-1">
                {itemName}
              </strong>
              {t("cargo.modals.confirmations.courierOut.message")}
            </p>
          ),
          variant: "default" as const,
          icon: (
            <LogOut className="w-8 h-8 text-ds-muted-light dark:text-ds-muted-dark" />
          ),
        };
      default:
        return {
          title: "",
          message: "",
          variant: "default" as const,
          icon: null,
        };
    }
  };

  const confirmContent = getConfirmModalContent();

  return (
    <div className="flex flex-col h-full overflow-hidden relative bg-ds-background-light dark:bg-ds-background-dark">
      <CargoHeader
        activeCategory={state.activeCategory}
        onCategoryChange={state.setActiveCategory}
        searchTerm={state.searchTerm}
        onSearchChange={state.setSearchTerm}
        rightContent={
          state.activeCategory === "cargo" ? (
            <Button
              onClick={handleAddCargo}
              leftIcon={<Plus className="w-4 h-4" />}
              className="bg-ds-in-sky-600 hover:bg-ds-in-sky-500 shadow-lg shadow-ds-in-sky-900/20 whitespace-nowrap"
            >
              <span className="hidden md:inline">
                {t("cargo.header.buttons.accept")}
              </span>
              <span className="md:hidden">
                {t("cargo.header.buttons.acceptShort")}
              </span>
            </Button>
          ) : undefined
        }
      />

      <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CargoStats
              isLoading={state.isLoading}
              activeCategory={state.activeCategory}
              cargoStats={filters.cargoStats}
              expectedCount={expectedList.length}
              courierStats={filters.courierStats}
            />
          </div>

          {/* Cargo View */}
          {state.activeCategory === "cargo" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* Tab Toggle and Controls */}
              <div className="flex justify-between items-center">
                <CargoTabToggle
                  activeTab={state.activeTab}
                  onTabChange={state.setActiveTab}
                  expectedCount={expectedList.length}
                />

                {state.activeTab === "inventory" && (
                  <CargoInventoryControls
                    statusFilter={state.statusFilter}
                    onStatusFilterChange={state.setStatusFilter}
                  />
                )}
              </div>

              {/* Inventory Table */}
              {state.activeTab === "inventory" && (
                <CargoInventoryTable
                  items={filters.filteredCargo}
                  isLoading={state.isLoading}
                  statusFilter={state.statusFilter}
                  onStatusFilterChange={state.setStatusFilter}
                  onDeliver={(id) =>
                    modals.openConfirmModal("cargo_deliver", id)
                  }
                  onReturn={(id) => modals.openConfirmModal("cargo_return", id)}
                />
              )}

              {/* Expected Cards */}
              {state.activeTab === "expected" && (
                <ExpectedCargoCards
                  items={filters.filteredExpected}
                  isLoading={state.isLoading}
                  onQuickAccept={handleQuickAccept}
                />
              )}
            </div>
          )}

          {/* Courier View */}
          {state.activeCategory === "courier" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <CourierTable
                items={filters.filteredCouriers}
                isLoading={state.isLoading}
                courierFilter={state.courierFilter}
                onFilterChange={state.setCourierFilter}
                onEntry={(id) => modals.openConfirmModal("courier_in", id)}
                onExit={(id) => modals.openConfirmModal("courier_out", id)}
                rightContent={
                  <Button
                    onClick={() => modals.openCourierModal()}
                    leftIcon={<Plus className="w-4 h-4" />}
                    className="bg-ds-in-sky-600 hover:bg-ds-in-sky-500 shadow-lg shadow-ds-in-sky-900/20 whitespace-nowrap"
                  >
                    {t("cargo.modals.confirmations.courierIn.title")}
                  </Button>
                }
              />
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <CargoFormModal
        isOpen={modals.showCargoModal}
        onClose={modals.closeCargoModal}
        formData={modals.newCargo}
        onChange={modals.setNewCargo}
        onSave={actions.handleAddCargo}
        isConverting={!!modals.convertingId}
      />

      <CourierFormModal
        isOpen={modals.showCourierModal}
        onClose={modals.closeCourierModal}
        formData={modals.newCourier}
        onChange={modals.setNewCourier}
        onSave={actions.handleAddCourier}
        selectedResidentId={modals.selectedResidentId}
        onResidentSelect={modals.setSelectedResidentId}
        isManualCourier={modals.isManualCourier}
        onManualCourierChange={modals.setIsManualCourier}
      />

      <ConfirmationModal
        isOpen={modals.showConfirmModal}
        onClose={modals.closeConfirmModal}
        onConfirm={handleConfirmAction}
        title={confirmContent.title}
        message={confirmContent.message}
        variant={confirmContent.variant}
        icon={confirmContent.icon}
      />
    </div>
  );
};
