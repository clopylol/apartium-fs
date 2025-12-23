import type { Building } from "@/types/residents.types";

export interface BuildingActionsParams {
    buildings: Building[];
    setBuildings: React.Dispatch<React.SetStateAction<Building[]>>;
    setActiveBlockId: (id: string) => void;
    activeBlock: Building | undefined;
    openAddBlockModal: () => void;
    closeAddBlockModal: () => void;
    openBuildingModal: () => void;
    closeBuildingModal: () => void;
    openDeleteBuildingConfirm: (buildingId: string, buildingName: string) => void;
    closeDeleteBuildingConfirm: () => void;
    deleteBuildingConfirm: {
        isOpen: boolean;
        buildingId: string;
        buildingName: string;
    };
}

export interface BuildingActionsReturn {
    handleOpenAddBuilding: () => void;
    handleSaveNewBuilding: (name: string) => void;
    handleOpenEditBuilding: () => void;
    handleSaveBuilding: (newName: string) => void;
    handleOpenDeleteBuilding: () => void;
    handleConfirmDeleteBuilding: () => void;
}

export function useBuildingActions(params: BuildingActionsParams): BuildingActionsReturn {
    const {
        buildings,
        setBuildings,
        setActiveBlockId,
        activeBlock,
        openAddBlockModal,
        closeAddBlockModal,
        openBuildingModal,
        closeBuildingModal,
        openDeleteBuildingConfirm,
        closeDeleteBuildingConfirm,
        deleteBuildingConfirm,
    } = params;

    const handleOpenAddBuilding = () => {
        openAddBlockModal();
    };

    const handleSaveNewBuilding = (name: string) => {
        const newId = String.fromCharCode(65 + buildings.length); // A, B, C, etc.
        const newBuilding: Building = {
            id: newId,
            name: `${name}`,
            units: [],
            parkingSpots: [],
        };
        setBuildings([...buildings, newBuilding]);
        setActiveBlockId(newId);
        closeAddBlockModal();
    };

    const handleOpenEditBuilding = () => {
        openBuildingModal();
    };

    const handleSaveBuilding = (newName: string) => {
        if (!activeBlock) return;
        setBuildings((prev) =>
            prev.map((b) => (b.id === activeBlock.id ? { ...b, name: newName } : b))
        );
        closeBuildingModal();
    };

    const handleOpenDeleteBuilding = () => {
        if (!activeBlock) return;
        openDeleteBuildingConfirm(activeBlock.id, activeBlock.name);
    };

    const handleConfirmDeleteBuilding = () => {
        setBuildings((prev) => {
            const newBuildings = prev.filter((b) => b.id !== deleteBuildingConfirm.buildingId);
            if (newBuildings.length > 0) {
                setActiveBlockId(newBuildings[0].id);
            } else {
                setActiveBlockId("");
            }
            return newBuildings;
        });
        closeDeleteBuildingConfirm();
    };

    return {
        handleOpenAddBuilding,
        handleSaveNewBuilding,
        handleOpenEditBuilding,
        handleSaveBuilding,
        handleOpenDeleteBuilding,
        handleConfirmDeleteBuilding,
    };
}
