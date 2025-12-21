
import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, User, Phone, Mail, Car, MapPin, MoreVertical, X, Home, Users, UserPlus, Key, Edit2, Trash2, AlertTriangle, Save, Layers, LayoutGrid, List, ParkingSquare, ShieldCheck, ArrowDown, ArrowUp, Clock, CalendarDays, LogIn, LogOut, History, CarFront, Smartphone, PenTool, MessageSquare, PlusCircle, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import StatCard from './StatCards';

// --- Constants ---
const ITEMS_PER_PAGE = 12;
const GUESTS_PER_PAGE = 10;

// Data Structures
interface ResidentVehicle {
  id: string;
  plate: string;
  model: string;
  parkingSpot?: string;
}

interface Resident {
  id: string;
  name: string;
  type: 'owner' | 'tenant';
  phone: string;
  email?: string;
  avatar: string;
  vehicles: ResidentVehicle[];
}

interface Unit {
  id: string;
  number: string;
  floor: number;
  status: 'occupied' | 'empty';
  residents: Resident[];
}

interface ParkingSpotDefinition {
  id: string;
  name: string;
  floor: number; // Added floor property
}

interface Building {
  id: string;
  name: string;
  units: Unit[];
  parkingSpots: ParkingSpotDefinition[];
}

interface GuestVisit {
  id: string;
  plate: string;
  guestName?: string; // Added guest name
  model?: string;
  color?: string;
  hostName: string;
  unitNumber: string;
  blockName: string;
  status: 'pending' | 'active' | 'completed'; // pending=expected, active=inside
  source: 'app' | 'manual' | 'phone'; // New field to track origin
  expectedDate: string; // ISO date
  durationDays: number;
  entryTime?: string;
  exitTime?: string;
  note?: string;
}

// Helper to generate mock units
const generateMockUnits = (blockId: string, count: number, startFloor: number): Unit[] => {
  return Array.from({ length: count }, (_, i) => {
    const isOccupied = Math.random() > 0.3;
    return {
      id: `${blockId.toLowerCase()}-gen-${i + 10}`, 
      number: `${i + 10}`,
      floor: startFloor + Math.floor(i / 4), // 4 units per floor
      status: isOccupied ? 'occupied' : 'empty',
      residents: isOccupied ? [
          {
              id: `r-${blockId}-${i + 10}`,
              name: `Sakin ${blockId}-${i + 10}`,
              type: Math.random() > 0.5 ? 'owner' : 'tenant',
              phone: `555-${1000 + i}`,
              email: `sakin${i}@example.com`,
              avatar: `https://ui-avatars.com/api/?name=Sakin+${i}&background=random&color=fff`,
              vehicles: Math.random() > 0.7 ? [{ id: `v-${i}`, plate: `34 T ${100+i}`, model: 'Fiat Egea' }] : []
          }
      ] : []
    };
  });
};

const INITIAL_BUILDINGS: Building[] = [
  {
    id: 'A',
    name: 'A Blok',
    // Updated to include floors: 0 (Ground) and -1 (Basement)
    parkingSpots: [
      ...Array.from({ length: 8 }, (_, i) => ({ id: `p-a-0-${i}`, name: `A-${String(i + 1).padStart(2, '0')}`, floor: 0 })),
      ...Array.from({ length: 8 }, (_, i) => ({ id: `p-a-m1-${i}`, name: `A-B${String(i + 1).padStart(2, '0')}`, floor: -1 }))
    ],
    units: [
      { 
        id: 'a1', number: '1', floor: 1, status: 'occupied', 
        residents: [{ 
          id: 'r1', name: 'Ahmet Yılmaz', type: 'owner', phone: '555-0001', email: 'ahmet@example.com', 
          avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=64&h=64',
          vehicles: [
            { id: 'v1', plate: '34 AB 123', model: 'Toyota Corolla (Beyaz)', parkingSpot: 'A-01' }
          ]
        }] 
      },
      { id: 'a2', number: '2', floor: 1, status: 'empty', residents: [] },
      { 
        id: 'a3', number: '3', floor: 2, status: 'occupied', 
        residents: [
          { 
            id: 'r2', name: 'Ayşe Demir', type: 'tenant', phone: '555-0002', 
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&h=64',
            vehicles: [
               { id: 'v2', plate: '34 KL 456', model: 'Honda Civic (Siyah)', parkingSpot: 'A-03' }
            ]
          }, 
          { 
            id: 'r3', name: 'Ali Demir', type: 'tenant', phone: '555-0003', 
            avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=64&h=64',
            vehicles: []
          }
        ] 
      },
      { 
        id: 'a4', number: '4', floor: 2, status: 'occupied', 
        residents: [{ 
          id: 'r4', name: 'Selin Kaya', type: 'owner', phone: '555-0004', 
          avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=64&h=64',
          vehicles: [
            { id: 'v3', plate: '35 KS 99', model: 'VW Golf (Kırmızı)', parkingSpot: 'A-04' }
          ]
        }] 
      },
      { id: 'a5', number: '5', floor: 3, status: 'empty', residents: [] },
      { 
        id: 'a6', number: '6', floor: 3, status: 'occupied', 
        residents: [{ 
          id: 'r5', name: 'Mehmet Can', type: 'tenant', phone: '555-0005', 
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&h=64',
          vehicles: []
        }] 
      },
      // Add generated units to demonstrate pagination
      ...generateMockUnits('A', 42, 4)
    ]
  },
  {
    id: 'B',
    name: 'B Blok',
    parkingSpots: Array.from({ length: 8 }, (_, i) => ({ id: `p-b-${i}`, name: `B-${String(i + 1).padStart(2, '0')}`, floor: 0 })),
    units: [
      { 
        id: 'b1', number: '1', floor: 1, status: 'occupied', 
        residents: [{ 
          id: 'r6', name: 'Zeynep Su', type: 'owner', phone: '555-0006', 
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=64&h=64',
          vehicles: [
            { id: 'v4', plate: '06 ZYN 06', model: 'BMW 320i (Gri)', parkingSpot: 'B-01' }
          ]
        }] 
      },
      { 
        id: 'b2', number: '2', floor: 1, status: 'occupied', 
        residents: [{ 
          id: 'r7', name: 'Caner Erkin', type: 'tenant', phone: '555-0007', 
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=64&h=64',
          vehicles: []
        }] 
      },
    ]
  },
  {
    id: 'C',
    name: 'C Blok',
    parkingSpots: Array.from({ length: 12 }, (_, i) => ({ id: `p-c-${i}`, name: `C-${String(i + 1).padStart(2, '0')}`, floor: 0 })),
    units: [
       { id: 'c1', number: '1', floor: 1, status: 'empty', residents: [] },
       { id: 'c2', number: '2', floor: 1, status: 'empty', residents: [] },
    ]
  }
];

// Generate mock guests for pagination
const GENERATED_GUESTS: GuestVisit[] = Array.from({ length: 35 }, (_, i) => {
  const plates = ['34', '06', '35', '16', '07'];
  const statuses = ['pending', 'active', 'completed'] as const;
  const plate = `${plates[Math.floor(Math.random() * plates.length)]} ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))} ${Math.floor(Math.random() * 900) + 100}`;
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  
  return {
    id: `gen-guest-${i}`,
    plate: plate,
    guestName: `Misafir ${i + 1}`,
    hostName: `Sakin ${Math.floor(Math.random() * 20) + 1}`,
    unitNumber: `${Math.floor(Math.random() * 10) + 1}`,
    blockName: ['A Blok', 'B Blok', 'C Blok'][Math.floor(Math.random() * 3)],
    status: status,
    source: Math.random() > 0.5 ? 'app' : 'manual',
    expectedDate: new Date().toISOString().split('T')[0],
    durationDays: 1,
    model: 'Binek Araç',
    color: ['Beyaz', 'Siyah', 'Gri', 'Kırmızı'][Math.floor(Math.random() * 4)],
    entryTime: status !== 'pending' ? '10:00' : undefined,
    exitTime: status === 'completed' ? '14:00' : undefined,
  };
});

const INITIAL_GUESTS: GuestVisit[] = [
  { 
    id: 'g1', 
    plate: '34 ASD 12', 
    guestName: 'Ali Veli',
    hostName: 'Ahmet Yılmaz', 
    unitNumber: '1', 
    blockName: 'A Blok',
    status: 'active', 
    source: 'manual',
    expectedDate: new Date().toISOString().split('T')[0], 
    durationDays: 1, 
    entryTime: '10:30', 
    model: 'Fiat Egea', 
    color: 'Beyaz' 
  },
  { 
    id: 'g2', 
    plate: '06 ANK 99', 
    guestName: 'Mehmet Öz',
    hostName: 'Zeynep Su', 
    unitNumber: '1', 
    blockName: 'B Blok',
    status: 'pending',
    source: 'app', 
    expectedDate: new Date().toISOString().split('T')[0], 
    durationDays: 3, 
    model: 'VW Passat', 
    note: 'Babamlar geliyor, otoparkı kullanabilirler.' 
  },
  { 
    id: 'g3', 
    plate: '35 IZM 35', 
    guestName: 'Ayşe Demir',
    hostName: 'Selin Kaya', 
    unitNumber: '4', 
    blockName: 'A Blok',
    status: 'completed', 
    source: 'manual',
    expectedDate: '2024-10-25', 
    durationDays: 1, 
    entryTime: '14:00',
    exitTime: '18:30',
    model: 'Ford Focus'
  },
  ...GENERATED_GUESTS
];

// --- Skeleton Components ---

const ResidentCardSkeleton = () => (
  <div className="rounded-2xl border border-slate-800 bg-slate-900 h-[280px] animate-pulse flex flex-col shadow-lg">
    <div className="p-5 border-b border-slate-800 flex justify-between">
       <div className="h-6 w-24 bg-slate-800 rounded"></div>
       <div className="h-6 w-16 bg-slate-800 rounded"></div>
    </div>
    <div className="p-5 flex-1 space-y-4">
       <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-800 shrink-0"></div>
          <div className="space-y-2 flex-1">
             <div className="h-4 w-32 bg-slate-800 rounded"></div>
             <div className="h-3 w-20 bg-slate-800 rounded"></div>
          </div>
       </div>
       <div className="h-12 bg-slate-800/50 rounded-lg"></div>
    </div>
    <div className="p-4 border-t border-slate-800 flex justify-between">
       <div className="h-4 w-20 bg-slate-800 rounded"></div>
       <div className="h-8 w-24 bg-slate-800 rounded"></div>
    </div>
  </div>
);

const ResidentRowSkeleton = () => (
  <tr className="border-b border-slate-800/50">
    <td className="px-6 py-4">
      <div className="space-y-2">
        <div className="h-5 w-20 bg-slate-800 rounded animate-pulse" />
        <div className="h-3 w-12 bg-slate-800 rounded animate-pulse" />
      </div>
    </td>
    <td className="px-6 py-4"><div className="h-6 w-16 bg-slate-800 rounded-full animate-pulse" /></td>
    <td className="px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-slate-800 animate-pulse" />
        <div className="space-y-1">
          <div className="h-4 w-32 bg-slate-800 rounded animate-pulse" />
          <div className="h-3 w-20 bg-slate-800 rounded animate-pulse" />
        </div>
      </div>
    </td>
    <td className="px-6 py-4"><div className="h-4 w-24 bg-slate-800 rounded animate-pulse" /></td>
    <td className="px-6 py-4"><div className="h-4 w-24 bg-slate-800 rounded animate-pulse" /></td>
    <td className="px-6 py-4 text-right"><div className="h-8 w-8 bg-slate-800 rounded ml-auto animate-pulse" /></td>
  </tr>
);

const ParkingMapSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
     <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 h-[600px]">
        <div className="flex justify-between mb-6">
           <div className="h-6 w-48 bg-slate-800 rounded"></div>
           <div className="h-6 w-32 bg-slate-800 rounded"></div>
        </div>
        <div className="flex gap-2 mb-6">
           {[1,2,3,4].map(i => <div key={i} className="h-8 w-24 bg-slate-800 rounded-full"></div>)}
        </div>
        <div className="grid grid-cols-5 gap-4">
           {Array.from({length: 15}).map((_, i) => (
              <div key={i} className="aspect-square bg-slate-800/50 rounded-xl border border-slate-800"></div>
           ))}
        </div>
     </div>
     <div className="bg-slate-900 border border-slate-800 rounded-2xl h-[600px] p-4 flex flex-col">
         <div className="h-12 w-full bg-slate-800 rounded-xl mb-4"></div>
         <div className="space-y-3 flex-1">
            {Array.from({length: 5}).map((_, i) => (
               <div key={i} className="h-24 bg-slate-800/50 rounded-xl"></div>
            ))}
         </div>
     </div>
  </div>
);

const StatCardSkeleton = () => (
  <div className="relative overflow-hidden rounded-2xl p-6 border border-slate-800 bg-slate-900 h-full min-h-[160px] shadow-lg animate-pulse">
    <div className="flex justify-between items-start">
      <div className="space-y-3 w-full">
        <div className="h-4 w-24 bg-slate-800 rounded" />
        <div className="h-8 w-32 bg-slate-800 rounded" />
      </div>
      <div className="w-12 h-12 bg-slate-800 rounded-xl shrink-0" />
    </div>
    <div className="mt-6 flex gap-2">
      <div className="h-6 w-16 bg-slate-800 rounded-full" />
      <div className="h-6 w-24 bg-slate-800 rounded" />
    </div>
  </div>
);

const GuestRowSkeleton = () => (
  <tr className="border-b border-slate-800/50">
    <td className="px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-slate-800 rounded-lg animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 w-32 bg-slate-800 rounded animate-pulse" />
          <div className="h-3 w-20 bg-slate-800 rounded animate-pulse" />
        </div>
      </div>
    </td>
    <td className="px-6 py-4">
      <div className="space-y-2">
        <div className="h-4 w-24 bg-slate-800 rounded animate-pulse" />
        <div className="h-3 w-32 bg-slate-800 rounded animate-pulse" />
      </div>
    </td>
    <td className="px-6 py-4"><div className="h-4 w-24 bg-slate-800 rounded animate-pulse" /></td>
    <td className="px-6 py-4"><div className="h-6 w-20 bg-slate-800 rounded-full animate-pulse" /></td>
    <td className="px-6 py-4 text-right"><div className="h-8 w-8 bg-slate-800 rounded ml-auto animate-pulse" /></td>
  </tr>
);

// --- Pagination Controls Component ---
interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const PaginationControls: React.FC<PaginationProps> = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-slate-800 animate-in fade-in">
      <div className="text-sm text-slate-500 font-medium">
        Toplam <span className="text-slate-300 font-bold">{totalItems}</span> kayıttan <span className="text-white font-bold">{startItem}-{endItem}</span> arası gösteriliyor
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-400 hover:text-white hover:border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
           // Show first, last, and near current pages
           if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
             return (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`w-8 h-8 rounded-lg text-sm font-bold transition-all ${
                    currentPage === page
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                      : 'bg-slate-900 border border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white'
                  }`}
                >
                  {page}
                </button>
             );
           } else if (page === currentPage - 2 || page === currentPage + 2) {
             return <span key={page} className="text-slate-600">...</span>;
           }
           return null;
        })}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-400 hover:text-white hover:border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const ResidentsPage = () => {
  const [buildings, setBuildings] = useState<Building[]>(INITIAL_BUILDINGS);
  const [activeBlockId, setActiveBlockId] = useState('A');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Parking Floor State
  const [activeParkingFloor, setActiveParkingFloor] = useState<number>(0);

  // View Mode: residents | parking | guests
  const [activeTab, setActiveTab] = useState<'residents' | 'parking' | 'guests'>('residents');
  const [residentViewMode, setResidentViewMode] = useState<'grid' | 'list'>('grid');
  
  // Pagination State (Residents)
  const [currentPage, setCurrentPage] = useState(1);
  
  // Pagination State (Guests)
  const [guestPage, setGuestPage] = useState(1);

  // Guest Management State
  const [guestList, setGuestList] = useState<GuestVisit[]>(INITIAL_GUESTS);
  const [guestFilter, setGuestFilter] = useState<'all' | 'pending' | 'active' | 'completed'>('all');
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<GuestVisit | null>(null);
  const [guestForm, setGuestForm] = useState({
    plate: '',
    guestName: '',
    model: '',
    color: '',
    blockId: '',
    unitId: '',
    durationDays: 1,
    note: ''
  });

  // Resident Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [residentForm, setResidentForm] = useState({
    id: '', // Empty for new residents
    name: '',
    type: 'tenant' as 'owner' | 'tenant',
    phone: '',
    email: '',
    blockId: '',
    unitId: ''
  });

  // Vehicle Management State
  const [showVehicleManager, setShowVehicleManager] = useState(false);
  const [managingResident, setManagingResident] = useState<{resident: Resident, blockId: string, unitId: string} | null>(null);
  const [vehicleForm, setVehicleForm] = useState({
    plate: '',
    model: '',
    parkingSpot: ''
  });

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    action: () => void;
    type: 'approve' | 'danger';
  }>({ isOpen: false, title: '', message: '', action: () => {}, type: 'approve' });

  // Building Management Modal State
  const [showBuildingModal, setShowBuildingModal] = useState(false);
  const [buildingModalMode, setBuildingModalMode] = useState<'add' | 'edit' | 'delete'>('add');
  const [buildingNameInput, setBuildingNameInput] = useState('');

  // Unit Management Modal State
  const [showUnitModal, setShowUnitModal] = useState(false);
  const [unitModalMode, setUnitModalMode] = useState<'add' | 'edit' | 'delete'>('add');
  const [unitForm, setUnitForm] = useState({
    id: '',
    number: '',
    floor: ''
  });

  // Parking Spot Management Modal State
  const [showSpotModal, setShowSpotModal] = useState(false);
  const [spotModalMode, setSpotModalMode] = useState<'add' | 'edit' | 'delete'>('add');
  const [spotForm, setSpotForm] = useState({
    id: '',
    name: '',
    floor: 0
  });

  // Simulate Loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Reset Pages on Filter Change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeBlockId, searchTerm, activeTab]);

  useEffect(() => {
    setGuestPage(1);
  }, [searchTerm, guestFilter]);

  // Derived Values
  const activeBlock = buildings.find(b => b.id === activeBlockId);
  
  // Enhanced Filter for Residents View
  const filteredUnits = activeBlock 
    ? activeBlock.units.filter(unit => {
        const term = searchTerm.toLowerCase();
        const matchesSearch = 
            unit.number.includes(term) || 
            unit.residents.some(r => 
              r.name.toLowerCase().includes(term) || 
              r.vehicles.some(v => v.plate.toLowerCase().replace(/\s/g, '').includes(term.replace(/\s/g, '')))
            );
        return matchesSearch;
      })
    : [];
  
  // Pagination Logic (Residents)
  const paginatedUnits = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUnits.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredUnits, currentPage]);

  // Filter for Parking View (Flattened list of cars INCLUDING GUESTS)
  const allVehicles = [
    // Resident Vehicles
    ...buildings.flatMap(b => 
      b.units.flatMap(u => 
        u.residents.flatMap(r => 
          r.vehicles.map(v => ({
            id: v.id,
            plate: v.plate,
            name: r.name,
            phone: r.phone,
            email: r.email,
            type: r.type,
            vehicleModel: v.model,
            parkingSpot: v.parkingSpot,
            avatar: r.avatar,
            unitNumber: u.number,
            blockName: b.name,
            isGuest: false,
            source: null,
            status: undefined
          }))
        )
      )
    ),
    // Guest Vehicles (Active or Pending)
    ...guestList
      .filter(g => (g.status === 'active' || g.status === 'pending') && g.plate)
      .map(g => ({
        id: g.id,
        plate: g.plate,
        name: g.guestName || 'Misafir',
        phone: '-', // Guests typically don't show phone here
        email: '',
        type: 'guest',
        vehicleModel: g.model,
        parkingSpot: 'Misafir',
        avatar: '',
        unitNumber: g.unitNumber,
        blockName: g.blockName,
        isGuest: true,
        source: g.source,
        status: g.status
      }))
  ].filter(v => {
      const term = searchTerm.toLowerCase();
      return (
        v.plate?.toLowerCase().includes(term) || 
        v.name.toLowerCase().includes(term) ||
        v.parkingSpot?.toLowerCase().includes(term) ||
        v.unitNumber.includes(term)
      );
  });

  // Filter for Guest View
  const filteredGuests = useMemo(() => {
    return guestList.filter(g => {
      const term = searchTerm.toLowerCase();
      const matchesSearch = 
        g.plate.toLowerCase().includes(term) || 
        g.hostName.toLowerCase().includes(term) ||
        g.unitNumber.includes(term) ||
        (g.model && g.model.toLowerCase().includes(term)) ||
        (g.guestName && g.guestName.toLowerCase().includes(term));
      
      const matchesFilter = guestFilter === 'all' || g.status === guestFilter;
      
      return matchesSearch && matchesFilter;
    }).sort((a, b) => {
      // Sort logic: Active first, then Pending, then Completed
      const statusOrder = { 'active': 0, 'pending': 1, 'completed': 2 };
      if (statusOrder[a.status] !== statusOrder[b.status]) {
        return statusOrder[a.status] - statusOrder[b.status];
      }
      return new Date(b.expectedDate).getTime() - new Date(a.expectedDate).getTime();
    });
  }, [guestList, searchTerm, guestFilter]);

  // Pagination Logic (Guests)
  const paginatedGuests = useMemo(() => {
    const startIndex = (guestPage - 1) * GUESTS_PER_PAGE;
    return filteredGuests.slice(startIndex, startIndex + GUESTS_PER_PAGE);
  }, [filteredGuests, guestPage]);

  const guestStats = {
    active: guestList.filter(g => g.status === 'active').length,
    pending: guestList.filter(g => g.status === 'pending').length,
    completedToday: guestList.filter(g => g.status === 'completed' && g.exitTime).length
  };

  const stats = activeBlock ? {
    total: activeBlock.units.length,
    occupied: activeBlock.units.filter(u => u.status === 'occupied').length,
    empty: activeBlock.units.filter(u => u.status === 'empty').length,
  } : { total: 0, occupied: 0, empty: 0 };

  // Calculate Available Floors for the active block
  const availableParkingFloors = activeBlock 
    ? (Array.from(new Set(activeBlock.parkingSpots.map((s) => s.floor))) as number[]).sort((a: number, b: number) => b - a)
    : [0];

  // Generate Parking Spots Grid (Filtered by Floor)
  const parkingGridData = activeBlock?.parkingSpots
    .filter(spot => spot.floor === activeParkingFloor)
    .map(spot => {
        // Find occupant for this specific spot name
        // We need to search all vehicles of all residents in this block/unit structure
        const occupantInfo = activeBlock.units
            .flatMap(u => u.residents.map(r => ({ resident: r, unitNumber: u.number })))
            .flatMap(item => item.resident.vehicles.map(v => ({ ...v, resident: item.resident, unitNumber: item.unitNumber })))
            .find(v => v.parkingSpot === spot.name);
            
        return {
            ...spot,
            occupant: occupantInfo ? { ...occupantInfo.resident, plate: occupantInfo.plate, name: occupantInfo.resident.name } : null,
            plate: occupantInfo?.plate,
            unitNumber: occupantInfo?.unitNumber
        };
    }) || [];

  // Effects
  useEffect(() => {
    if (!activeBlock && buildings.length > 0) {
      setActiveBlockId(buildings[0].id);
    }
  }, [activeBlock, buildings]);

  // Reset active floor when block changes
  useEffect(() => {
    if (activeBlock) {
        const floors = Array.from(new Set(activeBlock.parkingSpots.map(s => s.floor))) as number[];
        if (floors.length > 0) {
             // Default to 0 if exists, otherwise first available
            setActiveParkingFloor(floors.includes(0) ? 0 : floors[0]);
        } else {
            setActiveParkingFloor(0);
        }
    }
  }, [activeBlockId]);

  // --- Resident Management Functions ---

  const handleOpenAddResident = (blockId?: string, unitId?: string) => {
    setResidentForm({
      id: '',
      name: '',
      type: 'tenant',
      phone: '',
      email: '',
      blockId: blockId || activeBlockId,
      unitId: unitId || ''
    });
    setShowAddModal(true);
  };

  const handleOpenEditResident = (resident: Resident, blockId: string, unitId: string) => {
    setResidentForm({
      id: resident.id,
      name: resident.name,
      type: resident.type,
      phone: resident.phone,
      email: resident.email || '',
      blockId: blockId,
      unitId: unitId
    });
    setShowAddModal(true);
  };

  const handleSaveResident = () => {
    if (!residentForm.name || !residentForm.blockId || !residentForm.unitId) return;

    setBuildings(prevBuildings => {
      return prevBuildings.map(b => {
        if (b.id !== residentForm.blockId) return b;

        return {
          ...b,
          units: b.units.map(u => {
            if (u.id !== residentForm.unitId) return u;

            let updatedResidents = [...u.residents];
            
            if (residentForm.id) {
              // Edit existing resident
              updatedResidents = updatedResidents.map(r => r.id === residentForm.id ? {
                ...r,
                name: residentForm.name,
                type: residentForm.type,
                phone: residentForm.phone,
                email: residentForm.email,
                // Preserved vehicles
                vehicles: r.vehicles
              } : r);
            } else {
              // Add new resident
              updatedResidents.push({
                id: `res-${Date.now()}`,
                name: residentForm.name,
                type: residentForm.type,
                phone: residentForm.phone,
                email: residentForm.email,
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(residentForm.name)}&background=random&color=fff`,
                vehicles: [] // Start with empty vehicles
              });
            }

            return {
              ...u,
              status: updatedResidents.length > 0 ? 'occupied' : 'empty',
              residents: updatedResidents
            };
          })
        };
      });
    });

    setShowAddModal(false);
  };

  const handleDeleteResident = (residentId: string, blockId: string, unitId: string) => {
     if(!window.confirm("Bu kişiyi silmek istediğinize emin misiniz?")) return;

     setBuildings(prevBuildings => {
      return prevBuildings.map(b => {
        if (b.id !== blockId) return b;
        return {
          ...b,
          units: b.units.map(u => {
            if (u.id !== unitId) return u;
            const updatedResidents = u.residents.filter(r => r.id !== residentId);
            return {
              ...u,
              status: updatedResidents.length > 0 ? 'occupied' : 'empty',
              residents: updatedResidents
            };
          })
        };
      });
    });
  };

  // --- Vehicle Management Functions ---
  const handleOpenVehicleManager = (resident: Resident, blockId: string, unitId: string) => {
    setManagingResident({ resident, blockId, unitId });
    setVehicleForm({ plate: '', model: '', parkingSpot: '' });
    setShowVehicleManager(true);
  };

  const handleAddVehicleRequest = () => {
    if (!managingResident || !vehicleForm.plate) return;
    setConfirmModal({
        isOpen: true,
        title: 'Araç Ekleme Onayı',
        message: `${managingResident.resident.name} isimli sakine ${vehicleForm.plate.toUpperCase()} plakalı aracı eklemek istediğinize emin misiniz?`,
        type: 'approve',
        action: handleAddVehicle
    });
  };

  const handleAddVehicle = () => {
    if (!managingResident || !vehicleForm.plate) return;

    const newVehicle: ResidentVehicle = {
      id: `v-${Date.now()}`,
      plate: vehicleForm.plate.toUpperCase(),
      model: vehicleForm.model,
      parkingSpot: vehicleForm.parkingSpot
    };

    setBuildings(prev => prev.map(b => {
      if (b.id !== managingResident.blockId) return b;
      return {
        ...b,
        units: b.units.map(u => {
          if (u.id !== managingResident.unitId) return u;
          return {
            ...u,
            residents: u.residents.map(r => {
              if (r.id !== managingResident.resident.id) return r;
              const updatedResident = { ...r, vehicles: [...r.vehicles, newVehicle] };
              // Update local state to reflect change immediately in modal
              setManagingResident({ ...managingResident, resident: updatedResident });
              return updatedResident;
            })
          };
        })
      };
    }));

    setVehicleForm({ plate: '', model: '', parkingSpot: '' });
  };

  const handleDeleteVehicleRequest = (vehicleId: string, plate: string) => {
    setConfirmModal({
        isOpen: true,
        title: 'Araç Silme Onayı',
        message: `${plate} plakalı aracı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`,
        type: 'danger',
        action: () => handleDeleteVehicle(vehicleId)
    });
  };

  const handleDeleteVehicle = (vehicleId: string) => {
    if (!managingResident) return;

    setBuildings(prev => prev.map(b => {
      if (b.id !== managingResident.blockId) return b;
      return {
        ...b,
        units: b.units.map(u => {
          if (u.id !== managingResident.unitId) return u;
          return {
            ...u,
            residents: u.residents.map(r => {
              if (r.id !== managingResident.resident.id) return r;
              const updatedResident = { ...r, vehicles: r.vehicles.filter(v => v.id !== vehicleId) };
              // Update local state to reflect change immediately in modal
              setManagingResident({ ...managingResident, resident: updatedResident });
              return updatedResident;
            })
          };
        })
      };
    }));
  };

  // --- Guest Management Functions ---
  const handleGuestSubmit = () => {
    if (!guestForm.plate || !guestForm.blockId || !guestForm.unitId) {
      alert("Lütfen plaka ve ev sahibi seçiniz.");
      return;
    }

    const selectedBlock = buildings.find(b => b.id === guestForm.blockId);
    const selectedUnit = selectedBlock?.units.find(u => u.id === guestForm.unitId);
    const host = selectedUnit?.residents[0]; // Assuming first resident is main host for demo
    
    if (!host) {
      alert("Seçilen dairede sakin bulunamadı.");
      return;
    }

    const newGuest: GuestVisit = {
      id: `g-${Date.now()}`,
      plate: guestForm.plate.toUpperCase(),
      guestName: guestForm.guestName,
      model: guestForm.model,
      color: guestForm.color,
      hostName: host.name,
      unitNumber: selectedUnit.number,
      blockName: selectedBlock?.name || '',
      status: 'active', // Direct entry is active for Manual entry
      source: 'manual', // Explicitly manual
      expectedDate: new Date().toISOString().split('T')[0],
      durationDays: guestForm.durationDays,
      entryTime: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      note: guestForm.note
    };

    setGuestList([newGuest, ...guestList]);
    setShowGuestModal(false);
    setGuestForm({ plate: '', guestName: '', model: '', color: '', blockId: '', unitId: '', durationDays: 1, note: '' });
  };

  const handleCheckIn = (guestId: string) => {
    setGuestList(prev => prev.map(g => g.id === guestId ? {
      ...g,
      status: 'active',
      entryTime: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    } : g));
    
    // Also update selectedGuest if it's open
    if (selectedGuest && selectedGuest.id === guestId) {
      setSelectedGuest(prev => prev ? ({
        ...prev,
        status: 'active',
        entryTime: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
      }) : null);
    }
  };

  const handleCheckOut = (guestId: string) => {
    setGuestList(prev => prev.map(g => g.id === guestId ? {
      ...g,
      status: 'completed',
      exitTime: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    } : g));
    
    // Also update selectedGuest if it's open
    if (selectedGuest && selectedGuest.id === guestId) {
       setSelectedGuest(prev => prev ? ({
        ...prev,
        status: 'completed',
        exitTime: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
      }) : null);
    }
  };

  // --- Unit & Building Management ---
  const handleOpenAddUnit = () => { setUnitForm({ id: '', number: '', floor: '' }); setUnitModalMode('add'); setShowUnitModal(true); };
  const handleOpenEditUnit = (unit: Unit) => { setUnitForm({ id: unit.id, number: unit.number, floor: unit.floor.toString() }); setUnitModalMode('edit'); setShowUnitModal(true); };
  const handleOpenDeleteUnit = (unit: Unit) => { setUnitForm({ id: unit.id, number: unit.number, floor: unit.floor.toString() }); setUnitModalMode('delete'); setShowUnitModal(true); };
  
  const handleUnitSubmit = () => {
    if (!activeBlock) return;
    if (unitModalMode === 'delete') {
      setBuildings(prev => prev.map(b => b.id !== activeBlockId ? b : { ...b, units: b.units.filter(u => u.id !== unitForm.id) }));
    } else {
      if (!unitForm.number || !unitForm.floor) return;
      setBuildings(prev => prev.map(b => {
        if (b.id !== activeBlockId) return b;
        let newUnits = [...b.units];
        if (unitModalMode === 'add') {
           newUnits.push({ id: `u-${Date.now()}`, number: unitForm.number, floor: parseInt(unitForm.floor), status: 'empty', residents: [] });
        } else {
           newUnits = newUnits.map(u => u.id === unitForm.id ? { ...u, number: unitForm.number, floor: parseInt(unitForm.floor) } : u);
        }
        return { ...b, units: newUnits };
      }));
    }
    setShowUnitModal(false);
  };

  const handleOpenAddBuilding = () => { setBuildingModalMode('add'); setBuildingNameInput(''); setShowBuildingModal(true); };
  const handleOpenEditBuilding = () => { if (!activeBlock) return; setBuildingModalMode('edit'); setBuildingNameInput(activeBlock.name); setShowBuildingModal(true); };
  const handleOpenDeleteBuilding = () => { if (!activeBlock) return; setBuildingModalMode('delete'); setShowBuildingModal(true); };

  const handleBuildingSubmit = () => {
    if (buildingModalMode === 'add') {
      if (!buildingNameInput.trim()) return;
      const newId = `blk-${Date.now()}`;
      setBuildings([...buildings, { id: newId, name: buildingNameInput, parkingSpots: [], units: Array.from({ length: 4 }, (_, i) => ({ id: `${newId}-u${i + 1}`, number: `${i + 1}`, floor: 1, status: 'empty', residents: [] })) }]);
      setActiveBlockId(newId);
    } else if (buildingModalMode === 'edit') {
      if (!buildingNameInput.trim() || !activeBlock) return;
      setBuildings(buildings.map(b => b.id === activeBlock.id ? { ...b, name: buildingNameInput } : b));
    } else if (buildingModalMode === 'delete') {
      if (!activeBlock) return;
      setBuildings(buildings.filter(b => b.id !== activeBlock.id));
    }
    setShowBuildingModal(false);
  };

  // --- Parking Spot Management ---
  const handleOpenAddSpot = () => { setSpotForm({ id: '', name: '', floor: activeParkingFloor }); setSpotModalMode('add'); setShowSpotModal(true); };
  const handleOpenEditSpot = (spot: ParkingSpotDefinition) => { setSpotForm({ ...spot }); setSpotModalMode('edit'); setShowSpotModal(true); };
  const handleOpenDeleteSpot = (spot: ParkingSpotDefinition) => { setSpotForm({ ...spot }); setSpotModalMode('delete'); setShowSpotModal(true); };

  const handleSpotSubmit = () => {
    if (!activeBlock) return;

    if (spotModalMode === 'delete') {
       setBuildings(prev => prev.map(b => b.id !== activeBlockId ? b : {
         ...b,
         parkingSpots: b.parkingSpots.filter(p => p.id !== spotForm.id)
       }));
    } else {
       if (!spotForm.name.trim()) return;
       setBuildings(prev => prev.map(b => {
         if (b.id !== activeBlockId) return b;
         let newSpots = [...b.parkingSpots];
         if (spotModalMode === 'add') {
            newSpots.push({ id: `spot-${Date.now()}`, name: spotForm.name, floor: Number(spotForm.floor) });
         } else {
            newSpots = newSpots.map(s => s.id === spotForm.id ? { ...s, name: spotForm.name, floor: Number(spotForm.floor) } : s);
         }
         return { ...b, parkingSpots: newSpots };
       }));
    }
    setShowSpotModal(false);
  };

  const getFloorLabel = (floor: number) => {
      if (floor === 0) return 'Zemin Kat';
      if (floor < 0) return `${Math.abs(floor)}. Bodrum`;
      return `${floor}. Kat`;
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 overflow-hidden relative">
      
      {/* Header */}
      <header className="h-20 border-b border-slate-800/50 flex items-center justify-between px-8 bg-slate-950 shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold font-heading text-white">Kiracılar & Otopark</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder={activeTab === 'guests' ? "Plaka, misafir veya ev sahibi..." : "Daire, kişi veya plaka..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 w-64 placeholder-slate-500 transition-all focus:w-80"
            />
          </div>
          
          <div className="h-8 w-px bg-slate-800 mx-2 hidden md:block"></div>

          {/* Main View Toggle */}
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
             <button 
                onClick={() => setActiveTab('residents')}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'residents' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
             >
                <Users className="w-4 h-4" /> Sakinler
             </button>
             <button 
                onClick={() => setActiveTab('parking')}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'parking' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
             >
                <Car className="w-4 h-4" /> Otopark
             </button>
             <button 
                onClick={() => setActiveTab('guests')}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'guests' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
             >
                <CarFront className="w-4 h-4" /> Misafir
             </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Top Controls (Building Tabs) - Hidden in Guest View */}
          {activeTab !== 'guests' && (
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6 mb-8">
              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                <div className="flex bg-slate-900 p-1.5 rounded-xl border border-slate-800">
                  {buildings.map((block) => (
                    <button
                      key={block.id}
                      onClick={() => setActiveBlockId(block.id)}
                      className={`px-6 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                        activeBlockId === block.id 
                          ? 'bg-slate-800 text-white shadow-sm' 
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                      }`}
                    >
                      {block.name}
                    </button>
                  ))}
                  <button 
                    onClick={handleOpenAddBuilding}
                    className="px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all border-l border-slate-800 ml-1"
                    title="Yeni Blok Ekle"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Block Edit/Delete */}
                {activeBlock && (
                  <div className="flex gap-1 ml-2">
                    <button onClick={handleOpenEditBuilding} className="p-2 text-slate-500 hover:text-blue-400 hover:bg-slate-900 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={handleOpenDeleteBuilding} className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-900 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                )}
              </div>

              {/* Context Actions based on Tab */}
              <div className="flex items-center gap-4">
                {activeTab === 'residents' && activeBlock && (
                  <>
                    {/* Stats */}
                    <div className="hidden lg:flex gap-4 mr-4">
                        <div className="flex items-center gap-2 text-xs text-slate-400"><div className="w-2 h-2 rounded-full bg-emerald-500"></div>Dolu: <span className="text-white font-bold">{stats.occupied}</span></div>
                        <div className="flex items-center gap-2 text-xs text-slate-400"><div className="w-2 h-2 rounded-full bg-slate-700"></div>Boş: <span className="text-white font-bold">{stats.empty}</span></div>
                    </div>

                    {/* Sub View Toggle */}
                    <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-800">
                        <button onClick={() => setResidentViewMode('grid')} className={`p-2 rounded-md ${residentViewMode === 'grid' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}><LayoutGrid className="w-4 h-4" /></button>
                        <button onClick={() => setResidentViewMode('list')} className={`p-2 rounded-md ${residentViewMode === 'list' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}><List className="w-4 h-4" /></button>
                    </div>
                    
                    <button onClick={() => handleOpenAddResident()} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 shadow-lg shadow-blue-900/20">
                        <UserPlus className="w-4 h-4" /> <span className="hidden sm:inline">Sakin Ekle</span>
                    </button>
                  </>
                )}
                {activeTab === 'parking' && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      <span className="text-xs font-bold text-slate-300">Güvenlik Modu Aktif</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* VIEW 1: RESIDENTS GRID/LIST */}
          {activeTab === 'residents' && (
             <>
             {isLoading ? (
                <>
                  {residentViewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <ResidentCardSkeleton />
                        <ResidentCardSkeleton />
                        <ResidentCardSkeleton />
                        <ResidentCardSkeleton />
                        <ResidentCardSkeleton />
                        <ResidentCardSkeleton />
                        <ResidentCardSkeleton />
                        <ResidentCardSkeleton />
                    </div>
                  ) : (
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-slate-800 bg-slate-950/50 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                                        <th className="px-6 py-4 w-24">Daire</th>
                                        <th className="px-6 py-4 w-24">Durum</th>
                                        <th className="px-6 py-4">Sakinler</th>
                                        <th className="px-6 py-4">İletişim</th>
                                        <th className="px-6 py-4">Araç / Park</th>
                                        <th className="px-6 py-4 text-right">İşlemler</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/50">
                                    <ResidentRowSkeleton />
                                    <ResidentRowSkeleton />
                                    <ResidentRowSkeleton />
                                    <ResidentRowSkeleton />
                                    <ResidentRowSkeleton />
                                </tbody>
                            </table>
                        </div>
                    </div>
                  )}
                </>
             ) : (
               <>
                 {buildings.length === 0 ? (
                   <div className="flex flex-col items-center justify-center h-64 text-slate-500 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/20">
                     <Home className="w-12 h-12 mb-4 opacity-20" />
                     <p className="text-lg font-medium">Henüz bir blok eklenmedi.</p>
                     <button onClick={handleOpenAddBuilding} className="mt-4 text-blue-400 hover:text-blue-300 font-medium flex items-center gap-2"><Plus className="w-4 h-4" /> Yeni Blok Ekle</button>
                   </div>
                 ) : (
                   <>
                     {residentViewMode === 'grid' ? (
                       // GRID VIEW
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-300">
                         {paginatedUnits.map((unit) => (
                           <div 
                             key={unit.id} 
                             className={`group relative rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                               unit.status === 'occupied' ? 'bg-slate-900 border-slate-800 hover:border-blue-500/30' : 'bg-slate-900/50 border-slate-800 border-dashed hover:border-slate-600'
                             }`}
                           >
                             {/* Card Header */}
                             <div className="p-5 border-b border-slate-800/50 flex justify-between items-start">
                               <div>
                                 <h3 className="text-xl font-bold text-white flex items-center gap-2"><Home className="w-4 h-4 text-slate-500" /> No: {unit.number}</h3>
                                 <span className="text-xs text-slate-500 font-medium ml-6">{unit.floor}. Kat</span>
                               </div>
                               <div className="flex items-center gap-2">
                                 <div className={`px-2 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${unit.status === 'occupied' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-800 text-slate-500'}`}>{unit.status === 'occupied' ? 'Dolu' : 'Boş'}</div>
                                 <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                     <button onClick={() => handleOpenEditUnit(unit)} className="p-1 text-slate-500 hover:text-blue-400 hover:bg-slate-800 rounded"><Edit2 className="w-3.5 h-3.5" /></button>
                                     <button onClick={() => handleOpenDeleteUnit(unit)} className="p-1 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                                 </div>
                               </div>
                             </div>
       
                             {/* Card Body */}
                             <div className="p-5 min-h-[140px]">
                               {unit.residents.length > 0 ? (
                                 <div className="space-y-4">
                                   {unit.residents.map((resident) => (
                                     <div key={resident.id} className="flex flex-col gap-2 group/resident">
                                         <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                              <img src={resident.avatar} alt={resident.name} className="w-10 h-10 rounded-full border-2 border-slate-800 object-cover" />
                                              <div>
                                                <p className="text-sm font-medium text-slate-200">{resident.name}</p>
                                                <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${resident.type === 'owner' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>{resident.type === 'owner' ? 'Ev Sahibi' : 'Kiracı'}</span>
                                              </div>
                                            </div>
                                            <div className="flex gap-1">
                                              <button onClick={() => handleOpenVehicleManager(resident, activeBlockId, unit.id)} className="p-1.5 text-slate-500 hover:text-blue-400 hover:bg-slate-800 rounded" title="Araçları Yönet"><Car className="w-3 h-3" /></button>
                                              <button onClick={() => handleOpenEditResident(resident, activeBlockId, unit.id)} className="p-1.5 text-slate-500 hover:text-white hover:bg-slate-800 rounded"><Edit2 className="w-3 h-3" /></button>
                                              <button onClick={() => handleDeleteResident(resident.id, activeBlockId, unit.id)} className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded"><Trash2 className="w-3 h-3" /></button>
                                            </div>
                                         </div>
                                         {resident.vehicles.length > 0 && (
                                           <div className="pl-12 space-y-1">
                                             {resident.vehicles.map(v => (
                                               <div key={v.id} className="text-[10px] bg-slate-950/50 text-slate-400 px-2 py-1 rounded border border-slate-800/50 flex items-center justify-between">
                                                  <span className="font-mono">{v.plate}</span>
                                                  {v.parkingSpot && <span className="text-blue-400">{v.parkingSpot}</span>}
                                               </div>
                                             ))}
                                           </div>
                                         )}
                                     </div>
                                   ))}
                                 </div>
                               ) : (
                                 <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-2 py-4">
                                   <Key className="w-8 h-8 opacity-20" />
                                   <span className="text-sm font-medium">Sakin bulunmuyor</span>
                                 </div>
                               )}
                             </div>
       
                             {/* Card Footer */}
                             <div className="p-4 bg-slate-950/30 border-t border-slate-800/50 flex justify-between items-center opacity-60 group-hover:opacity-100 transition-opacity">
                               <button className="text-xs font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-1"><MoreVertical className="w-3 h-3" /> Detaylar</button>
                               <button onClick={() => handleOpenAddResident(activeBlockId, unit.id)} className="text-xs font-bold text-blue-500 hover:text-blue-400 transition-colors bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1.5 rounded-lg flex items-center gap-1"><Plus className="w-3 h-3" /> Sakin Ekle</button>
                             </div>
                           </div>
                         ))}
                         {activeBlock && (
                           <button onClick={handleOpenAddUnit} className="rounded-2xl border-2 border-dashed border-slate-800 flex flex-col items-center justify-center gap-4 min-h-[300px] hover:bg-slate-900/40 hover:border-slate-700 transition-all group">
                             <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center group-hover:scale-110 transition-transform"><Plus className="w-8 h-8 text-slate-500 group-hover:text-blue-500 transition-colors" /></div>
                             <div className="text-center"><h3 className="text-lg font-bold text-slate-400 group-hover:text-white transition-colors">Daire Ekle</h3><p className="text-sm text-slate-600">Bu bloğa yeni daire ekle</p></div>
                           </button>
                         )}
                       </div>
                     ) : (
                       // LIST VIEW
                       <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl animate-in fade-in duration-300">
                          <div className="overflow-x-auto">
                            <table className="w-full text-left">
                              <thead>
                                <tr className="border-b border-slate-800 bg-slate-950/50 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                                  <th className="px-6 py-4 w-24">Daire</th>
                                  <th className="px-6 py-4 w-24">Durum</th>
                                  <th className="px-6 py-4">Sakinler</th>
                                  <th className="px-6 py-4">İletişim</th>
                                  <th className="px-6 py-4">Araç / Park</th>
                                  <th className="px-6 py-4 text-right">İşlemler</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-800/50">
                                {paginatedUnits.length > 0 ? paginatedUnits.map(unit => (
                                  <tr key={unit.id} className="hover:bg-slate-800/30 transition-colors group">
                                     <td className="px-6 py-4 align-top"><div className="flex flex-col"><span className="text-lg font-bold text-white">No: {unit.number}</span><span className="text-xs text-slate-500">{unit.floor}. Kat</span></div></td>
                                     <td className="px-6 py-4 align-top"><div className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold uppercase tracking-wider ${unit.status === 'occupied' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-800 text-slate-500'}`}>{unit.status === 'occupied' ? 'Dolu' : 'Boş'}</div></td>
                                     <td className="px-6 py-4 align-top">
                                        {unit.residents.length > 0 ? (
                                           <div className="space-y-3">
                                              {unit.residents.map(r => (
                                                 <div key={r.id} className="flex items-center justify-between gap-4 group/item">
                                                    <div className="flex items-center gap-3">
                                                       <img src={r.avatar} className="w-8 h-8 rounded-full border border-slate-700 object-cover" alt="" />
                                                       <div><div className="text-sm font-medium text-slate-200">{r.name}</div><div className={`text-[10px] uppercase font-bold ${r.type === 'owner' ? 'text-blue-400' : 'text-purple-400'}`}>{r.type === 'owner' ? 'Ev Sahibi' : 'Kiracı'}</div></div>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        <button onClick={() => handleOpenVehicleManager(r, activeBlockId, unit.id)} className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-blue-400" title="Araç Yönetimi"><Car className="w-3 h-3"/></button>
                                                        <button onClick={() => handleOpenEditResident(r, activeBlockId, unit.id)} className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white" title="Düzenle"><Edit2 className="w-3 h-3"/></button>
                                                        <button onClick={() => handleDeleteResident(r.id, activeBlockId, unit.id)} className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-red-400" title="Sil"><Trash2 className="w-3 h-3"/></button>
                                                    </div>
                                                 </div>
                                              ))}
                                           </div>
                                        ) : <span className="text-sm text-slate-600 flex items-center gap-2"><Key className="w-4 h-4" /> Sakin Yok</span>}
                                     </td>
                                     <td className="px-6 py-4 align-top text-sm">
                                        {unit.residents.length > 0 ? unit.residents.map(r => (
                                           <div key={r.id} className="mb-3 last:mb-0"><div className="flex items-center gap-2 text-slate-300"><Phone className="w-3 h-3 text-slate-500" /> {r.phone}</div>{r.email && <div className="flex items-center gap-2 text-slate-400 text-xs mt-0.5"><Mail className="w-3 h-3 text-slate-600" /> {r.email}</div>}</div>
                                        )) : <span className="text-slate-600">-</span>}
                                     </td>
                                     <td className="px-6 py-4 align-top text-sm">
                                        {unit.residents.length > 0 ? unit.residents.map(r => (
                                           <div key={r.id} className="mb-3 last:mb-0 min-h-[20px]">
                                              {r.vehicles.length > 0 ? (
                                                 <div className="space-y-1">
                                                    {r.vehicles.map(v => (
                                                      <div key={v.id}>
                                                          <div className="flex items-center gap-2 text-slate-300 font-mono text-xs"><Car className="w-3 h-3 text-slate-500" /> {v.plate}</div>
                                                          {v.parkingSpot && <div className="text-[10px] bg-slate-800 text-blue-300 px-1.5 py-0.5 rounded w-fit mt-0.5 border border-slate-700 ml-5">Park: {v.parkingSpot}</div>}
                                                      </div>
                                                    ))}
                                                 </div>
                                              ) : <span className="text-slate-700 text-xs">-</span>}
                                           </div>
                                        )) : <span className="text-slate-600">-</span>}
                                     </td>
                                     <td className="px-6 py-4 align-top text-right">
                                        <div className="flex flex-col gap-2 items-end opacity-0 group-hover:opacity-100 transition-opacity">
                                           <button onClick={() => handleOpenAddResident(activeBlockId, unit.id)} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-500 hover:text-blue-400 rounded-lg text-xs font-bold transition-colors"><Plus className="w-3 h-3" /> Sakin Ekle</button>
                                           <div className="flex gap-1"><button onClick={() => handleOpenEditUnit(unit)} className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded transition-colors"><Edit2 className="w-4 h-4"/></button><button onClick={() => handleOpenDeleteUnit(unit)} className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-red-400 rounded transition-colors"><Trash2 className="w-4 h-4"/></button></div>
                                        </div>
                                     </td>
                                  </tr>
                                )) : (
                                  <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-500"><Home className="w-12 h-12 mx-auto mb-3 opacity-20" /><p>Kayıt bulunamadı.</p></td></tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                       </div>
                     )}

                     {/* Pagination Controls */}
                     <PaginationControls 
                        totalItems={filteredUnits.length}
                        itemsPerPage={ITEMS_PER_PAGE}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                     />
                   </>
                 )}
               </>
             )}
             </>
          )}

          {/* VIEW 2: PARKING MANAGEMENT */}
          {activeTab === 'parking' && (
             <>
                {isLoading ? (
                    <ParkingMapSkeleton />
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
                        {/* Left Col: Visual Parking Map */}
                        <div className="lg:col-span-2">
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl p-6">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-lg font-bold text-white flex items-center gap-2"><ParkingSquare className="w-5 h-5 text-blue-500" /> Otopark Düzeni ({activeBlock?.name})</h3>
                                    <p className="text-slate-500 text-sm">
                                    {getFloorLabel(activeParkingFloor)} yerleşimi ve doluluk durumu.
                                    </p>
                                </div>
                                <div className="flex gap-3 text-xs font-medium">
                                    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-slate-800 border border-slate-700 rounded"></div> Boş</div>
                                    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500/20 border border-blue-500/50 rounded"></div> Dolu</div>
                                </div>
                            </div>

                            {/* Floor Switcher (Chip Filter) */}
                            {availableParkingFloors.length > 0 && (
                                <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
                                    {availableParkingFloors.map(floor => (
                                        <button
                                            key={floor}
                                            onClick={() => setActiveParkingFloor(floor)}
                                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border whitespace-nowrap ${
                                                activeParkingFloor === floor 
                                                ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/20' 
                                                : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200'
                                            }`}
                                        >
                                            {getFloorLabel(floor)}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Visual Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                                {parkingGridData.length > 0 ? parkingGridData.map((spot) => (
                                    <div 
                                    key={spot.id} 
                                    className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center p-2 relative group transition-all ${
                                        spot.occupant 
                                            ? 'bg-blue-900/10 border-blue-500/40 hover:bg-blue-900/20 hover:border-blue-500' 
                                            : 'bg-slate-950/50 border-slate-800 border-dashed hover:border-slate-600'
                                    }`}
                                    >
                                    {/* Edit/Delete Controls for Spot */}
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex gap-1 z-10 transition-opacity">
                                        <button onClick={() => handleOpenEditSpot(spot)} className="p-1 bg-slate-800 hover:bg-blue-600 text-white rounded"><Edit2 className="w-3 h-3"/></button>
                                        <button onClick={() => handleOpenDeleteSpot(spot)} className="p-1 bg-slate-800 hover:bg-red-600 text-white rounded"><Trash2 className="w-3 h-3"/></button>
                                        </div>

                                    <span className="absolute top-2 left-2 text-[10px] font-bold text-slate-500">{spot.name}</span>
                                    
                                    {spot.occupant ? (
                                        <>
                                            <Car className="w-8 h-8 text-blue-400 mb-2" />
                                            <div className="text-center w-full">
                                                <div className="font-bold text-white text-sm bg-slate-900 rounded px-1.5 py-0.5 border border-slate-700 truncate">{spot.plate}</div>
                                                <div className="text-[10px] text-slate-400 mt-1 truncate">Daire {spot.unitNumber}</div>
                                                <div className="text-[10px] text-slate-500 truncate">{spot.occupant.name}</div>
                                            </div>
                                        </>
                                    ) : (
                                        <span className="text-slate-700 text-xs font-medium">Boş</span>
                                    )}
                                    </div>
                                )) : (
                                    <div className="col-span-full flex flex-col items-center justify-center py-12 text-slate-500 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/20">
                                        <ParkingSquare className="w-10 h-10 opacity-20 mb-2" />
                                        <p className="text-sm">Bu katta tanımlı park yeri yok.</p>
                                    </div>
                                )}
                                
                                {/* Add New Spot Button */}
                                {activeBlock && (
                                    <button 
                                        onClick={handleOpenAddSpot}
                                        className="aspect-square rounded-xl border-2 border-dashed border-slate-800 flex flex-col items-center justify-center p-2 hover:bg-slate-900/50 hover:border-slate-600 transition-all text-slate-600 hover:text-white group"
                                    >
                                        <Plus className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
                                        <span className="text-xs font-bold">Park Yeri Ekle</span>
                                    </button>
                                )}
                            </div>
                        </div>
                        </div>

                        {/* Right Col: Vehicle Search List */}
                        <div>
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col h-[600px]">
                            <div className="p-4 border-b border-slate-800 bg-slate-950/50">
                                <h3 className="font-bold text-white mb-1">Araç Arama</h3>
                                <div className="text-xs text-slate-500">
                                    {allVehicles.length} kayıt (Sakin + Misafir)
                                </div>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                                {allVehicles.length > 0 ? allVehicles.map((vehicle, idx) => (
                                    <div key={idx} className={`p-3 mb-2 rounded-xl border transition-colors cursor-pointer group ${vehicle.isGuest ? 'bg-amber-900/10 border-amber-900/30 hover:bg-amber-900/20' : 'bg-slate-950/30 border-slate-800 hover:bg-slate-800/50'}`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="font-bold text-white font-mono bg-slate-900 px-2 py-1 rounded border border-slate-700 shadow-sm">{vehicle.plate}</div>
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded ${vehicle.isGuest ? 'bg-amber-500/20 text-amber-500' : 'bg-blue-900/20 text-blue-400'}`}>
                                            {vehicle.isGuest ? (vehicle.status === 'pending' ? 'Beklenen Misafir' : 'Misafir (İçeride)') : `${vehicle.blockName} - ${vehicle.unitNumber}`}
                                        </span>
                                    </div>
                                    <div className="text-sm text-slate-300 font-medium mb-1">{vehicle.vehicleModel || 'Araç Modeli Belirtilmemiş'}</div>
                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                        <User className="w-3 h-3" /> {vehicle.name}
                                        {!vehicle.isGuest && <><span className="w-1 h-1 rounded-full bg-slate-600"></span><Phone className="w-3 h-3" /> {vehicle.phone}</>}
                                    </div>
                                    {vehicle.parkingSpot && (
                                        <div className={`mt-2 text-[10px] px-2 py-1 rounded w-fit border font-bold flex items-center gap-1 ${vehicle.isGuest ? 'text-amber-500 bg-amber-500/10 border-amber-500/20' : 'text-emerald-500 bg-emerald-900/10 border-emerald-900/20'}`}>
                                            <MapPin className="w-3 h-3" /> Park Yeri: {vehicle.parkingSpot}
                                        </div>
                                    )}
                                    {vehicle.source === 'app' && (
                                        <div className="mt-2 flex items-center gap-1 text-[10px] text-blue-400">
                                            <Smartphone className="w-3 h-3" /> Mobil Bildirim
                                        </div>
                                    )}
                                    </div>
                                )) : (
                                    <div className="text-center py-10 text-slate-500">
                                    <Search className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                    <p className="text-sm">Araç bulunamadı.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        </div>
                    </div>
                )}
             </>
          )}

          {/* VIEW 3: GUEST VEHICLES */}
          {activeTab === 'guests' && (
             <div className="space-y-6 animate-in fade-in duration-300">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   {isLoading ? (
                       <>
                           <StatCardSkeleton />
                           <StatCardSkeleton />
                           <StatCardSkeleton />
                       </>
                   ) : (
                       <>
                           <StatCard 
                              title="İçerideki Misafir" 
                              value={guestStats.active.toString()} 
                              trend="Aktif" 
                              trendUp={true} 
                              trendText="araç park halinde"
                              variant="blue"
                              icon={CarFront}
                           />
                           <StatCard 
                              title="Beklenen Araç" 
                              value={guestStats.pending.toString()} 
                              trend="Talep" 
                              trendUp={true} 
                              trendText="giriş yapacak"
                              variant="orange"
                              icon={Clock}
                           />
                           <StatCard 
                              title="Bugün Giriş/Çıkış" 
                              value={guestStats.completedToday.toString()} 
                              trend="Tamamlanan" 
                              trendUp={true} 
                              trendText="ziyaret"
                              variant="green"
                              icon={History}
                           />
                       </>
                   )}
                </div>

                {/* Controls */}
                <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4">
                   <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
                      <button onClick={() => setGuestFilter('all')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border whitespace-nowrap ${guestFilter === 'all' ? 'bg-slate-800 border-slate-600 text-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'}`}>Tümü</button>
                      <button onClick={() => setGuestFilter('pending')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border flex items-center gap-2 whitespace-nowrap ${guestFilter === 'pending' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'}`}>
                         <Clock className="w-4 h-4" /> Bekleyenler
                      </button>
                      <button onClick={() => setGuestFilter('active')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border flex items-center gap-2 whitespace-nowrap ${guestFilter === 'active' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'}`}>
                         <CarFront className="w-4 h-4" /> İçeridekiler
                      </button>
                   </div>
                   
                   <button 
                      onClick={() => setShowGuestModal(true)}
                      className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all shadow-lg shadow-blue-900/20 whitespace-nowrap"
                   >
                      <Plus className="w-4 h-4" />
                      Misafir Kaydı
                   </button>
                </div>

                {/* List */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                   <div className="overflow-x-auto">
                      <table className="w-full text-left">
                         <thead>
                            <tr className="border-b border-slate-800 bg-slate-950/50 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                               <th className="px-6 py-4">Plaka / Araç</th>
                               <th className="px-6 py-4">Ev Sahibi</th>
                               <th className="px-6 py-4">Ziyaret Tarihi</th>
                               <th className="px-6 py-4">Durum / Kaynak</th>
                               <th className="px-6 py-4 text-right">İşlemler</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-800/50">
                            {isLoading ? (
                                <>
                                    <GuestRowSkeleton />
                                    <GuestRowSkeleton />
                                    <GuestRowSkeleton />
                                    <GuestRowSkeleton />
                                    <GuestRowSkeleton />
                                </>
                            ) : (
                                <>
                                    {paginatedGuests.length > 0 ? paginatedGuests.map((guest) => (
                                    <tr 
                                        key={guest.id} 
                                        className="hover:bg-slate-800/30 transition-colors group cursor-pointer"
                                        onClick={() => setSelectedGuest(guest)}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                                                <CarFront className="w-5 h-5 text-slate-400" />
                                                </div>
                                                <div>
                                                <div className="text-sm font-bold text-white mb-0.5">{guest.guestName || 'Misafir'}</div>
                                                <div className="font-mono text-xs text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 w-fit inline-block mr-2">{guest.plate}</div>
                                                <span className="text-xs text-slate-500">{guest.model}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-200 text-sm">{guest.hostName}</div>
                                            <div className="text-xs text-slate-500">{guest.blockName} - Daire {guest.unitNumber}</div>
                                            {guest.note && (
                                                <div className="text-[10px] text-blue-300 mt-1 bg-blue-900/20 px-2 py-1 rounded w-fit max-w-[200px] truncate" title={guest.note}>
                                                    <span className="font-bold mr-1">Not:</span> {guest.note}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col text-sm text-slate-300">
                                                <span className="flex items-center gap-2"><CalendarDays className="w-3.5 h-3.5 text-slate-500" /> {guest.expectedDate}</span>
                                                <span className="text-xs text-slate-500 mt-0.5 ml-5">{guest.durationDays} Gün Süreli</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col items-start gap-1">
                                                {guest.status === 'pending' && (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                                    <Clock className="w-3.5 h-3.5" /> Bekliyor
                                                    </span>
                                                )}
                                                {guest.status === 'active' && (
                                                    <div>
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 animate-pulse">
                                                        <LogIn className="w-3.5 h-3.5" /> İçeride
                                                    </span>
                                                    <div className="text-[10px] text-blue-400/60 mt-1 pl-1">Giriş: {guest.entryTime}</div>
                                                    </div>
                                                )}
                                                {guest.status === 'completed' && (
                                                    <div>
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-slate-800 text-slate-400 border border-slate-700">
                                                        <LogOut className="w-3.5 h-3.5" /> Çıkış Yaptı
                                                    </span>
                                                    <div className="text-[10px] text-slate-500 mt-1 pl-1">Çıkış: {guest.exitTime}</div>
                                                    </div>
                                                )}

                                                {/* Source Indicator */}
                                                {guest.source === 'app' ? (
                                                    <div className="flex items-center gap-1 text-[10px] text-emerald-500 mt-1 font-medium bg-emerald-900/10 px-1.5 py-0.5 rounded border border-emerald-900/20">
                                                        <Smartphone className="w-3 h-3" /> Mobil Bildirim
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-1 font-medium">
                                                        <PenTool className="w-3 h-3" /> Manuel Kayıt
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                    )) : (
                                    <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500"><CarFront className="w-12 h-12 mx-auto mb-3 opacity-20" /><p>Kayıt bulunamadı.</p></td></tr>
                                    )}
                                </>
                            )}
                         </tbody>
                      </table>
                   </div>
                </div>

                {/* Guest Pagination Controls */}
                {!isLoading && (
                    <PaginationControls 
                        totalItems={filteredGuests.length}
                        itemsPerPage={GUESTS_PER_PAGE}
                        currentPage={guestPage}
                        onPageChange={setGuestPage}
                    />
                )}

             </div>
          )}

        </div>
      </div>

      {/* Building Management Modal */}
      {showBuildingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
             {/* ... Building Modal Content ... */}
             <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  {buildingModalMode === 'add' && <><Plus className="w-5 h-5 text-blue-500" /> Yeni Blok Ekle</>}
                  {buildingModalMode === 'edit' && <><Edit2 className="w-5 h-5 text-blue-500" /> Bloğu Düzenle</>}
                  {buildingModalMode === 'delete' && <><Trash2 className="w-5 h-5 text-red-500" /> Bloğu Sil</>}
                </h2>
                <button onClick={() => setShowBuildingModal(false)} className="text-slate-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
             </div>
             
             <div className="p-6">
                {buildingModalMode === 'delete' ? (
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                      <AlertTriangle className="w-6 h-6 text-red-500" />
                    </div>
                    <p className="text-slate-300 mb-2">
                      <span className="font-bold text-white">{activeBlock?.name}</span> adlı bloğu silmek istediğinize emin misiniz?
                    </p>
                    <p className="text-slate-500 text-sm">Bu işlem geri alınamaz ve bloğa ait tüm veriler silinir.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <label className="text-xs font-medium text-slate-400 uppercase">Blok Adı</label>
                    <input 
                      type="text" 
                      value={buildingNameInput}
                      onChange={(e) => setBuildingNameInput(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500" 
                      placeholder="Örn: D Blok" 
                      autoFocus
                    />
                  </div>
                )}
             </div>

             <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex gap-3">
                <button 
                  onClick={() => setShowBuildingModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors text-sm"
                >
                  İptal
                </button>
                <button 
                  onClick={handleBuildingSubmit}
                  className={`flex-1 px-4 py-2 text-white rounded-xl font-medium shadow-lg transition-colors text-sm ${
                    buildingModalMode === 'delete' 
                      ? 'bg-red-600 hover:bg-red-500 shadow-red-900/20' 
                      : 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/20'
                  }`}
                >
                  {buildingModalMode === 'delete' ? 'Evet, Sil' : 'Kaydet'}
                </button>
             </div>
          </div>
        </div>
      )}
      
      {/* Unit Management Modal */}
      {showUnitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
             {/* ... Unit Modal Content ... */}
             <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  {unitModalMode === 'add' && <><Plus className="w-5 h-5 text-blue-500" /> Daire Ekle</>}
                  {unitModalMode === 'edit' && <><Edit2 className="w-5 h-5 text-blue-500" /> Daireyi Düzenle</>}
                  {unitModalMode === 'delete' && <><Trash2 className="w-5 h-5 text-red-500" /> Daireyi Sil</>}
                </h2>
                <button onClick={() => setShowUnitModal(false)} className="text-slate-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
             </div>
             
             <div className="p-6">
                {unitModalMode === 'delete' ? (
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                      <AlertTriangle className="w-6 h-6 text-red-500" />
                    </div>
                    <p className="text-slate-300 mb-2">
                      <span className="font-bold text-white">Daire {unitForm.number}</span> kaydını silmek istediğinize emin misiniz?
                    </p>
                    <p className="text-slate-500 text-sm">İçindeki tüm sakin kayıtları da silinecektir.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-slate-400 uppercase">Daire No</label>
                      <input 
                        type="text" 
                        value={unitForm.number}
                        onChange={(e) => setUnitForm({...unitForm, number: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500" 
                        placeholder="Örn: 5, 2B, Zemin..." 
                        autoFocus
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-slate-400 uppercase">Bulunduğu Kat</label>
                      <input 
                        type="number" 
                        value={unitForm.floor}
                        onChange={(e) => setUnitForm({...unitForm, floor: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500" 
                        placeholder="Örn: 1, 2, -1" 
                      />
                    </div>
                  </div>
                )}
             </div>

             <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex gap-3">
                <button 
                  onClick={() => setShowUnitModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors text-sm"
                >
                  İptal
                </button>
                <button 
                  onClick={handleUnitSubmit}
                  className={`flex-1 px-4 py-2 text-white rounded-xl font-medium shadow-lg transition-colors text-sm ${
                    unitModalMode === 'delete' 
                      ? 'bg-red-600 hover:bg-red-500 shadow-red-900/20' 
                      : 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/20'
                  }`}
                >
                  {unitModalMode === 'delete' ? 'Evet, Sil' : 'Kaydet'}
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Parking Spot Management Modal */}
      {showSpotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
             {/* ... Spot Modal Content ... */}
             <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  {spotModalMode === 'add' && <><Plus className="w-5 h-5 text-blue-500" /> Park Yeri Ekle</>}
                  {spotModalMode === 'edit' && <><Edit2 className="w-5 h-5 text-blue-500" /> Park Yeri Düzenle</>}
                  {spotModalMode === 'delete' && <><Trash2 className="w-5 h-5 text-red-500" /> Park Yeri Sil</>}
                </h2>
                <button onClick={() => setShowSpotModal(false)} className="text-slate-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
             </div>
             
             <div className="p-6">
                {spotModalMode === 'delete' ? (
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                      <AlertTriangle className="w-6 h-6 text-red-500" />
                    </div>
                    <p className="text-slate-300 mb-2">
                      <span className="font-bold text-white">{spotForm.name}</span> numaralı park yerini silmek istediğinize emin misiniz?
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-slate-400 uppercase">Bulunduğu Kat</label>
                      <select 
                         value={spotForm.floor}
                         onChange={(e) => setSpotForm({...spotForm, floor: Number(e.target.value)})}
                         className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                      >
                         <option value="0">Zemin Kat (0)</option>
                         <option value="-1">1. Bodrum (-1)</option>
                         <option value="-2">2. Bodrum (-2)</option>
                         <option value="1">1. Kat</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-slate-400 uppercase">Park Yeri Adı / No</label>
                      <input 
                        type="text" 
                        value={spotForm.name}
                        onChange={(e) => setSpotForm({...spotForm, name: e.target.value.toUpperCase()})}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500" 
                        placeholder="Örn: A-05" 
                        autoFocus
                      />
                    </div>
                  </div>
                )}
             </div>

             <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex gap-3">
                <button 
                  onClick={() => setShowSpotModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors text-sm"
                >
                  İptal
                </button>
                <button 
                  onClick={handleSpotSubmit}
                  className={`flex-1 px-4 py-2 text-white rounded-xl font-medium shadow-lg transition-colors text-sm ${
                    spotModalMode === 'delete' 
                      ? 'bg-red-600 hover:bg-red-500 shadow-red-900/20' 
                      : 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/20'
                  }`}
                >
                  {spotModalMode === 'delete' ? 'Evet, Sil' : 'Kaydet'}
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Guest Vehicle Modal (Add New) */}
      {showGuestModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200">
            {/* ... Guest Modal Content ... */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
               <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                     <CarFront className="w-5 h-5 text-blue-500" />
                     Yeni Misafir Araç Kaydı
                  </h2>
                  <button onClick={() => setShowGuestModal(false)} className="text-slate-400 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
               </div>
               
               <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-400 uppercase">Blok</label>
                        <select 
                           value={guestForm.blockId}
                           onChange={(e) => setGuestForm({...guestForm, blockId: e.target.value, unitId: ''})}
                           className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer"
                        >
                           <option value="">Blok Seçin</option>
                           {buildings.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                        </select>
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-400 uppercase">Daire</label>
                        <select 
                           value={guestForm.unitId}
                           onChange={(e) => setGuestForm({...guestForm, unitId: e.target.value})}
                           disabled={!guestForm.blockId}
                           className={`w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer ${!guestForm.blockId ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                           <option value="">Daire Seçin</option>
                           {buildings.find(b => b.id === guestForm.blockId)?.units.map(u => (
                              <option key={u.id} value={u.id}>
                                 Daire {u.number} {u.residents.length > 0 ? `(${u.residents[0].name})` : ''}
                              </option>
                           ))}
                        </select>
                     </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-400 uppercase">Misafir Adı Soyadı</label>
                    <input 
                      type="text" 
                      value={guestForm.guestName}
                      onChange={(e) => setGuestForm({...guestForm, guestName: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-slate-600"
                      placeholder="Ad Soyad"
                    />
                  </div>

                  <div className="space-y-2">
                     <label className="text-xs font-medium text-slate-400 uppercase">Araç Plakası</label>
                     <input 
                        type="text" 
                        value={guestForm.plate}
                        onChange={(e) => setGuestForm({...guestForm, plate: e.target.value.toUpperCase()})}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-lg tracking-wide placeholder-slate-600"
                        placeholder="34 ABC 123"
                     />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-400 uppercase">Model (Opsiyonel)</label>
                        <input 
                           type="text" 
                           value={guestForm.model}
                           onChange={(e) => setGuestForm({...guestForm, model: e.target.value})}
                           className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                           placeholder="Örn: VW Golf"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-400 uppercase">Renk (Opsiyonel)</label>
                        <input 
                           type="text" 
                           value={guestForm.color}
                           onChange={(e) => setGuestForm({...guestForm, color: e.target.value})}
                           className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                           placeholder="Örn: Siyah"
                        />
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-xs font-medium text-slate-400 uppercase">Ziyaret Süresi (Gün)</label>
                     <div className="flex items-center gap-4 bg-slate-950 border border-slate-700 rounded-lg p-2">
                        <button onClick={() => setGuestForm({...guestForm, durationDays: Math.max(1, guestForm.durationDays - 1)})} className="p-2 hover:bg-slate-800 rounded text-slate-400"><ArrowDown className="w-4 h-4" /></button>
                        <span className="flex-1 text-center font-bold text-white">{guestForm.durationDays} Gün</span>
                        <button onClick={() => setGuestForm({...guestForm, durationDays: guestForm.durationDays + 1})} className="p-2 hover:bg-slate-800 rounded text-slate-400"><ArrowUp className="w-4 h-4" /></button>
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-xs font-medium text-slate-400 uppercase">Not</label>
                     <textarea 
                        value={guestForm.note}
                        onChange={(e) => setGuestForm({...guestForm, note: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none h-20"
                        placeholder="Varsa notunuz..."
                     />
                  </div>
               </div>

               <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex gap-3">
                  <button onClick={() => setShowGuestModal(false)} className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors text-sm">İptal</button>
                  <button onClick={handleGuestSubmit} className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium shadow-lg transition-colors text-sm">Kaydet & Giriş Yap</button>
               </div>
            </div>
         </div>
      )}

      {/* Guest Detail Modal */}
      {selectedGuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
           {/* ... Guest Detail Modal Content ... */}
           <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden relative" onClick={(e) => e.stopPropagation()}>
               {/* Header */}
               <div className="p-6 border-b border-slate-800 bg-slate-900 flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        Misafir Detayları
                    </h2>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">{selectedGuest.id}</p>
                  </div>
                  <button onClick={() => setSelectedGuest(null)} className="text-slate-400 hover:text-white transition-colors p-1 bg-slate-800 rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
               </div>

               {/* Body */}
               <div className="p-6 space-y-6">
                  
                  {/* Status Badge & Actions */}
                  <div className="flex items-center justify-between mb-2">
                     <div className="flex items-center gap-2">
                        {selectedGuest.status === 'pending' && <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Bekliyor</span>}
                        {selectedGuest.status === 'active' && <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1 animate-pulse"><LogIn className="w-3.5 h-3.5" /> İçeride</span>}
                        {selectedGuest.status === 'completed' && <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-400 border border-slate-700 flex items-center gap-1"><LogOut className="w-3.5 h-3.5" /> Çıkış Yaptı</span>}
                     </div>
                     <div className="text-xs text-slate-500 font-mono">
                        {selectedGuest.source === 'app' ? 'Mobil Bildirim' : 'Manuel Kayıt'}
                     </div>
                  </div>

                  {/* Vehicle Card */}
                  <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 flex items-center gap-4">
                     <div className="w-12 h-12 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                        <CarFront className="w-6 h-6 text-blue-500" />
                     </div>
                     <div>
                        <h3 className="text-white font-bold font-mono text-lg tracking-wide">{selectedGuest.plate}</h3>
                        <p className="text-slate-400 text-sm">{selectedGuest.model || 'Model Belirtilmemiş'} {selectedGuest.color && `• ${selectedGuest.color}`}</p>
                        <p className="text-slate-500 text-xs mt-1">{selectedGuest.guestName || 'İsimsiz Misafir'}</p>
                     </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-4">
                     {/* Host Info */}
                     <div className="bg-slate-800/20 p-4 rounded-xl border border-slate-800">
                        <p className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1"><Home className="w-3 h-3" /> Ev Sahibi</p>
                        <p className="text-slate-200 font-bold text-sm">{selectedGuest.hostName}</p>
                        <p className="text-slate-400 text-xs mt-1">{selectedGuest.blockName} - Daire {selectedGuest.unitNumber}</p>
                        {/* Mock Phone */}
                        <p className="text-slate-500 text-xs mt-2 flex items-center gap-1"><Phone className="w-3 h-3" /> 5XX XXX XX XX</p>
                     </div>
                     
                     {/* Visit Info */}
                     <div className="bg-slate-800/20 p-4 rounded-xl border border-slate-800">
                        <p className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1"><CalendarDays className="w-3 h-3" /> Ziyaret</p>
                        <p className="text-slate-200 font-bold text-sm">{selectedGuest.expectedDate}</p>
                        <p className="text-slate-400 text-xs mt-1">{selectedGuest.durationDays} Gün Süreli</p>
                        {selectedGuest.entryTime && <p className="text-blue-400 text-xs mt-2">Giriş: {selectedGuest.entryTime}</p>}
                        {selectedGuest.exitTime && <p className="text-slate-500 text-xs">Çıkış: {selectedGuest.exitTime}</p>}
                     </div>
                  </div>

                  {/* Note */}
                  {selectedGuest.note && (
                     <div className="bg-blue-900/10 border border-blue-900/20 p-4 rounded-xl">
                        <p className="text-xs font-bold text-blue-400 uppercase mb-1 flex items-center gap-1"><MessageSquare className="w-3 h-3" /> Not</p>
                        <p className="text-sm text-blue-100 italic">"{selectedGuest.note}"</p>
                     </div>
                  )}

               </div>

               {/* Footer Actions */}
               <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex gap-3">
                  <button onClick={() => setSelectedGuest(null)} className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors text-sm">
                     Kapat
                  </button>
                  
                  {selectedGuest.status === 'pending' && (
                     <button 
                        onClick={() => handleCheckIn(selectedGuest.id)}
                        className="flex-[2] px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-900/20 transition-colors text-sm flex items-center justify-center gap-2"
                     >
                        <LogIn className="w-4 h-4" /> Giriş Yap
                     </button>
                  )}
                  
                  {selectedGuest.status === 'active' && (
                     <button 
                        onClick={() => handleCheckOut(selectedGuest.id)}
                        className="flex-[2] px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold transition-colors text-sm flex items-center justify-center gap-2"
                     >
                        <LogOut className="w-4 h-4" /> Çıkış Yap
                     </button>
                  )}
               </div>
           </div>
        </div>
      )}

      {/* NEW: Vehicle Management Modal */}
      {showVehicleManager && managingResident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden relative z-50">
              <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900">
                 <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                       <Car className="w-5 h-5 text-blue-500" />
                       Araç Yönetimi
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">Sakin: {managingResident.resident.name}</p>
                 </div>
                 <button onClick={() => setShowVehicleManager(false)} className="text-slate-400 hover:text-white transition-colors">
                   <X className="w-5 h-5" />
                 </button>
              </div>

              <div className="p-6 space-y-6">
                 {/* List of existing vehicles */}
                 <div>
                    <h3 className="text-sm font-bold text-white mb-3">Kayıtlı Araçlar</h3>
                    {managingResident.resident.vehicles.length > 0 ? (
                       <div className="space-y-3">
                          {managingResident.resident.vehicles.map(vehicle => (
                             <div key={vehicle.id} className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl group">
                                <div>
                                   <div className="font-mono text-white font-bold tracking-wide">{vehicle.plate}</div>
                                   <div className="text-xs text-slate-500">{vehicle.model}</div>
                                </div>
                                <div className="flex items-center gap-3">
                                   {vehicle.parkingSpot && (
                                      <span className="text-xs bg-blue-900/20 text-blue-400 px-2 py-1 rounded border border-blue-900/30 font-medium">
                                         {vehicle.parkingSpot}
                                      </span>
                                   )}
                                   <button 
                                      onClick={() => handleDeleteVehicleRequest(vehicle.id, vehicle.plate)}
                                      className="p-2 text-slate-600 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                                      title="Aracı Sil"
                                   >
                                      <Trash2 className="w-4 h-4" />
                                   </button>
                                </div>
                             </div>
                          ))}
                       </div>
                    ) : (
                       <div className="p-4 border-2 border-dashed border-slate-800 rounded-xl text-center text-slate-500 text-sm">
                          Bu sakine ait kayıtlı araç bulunmuyor.
                       </div>
                    )}
                 </div>

                 {/* Add new vehicle form */}
                 <div className="pt-6 border-t border-slate-800">
                    <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2"><PlusCircle className="w-4 h-4" /> Yeni Araç Ekle</h3>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                       <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Plaka</label>
                          <input 
                             type="text" 
                             value={vehicleForm.plate}
                             onChange={(e) => setVehicleForm({...vehicleForm, plate: e.target.value.toUpperCase()})}
                             className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-slate-600 font-mono"
                             placeholder="34 ABC 123"
                          />
                       </div>
                       <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Model</label>
                          <input 
                             type="text" 
                             value={vehicleForm.model}
                             onChange={(e) => setVehicleForm({...vehicleForm, model: e.target.value})}
                             className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-slate-600"
                             placeholder="Örn: BMW 320i"
                          />
                       </div>
                    </div>
                    <div className="space-y-1 mb-4">
                       <label className="text-[10px] font-bold text-slate-500 uppercase">Park Yeri</label>
                       {/* Dropdown for available spots in the block */}
                       <select 
                           value={vehicleForm.parkingSpot}
                           onChange={(e) => setVehicleForm({...vehicleForm, parkingSpot: e.target.value})}
                           className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer"
                        >
                           <option value="">Park Yeri Seçin (Opsiyonel)</option>
                           {buildings.find(b => b.id === managingResident.blockId)?.parkingSpots.map(spot => {
                              // Check if spot is taken by any vehicle (except the ones of current resident which might be re-assigned, but for simplicity show status)
                              const isTaken = buildings
                                 .flatMap(b => b.units.flatMap(u => u.residents.flatMap(r => r.vehicles)))
                                 .some(v => v.parkingSpot === spot.name);
                              
                              return (
                                 <option key={spot.id} value={spot.name} disabled={isTaken} className={isTaken ? 'text-red-500' : ''}>
                                    {spot.name} {isTaken ? '(Dolu)' : ''}
                                 </option>
                              );
                           })}
                        </select>
                    </div>
                    <button 
                       onClick={handleAddVehicleRequest}
                       disabled={!vehicleForm.plate}
                       className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-lg shadow-blue-900/20 transition-colors text-sm"
                    >
                       Aracı Kaydet
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Add/Edit Resident Modal (Updated without vehicle fields) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl relative overflow-hidden">
             
             {/* Modal Header */}
             <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  {residentForm.id ? (
                    <><Edit2 className="w-5 h-5 text-blue-500" /> Sakin Bilgilerini Düzenle</>
                  ) : (
                    <><UserPlus className="w-5 h-5 text-blue-500" /> Yeni Sakin Ekle</>
                  )}
                </h2>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
             </div>

             {/* Form */}
             <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh] custom-scrollbar">
                
                {/* Location Selection */}
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <label className="text-xs font-medium text-slate-400 uppercase">Blok</label>
                      <select 
                        value={residentForm.blockId}
                        onChange={(e) => setResidentForm({...residentForm, blockId: e.target.value, unitId: ''})}
                        disabled={!!residentForm.id} // Disable changing block when editing
                        className={`w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer ${residentForm.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                         <option value="">Blok Seçin</option>
                         {buildings.map(b => (
                           <option key={b.id} value={b.id}>{b.name}</option>
                         ))}
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-medium text-slate-400 uppercase">Daire No</label>
                      <select 
                        value={residentForm.unitId}
                        onChange={(e) => setResidentForm({...residentForm, unitId: e.target.value})}
                        disabled={!!residentForm.id || !residentForm.blockId} // Disable when editing or no block
                        className={`w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer ${residentForm.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                         <option value="">Daire Seçin</option>
                         {buildings.find(b => b.id === residentForm.blockId)?.units.map(u => (
                           <option key={u.id} value={u.id}>
                             Daire {u.number} {u.status === 'occupied' ? '(Dolu)' : ''}
                           </option>
                         ))}
                      </select>
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-xs font-medium text-slate-400 uppercase">Sakin Tipi</label>
                   <div className="grid grid-cols-2 gap-3">
                      <label className={`flex items-center justify-center gap-2 p-3 border rounded-lg cursor-pointer transition-all ${residentForm.type === 'owner' ? 'border-blue-500/50 bg-blue-500/10' : 'border-slate-700 bg-slate-950 hover:border-slate-600'}`}>
                         <input 
                           type="radio" 
                           name="type" 
                           className="accent-blue-500" 
                           checked={residentForm.type === 'owner'} 
                           onChange={() => setResidentForm({...residentForm, type: 'owner'})} 
                         />
                         <span className={`text-sm font-medium ${residentForm.type === 'owner' ? 'text-white' : 'text-slate-300'}`}>Ev Sahibi</span>
                      </label>
                      <label className={`flex items-center justify-center gap-2 p-3 border rounded-lg cursor-pointer transition-all ${residentForm.type === 'tenant' ? 'border-blue-500/50 bg-blue-500/10' : 'border-slate-700 bg-slate-950 hover:border-slate-600'}`}>
                         <input 
                           type="radio" 
                           name="type" 
                           className="accent-blue-500" 
                           checked={residentForm.type === 'tenant'} 
                           onChange={() => setResidentForm({...residentForm, type: 'tenant'})} 
                         />
                         <span className={`text-sm font-medium ${residentForm.type === 'tenant' ? 'text-white' : 'text-slate-300'}`}>Kiracı</span>
                      </label>
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-xs font-medium text-slate-400 uppercase">Ad Soyad</label>
                   <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input 
                        type="text" 
                        value={residentForm.name}
                        onChange={(e) => setResidentForm({...residentForm, name: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-3 py-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500" 
                        placeholder="Ad Soyad Giriniz" 
                      />
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <label className="text-xs font-medium text-slate-400 uppercase">Telefon</label>
                      <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                          <input 
                            type="text" 
                            value={residentForm.phone}
                            onChange={(e) => setResidentForm({...residentForm, phone: e.target.value})}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-3 py-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500" 
                            placeholder="5XX..." 
                          />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-medium text-slate-400 uppercase">E-Posta (Opsiyonel)</label>
                      <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                          <input 
                            type="email" 
                            value={residentForm.email}
                            onChange={(e) => setResidentForm({...residentForm, email: e.target.value})}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-3 py-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500" 
                            placeholder="ornek@email.com" 
                          />
                      </div>
                   </div>
                </div>

                {/* Info Note about vehicles */}
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-800 flex gap-3">
                   <div className="p-2 bg-slate-800 rounded-lg h-fit">
                      <Car className="w-4 h-4 text-slate-400" />
                   </div>
                   <div>
                      <p className="text-sm font-bold text-slate-300">Araç Ekleme</p>
                      <p className="text-xs text-slate-500 mt-1">
                         Sakini kaydettikten sonra listedeki "Araç Yönetimi" butonu ile birden fazla araç tanımlayabilirsiniz.
                      </p>
                   </div>
                </div>

             </div>

             {/* Footer */}
             <div className="p-6 border-t border-slate-800 bg-slate-950/50 flex gap-3">
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors"
                >
                  İptal
                </button>
                <button 
                  onClick={handleSaveResident}
                  className="flex-[2] px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium shadow-lg shadow-blue-900/20 transition-colors flex justify-center items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {residentForm.id ? 'Değişiklikleri Kaydet' : 'Sakin Ekle'}
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
           <div className={`bg-slate-900 border rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden relative ${confirmModal.type === 'danger' ? 'border-red-500/30' : 'border-blue-500/30'}`}>
              <div className="p-6 text-center">
                 <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border ${confirmModal.type === 'danger' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-blue-500/10 border-blue-500/20 text-blue-500'}`}>
                    {confirmModal.type === 'danger' ? <AlertTriangle className="w-8 h-8" /> : <CheckCircle className="w-8 h-8" />}
                 </div>
                 <h3 className="text-xl font-bold text-white mb-2">{confirmModal.title}</h3>
                 <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    {confirmModal.message}
                 </p>
                 <div className="flex gap-3">
                    <button 
                       onClick={() => setConfirmModal({...confirmModal, isOpen: false})} 
                       className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors text-sm"
                    >
                       Vazgeç
                    </button>
                    <button 
                       onClick={() => { confirmModal.action(); setConfirmModal({...confirmModal, isOpen: false}); }} 
                       className={`flex-1 px-4 py-2.5 text-white rounded-xl font-bold shadow-lg transition-colors text-sm ${confirmModal.type === 'danger' ? 'bg-red-600 hover:bg-red-500' : 'bg-blue-600 hover:bg-blue-500'}`}
                    >
                       Onayla
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default ResidentsPage;
