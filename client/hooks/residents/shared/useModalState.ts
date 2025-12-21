import { useState } from "react";
import type { Resident, GuestVisit, ParkingSpotDefinition } from "@/types/residents.types";

export interface ModalStateReturn {
    // Add Resident Modal
    showAddModal: boolean;
    addModalProps: { blockId?: string; unitId?: string };
    openAddResidentModal: (blockId?: string, unitId?: string) => void;
    closeAddResidentModal: () => void;

    // Building Modals
    showBuildingModal: boolean;
    openBuildingModal: () => void;
    closeBuildingModal: () => void;
    showAddBlockModal: boolean;
    openAddBlockModal: () => void;
    closeAddBlockModal: () => void;

    // Parking Spot Modal
    showSpotModal: boolean;
    spotModalMode: "add" | "edit" | "delete";
    spotForm: ParkingSpotDefinition;
    setSpotForm: React.Dispatch<React.SetStateAction<ParkingSpotDefinition>>;
    openAddSpotModal: (floor: number) => void;
    openEditSpotModal: (spot: ParkingSpotDefinition) => void;
    openDeleteSpotModal: (spot: ParkingSpotDefinition) => void;
    closeSpotModal: () => void;

    // Assign Vehicle Modal
    showAssignVehicleModal: boolean;
    assignVehicleSpot: ParkingSpotDefinition | null;
    openAssignVehicleModal: (spot: ParkingSpotDefinition) => void;
    closeAssignVehicleModal: () => void;

    // Guest Modal
    showGuestModal: boolean;
    selectedGuest: GuestVisit | null;
    setSelectedGuest: (guest: GuestVisit | null) => void;
    openGuestModal: () => void;
    closeGuestModal: () => void;

    // Guest Confirmation Modals
    checkInConfirm: { isOpen: boolean; guestId: string | null };
    setCheckInConfirm: React.Dispatch<React.SetStateAction<{ isOpen: boolean; guestId: string | null }>>;
    checkOutConfirm: { isOpen: boolean; guestId: string | null };
    setCheckOutConfirm: React.Dispatch<React.SetStateAction<{ isOpen: boolean; guestId: string | null }>>;

    // Vehicle Management Modal
    showVehicleManager: boolean;
    managingResident: { resident: Resident; blockId: string; unitId: string } | null;
    openVehicleManager: (resident: Resident, blockId: string, unitId: string) => void;
    closeVehicleManager: () => void;

    // Edit Resident Modal
    showEditResidentModal: boolean;
    editingResident: { resident: Resident; blockId: string; unitId: string } | null;
    openEditResidentModal: (resident: Resident, blockId: string, unitId: string) => void;
    closeEditResidentModal: () => void;

    // Delete Confirmations
    deleteResidentConfirm: {
        isOpen: boolean;
        residentId: string;
        residentName: string;
        blockId: string;
        unitId: string;
    };
    openDeleteResidentConfirm: (residentId: string, residentName: string, blockId: string, unitId: string) => void;
    closeDeleteResidentConfirm: () => void;

    deleteBuildingConfirm: {
        isOpen: boolean;
        buildingId: string;
        buildingName: string;
    };
    openDeleteBuildingConfirm: (buildingId: string, buildingName: string) => void;
    closeDeleteBuildingConfirm: () => void;
}

export function useModalState(): ModalStateReturn {
    // Add Resident Modal
    const [showAddModal, setShowAddModal] = useState(false);
    const [addModalProps, setAddModalProps] = useState<{ blockId?: string; unitId?: string }>({});

    // Building Modals
    const [showBuildingModal, setShowBuildingModal] = useState(false);
    const [showAddBlockModal, setShowAddBlockModal] = useState(false);

    // Parking Spot Modal
    const [showSpotModal, setShowSpotModal] = useState(false);
    const [spotModalMode, setSpotModalMode] = useState<"add" | "edit" | "delete">("add");
    const [spotForm, setSpotForm] = useState<ParkingSpotDefinition>({ id: "", name: "", floor: 0 });

    // Assign Vehicle Modal
    const [showAssignVehicleModal, setShowAssignVehicleModal] = useState(false);
    const [assignVehicleSpot, setAssignVehicleSpot] = useState<ParkingSpotDefinition | null>(null);

    // Guest Modal
    const [showGuestModal, setShowGuestModal] = useState(false);
    const [selectedGuest, setSelectedGuest] = useState<GuestVisit | null>(null);

    // Guest Confirmation Modals
    const [checkInConfirm, setCheckInConfirm] = useState<{ isOpen: boolean; guestId: string | null }>({
        isOpen: false,
        guestId: null,
    });
    const [checkOutConfirm, setCheckOutConfirm] = useState<{ isOpen: boolean; guestId: string | null }>({
        isOpen: false,
        guestId: null,
    });

    // Vehicle Management Modal
    const [showVehicleManager, setShowVehicleManager] = useState(false);
    const [managingResident, setManagingResident] = useState<{
        resident: Resident;
        blockId: string;
        unitId: string;
    } | null>(null);

    // Edit Resident Modal
    const [showEditResidentModal, setShowEditResidentModal] = useState(false);
    const [editingResident, setEditingResident] = useState<{
        resident: Resident;
        blockId: string;
        unitId: string;
    } | null>(null);

    // Delete Confirmations
    const [deleteResidentConfirm, setDeleteResidentConfirm] = useState({
        isOpen: false,
        residentId: "",
        residentName: "",
        blockId: "",
        unitId: "",
    });

    const [deleteBuildingConfirm, setDeleteBuildingConfirm] = useState({
        isOpen: false,
        buildingId: "",
        buildingName: "",
    });

    return {
        // Add Resident Modal
        showAddModal,
        addModalProps,
        openAddResidentModal: (blockId?: string, unitId?: string) => {
            setAddModalProps({ blockId, unitId });
            setShowAddModal(true);
        },
        closeAddResidentModal: () => setShowAddModal(false),

        // Building Modals
        showBuildingModal,
        openBuildingModal: () => setShowBuildingModal(true),
        closeBuildingModal: () => setShowBuildingModal(false),
        showAddBlockModal,
        openAddBlockModal: () => setShowAddBlockModal(true),
        closeAddBlockModal: () => setShowAddBlockModal(false),

        // Parking Spot Modal
        showSpotModal,
        spotModalMode,
        spotForm,
        setSpotForm,
        openAddSpotModal: (floor: number) => {
            setSpotForm({ id: "", name: "", floor });
            setSpotModalMode("add");
            setShowSpotModal(true);
        },
        openEditSpotModal: (spot: ParkingSpotDefinition) => {
            setSpotForm({ ...spot });
            setSpotModalMode("edit");
            setShowSpotModal(true);
        },
        openDeleteSpotModal: (spot: ParkingSpotDefinition) => {
            setSpotForm({ ...spot });
            setSpotModalMode("delete");
            setShowSpotModal(true);
        },
        closeSpotModal: () => setShowSpotModal(false),

        // Assign Vehicle Modal
        showAssignVehicleModal,
        assignVehicleSpot,
        openAssignVehicleModal: (spot: ParkingSpotDefinition) => {
            setAssignVehicleSpot(spot);
            setShowAssignVehicleModal(true);
        },
        closeAssignVehicleModal: () => {
            setShowAssignVehicleModal(false);
            setAssignVehicleSpot(null);
        },

        // Guest Modal
        showGuestModal,
        selectedGuest,
        setSelectedGuest,
        openGuestModal: () => setShowGuestModal(true),
        closeGuestModal: () => setShowGuestModal(false),

        // Guest Confirmation Modals
        checkInConfirm,
        setCheckInConfirm,
        checkOutConfirm,
        setCheckOutConfirm,

        // Vehicle Management Modal
        showVehicleManager,
        managingResident,
        openVehicleManager: (resident: Resident, blockId: string, unitId: string) => {
            setManagingResident({ resident, blockId, unitId });
            setShowVehicleManager(true);
        },
        closeVehicleManager: () => setShowVehicleManager(false),

        // Edit Resident Modal
        showEditResidentModal,
        editingResident,
        openEditResidentModal: (resident: Resident, blockId: string, unitId: string) => {
            setEditingResident({ resident, blockId, unitId });
            setShowEditResidentModal(true);
        },
        closeEditResidentModal: () => setShowEditResidentModal(false),

        // Delete Confirmations
        deleteResidentConfirm,
        openDeleteResidentConfirm: (residentId: string, residentName: string, blockId: string, unitId: string) => {
            setDeleteResidentConfirm({ isOpen: true, residentId, residentName, blockId, unitId });
        },
        closeDeleteResidentConfirm: () => {
            setDeleteResidentConfirm({ isOpen: false, residentId: "", residentName: "", blockId: "", unitId: "" });
        },

        deleteBuildingConfirm,
        openDeleteBuildingConfirm: (buildingId: string, buildingName: string) => {
            setDeleteBuildingConfirm({ isOpen: true, buildingId, buildingName });
        },
        closeDeleteBuildingConfirm: () => {
            setDeleteBuildingConfirm({ isOpen: false, buildingId: "", buildingName: "" });
        },
    };
}
