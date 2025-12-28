import { useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { Building, ParkingSpotDefinition, VehicleSearchItem, GuestVisit } from "@/types/residents.types";
import { useParkingMutations } from "@/hooks/residents/api";
import { api } from "@/lib/api";
import { showError, showSuccess } from "@/utils/toast";

export interface ParkingActionsParams {
    buildings: Building[];
    setBuildings: React.Dispatch<React.SetStateAction<Building[]>>;
    activeBlockId: string | null;
    activeBlock: Building | undefined;
    activeParkingFloor: number;
    guestList: GuestVisit[];
    setGuestList: React.Dispatch<React.SetStateAction<GuestVisit[]>>;
    searchTerm: string;
    openAddSpotModal: (floor: number) => void;
    openEditSpotModal: (spot: ParkingSpotDefinition) => void;
    openDeleteSpotModal: (spot: ParkingSpotDefinition) => void;
    closeSpotModal: () => void;
    spotModalMode: "add" | "edit" | "delete";
    spotForm: ParkingSpotDefinition;
}

export interface ParkingActionsReturn {
    handleOpenAddSpot: () => void;
    handleOpenEditSpot: (spot: ParkingSpotDefinition) => void;
    handleOpenDeleteSpot: (spot: ParkingSpotDefinition) => void;
    handleSpotSubmit: () => void;
    handleAssignVehicle: (spotId: string, vehicleId: string) => void;
    handleUnassignVehicle: (spotId: string) => void;
    handleDeleteVehicle: (vehicleId: string, isGuest: boolean) => void;
    parkingGridData: any[];
    allVehicles: VehicleSearchItem[];
    parkingStats: {
        totalSpots: number;
        occupiedSpots: number;
        availableSpots: number;
        occupancyRate: number;
        guestVehicles: number;
    };
}

export function useParkingActions(params: ParkingActionsParams): ParkingActionsReturn {
    const {
        buildings,
        setBuildings,
        activeBlockId,
        activeBlock,
        activeParkingFloor,
        guestList,
        setGuestList,
        searchTerm,
        openAddSpotModal,
        openEditSpotModal,
        openDeleteSpotModal,
        closeSpotModal,
        spotModalMode,
        spotForm,
    } = params;

    // Parking mutations
    const { createParkingSpot, updateParkingSpot, deleteParkingSpot } = useParkingMutations(activeBlockId);
    const queryClient = useQueryClient();

    const handleOpenAddSpot = () => {
        openAddSpotModal(activeParkingFloor);
    };

    const handleOpenEditSpot = (spot: ParkingSpotDefinition) => {
        openEditSpotModal(spot);
    };

    const handleOpenDeleteSpot = (spot: ParkingSpotDefinition) => {
        openDeleteSpotModal(spot);
    };

    const handleSpotSubmit = async () => {
        if (!activeBlockId) return;

        try {
            if (spotModalMode === "add") {
                await createParkingSpot.mutateAsync({
                    buildingId: activeBlockId,
                    name: spotForm.name,
                    floor: Number(spotForm.floor),
                });
            } else if (spotModalMode === "edit") {
                await updateParkingSpot.mutateAsync({
                    id: spotForm.id,
                    data: {
                        name: spotForm.name,
                        floor: Number(spotForm.floor),
                    },
                });
            } else if (spotModalMode === "delete") {
                await deleteParkingSpot.mutateAsync(spotForm.id);
            }
            closeSpotModal();
        } catch (error) {
            // Error handled by mutation (toast notification)
            console.error('Failed to submit parking spot:', error);
        }
    };

    const handleAssignVehicle = async (spotId: string, vehicleId: string) => {
        const spot = activeBlock?.parkingSpots.find((s) => s.id === spotId);
        if (!spot || !activeBlockId) return;

        try {
            // Check if vehicle is a guest vehicle
            const guestVehicle = guestList.find((g) => g.id === vehicleId);
            if (guestVehicle) {
                // Guest vehicle - update guest visit
                await api.residents.updateGuestVisit(vehicleId, { parkingSpotId: spot.id });
                // Invalidate guest visits cache
                queryClient.invalidateQueries({ queryKey: ['guest-visits'] });
            } else {
                // Resident vehicle - update vehicle
                await api.residents.updateVehicle(vehicleId, { parkingSpotId: spot.id });
            }
            // Invalidate building data cache to refresh parking spots
            queryClient.invalidateQueries({ queryKey: ['residents', 'building-data', activeBlockId] });
        } catch (error: any) {
            showError(error.message || "Araç ataması yapılırken hata oluştu");
            console.error('Failed to assign vehicle:', error);
        }
    };

    const handleUnassignVehicle = async (spotId: string) => {
        if (!activeBlockId || !activeBlock) return;

        try {
            // Find vehicle assigned to this spot
            let vehicleId: string | null = null;
            let isGuest = false;

            // Check resident vehicles
            if (activeBlock.units) {
                for (const unit of activeBlock.units) {
                    if (unit.residents) {
                        for (const resident of unit.residents) {
                            if (resident.vehicles) {
                                const vehicle = resident.vehicles.find(
                                    (v) => v.parkingSpotId === spotId || v.parkingSpot === activeBlock.parkingSpots?.find(s => s.id === spotId)?.name
                                );
                                if (vehicle) {
                                    vehicleId = vehicle.id;
                                    break;
                                }
                            }
                        }
                    }
                }
            }

            // Check guest vehicles if not found
            if (!vehicleId && guestList) {
                const guest = guestList.find(
                    (g) => (g.parkingSpotId === spotId || g.parkingSpot === activeBlock.parkingSpots?.find(s => s.id === spotId)?.name)
                         && (g.status === 'active' || g.status === 'pending')
                );
                if (guest) {
                    vehicleId = guest.id;
                    isGuest = true;
                }
            }

            if (!vehicleId) {
                showError("Bu park yerinde atanmış araç bulunamadı");
                return;
            }

            // Unassign vehicle
            if (isGuest) {
                // Guest vehicle - update guest visit
                await api.residents.updateGuestVisit(vehicleId, { parkingSpotId: undefined });
                // Invalidate guest visits cache
                queryClient.invalidateQueries({ queryKey: ['guest-visits'] });
            } else {
                // Resident vehicle - update vehicle
                await api.residents.updateVehicle(vehicleId, { parkingSpotId: undefined });
            }
            // Invalidate building data cache to refresh parking spots
            queryClient.invalidateQueries({ queryKey: ['residents', 'building-data', activeBlockId] });
        } catch (error: any) {
            showError(error.message || "Araç ataması kaldırılırken hata oluştu");
            console.error('Failed to unassign vehicle:', error);
        }
    };

    const handleDeleteVehicle = async (vehicleId: string, isGuest: boolean) => {
        if (!activeBlockId) return;

        try {
            if (isGuest) {
                // Delete guest visit
                await api.residents.deleteGuestVisit(vehicleId);
                showSuccess('Misafir kaydı silindi');
            } else {
                // Delete resident vehicle
                await api.residents.deleteVehicle(vehicleId);
                showSuccess('Araç silindi');
            }
            
            // Invalidate all related caches - React Query will automatically refetch
            // Guest visits cache (for all pages and filters)
            if (isGuest) {
                queryClient.invalidateQueries({ queryKey: ['guest-visits'] });
            }
            
            // Building data cache (contains vehicles) - this will update activeBlock
            queryClient.invalidateQueries({ queryKey: ['residents', 'building-data', activeBlockId] });
            
            // Also invalidate any resident-specific vehicle queries
            queryClient.invalidateQueries({ queryKey: ['residents'], exact: false });
        } catch (error: any) {
            showError(error.message || (isGuest ? "Misafir kaydı silinirken hata oluştu" : "Araç silinirken hata oluştu"));
            console.error('Failed to delete vehicle:', error);
            throw error; // Re-throw to let caller handle it
        }
    };

    // Computed: Parking Grid Data (Real Data)
    const parkingGridData = useMemo(() => {
        if (!activeBlock?.parkingSpots) return [];
        
        // Filter spots by active floor
        const floorSpots = activeBlock.parkingSpots.filter(
            (spot) => spot.floor === activeParkingFloor
        );
        
        return floorSpots.map((spot) => {
            // Find assigned vehicle (resident or guest)
            let occupant = null;
            
            // Check if spot has assignedVehicle from backend
            if (spot.assignedVehicle) {
                // Find resident info for this vehicle
                if (activeBlock.units) {
                    for (const unit of activeBlock.units) {
                        if (unit.residents) {
                            for (const resident of unit.residents) {
                                if (resident.vehicles) {
                                    const vehicle = resident.vehicles.find(
                                        (v) => v.id === spot.assignedVehicle?.id
                                    );
                                    if (vehicle) {
                                        occupant = {
                                            name: resident.name,
                                            plate: vehicle.plate,
                                            unitNumber: unit.number,
                                            type: 'resident',
                                        };
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            
            // Check resident vehicles by parkingSpotId
            if (!occupant && activeBlock.units) {
                for (const unit of activeBlock.units) {
                    if (unit.residents) {
                        for (const resident of unit.residents) {
                            if (resident.vehicles) {
                                const vehicle = resident.vehicles.find(
                                    (v) => v.parkingSpotId === spot.id || v.parkingSpot === spot.name
                                );
                                if (vehicle) {
                                    occupant = {
                                        name: resident.name,
                                        plate: vehicle.plate,
                                        unitNumber: unit.number,
                                        type: 'resident',
                                    };
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            
            // Check guest vehicles if not found
            if (!occupant && guestList) {
                const guest = guestList.find(
                    (g) => (g.parkingSpotId === spot.id || g.parkingSpot === spot.name) 
                         && (g.status === 'active' || g.status === 'pending')
                );
                if (guest) {
                    occupant = {
                        name: guest.guestName || 'İsimsiz Misafir',
                        plate: guest.plate,
                        unitNumber: guest.unitNumber || '-',
                        type: 'guest',
                    };
                }
            }
            
            return {
                id: spot.id,
                name: spot.name,
                floor: spot.floor,
                occupant,
                isOccupied: !!occupant,
            };
        });
    }, [activeBlock, activeParkingFloor, guestList]);

    // Computed: All Vehicles (Residents + Guests)
    const allVehicles = useMemo(() => {
        const vehicles: VehicleSearchItem[] = [];

        // Add Resident Vehicles from activeBlock (which has units from buildingData)
        if (activeBlock && activeBlock.units && Array.isArray(activeBlock.units)) {
            activeBlock.units.forEach((u) => {
                if (u.residents && Array.isArray(u.residents)) {
                    u.residents.forEach((r) => {
                        if (r.vehicles && Array.isArray(r.vehicles)) {
                            r.vehicles.forEach((v) => {
                                vehicles.push({
                                    id: v.id,
                                    plate: v.plate,
                                    blockName: activeBlock.name,
                                    unitNumber: u.number,
                                    name: r.name,
                                    phone: r.phone,
                                    vehicleModel: v.model || undefined,
                                    parkingSpot: v.parkingSpot || undefined,
                                    isGuest: false,
                                    type: r.type,
                                    avatar: r.avatar,
                                });
                            });
                        }
                    });
                }
            });
        }

        // Add Guest Vehicles
        if (guestList && Array.isArray(guestList)) {
        guestList.forEach((g) => {
            if (g.status === "active" || g.status === "pending") {
                vehicles.push({
                    id: g.id,
                    plate: g.plate,
                    blockName: g.blockName,
                    unitNumber: g.unitNumber,
                    name: g.guestName || "İsimsiz Misafir",
                    phone: "-",
                    vehicleModel: g.model,
                    isGuest: true,
                    status: g.status,
                    source: g.source,
                });
            }
        });
        }

        // Filter by search term if needed
        if (!searchTerm) return vehicles;
        const term = searchTerm.toLowerCase();
        return vehicles.filter(
            (v) =>
                v.plate.toLowerCase().includes(term) ||
                v.name.toLowerCase().includes(term) ||
                v.unitNumber.includes(term)
        );
    }, [activeBlock, guestList, searchTerm]);

    // Computed: Parking Stats
    const parkingStats = useMemo(() => {
        if (!activeBlock || !activeBlock.parkingSpots || !Array.isArray(activeBlock.parkingSpots)) {
            return {
                totalSpots: 0,
                occupiedSpots: 0,
                availableSpots: 0,
                occupancyRate: 0,
                guestVehicles: 0,
            };
        }

        const totalSpots = activeBlock.parkingSpots.length;
        
        // Calculate occupied spots by checking parkingSpotId or assignedVehicle
        const occupiedSpots = activeBlock.parkingSpots.filter((spot) => {
            // Check if spot has assignedVehicle from backend
            if (spot.assignedVehicle) {
                return true;
            }
            
            // Check resident vehicles by parkingSpotId
            if (activeBlock.units && Array.isArray(activeBlock.units)) {
                const hasResidentVehicle = activeBlock.units.some((unit) => {
                    if (!unit.residents || !Array.isArray(unit.residents)) return false;
                    return unit.residents.some((resident) => {
                        if (!resident.vehicles || !Array.isArray(resident.vehicles)) return false;
                        return resident.vehicles.some(
                            (vehicle) => vehicle.parkingSpotId === spot.id || vehicle.parkingSpot === spot.name
                        );
                    });
                });
                if (hasResidentVehicle) return true;
            }
            
            // Check guest vehicles by parkingSpotId
            if (guestList && Array.isArray(guestList)) {
                return guestList.some(
                    (g) => (g.parkingSpotId === spot.id || g.parkingSpot === spot.name) 
                         && (g.status === 'active' || g.status === 'pending')
                );
            }
            
            return false;
        }).length;

        const availableSpots = totalSpots - occupiedSpots;
        const occupancyRate = totalSpots > 0 ? Math.round((occupiedSpots / totalSpots) * 100) : 0;
        
        // Count active guest vehicles
        const guestVehicles = (guestList && Array.isArray(guestList)) 
            ? guestList.filter((g) => g.status === "active" || g.status === "pending").length
            : 0;

        return {
            totalSpots,
            occupiedSpots,
            availableSpots,
            occupancyRate,
            guestVehicles,
        };
    }, [activeBlock, guestList]);

    return {
        handleOpenAddSpot,
        handleOpenEditSpot,
        handleOpenDeleteSpot,
        handleSpotSubmit,
        handleAssignVehicle,
        handleUnassignVehicle,
        handleDeleteVehicle,
        parkingGridData,
        allVehicles,
        parkingStats,
    };
}
