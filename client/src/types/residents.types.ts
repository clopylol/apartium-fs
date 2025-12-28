// ==================== BASE TYPES ====================

export interface Site {
    id: string;
    name: string;
    address?: string;
    totalBuildings: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface ResidentVehicle {
    id: string;
    plate: string;
    model: string;
    brandId?: string | null;
    modelId?: string | null;
    color?: string;
    fuelType?: string;
    parkingSpot?: string;
    parkingSpotId?: string | null;
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
    assignedVehicle?: Vehicle | null;
}

export interface Building {
    id: string;
    siteId: string;
    name: string;
    units: Unit[];
    parkingSpots: ParkingSpotDefinition[];
}

// ==================== API RESPONSE TYPES (WITH NESTED DATA) ====================

/**
 * Backend'den gelen full building data response
 * JOIN ile tüm nested relationships bir seferde gelir
 */
export interface BuildingDataResponse {
    building: Building;
    site: Site | null;
    units: UnitWithResidents[];
    parkingSpots: ParkingSpotWithVehicle[];
}

export interface UnitWithResidents extends Omit<Unit, 'residents'> {
    residents: ResidentWithVehicles[];
}

export interface ResidentWithVehicles extends Omit<Resident, 'vehicles'> {
    vehicles: Vehicle[];
}

export interface Vehicle {
    id: string;
    residentId: string;
    parkingSpotId?: string | null;
    plate: string;
    brandId?: string | null;
    modelId?: string | null;
    model?: string | null;
    color?: string | null;
    fuelType?: string | null;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null;
}

export interface ParkingSpotWithVehicle extends ParkingSpotDefinition {
    assignedVehicle?: Vehicle | null;
}

// ==================== GUEST VISIT TYPES ====================

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
    expectedDate: string; // YYYY-MM-DD
    durationDays: number;
    entryTime?: Date | null; // ✅ Date object (parsed from ISO string)
    exitTime?: Date | null;  // ✅ Date object (parsed from ISO string)
    note?: string;
    parkingSpot?: string;
    parkingSpotId?: string | null;
}

/**
 * Backend'den gelen raw guest visit (ISO string dates)
 */
export interface GuestVisitRaw {
    id: string;
    unitId: string;
    plate: string;
    guestName?: string;
    model?: string;
    color?: string;
    status: "pending" | "active" | "completed";
    source: "app" | "manual" | "phone";
    expectedDate: string;
    durationDays: number;
    entryTime?: string | null; // ISO string
    exitTime?: string | null;  // ISO string
    note?: string;
    parkingSpotId?: string | null;
    // JOIN fields from backend
    unitNumber?: string | null;
    blockName?: string | null;
    hostName?: string | null;
    parkingSpot?: string | null;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string | null;
}

/**
 * Paginated guest visits response
 */
export interface GuestVisitsPaginatedResponse {
    visits: GuestVisitRaw[];
    total: number;
    page: number;
    limit: number;
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
