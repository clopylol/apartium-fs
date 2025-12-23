export interface ResidentVehicle {
    id: string;
    plate: string;
    model: string;
    parkingSpot?: string;
}

export interface Resident {
    id: string;
    name: string;
    type: "owner" | "tenant";
    phone: string;
    email?: string;
    avatar: string;
    vehicles: ResidentVehicle[];
}

export interface Unit {
    id: string;
    number: string;
    floor: number;
    status: "occupied" | "empty";
    residents: Resident[];
}

export interface ParkingSpotDefinition {
    id: string;
    name: string;
    floor: number;
}

export interface Building {
    id: string;
    name: string;
    units: Unit[];
    parkingSpots: ParkingSpotDefinition[];
}

export interface GuestVisit {
    id: string;
    plate: string;
    guestName?: string;
    model?: string;
    color?: string;
    hostName: string;
    unitNumber: string;
    blockName: string;
    status: "pending" | "active" | "completed";
    source: "app" | "manual" | "phone";
    expectedDate: string;
    durationDays: number;
    entryTime?: string;
    exitTime?: string;
    note?: string;
    parkingSpot?: string;
}

export interface VehicleSearchItem {
    id: string;
    plate: string;
    name: string;
    phone: string;
    email?: string;
    type?: "owner" | "tenant";
    vehicleModel?: string;
    parkingSpot?: string;
    avatar?: string;
    unitNumber: string;
    blockName: string;
    isGuest: boolean;
    source?: string | null;
    status?: "pending" | "active" | "completed";
}
