import { useState } from "react";

export interface ParkingStateReturn {
    activeParkingFloor: number;
    setActiveParkingFloor: (floor: number) => void;
    availableFloors: number[];
    setAvailableFloors: React.Dispatch<React.SetStateAction<number[]>>;
    showFloorManager: boolean;
    setShowFloorManager: (show: boolean) => void;

    // Floor Actions
    handleAddFloor: (floor: number) => void;
    handleDeleteFloor: (floor: number) => void;
}

export function useParkingState(): ParkingStateReturn {
    const [activeParkingFloor, setActiveParkingFloor] = useState(0);
    const [availableFloors, setAvailableFloors] = useState<number[]>([0, -1, -2]);
    const [showFloorManager, setShowFloorManager] = useState(false);

    const handleAddFloor = (floor: number) => {
        setAvailableFloors((prev) => [...prev, floor].sort((a, b) => b - a));
    };

    const handleDeleteFloor = (floor: number) => {
        setAvailableFloors((prev) => prev.filter((f) => f !== floor));
        if (activeParkingFloor === floor) {
            setActiveParkingFloor(0);
        }
    };

    return {
        activeParkingFloor,
        setActiveParkingFloor,
        availableFloors,
        setAvailableFloors,
        showFloorManager,
        setShowFloorManager,
        handleAddFloor,
        handleDeleteFloor,
    };
}
