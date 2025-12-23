
import type { Payment, MaintenanceRequest, Booking, Alert } from '@/types';

export const RECENT_PAYMENTS: Payment[] = [
  {
    id: '1',
    tenant: { id: 't1', name: 'Zeynep Kaya', unit: 'Daire 4B', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&h=64' },
    amount: 18500,
    date: '2dk önce',
    status: 'paid'
  },
  {
    id: '2',
    tenant: { id: 't1', name: 'Zeynep Kaya', unit: 'Daire 4B', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&h=64' },
    amount: 1850,
    date: '3dk önce',
    status: 'paid'
  },
  {
    id: '3',
    tenant: { id: 't1', name: 'Zeynep Kaya', unit: 'Daire 4B', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&h=64' },
    amount: 18500,
    date: '8sa önce',
    status: 'paid'
  },
  {
    id: '4',
    tenant: { id: 't2', name: 'Burak Demir', unit: 'Daire 12A', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=64&h=64' },
    amount: 21000,
    date: '1g önce',
    status: 'paid'
  },
];

export const MAINTENANCE_REQUESTS: MaintenanceRequest[] = [
  {
    id: 'm1',
    tenant: { id: 't3', name: 'Murat Can', unit: 'Daire 2A', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=64&h=64' },
    issue: 'Mutfak lavabosu su damlatıyor.',
    date: '15dk önce',
    status: 'new'
  },
  {
    id: 'm2',
    tenant: { id: 't3', name: 'Murat Can', unit: 'Daire 2A', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=64&h=64' },
    issue: 'Murat Can tarafından yeni bakım talebi...',
    date: '15dk önce',
    status: 'new'
  },
  {
    id: 'm3',
    tenant: { id: 't4', name: 'Selin Yılmaz', unit: 'Daire 5C', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=64&h=64' },
    issue: 'Klima yeterince soğutmuyor.',
    date: '1sa önce',
    status: 'in-progress'
  },
];

export const BOOKINGS: Booking[] = [
  {
    id: 'b1',
    tenant: { id: 't4', name: 'Selin Yılmaz', unit: 'Daire 11C', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=64&h=64' },
    facility: 'Toplantı Odası rezervasyonu',
    time: '1sa önce'
  },
  {
    id: 'b2',
    tenant: { id: 't5', name: 'Davut Kim', unit: 'Daire 8B', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&h=64' },
    facility: 'Tenis Kortu rezervasyonu',
    time: '3sa önce'
  },
];

export const NEW_TENANTS: Alert[] = [
  {
    id: 'a1',
    title: 'Ali Rıza',
    description: 'Daire 7G\'ye taşındı.',
    time: '4sa önce',
    type: 'info'
  },
  {
    id: 'a2',
    title: 'Seda Erkin',
    description: 'Daire 3B\'ye taşındı.',
    time: '1g önce',
    type: 'info'
  },
];

export const CHART_DATA_INCOME = [
  { value: 4000 }, { value: 3000 }, { value: 5000 }, { value: 2780 }, { value: 1890 }, { value: 2390 }, { value: 3490 }
];

export const CHART_DATA_OCCUPANCY = [
  { value: 95 }, { value: 92 }, { value: 96 }, { value: 85 }, { value: 90 }, { value: 88 }, { value: 70 }
];

export { ITEMS_PER_PAGE, BLOCKS, INITIAL_JANITORS, INITIAL_REQUESTS } from './janitor';
export { ITEMS_PER_PAGE as CARGO_ITEMS_PER_PAGE, MOCK_RESIDENTS, INITIAL_CARGO, INITIAL_EXPECTED, INITIAL_COURIERS, CARRIERS, COURIER_COMPANIES } from './cargo';
export { ITEMS_PER_PAGE as BOOKINGS_ITEMS_PER_PAGE, INITIAL_FACILITIES, INITIAL_BOOKINGS, BASE_BOOKINGS, getTodayString, addDays } from './bookings';
