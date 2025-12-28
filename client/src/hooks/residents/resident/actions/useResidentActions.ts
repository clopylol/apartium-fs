import type { Resident, ResidentVehicle } from "@/types/residents.types";
import { useResidentMutations } from "@/hooks/residents/api";
import { showError, showSuccess } from "@/utils/toast";
import { api } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

export interface ResidentActionsParams {
    buildingId: string | null;
    openAddResidentModal: (blockId?: string, unitId?: string) => void;
    closeAddResidentModal: () => void;
    openEditResidentModal: (resident: Resident, blockId: string, unitId: string) => void;
    closeEditResidentModal: () => void;
    openDeleteResidentConfirm: (residentId: string, residentName: string, blockId: string, unitId: string) => void;
    closeDeleteResidentConfirm: () => void;
    openVehicleManager: (resident: Resident, blockId: string, unitId: string) => void;
    closeVehicleManager: () => void;
    deleteResidentConfirm: {
        isOpen: boolean;
        residentId: string;
        residentName: string;
        blockId: string;
        unitId: string;
    };
    editingResident: { resident: Resident; blockId: string; unitId: string } | null;
}

export interface ResidentActionsReturn {
    handleOpenAddResident: (blockId?: string, unitId?: string) => void;
    handleSaveResident: (residentData: any) => void;
    handleOpenDeleteResident: (residentId: string, residentName: string, blockId: string, unitId: string) => void;
    handleConfirmDeleteResident: () => void;
    handleOpenEditResident: (resident: Resident, blockId: string, unitId: string) => void;
    handleSaveEditResident: (updatedData: Partial<Resident>) => void;
    handleOpenVehicleManager: (resident: Resident, blockId: string, unitId: string) => void;
    handleUpdateResidentVehicles: (residentId: string, vehicles: ResidentVehicle[]) => void;
}

export function useResidentActions(params: ResidentActionsParams): ResidentActionsReturn {
    const {
        buildingId,
        openAddResidentModal,
        closeAddResidentModal,
        openEditResidentModal,
        closeEditResidentModal,
        openDeleteResidentConfirm,
        closeDeleteResidentConfirm,
        openVehicleManager,
        closeVehicleManager,
        deleteResidentConfirm,
        editingResident,
    } = params;

    // ✅ Use API mutations
    const { createResident, updateResident, deleteResident } = useResidentMutations(buildingId);
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    const handleOpenAddResident = (blockId?: string, unitId?: string) => {
        openAddResidentModal(blockId, unitId);
    };

    const handleSaveResident = async (residentData: any) => {
        // Validate unitId before sending
        if (!residentData.unitId || residentData.unitId.trim() === "") {
            showError(t("residents.messages.unitRequired"));
            return;
        }
        
        try {
            await createResident.mutateAsync({
                unitId: residentData.unitId,
                name: residentData.name,
                type: residentData.type,
                phone: residentData.phone,
                email: residentData.email || null,
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(residentData.name)}&background=random&color=fff`,
            });
            closeAddResidentModal();
        } catch (error) {
            // Error handled by mutation
            console.error('Failed to create resident:', error);
        }
    };

    const handleOpenDeleteResident = (
        residentId: string,
        residentName: string,
        blockId: string,
        unitId: string
    ) => {
        openDeleteResidentConfirm(residentId, residentName, blockId, unitId);
    };

    const handleConfirmDeleteResident = async () => {
        const { residentId } = deleteResidentConfirm;
        try {
            await deleteResident.mutateAsync(residentId);
        closeDeleteResidentConfirm();
        } catch (error) {
            // Error handled by mutation
            console.error('Failed to delete resident:', error);
        }
    };

    const handleOpenEditResident = (resident: Resident, blockId: string, unitId: string) => {
        openEditResidentModal(resident, blockId, unitId);
    };

    const handleSaveEditResident = async (updatedData: Partial<Resident>) => {
        if (!editingResident) return;

        try {
            await updateResident.mutateAsync({
                id: editingResident.resident.id,
                data: updatedData,
            });
        closeEditResidentModal();
        } catch (error) {
            // Error handled by mutation
            console.error('Failed to update resident:', error);
        }
    };

    const handleOpenVehicleManager = (resident: Resident, blockId: string, unitId: string) => {
        openVehicleManager(resident, blockId, unitId);
    };

    const handleUpdateResidentVehicles = async (residentId: string, vehicles: ResidentVehicle[]) => {
        try {
            // Get current vehicles from backend to detect deletions
            const currentVehiclesResponse = await api.residents.getVehiclesByResidentId(residentId);
            const currentVehicles = currentVehiclesResponse.vehicles || [];
            const currentVehicleIds = new Set(currentVehicles.map(v => v.id));
            const newVehicleIds = new Set(vehicles.map(v => v.id).filter(id => !id.startsWith('vehicle-')));
            
            // Find vehicles to delete (exist in backend but not in new list)
            const vehiclesToDelete = currentVehicles.filter(v => !newVehicleIds.has(v.id));
            
            // Delete removed vehicles
            const deletePromises = vehiclesToDelete.map(vehicle => 
                api.residents.deleteVehicle(vehicle.id)
            );
            
            // Create or update vehicles
            const vehiclePromises = vehicles.map(async (vehicle) => {
                // Skip temporary IDs (frontend-generated) - these are new vehicles
                if (vehicle.id.startsWith('vehicle-')) {
                    // New vehicle - create it
                    return api.residents.createVehicle({
                        residentId,
                        plate: vehicle.plate,
                        brandId: vehicle.brandId || null,
                        modelId: vehicle.modelId || null,
                        model: vehicle.model || null,
                        color: vehicle.color || null,
                        fuelType: vehicle.fuelType || null,
                        parkingSpotId: vehicle.parkingSpotId || null,
                    });
                } else {
                    // Existing vehicle - update it
                    return api.residents.updateVehicle(vehicle.id, {
                        plate: vehicle.plate,
                        brandId: vehicle.brandId || null,
                        modelId: vehicle.modelId || null,
                        model: vehicle.model || null,
                        color: vehicle.color || null,
                        fuelType: vehicle.fuelType || null,
                        parkingSpotId: vehicle.parkingSpotId || null,
                    });
                }
            });

            // Execute all operations in parallel
            await Promise.all([...deletePromises, ...vehiclePromises]);
            
            // Invalidate React Query cache to refresh data
            if (buildingId) {
                queryClient.invalidateQueries({ queryKey: ['residents', 'building-data', buildingId] });
            }
            queryClient.invalidateQueries({ queryKey: ['residents', residentId, 'vehicles'] });
            
            showSuccess("Araçlar başarıyla güncellendi");
            closeVehicleManager();
        } catch (error: any) {
            console.error('Failed to update vehicles:', error);
            showError(error?.message || "Araçlar güncellenirken hata oluştu");
        }
    };

    return {
        handleOpenAddResident,
        handleSaveResident,
        handleOpenDeleteResident,
        handleConfirmDeleteResident,
        handleOpenEditResident,
        handleSaveEditResident,
        handleOpenVehicleManager,
        handleUpdateResidentVehicles,
    };
}
