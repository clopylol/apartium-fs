import type { VehicleSearchItem, Building } from "@/types/residents.types";
import { ParkingMap } from "../../parking/parking-map";
import { VehicleSearchList } from "../../parking/vehicle-search-list";
import { ParkingMapSkeleton } from "../../parking/skeletons";
import { ParkingStats } from "../../parking/stats";
import { BuildingTabs } from "../../resident/building-tabs";

export interface ParkingViewProps {
    buildings: Building[];
    activeBlockId: string | null;
    activeBlock: Building | null;
    parkingGridData: any[];
    activeParkingFloor: number;
    availableFloors: number[];
    onFloorChange: (floor: number) => void;
    onAddSpot: () => void;
    onEditSpot: (spot: any) => void;
    onDeleteSpot: (spot: any) => void;
    blockName: string;
    onManageFloors: () => void;
    allVehicles: VehicleSearchItem[];
    isLoading: boolean;
    parkingStats: {
        totalSpots: number;
        occupiedSpots: number;
        availableSpots: number;
        occupancyRate: number;
        guestVehicles: number;
    };
    onAssignVehicle: (spot: any) => void;
    onUnassignVehicle?: (spotId: string) => void;
    onDeleteVehicle?: (vehicleId: string, isGuest: boolean) => void;
    onBlockChange: (blockId: string) => void;
    onAddBuilding: () => void;
    onEditBuilding: () => void;
    onDeleteBuilding: () => void;
}

export function ParkingView({
    buildings,
    activeBlockId,
    activeBlock,
    parkingGridData,
    activeParkingFloor,
    availableFloors,
    onFloorChange,
    onAddSpot,
    onEditSpot,
    onDeleteSpot,
    blockName,
    onManageFloors,
    allVehicles,
    isLoading,
    parkingStats,
    onAssignVehicle,
    onUnassignVehicle,
    onDeleteVehicle,
    onBlockChange,
    onAddBuilding,
    onEditBuilding,
    onDeleteBuilding,
}: ParkingViewProps) {
    if (isLoading) {
        return (
            <div className="space-y-6 animate-in fade-in duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-[160px] rounded-2xl bg-ds-card-light dark:bg-ds-card-dark border border-ds-border-light dark:border-ds-border-dark animate-pulse"></div>
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <ParkingMapSkeleton />
                    </div>
                    <div>
                        <div className="h-[600px] rounded-2xl bg-ds-card-light dark:bg-ds-card-dark border border-ds-border-light dark:border-ds-border-dark animate-pulse"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Top Controls (Building Tabs) */}
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6 mb-8">
                <BuildingTabs
                    buildings={buildings}
                    activeBlockId={activeBlockId}
                    onBlockChange={onBlockChange}
                    onAddBuilding={onAddBuilding}
                    onEditBuilding={onEditBuilding}
                    onDeleteBuilding={onDeleteBuilding}
                />
            </div>

            {/* Stats Cards */}
            <ParkingStats
                totalSpots={parkingStats.totalSpots}
                occupiedSpots={parkingStats.occupiedSpots}
                availableSpots={parkingStats.availableSpots}
                occupancyRate={parkingStats.occupancyRate}
                guestVehicles={parkingStats.guestVehicles}
                isLoading={isLoading}
            />

            {/* Parking Map and Vehicle List */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <ParkingMap
                        parkingGridData={parkingGridData}
                        activeParkingFloor={activeParkingFloor}
                        availableParkingFloors={availableFloors}
                        onFloorChange={onFloorChange}
                        onAddSpot={onAddSpot}
                        onEditSpot={onEditSpot}
                        onDeleteSpot={onDeleteSpot}
                        blockName={blockName}
                        onManageFloors={onManageFloors}
                        onAssignResident={onAssignVehicle}
                        onUnassignVehicle={onUnassignVehicle}
                    />
                </div>
                <div className="flex flex-col min-h-0">
                    <VehicleSearchList vehicles={allVehicles} onDeleteVehicle={onDeleteVehicle} />
                </div>
            </div>
        </div>
    );
}
