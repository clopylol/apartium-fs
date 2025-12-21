export type CargoStatus = "received" | "delivered" | "returned";
export type CourierStatus = "pending" | "inside" | "completed";
export type CargoType = "Small" | "Medium" | "Large";
export type CourierMethod = "app" | "manual";

export interface CargoItem {
  id: string;
  trackingNo: string;
  carrier: string;
  recipientName: string;
  unit: string;
  arrivalDate: string; // ISO String for sorting
  arrivalTime: string;
  status: CargoStatus;
  deliveredDate?: string;
  type: CargoType;
}

export interface ExpectedCargo {
  id: string;
  residentName: string;
  unit: string;
  trackingNo: string;
  carrier: string;
  expectedDate: string; // ISO date
  note: string;
  createdAt: string; // time ago
}

export interface CourierVisit {
  id: string;
  company: string;
  residentName: string;
  unit: string;
  status: CourierStatus;
  entryTime?: string;
  exitTime?: string;
  method: CourierMethod; // app = notification, manual = security entry
  note?: string;
  plate?: string;
}

export interface MockResident {
  id: string;
  name: string;
  unit: string;
}

