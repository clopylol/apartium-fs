export interface Tenant {
  id: string;
  name: string;
  avatar: string;
  unit: string;
}

export interface Payment {
  id: string;
  tenant: Tenant;
  amount: number;
  date: string; // Relative time string for UI
  status: 'paid' | 'pending' | 'failed';
}

export interface MaintenanceRequest {
  id: string;
  tenant: Tenant;
  issue: string;
  date: string;
  status: 'new' | 'in-progress' | 'resolved';
}

export interface Booking {
  id: string;
  tenant: Tenant;
  facility: string;
  time: string;
}

export interface Alert {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'info' | 'warning' | 'success';
}

export type { Janitor, JanitorRequest, JanitorRequestType, JanitorRequestStatus, JanitorStatus } from './janitor.types';
export type { CargoItem, ExpectedCargo, CourierVisit, MockResident, CargoStatus, CourierStatus, CargoType, CourierMethod } from './cargo.types';
export type { Facility, Booking, BookingStatus, FacilityStatus } from './bookings.types';