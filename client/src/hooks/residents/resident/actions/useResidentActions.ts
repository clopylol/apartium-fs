import type { Resident, ResidentVehicle } from "@/types/residents.types";
import { useResidentMutations } from "@/hooks/residents/api";

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

    const handleOpenAddResident = (blockId?: string, unitId?: string) => {
        openAddResidentModal(blockId, unitId);
    };

    const handleSaveResident = async (residentData: any) => {
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
        // TODO: Implement vehicle update API call
        // For now, just close the modal
        console.log('Update vehicles for resident:', residentId, vehicles);
        closeVehicleManager();
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
