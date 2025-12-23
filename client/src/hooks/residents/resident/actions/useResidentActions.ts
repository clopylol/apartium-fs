import type { Building, Resident, ResidentVehicle } from "@/types/residents.types";

export interface ResidentActionsParams {
    buildings: Building[];
    setBuildings: React.Dispatch<React.SetStateAction<Building[]>>;
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
        setBuildings,
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

    const handleOpenAddResident = (blockId?: string, unitId?: string) => {
        openAddResidentModal(blockId, unitId);
    };

    const handleSaveResident = (residentData: any) => {
        setBuildings((prevBuildings) => {
            return prevBuildings.map((b) => {
                if (b.id !== residentData.blockId) return b;

                return {
                    ...b,
                    units: b.units.map((u) => {
                        if (u.id !== residentData.unitId) return u;

                        const newResident: Resident = {
                            id: `res-${Date.now()}`,
                            name: residentData.name,
                            type: residentData.type,
                            phone: residentData.phone,
                            email: residentData.email,
                            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(residentData.name)}&background=random&color=fff`,
                            vehicles: [],
                        };

                        return {
                            ...u,
                            status: "occupied",
                            residents: [...u.residents, newResident],
                        };
                    }),
                };
            });
        });
        closeAddResidentModal();
    };

    const handleOpenDeleteResident = (
        residentId: string,
        residentName: string,
        blockId: string,
        unitId: string
    ) => {
        openDeleteResidentConfirm(residentId, residentName, blockId, unitId);
    };

    const handleConfirmDeleteResident = () => {
        const { residentId, blockId, unitId } = deleteResidentConfirm;
        setBuildings((prevBuildings) =>
            prevBuildings.map((b) => {
                if (b.id !== blockId) return b;
                return {
                    ...b,
                    units: b.units.map((u) => {
                        if (u.id !== unitId) return u;
                        const updatedResidents = u.residents.filter((r) => r.id !== residentId);
                        return {
                            ...u,
                            residents: updatedResidents,
                            status: updatedResidents.length > 0 ? "occupied" : "empty",
                        };
                    }),
                };
            })
        );
        closeDeleteResidentConfirm();
    };

    const handleOpenEditResident = (resident: Resident, blockId: string, unitId: string) => {
        openEditResidentModal(resident, blockId, unitId);
    };

    const handleSaveEditResident = (updatedData: Partial<Resident>) => {
        if (!editingResident) return;

        setBuildings((prev) =>
            prev.map((b) => ({
                ...b,
                units: b.units.map((u) => ({
                    ...u,
                    residents: u.residents.map((r) =>
                        r.id === editingResident.resident.id ? { ...r, ...updatedData } : r
                    ),
                })),
            }))
        );
        closeEditResidentModal();
    };

    const handleOpenVehicleManager = (resident: Resident, blockId: string, unitId: string) => {
        openVehicleManager(resident, blockId, unitId);
    };

    const handleUpdateResidentVehicles = (residentId: string, vehicles: ResidentVehicle[]) => {
        setBuildings((prev) =>
            prev.map((b) => ({
                ...b,
                units: b.units.map((u) => ({
                    ...u,
                    residents: u.residents.map((r) => (r.id === residentId ? { ...r, vehicles } : r)),
                })),
            }))
        );
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
