export interface Facility {
  id: string;
  name: string;
  image: string;
  status: 'open' | 'closed' | 'maintenance';
  hours: string;
  capacity: number;
  requiresBooking: boolean;
  pricePerHour: number;
}

export interface Booking {
  id: string;
  facilityId: string;
  residentName: string;
  unit: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  status: 'confirmed' | 'pending' | 'cancelled';
  note?: string;
  rejectionReason?: string;
}

export type BookingStatus = Booking['status'];
export type FacilityStatus = Facility['status'];

