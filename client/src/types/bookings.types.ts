export type FacilityPricingType = 'free' | 'per_entry' | 'hourly' | 'monthly' | 'yearly';

export interface Facility {
  id: string;
  siteId?: string;
  buildingIds?: string[]; // null/empty = all buildings in site
  name: string;
  imageUrl?: string;
  status: 'open' | 'closed' | 'maintenance';
  // Working hours
  openTime?: string;  // HH:MM format
  closeTime?: string; // HH:MM format
  isOpen24Hours?: boolean;
  hours?: string; // backward compat (computed: "09:00 - 22:00")
  // Capacity & Booking
  capacity: number;
  requiresBooking: boolean;
  // Pricing
  pricingType: FacilityPricingType;
  price: number;
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
