import type { VehicleSearchItem } from "@/types/residents.types";
import { ParkingMap } from "../../parking/parking-map";
import { VehicleSearchList } from "../../parking/vehicle-search-list";
import { ParkingMapSkeleton } from "../../parking/skeletons";
import { ParkingStats } from "../../parking/stats";

export interface ParkingViewProps {
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
}

export function ParkingView({
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
                    />
                </div>
                <div className="flex flex-col min-h-0">
                    <VehicleSearchList vehicles={allVehicles} />
                </div>
            </div>
        </div>
    );
}
