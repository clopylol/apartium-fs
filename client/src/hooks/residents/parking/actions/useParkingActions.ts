import { useMemo } from "react";
import type { Building, ParkingSpotDefinition, VehicleSearchItem, GuestVisit } from "@/types/residents.types";

export interface ParkingActionsParams {
    buildings: Building[];
    setBuildings: React.Dispatch<React.SetStateAction<Building[]>>;
    activeBlockId: string;
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

    const handleOpenAddSpot = () => {
        openAddSpotModal(activeParkingFloor);
    };

    const handleOpenEditSpot = (spot: ParkingSpotDefinition) => {
        openEditSpotModal(spot);
    };

    const handleOpenDeleteSpot = (spot: ParkingSpotDefinition) => {
        openDeleteSpotModal(spot);
    };

    const handleSpotSubmit = () => {
        if (!activeBlock) return;

        if (spotModalMode === "delete") {
            setBuildings((prev) =>
                prev.map((b) =>
                    b.id !== activeBlockId
                        ? b
                        : {
                            ...b,
                            parkingSpots: b.parkingSpots.filter((p) => p.id !== spotForm.id),
                        }
                )
            );
        } else {
            if (!spotForm.name.trim()) return;
            setBuildings((prev) =>
                prev.map((b) => {
                    if (b.id !== activeBlockId) return b;
                    let newSpots = [...b.parkingSpots];
                    if (spotModalMode === "add") {
                        newSpots.push({
                            id: `spot-${Date.now()}`,
                            name: spotForm.name,
                            floor: Number(spotForm.floor),
                        });
                    } else {
                        newSpots = newSpots.map((s) =>
                            s.id === spotForm.id
                                ? { ...s, name: spotForm.name, floor: Number(spotForm.floor) }
                                : s
                        );
                    }
                    return { ...b, parkingSpots: newSpots };
                })
            );
        }
        closeSpotModal();
    };

    const handleAssignVehicle = (spotId: string, vehicleId: string) => {
        if (!activeBlock) return;

        // Find the spot
        const spot = activeBlock.parkingSpots.find((s) => s.id === spotId);
        if (!spot) return;

        // Check if vehicle is a guest vehicle
        const guestVehicle = guestList.find((g) => g.id === vehicleId);
        if (guestVehicle) {
            // Update guest parking spot
            setGuestList((prev) =>
                prev.map((g) =>
                    g.id === vehicleId ? { ...g, parkingSpot: spot.name } : g
                )
            );
            return;
        }

        // Find resident vehicle
        let vehicleFound = false;
        setBuildings((prev) =>
            prev.map((b) => {
                if (b.id !== activeBlockId) return b;
                return {
                    ...b,
                    units: b.units.map((u) => ({
                        ...u,
                        residents: u.residents.map((r) => {
                            const vehicle = r.vehicles.find((v) => v.id === vehicleId);
                            if (vehicle) {
                                vehicleFound = true;
                                return {
                                    ...r,
                                    vehicles: r.vehicles.map((v) =>
                                        v.id === vehicleId ? { ...v, parkingSpot: spot.name } : v
                                    ),
                                };
                            }
                            return r;
                        }),
                    })),
                };
            })
        );
    };

    // Computed: Parking Grid Data (Mock)
    const parkingGridData = useMemo(() => {
        if (!activeBlock) return [];
        // Mock parking data generation based on active floor
        return Array.from({ length: 20 }).map((_, i) => {
            const isOccupied = Math.random() > 0.5;
            return {
                id: `p-${i}`,
                name: `P-${activeParkingFloor}-${i + 1}`,
                floor: activeParkingFloor,
                isOccupied,
                occupant: isOccupied
                    ? {
                        name: "Ahmet Yılmaz",
                        plate: `34 AB ${100 + i}`,
                        unitNumber: `${Math.floor(Math.random() * 20) + 1}`,
                    }
                    : undefined,
                type: "standard",
            } as any;
        });
    }, [activeBlock, activeParkingFloor]);

    // Computed: All Vehicles (Residents + Guests)
    const allVehicles = useMemo(() => {
        const vehicles: VehicleSearchItem[] = [];

        // Add Resident Vehicles
        buildings.forEach((b) => {
            b.units.forEach((u) => {
                u.residents.forEach((r) => {
                    r.vehicles.forEach((v) => {
                        vehicles.push({
                            id: v.id,
                            plate: v.plate,
                            blockName: b.name,
                            unitNumber: u.number,
                            name: r.name,
                            phone: r.phone,
                            vehicleModel: v.model,
                            parkingSpot: v.parkingSpot,
                            isGuest: false,
                            type: r.type,
                            avatar: r.avatar,
                        });
                    });
                });
            });
        });

        // Add Guest Vehicles
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

        // Filter by search term if needed
        if (!searchTerm) return vehicles;
        const term = searchTerm.toLowerCase();
        return vehicles.filter(
            (v) =>
                v.plate.toLowerCase().includes(term) ||
                v.name.toLowerCase().includes(term) ||
                v.unitNumber.includes(term)
        );
    }, [buildings, guestList, searchTerm]);

    // Computed: Parking Stats
    const parkingStats = useMemo(() => {
        if (!activeBlock) {
            return {
                totalSpots: 0,
                occupiedSpots: 0,
                availableSpots: 0,
                occupancyRate: 0,
                guestVehicles: 0,
            };
        }

        const totalSpots = activeBlock.parkingSpots.length;
        
        // Calculate occupied spots by checking if any resident vehicle has this spot assigned
        const occupiedSpots = activeBlock.parkingSpots.filter((spot) => {
            return activeBlock.units.some((unit) =>
                unit.residents.some((resident) =>
                    resident.vehicles.some((vehicle) => vehicle.parkingSpot === spot.name)
                )
            );
        }).length;

        const availableSpots = totalSpots - occupiedSpots;
        const occupancyRate = totalSpots > 0 ? Math.round((occupiedSpots / totalSpots) * 100) : 0;
        
        // Count active guest vehicles
        const guestVehicles = guestList.filter(
            (g) => g.status === "active" || g.status === "pending"
        ).length;

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
        parkingGridData,
        allVehicles,
        parkingStats,
    };
}
