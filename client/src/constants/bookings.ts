import type { Facility, Booking } from '@/types/bookings.types';

export const ITEMS_PER_PAGE = 10;

// --- Helpers for Dates ---
export const getTodayString = (): string => new Date().toISOString().split('T')[0];

export const addDays = (dateStr: string, days: number): string => {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

// --- Mock Data ---
export const INITIAL_FACILITIES: Facility[] = [
  {
    id: 'f1',
    name: 'Açık Yüzme Havuzu',
    image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80',
    status: 'open',
    hours: '08:00 - 22:00',
    capacity: 40,
    requiresBooking: false,
    pricePerHour: 0
  },
  {
    id: 'f2',
    name: 'Fitness Merkezi',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
    status: 'open',
    hours: '06:00 - 23:00',
    capacity: 20,
    requiresBooking: false,
    pricePerHour: 0
  },
  {
    id: 'f3',
    name: 'Tenis Kortu',
    image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=800&q=80',
    status: 'open',
    hours: '09:00 - 21:00',
    capacity: 4,
    requiresBooking: true,
    pricePerHour: 150
  },
  {
    id: 'f4',
    name: 'Toplantı & Etkinlik Salonu',
    image: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&w=800&q=80',
    status: 'maintenance',
    hours: 'İstek üzerine',
    capacity: 50,
    requiresBooking: true,
    pricePerHour: 500
  },
  {
    id: 'f5',
    name: 'Barbekü Alanı',
    image: 'https://images.unsplash.com/photo-1555529733-0e670560f7e1?auto=format&fit=crop&w=800&q=80',
    status: 'open',
    hours: '11:00 - 20:00',
    capacity: 10,
    requiresBooking: true,
    pricePerHour: 200
  }
];

// Generate bookings relative to today for Calendar demo
const today = getTodayString();
export const BASE_BOOKINGS: Booking[] = [
  { id: 'b1', facilityId: 'f3', residentName: 'Caner Erkin', unit: 'B-2', date: today, startTime: '14:00', endTime: '15:00', status: 'confirmed' },
  { id: 'b2', facilityId: 'f3', residentName: 'Ayşe Yılmaz', unit: 'A-4', date: today, startTime: '18:00', endTime: '19:00', status: 'confirmed' },
  { id: 'b3', facilityId: 'f4', residentName: 'Site Yönetimi', unit: 'Yönetim', date: addDays(today, 1), startTime: '10:00', endTime: '12:00', status: 'pending', note: 'Aylık olağan toplantı' },
  { id: 'b4', facilityId: 'f5', residentName: 'Mehmet Öz', unit: 'A-6', date: addDays(today, 2), startTime: '13:00', endTime: '17:00', status: 'confirmed' },
  { id: 'b5', facilityId: 'f3', residentName: 'Ali Demir', unit: 'C-1', date: addDays(today, 3), startTime: '09:00', endTime: '10:30', status: 'pending' },
];

// Generate additional mock data for pagination
const GENERATED_BOOKINGS: Booking[] = Array.from({ length: 45 }, (_, i) => {
  const date = addDays(today, Math.floor(Math.random() * 14) - 7); // +/- 7 days
  return {
    id: `gen-b-${i}`,
    facilityId: ['f3', 'f4', 'f5'][Math.floor(Math.random() * 3)] as string,
    residentName: `Sakin ${i + 10}`,
    unit: `${['A', 'B', 'C'][Math.floor(Math.random() * 3)]}-${Math.floor(Math.random() * 10) + 1}`,
    date: date,
    startTime: `${Math.floor(Math.random() * 10) + 9}:00`,
    endTime: `${Math.floor(Math.random() * 10) + 10}:00`,
    status: (['confirmed', 'pending', 'cancelled'][Math.floor(Math.random() * 3)] as Booking['status']),
    note: Math.random() > 0.7 ? 'Özel etkinlik' : undefined
  };
});

export const INITIAL_BOOKINGS = [...BASE_BOOKINGS, ...GENERATED_BOOKINGS];

