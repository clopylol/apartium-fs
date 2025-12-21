
import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Calendar, Clock, MapPin, MoreVertical, X, Filter, CheckCircle, AlertCircle, User, Info, Settings, Trash2, Edit2, Image as ImageIcon, ArrowRight, FileText, Ban, LayoutList, CalendarDays, ChevronLeft, ChevronRight, DollarSign, Users } from 'lucide-react';

// --- Types ---
interface Facility {
  id: string;
  name: string;
  image: string;
  status: 'open' | 'closed' | 'maintenance';
  hours: string;
  capacity: number;
  requiresBooking: boolean;
  pricePerHour: number;
}

interface Booking {
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

// --- Constants ---
const ITEMS_PER_PAGE = 10;

// --- Helpers for Dates ---
const getTodayString = () => new Date().toISOString().split('T')[0];
const addDays = (dateStr: string, days: number) => {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

// --- Mock Data ---
const INITIAL_FACILITIES: Facility[] = [
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
    image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=800&q=80', // Updated working image
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
const BASE_BOOKINGS: Booking[] = [
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
    facilityId: ['f3', 'f4', 'f5'][Math.floor(Math.random() * 3)],
    residentName: `Sakin ${i + 10}`,
    unit: `${['A', 'B', 'C'][Math.floor(Math.random() * 3)]}-${Math.floor(Math.random() * 10) + 1}`,
    date: date,
    startTime: `${Math.floor(Math.random() * 10) + 9}:00`,
    endTime: `${Math.floor(Math.random() * 10) + 10}:00`,
    status: ['confirmed', 'pending', 'cancelled'][Math.floor(Math.random() * 3)] as any,
    note: Math.random() > 0.7 ? 'Özel etkinlik' : undefined
  };
});

const INITIAL_BOOKINGS = [...BASE_BOOKINGS, ...GENERATED_BOOKINGS];

// --- Skeleton Components ---

const FacilityCardSkeleton = () => (
  <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 h-[320px] animate-pulse shadow-lg">
    <div className="h-40 bg-slate-800" />
    <div className="p-4 flex flex-col justify-between h-[160px]">
      <div className="space-y-3">
        <div className="h-6 w-3/4 bg-slate-800 rounded" />
        <div className="h-4 w-1/2 bg-slate-800 rounded" />
        <div className="h-4 w-1/3 bg-slate-800 rounded" />
      </div>
      <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
         <div className="h-4 w-16 bg-slate-800 rounded" />
         <div className="h-4 w-20 bg-slate-800 rounded" />
      </div>
    </div>
  </div>
);

const BookingRowSkeleton = () => (
  <tr className="border-b border-slate-800/50 animate-pulse">
    <td className="px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-slate-800 shrink-0" />
        <div className="space-y-2">
          <div className="h-4 w-32 bg-slate-800 rounded" />
          <div className="h-3 w-20 bg-slate-800 rounded" />
        </div>
      </div>
    </td>
    <td className="px-6 py-4">
       <div className="space-y-2">
          <div className="h-4 w-32 bg-slate-800 rounded" />
          <div className="h-3 w-12 bg-slate-800 rounded" />
       </div>
    </td>
    <td className="px-6 py-4">
       <div className="space-y-2">
          <div className="h-4 w-24 bg-slate-800 rounded" />
          <div className="h-3 w-20 bg-slate-800 rounded" />
       </div>
    </td>
    <td className="px-6 py-4"><div className="h-4 w-24 bg-slate-800 rounded" /></td>
    <td className="px-6 py-4"><div className="h-6 w-24 bg-slate-800 rounded-full" /></td>
    <td className="px-6 py-4 text-right"><div className="h-8 w-8 bg-slate-800 rounded ml-auto" /></td>
  </tr>
);

const CalendarSkeleton = () => (
  <div className="flex flex-col h-[600px] animate-pulse">
     <div className="flex border-b border-slate-800">
        <div className="w-16 shrink-0 border-r border-slate-800 bg-slate-950/30 h-16"></div>
        {[1,2,3,4,5,6,7].map(i => (
           <div key={i} className="flex-1 border-r border-slate-800 h-16 bg-slate-900/30 flex flex-col items-center justify-center gap-2">
              <div className="h-3 w-10 bg-slate-800 rounded"></div>
              <div className="h-4 w-6 bg-slate-800 rounded"></div>
           </div>
        ))}
     </div>
     <div className="flex-1 relative overflow-hidden">
        {[1,2,3,4,5,6].map(i => (
           <div key={i} className="flex border-b border-slate-800/50 h-24">
              <div className="w-16 shrink-0 border-r border-slate-800 bg-slate-950/20 flex items-center justify-center">
                 <div className="h-3 w-8 bg-slate-800 rounded"></div>
              </div>
              <div className="flex-1 bg-slate-900/10"></div>
           </div>
        ))}
     </div>
  </div>
);

// --- Pagination Component ---
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
           if (totalPages > 7) {
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
           }

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

const BookingsPage = () => {
  // --- States ---
  const [facilities, setFacilities] = useState<Facility[]>(INITIAL_FACILITIES);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [isLoading, setIsLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState<'all' | string>('all'); 
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [calendarWeekStart, setCalendarWeekStart] = useState(new Date());

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  // Modal States
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showBookingConfirmation, setShowBookingConfirmation] = useState(false);
  const [newBooking, setNewBooking] = useState({
    facilityId: '',
    residentName: '',
    unit: '',
    date: '',
    startTime: '',
    endTime: '',
    note: ''
  });

  const [showFacilityModal, setShowFacilityModal] = useState(false);
  const [facilityForm, setFacilityForm] = useState<Partial<Facility>>({
    id: '', name: '', image: '', status: 'open', hours: '', capacity: 0, requiresBooking: false, pricePerHour: 0
  });
  const [isEditingFacility, setIsEditingFacility] = useState(false);

  // Rejection Modal
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Simulate Loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Reset Page on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm, viewMode]);

  // --- Helpers ---
  const getFacilityName = (id: string) => facilities.find(f => f.id === id)?.name || 'Bilinmiyor';
  const getFacilityImage = (id: string) => facilities.find(f => f.id === id)?.image || '';

  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
        const matchesTab = activeTab === 'all' || b.facilityId === activeTab;
        const matchesSearch = 
          b.residentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
          b.unit.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesTab && matchesSearch;
      }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [bookings, activeTab, searchTerm]);

  // Pagination Logic
  const paginatedBookings = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredBookings.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredBookings, currentPage]);

  // Calculate Week Dates for Calendar
  const getWeekDates = (startDate: Date) => {
    const dates = [];
    // Adjust to Monday
    const day = startDate.getDay();
    const diff = startDate.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(startDate.setDate(diff));

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      dates.push(d);
    }
    return dates;
  };
  const currentWeekDates = getWeekDates(new Date(calendarWeekStart));

  // --- Facility Management Functions ---

  const handleOpenAddFacility = () => {
    setFacilityForm({
      name: '', image: '', status: 'open', hours: '', capacity: 10, requiresBooking: false, pricePerHour: 0
    });
    setIsEditingFacility(false);
    setShowFacilityModal(true);
  };

  const handleOpenEditFacility = (e: React.MouseEvent, facility: Facility) => {
    e.stopPropagation();
    setFacilityForm({ ...facility });
    setIsEditingFacility(true);
    setShowFacilityModal(true);
  };

  const handleDeleteFacility = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Bu tesisi silmek istediğinize emin misiniz?')) {
      setFacilities(prev => prev.filter(f => f.id !== id));
      if (activeTab === id) setActiveTab('all');
    }
  };

  const handleSaveFacility = () => {
    if (!facilityForm.name) return;

    if (isEditingFacility && facilityForm.id) {
      setFacilities(prev => prev.map(f => f.id === facilityForm.id ? { ...f, ...facilityForm } as Facility : f));
    } else {
      const newFacility: Facility = {
        id: `f-${Date.now()}`,
        name: facilityForm.name || 'Yeni Tesis',
        image: facilityForm.image || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
        status: facilityForm.status as any,
        hours: facilityForm.hours || '09:00 - 18:00',
        capacity: facilityForm.capacity || 10,
        requiresBooking: facilityForm.requiresBooking || false,
        pricePerHour: facilityForm.pricePerHour || 0
      };
      setFacilities([...facilities, newFacility]);
    }
    setShowFacilityModal(false);
  };

  // --- Booking Management Functions ---

  const handleInitiateBooking = () => {
    if(!newBooking.facilityId || !newBooking.residentName || !newBooking.date || !newBooking.startTime || !newBooking.endTime) {
        alert("Lütfen tüm zorunlu alanları doldurunuz.");
        return;
    }
    setShowBookingModal(false);
    setShowBookingConfirmation(true);
  };

  const handleFinalizeBooking = () => {
    const booking: Booking = {
      id: `b-${Date.now()}`,
      facilityId: newBooking.facilityId,
      residentName: newBooking.residentName,
      unit: newBooking.unit,
      date: newBooking.date,
      startTime: newBooking.startTime,
      endTime: newBooking.endTime,
      status: 'pending',
      note: newBooking.note
    };
    setBookings([booking, ...bookings]);
    setShowBookingConfirmation(false);
    setNewBooking({ facilityId: '', residentName: '', unit: '', date: '', startTime: '', endTime: '', note: '' });
  };

  const handleApproveBooking = (id: string) => {
    setBookings(bookings.map(b => b.id === id ? { ...b, status: 'confirmed' } : b));
  };

  const handleRejectClick = (id: string) => {
    setRejectingId(id);
    setRejectionReason('');
  };

  const confirmRejection = () => {
    if (!rejectingId) return;
    setBookings(bookings.map(b => b.id === rejectingId ? { ...b, status: 'cancelled', rejectionReason } : b));
    setRejectingId(null);
  };

  // --- Calendar Logic ---
  const timeSlots = Array.from({ length: 15 }, (_, i) => i + 8); // 08:00 to 22:00

  const getBookingsForCell = (date: Date, hour: number) => {
    const dateStr = date.toISOString().split('T')[0];
    return filteredBookings.filter(b => {
      if (b.status === 'cancelled') return false;
      const bDate = b.date;
      const bHour = parseInt(b.startTime.split(':')[0]);
      return bDate === dateStr && bHour === hour;
    });
  };

  // --- Visual Helpers ---

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'open': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20';
      case 'closed': return 'bg-red-500/20 text-red-400 border-red-500/20';
      case 'maintenance': return 'bg-amber-500/20 text-amber-400 border-amber-500/20';
      case 'confirmed': return 'text-emerald-400 bg-emerald-500/10';
      case 'pending': return 'text-amber-400 bg-amber-500/10';
      case 'cancelled': return 'text-slate-400 bg-slate-800';
      default: return 'text-slate-400';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'open': return 'Açık';
      case 'closed': return 'Kapalı';
      case 'maintenance': return 'Bakımda';
      case 'confirmed': return 'Onaylandı';
      case 'pending': return 'Bekliyor';
      case 'cancelled': return 'İptal';
      default: return status;
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 overflow-hidden relative">
      
      {/* Header */}
      <header className="h-20 border-b border-slate-800/50 flex items-center justify-between px-8 bg-slate-950 shrink-0">
         <div className="flex items-center gap-4">
           <h1 className="text-2xl font-bold font-heading text-white">Tesisler & Rezervasyonlar</h1>
         </div>
         
         <div className="flex items-center gap-4">
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Rezervasyon ara..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 w-64 placeholder-slate-500"
              />
           </div>
           
           <button 
             onClick={handleOpenAddFacility}
             className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all border border-slate-700"
           >
             <Settings className="w-4 h-4" />
             Tesis Yönetimi
           </button>

           <button 
             onClick={() => setShowBookingModal(true)}
             className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all shadow-lg shadow-blue-900/20"
           >
             <Plus className="w-4 h-4" />
             Rezervasyon Yap
           </button>
         </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
        <div className="max-w-7xl mx-auto space-y-8 pb-20">
          
          {/* Facilities Cards */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Sosyal Tesisler</h2>
              <button onClick={() => setActiveTab('all')} className="text-sm text-blue-400 hover:text-blue-300">Tümünü Göster</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {isLoading ? (
                <>
                  <FacilityCardSkeleton />
                  <FacilityCardSkeleton />
                  <FacilityCardSkeleton />
                  <FacilityCardSkeleton />
                </>
              ) : (
                <>
                  {facilities.map(facility => (
                    <div 
                      key={facility.id}
                      onClick={() => setActiveTab(activeTab === facility.id ? 'all' : facility.id)}
                      className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 cursor-pointer ${
                        activeTab === facility.id 
                          ? 'border-blue-500 ring-1 ring-blue-500/50 shadow-2xl shadow-blue-900/10' 
                          : 'border-slate-800 hover:border-slate-600 hover:shadow-xl'
                      } bg-slate-900`}
                    >
                      {/* Image Background */}
                      <div className="h-40 w-full overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent z-10" />
                        <img 
                          src={facility.image} 
                          alt={facility.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        
                        {/* Status Badge */}
                        <div className="absolute top-3 left-3 z-20">
                            <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider border backdrop-blur-md shadow-sm ${getStatusColor(facility.status)}`}>
                              {getStatusText(facility.status)}
                            </span>
                        </div>

                        {/* Settings Button */}
                        <div className="absolute top-3 right-3 z-20">
                            <button 
                              onClick={(e) => handleOpenEditFacility(e, facility)}
                              className="p-2 bg-slate-950/40 hover:bg-blue-600 backdrop-blur-md text-white rounded-lg transition-colors border border-white/10 shadow-lg"
                            >
                              <Settings className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Info Badges (Bottom Overlay) */}
                        <div className="absolute bottom-3 left-3 right-3 z-20 flex justify-between items-end">
                            <div className="flex gap-2">
                              <div className="flex items-center gap-1 text-[10px] font-bold bg-black/40 backdrop-blur-sm px-2 py-1 rounded-md text-white border border-white/10">
                                  <Users className="w-3 h-3 text-blue-400" />
                                  {facility.capacity}
                              </div>
                              <div className="flex items-center gap-1 text-[10px] font-bold bg-black/40 backdrop-blur-sm px-2 py-1 rounded-md text-white border border-white/10">
                                  <DollarSign className="w-3 h-3 text-emerald-400" />
                                  {facility.pricePerHour > 0 ? `${facility.pricePerHour}₺/sa` : 'Ücretsiz'}
                              </div>
                            </div>
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="p-4 relative">
                        <h3 className="text-white font-bold text-lg mb-1 truncate">{facility.name}</h3>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-2">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{facility.hours}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                            <Info className="w-3.5 h-3.5" />
                            <span>{facility.requiresBooking ? 'Rezervasyon Gerekli' : 'Serbest Giriş'}</span>
                        </div>

                        {facility.requiresBooking && (
                          <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center">
                              <span className="text-xs font-medium text-slate-500">
                                Aktif: {bookings.filter(b => b.facilityId === facility.id && b.status === 'confirmed').length}
                              </span>
                              <span className="text-xs font-bold text-blue-400 group-hover:text-blue-300 transition-colors flex items-center gap-1">
                                Program <ArrowRight className="w-3 h-3" />
                              </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </section>

          {/* Bookings Section */}
          <section className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl min-h-[500px] flex flex-col">
             {/* Section Header */}
             <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-bold text-white">
                    {activeTab === 'all' ? 'Tüm Rezervasyonlar' : `${getFacilityName(activeTab)} Programı`}
                  </h2>
                  <span className="px-2 py-0.5 bg-slate-800 text-slate-400 rounded-full text-xs font-medium">
                    {filteredBookings.length}
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                   {/* View Toggle */}
                   <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
                      <button 
                        onClick={() => setViewMode('list')}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-2 ${viewMode === 'list' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                      >
                         <LayoutList className="w-3.5 h-3.5" /> Liste
                      </button>
                      <button 
                        onClick={() => setViewMode('calendar')}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-2 ${viewMode === 'calendar' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                      >
                         <CalendarDays className="w-3.5 h-3.5" /> Takvim
                      </button>
                   </div>
                   
                   <div className="h-6 w-px bg-slate-800"></div>

                   <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                     <Filter className="w-4 h-4" />
                   </button>
                </div>
             </div>

             {/* Content Area */}
             <div className="flex-1 overflow-hidden flex flex-col">
               
               {viewMode === 'list' ? (
                 // --- LIST VIEW ---
                 <>
                    <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-800 bg-slate-950/30 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                                <th className="px-6 py-4">Tesis</th>
                                <th className="px-6 py-4">Sakin</th>
                                <th className="px-6 py-4">Tarih & Saat</th>
                                <th className="px-6 py-4">Notlar</th>
                                <th className="px-6 py-4">Durum</th>
                                <th className="px-6 py-4 text-right">Onay İşlemleri</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {isLoading ? (
                            <>
                                <BookingRowSkeleton />
                                <BookingRowSkeleton />
                                <BookingRowSkeleton />
                                <BookingRowSkeleton />
                                <BookingRowSkeleton />
                            </>
                            ) : (
                            <>
                                {paginatedBookings.length > 0 ? (
                                paginatedBookings.map(booking => (
                                    <tr key={booking.id} className="hover:bg-slate-800/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-800 shrink-0">
                                            <img src={getFacilityImage(booking.facilityId)} className="w-full h-full object-cover opacity-80" alt="" />
                                            </div>
                                            <div>
                                            <p className="font-medium text-slate-200 text-sm">{getFacilityName(booking.facilityId)}</p>
                                            <p className="text-xs text-slate-500">ID: {booking.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-slate-300">{booking.residentName}</div>
                                        <div className="text-xs text-slate-500">{booking.unit}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-sm text-slate-300">
                                            <Calendar className="w-3.5 h-3.5 text-slate-500" />
                                            {booking.date}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                            <Clock className="w-3.5 h-3.5" />
                                            {booking.startTime} - {booking.endTime}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-400 max-w-[150px] truncate">
                                        {booking.note || '-'}
                                        {booking.status === 'cancelled' && booking.rejectionReason && (
                                            <span className="block text-red-400 text-xs mt-1">Sebep: {booking.rejectionReason}</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                            {getStatusText(booking.status)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {booking.status === 'pending' ? (
                                                <>
                                                <button 
                                                    onClick={() => handleApproveBooking(booking.id)}
                                                    className="p-1.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition-colors border border-emerald-500/20"
                                                    title="Onayla"
                                                >
                                                    <CheckCircle className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleRejectClick(booking.id)}
                                                    className="p-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors border border-red-500/20"
                                                    title="Reddet"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                                </>
                                            ) : (
                                                <button className="p-1.5 text-slate-500 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
                                                <MoreVertical className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                    </tr>
                                ))
                                ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                    <Calendar className="w-10 h-10 mx-auto mb-3 opacity-20" />
                                    <p>Kayıt bulunamadı.</p>
                                    </td>
                                </tr>
                                )}
                            </>
                            )}
                        </tbody>
                    </table>
                    </div>
                    
                    {!isLoading && (
                        <PaginationControls 
                            totalItems={filteredBookings.length}
                            itemsPerPage={ITEMS_PER_PAGE}
                            currentPage={currentPage}
                            onPageChange={setCurrentPage}
                        />
                    )}
                 </>
               ) : (
                 // --- CALENDAR VIEW ---
                 <>
                    {isLoading ? (
                       <div className="p-6">
                          <CalendarSkeleton />
                       </div>
                    ) : (
                       <div className="flex flex-col h-[600px]">
                          {/* Calendar Header (Dates) */}
                          <div className="flex border-b border-slate-800">
                             <div className="w-16 shrink-0 border-r border-slate-800 bg-slate-950/30"></div> {/* Time Col */}
                             {currentWeekDates.map((date, i) => (
                                <div key={i} className={`flex-1 py-3 text-center border-r border-slate-800 last:border-0 ${date.toISOString().split('T')[0] === getTodayString() ? 'bg-blue-900/10' : ''}`}>
                                   <div className="text-xs text-slate-500 font-medium uppercase">{date.toLocaleDateString('tr-TR', { weekday: 'short' })}</div>
                                   <div className={`text-sm font-bold mt-1 ${date.toISOString().split('T')[0] === getTodayString() ? 'text-blue-400' : 'text-white'}`}>
                                      {date.getDate()}
                                   </div>
                                </div>
                             ))}
                          </div>
                          
                          {/* Calendar Body (Grid) */}
                          <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                             {timeSlots.map(hour => (
                                <div key={hour} className="flex min-h-[60px] border-b border-slate-800/50">
                                   <div className="w-16 shrink-0 border-r border-slate-800 flex items-start justify-center pt-2 text-xs text-slate-500 bg-slate-950/20">
                                      {String(hour).padStart(2, '0')}:00
                                   </div>
                                   {currentWeekDates.map((date, i) => (
                                      <div key={i} className="flex-1 border-r border-slate-800/30 last:border-0 relative">
                                         {/* Render Events */}
                                         {getBookingsForCell(date, hour).map(booking => {
                                            // Simple positioning for demo (assuming start on hour)
                                            const startHour = parseInt(booking.startTime.split(':')[0]);
                                            const endHour = parseInt(booking.endTime.split(':')[0]); // Approx duration
                                            const duration = endHour - startHour || 1; 
                                            
                                            return (
                                              <div 
                                                key={booking.id}
                                                className={`absolute left-1 right-1 rounded-md p-1.5 text-[10px] border shadow-sm cursor-pointer hover:brightness-110 transition-all z-10 ${
                                                   booking.status === 'confirmed' ? 'bg-emerald-600/20 border-emerald-600/50 text-emerald-100' : 
                                                   booking.status === 'pending' ? 'bg-amber-600/20 border-amber-600/50 text-amber-100' : 'bg-slate-800'
                                                }`}
                                                style={{
                                                   top: '2px',
                                                   height: `${duration * 60 - 4}px` // Scale height
                                                }}
                                                title={`${booking.residentName} - ${booking.note || ''}`}
                                              >
                                                 <div className="font-bold truncate">{booking.startTime} - {getFacilityName(booking.facilityId)}</div>
                                                 <div className="truncate opacity-80">{booking.residentName}</div>
                                              </div>
                                            );
                                         })}
                                      </div>
                                   ))}
                                </div>
                             ))}
                          </div>
                       </div>
                    )}
                 </>
               )}
             </div>
          </section>

        </div>
      </div>

      {/* Add/Edit Booking Modal (Form) */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
             <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                   <Calendar className="w-5 h-5 text-blue-500" />
                   Yeni Rezervasyon
                </h2>
                <button onClick={() => setShowBookingModal(false)} className="text-slate-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
             </div>
             
             <div className="p-6 space-y-4">
                <div className="space-y-2">
                   <label className="text-xs font-medium text-slate-400 uppercase">Tesis Seçimi</label>
                   <select 
                      value={newBooking.facilityId}
                      onChange={(e) => setNewBooking({...newBooking, facilityId: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer"
                   >
                      <option value="">Tesis Seçiniz</option>
                      {facilities.filter(f => f.requiresBooking && f.status !== 'closed').map(f => (
                         <option key={f.id} value={f.id}>{f.name}</option>
                      ))}
                   </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <label className="text-xs font-medium text-slate-400 uppercase">Sakin Adı</label>
                     <input 
                        type="text" 
                        value={newBooking.residentName}
                        onChange={(e) => setNewBooking({...newBooking, residentName: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Ad Soyad"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs font-medium text-slate-400 uppercase">Daire</label>
                     <input 
                        type="text" 
                        value={newBooking.unit}
                        onChange={(e) => setNewBooking({...newBooking, unit: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Örn: A-5"
                     />
                  </div>
                </div>

                <div className="space-y-2">
                   <label className="text-xs font-medium text-slate-400 uppercase">Tarih</label>
                   <input 
                      type="date" 
                      value={newBooking.date}
                      onChange={(e) => setNewBooking({...newBooking, date: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 [color-scheme:dark]"
                   />
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <label className="text-xs font-medium text-slate-400 uppercase">Başlangıç</label>
                      <input 
                         type="time" 
                         value={newBooking.startTime}
                         onChange={(e) => setNewBooking({...newBooking, startTime: e.target.value})}
                         className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 [color-scheme:dark]"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-medium text-slate-400 uppercase">Bitiş</label>
                      <input 
                         type="time" 
                         value={newBooking.endTime}
                         onChange={(e) => setNewBooking({...newBooking, endTime: e.target.value})}
                         className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 [color-scheme:dark]"
                      />
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-xs font-medium text-slate-400 uppercase">Not (Opsiyonel)</label>
                   <textarea 
                      value={newBooking.note}
                      onChange={(e) => setNewBooking({...newBooking, note: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 h-20 resize-none"
                      placeholder="Özel istekler..."
                   />
                </div>
             </div>

             <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex gap-3">
                <button 
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors text-sm"
                >
                  İptal
                </button>
                <button 
                  onClick={handleInitiateBooking}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium shadow-lg shadow-blue-900/20 transition-colors text-sm"
                >
                  Oluştur
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Booking Confirmation Modal */}
      {showBookingConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden transform transition-all">
              <div className="p-6 border-b border-slate-800 bg-slate-900 flex justify-between items-center">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                     <CheckCircle className="w-5 h-5 text-emerald-500" />
                     Rezervasyon Özeti
                  </h2>
                  <button onClick={() => setShowBookingConfirmation(false)} className="text-slate-400 hover:text-white transition-colors">
                     <X className="w-5 h-5" />
                  </button>
              </div>

              <div className="p-6 space-y-6">
                 <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-4">
                    <div className="flex items-start gap-3">
                       <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                          <Settings className="w-5 h-5 text-blue-400" />
                       </div>
                       <div>
                          <p className="text-xs text-slate-500 font-medium uppercase">Tesis</p>
                          <p className="text-white font-medium">{getFacilityName(newBooking.facilityId)}</p>
                       </div>
                    </div>

                    <div className="flex items-start gap-3">
                       <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
                          <User className="w-5 h-5 text-indigo-400" />
                       </div>
                       <div>
                          <p className="text-xs text-slate-500 font-medium uppercase">Rezervasyon Sahibi</p>
                          <p className="text-white font-medium">{newBooking.residentName} <span className="text-slate-500 text-sm">({newBooking.unit})</span></p>
                       </div>
                    </div>

                    <div className="flex items-start gap-3">
                       <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
                          <Calendar className="w-5 h-5 text-orange-400" />
                       </div>
                       <div>
                          <p className="text-xs text-slate-500 font-medium uppercase">Zaman</p>
                          <p className="text-white font-medium">{newBooking.date}</p>
                          <p className="text-sm text-slate-400 flex items-center gap-1">
                             {newBooking.startTime} <ArrowRight className="w-3 h-3" /> {newBooking.endTime}
                          </p>
                       </div>
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-2 p-3 bg-blue-500/5 border border-blue-500/10 rounded-lg">
                    <Info className="w-5 h-5 text-blue-400 shrink-0" />
                    <p className="text-xs text-blue-300">
                       Rezervasyon talebiniz yönetici onayına sunulmak üzere oluşturulacaktır.
                    </p>
                 </div>
              </div>

              <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex gap-3">
                 <button 
                    onClick={() => { setShowBookingConfirmation(false); setShowBookingModal(true); }}
                    className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors text-sm flex items-center justify-center gap-2"
                 >
                    <Edit2 className="w-3.5 h-3.5" />
                    Düzenle
                 </button>
                 <button 
                    onClick={handleFinalizeBooking}
                    className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium shadow-lg shadow-emerald-900/20 transition-colors text-sm flex items-center justify-center gap-2"
                 >
                    <CheckCircle className="w-4 h-4" />
                    Onayla
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Facility Management Modal */}
      {showFacilityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
             <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                   <Settings className="w-5 h-5 text-blue-500" />
                   {isEditingFacility ? 'Tesis Düzenle' : 'Yeni Tesis Ekle'}
                </h2>
                <button onClick={() => setShowFacilityModal(false)} className="text-slate-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
             </div>
             
             <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh] custom-scrollbar">
                
                <div className="space-y-2">
                   <label className="text-xs font-medium text-slate-400 uppercase">Tesis Adı</label>
                   <input 
                      type="text" 
                      value={facilityForm.name}
                      onChange={(e) => setFacilityForm({...facilityForm, name: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Örn: Yüzme Havuzu"
                   />
                </div>

                <div className="space-y-2">
                   <label className="text-xs font-medium text-slate-400 uppercase">Görsel URL</label>
                   <div className="relative">
                      <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input 
                        type="text" 
                        value={facilityForm.image}
                        onChange={(e) => setFacilityForm({...facilityForm, image: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-3 py-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="https://..."
                      />
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <label className="text-xs font-medium text-slate-400 uppercase">Durum</label>
                     <select 
                        value={facilityForm.status}
                        onChange={(e) => setFacilityForm({...facilityForm, status: e.target.value as any})}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer"
                     >
                        <option value="open">Açık</option>
                        <option value="closed">Kapalı</option>
                        <option value="maintenance">Bakımda</option>
                     </select>
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs font-medium text-slate-400 uppercase">Kapasite</label>
                     <input 
                        type="number" 
                        value={facilityForm.capacity}
                        onChange={(e) => setFacilityForm({...facilityForm, capacity: parseInt(e.target.value)})}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="20"
                     />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <label className="text-xs font-medium text-slate-400 uppercase">Çalışma Saatleri</label>
                     <input 
                        type="text" 
                        value={facilityForm.hours}
                        onChange={(e) => setFacilityForm({...facilityForm, hours: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="08:00 - 22:00"
                     />
                  </div>
                   <div className="space-y-2">
                     <label className="text-xs font-medium text-slate-400 uppercase">Ücret (₺/Sa)</label>
                     <input 
                        type="number" 
                        value={facilityForm.pricePerHour}
                        onChange={(e) => setFacilityForm({...facilityForm, pricePerHour: parseInt(e.target.value)})}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="0"
                     />
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl border border-slate-800">
                    <input 
                      type="checkbox" 
                      id="requiresBooking"
                      checked={facilityForm.requiresBooking}
                      onChange={(e) => setFacilityForm({...facilityForm, requiresBooking: e.target.checked})}
                      className="w-5 h-5 rounded border-slate-600 bg-slate-900 text-blue-600 focus:ring-offset-slate-900 accent-blue-600"
                    />
                    <label htmlFor="requiresBooking" className="text-sm font-medium text-slate-300 cursor-pointer">
                      Bu tesis için rezervasyon zorunludur
                    </label>
                </div>

             </div>

             <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex gap-3">
                <button 
                  onClick={() => setShowFacilityModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors text-sm"
                >
                  İptal
                </button>
                <button 
                  onClick={handleSaveFacility}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium shadow-lg shadow-blue-900/20 transition-colors text-sm"
                >
                  Kaydet
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Rejection Reason Modal */}
      {rejectingId && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm shadow-2xl">
               <div className="p-6">
                  <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                     <Ban className="w-6 h-6 text-red-500" />
                  </div>
                  <h3 className="text-lg font-bold text-white text-center mb-2">Reddetme Nedeni</h3>
                  <p className="text-slate-400 text-center text-sm mb-4">Lütfen rezervasyonu reddetme sebebinizi belirtiniz.</p>
                  
                  <textarea 
                     className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 resize-none h-24 mb-4"
                     placeholder="Örn: Bakım çalışması nedeniyle..."
                     value={rejectionReason}
                     onChange={(e) => setRejectionReason(e.target.value)}
                     autoFocus
                  />

                  <div className="flex gap-3">
                     <button onClick={() => setRejectingId(null)} className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium text-sm transition-colors">Vazgeç</button>
                     <button onClick={confirmRejection} className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl font-medium text-sm transition-colors">Reddet</button>
                  </div>
               </div>
            </div>
         </div>
      )}

    </div>
  );
};

export default BookingsPage;
