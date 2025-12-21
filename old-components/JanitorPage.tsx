
import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, UserCog, Phone, Building2, MapPin, Clock, Trash2, ShoppingBag, Briefcase, MoreVertical, CheckCircle, AlertCircle, X, Edit2, UserPlus, Coffee, Sparkles, Bell, ArrowUpDown, Filter, Save, CheckSquare, Check, AlertTriangle, LayoutGrid, List, Calendar, UserX, Moon, ChevronLeft, ChevronRight } from 'lucide-react';
import StatCard from './StatCards';

// --- Constants ---
const ITEMS_PER_PAGE = 20;

// --- Types ---
interface Janitor {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  assignedBlocks: string[]; // e.g., ['A', 'B']
  status: 'on-duty' | 'off-duty' | 'passive';
  tasksCompleted: number;
}

interface JanitorRequest {
  id: string;
  residentName: string;
  phone: string;
  unit: string;
  blockId: string;
  type: 'trash' | 'market' | 'cleaning' | 'bread' | 'other';
  status: 'pending' | 'completed';
  openedAt: string;
  completedAt?: string;
  assignedJanitorId?: string;
  note?: string; // Added note for details
}

const BLOCKS = ['A Blok', 'B Blok', 'C Blok', 'D Blok'];

// --- Mock Data ---
const INITIAL_JANITORS: Janitor[] = [
  {
    id: 'j1',
    name: 'Hüseyin Yılmaz',
    phone: '0532 123 45 67',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100',
    assignedBlocks: ['A Blok', 'B Blok'],
    status: 'on-duty',
    tasksCompleted: 145
  },
  {
    id: 'j2',
    name: 'Mustafa Demir',
    phone: '0533 987 65 43',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100',
    assignedBlocks: ['C Blok'],
    status: 'on-duty',
    tasksCompleted: 89
  },
  {
    id: 'j3',
    name: 'İsmail Kaya',
    phone: '0555 444 33 22',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&h=100',
    assignedBlocks: ['D Blok'],
    status: 'off-duty',
    tasksCompleted: 210
  }
];

// Base requests
const BASE_REQUESTS: JanitorRequest[] = [
  { id: 'req-1', residentName: 'Ayşe Hanım', phone: '0532 555 11 22', unit: 'A-5', blockId: 'A Blok', type: 'trash', status: 'pending', openedAt: '10:30', note: 'Kapının önüne bıraktım.' },
  { id: 'req-2', residentName: 'Mehmet Bey', phone: '0533 444 22 11', unit: 'B-12', blockId: 'B Blok', type: 'market', status: 'pending', openedAt: '10:15', note: 'Süt, yumurta ve gazete alınacak.' },
  { id: 'req-3', residentName: 'Selin Yılmaz', phone: '0544 333 44 55', unit: 'C-3', blockId: 'C Blok', type: 'bread', status: 'completed', openedAt: '08:00', completedAt: '08:45', assignedJanitorId: 'j2', note: '2 ekmek lütfen.' },
  { id: 'req-4', residentName: 'Caner Erkin', phone: '0535 222 55 66', unit: 'A-2', blockId: 'A Blok', type: 'cleaning', status: 'pending', openedAt: '09:00', note: 'Koridor paspaslanabilir mi?' },
  { id: 'req-5', residentName: 'Zeynep Su', phone: '0536 111 66 77', unit: 'D-8', blockId: 'D Blok', type: 'trash', status: 'completed', openedAt: '07:30', completedAt: '08:15', assignedJanitorId: 'j3' },
];

// Generate more requests to demonstrate pagination (Total ~45 items)
const GENERATED_REQUESTS: JanitorRequest[] = Array.from({ length: 40 }, (_, i) => ({
  id: `gen-req-${i + 6}`,
  residentName: `Sakin ${i + 6}`,
  phone: `0532 000 00 ${String(i).padStart(2, '0')}`,
  unit: `${['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)]}-${Math.floor(Math.random() * 20) + 1}`,
  blockId: `${['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)]} Blok`,
  type: ['trash', 'market', 'bread', 'cleaning'][Math.floor(Math.random() * 4)] as any,
  status: Math.random() > 0.5 ? 'pending' : 'completed',
  openedAt: `${String(Math.floor(Math.random() * 12) + 8).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
  completedAt: Math.random() > 0.5 ? '14:00' : undefined,
  assignedJanitorId: Math.random() > 0.5 ? 'j1' : undefined,
  note: 'Otomatik oluşturulan talep.'
}));

const INITIAL_REQUESTS = [...BASE_REQUESTS, ...GENERATED_REQUESTS];

// --- Skeletons ---
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

const JanitorCardSkeleton = () => (
  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 animate-pulse">
    <div className="flex items-start justify-between mb-6">
      <div className="flex gap-4">
        <div className="w-16 h-16 rounded-full bg-slate-800" />
        <div className="space-y-2 pt-1">
          <div className="h-4 w-32 bg-slate-800 rounded" />
          <div className="h-3 w-24 bg-slate-800 rounded" />
        </div>
      </div>
      <div className="h-6 w-16 bg-slate-800 rounded-full" />
    </div>
    <div className="space-y-3">
      <div className="h-3 w-full bg-slate-800 rounded" />
      <div className="flex gap-2">
        <div className="h-6 w-12 bg-slate-800 rounded" />
        <div className="h-6 w-12 bg-slate-800 rounded" />
      </div>
    </div>
  </div>
);

const JanitorRowSkeleton = () => (
  <tr className="border-b border-slate-800/50 animate-pulse">
    <td className="px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-slate-800" />
        <div className="space-y-2">
          <div className="h-4 w-32 bg-slate-800 rounded" />
          <div className="h-3 w-20 bg-slate-800 rounded" />
        </div>
      </div>
    </td>
    <td className="px-6 py-4"><div className="h-4 w-32 bg-slate-800 rounded" /></td>
    <td className="px-6 py-4"><div className="h-6 w-24 bg-slate-800 rounded" /></td>
    <td className="px-6 py-4"><div className="h-6 w-16 bg-slate-800 rounded-full" /></td>
    <td className="px-6 py-4"><div className="h-4 w-8 bg-slate-800 rounded" /></td>
    <td className="px-6 py-4"><div className="h-8 w-8 bg-slate-800 rounded ml-auto" /></td>
  </tr>
);

const RequestCardSkeleton = () => (
  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 animate-pulse">
    <div className="flex justify-between items-start mb-4">
      <div className="w-10 h-10 rounded-lg bg-slate-800" />
      <div className="h-6 w-20 bg-slate-800 rounded-full" />
    </div>
    <div className="space-y-2 mb-4">
      <div className="h-4 w-32 bg-slate-800 rounded" />
      <div className="h-3 w-24 bg-slate-800 rounded" />
    </div>
    <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
      <div className="h-3 w-16 bg-slate-800 rounded" />
      <div className="h-8 w-8 bg-slate-800 rounded" />
    </div>
  </div>
);

const RequestRowSkeleton = () => (
  <tr className="border-b border-slate-800/50 animate-pulse">
    <td className="px-6 py-4"><div className="w-10 h-10 rounded-lg bg-slate-800" /></td>
    <td className="px-6 py-4">
      <div className="space-y-2">
        <div className="h-4 w-32 bg-slate-800 rounded" />
        <div className="h-3 w-20 bg-slate-800 rounded" />
      </div>
    </td>
    <td className="px-6 py-4"><div className="h-4 w-24 bg-slate-800 rounded" /></td>
    <td className="px-6 py-4"><div className="h-4 w-20 bg-slate-800 rounded" /></td>
    <td className="px-6 py-4"><div className="h-6 w-16 bg-slate-800 rounded-full" /></td>
    <td className="px-6 py-4"><div className="h-8 w-8 bg-slate-800 rounded ml-auto" /></td>
  </tr>
);

// --- Helper Component: Pagination Controls ---
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
        
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
        ))}

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

const JanitorPage = () => {
  const [activeTab, setActiveTab] = useState<'staff' | 'requests'>('staff');
  const [isLoading, setIsLoading] = useState(true);
  const [janitors, setJanitors] = useState<Janitor[]>(INITIAL_JANITORS);
  const [requests, setRequests] = useState<JanitorRequest[]>(INITIAL_REQUESTS);
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination States
  const [staffPage, setStaffPage] = useState(1);
  const [requestPage, setRequestPage] = useState(1);

  // View Modes
  const [staffViewMode, setStaffViewMode] = useState<'grid' | 'list'>('grid');
  const [requestViewMode, setRequestViewMode] = useState<'list' | 'grid'>('list');

  // Request Filters
  const [requestTypeFilter, setRequestTypeFilter] = useState<'all' | 'trash' | 'market' | 'cleaning' | 'bread'>('all');
  const [requestStatusSort, setRequestStatusSort] = useState<'pending_first' | 'completed_first'>('pending_first');

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    phone: '',
    assignedBlocks: [] as string[],
    status: 'on-duty' as 'on-duty' | 'off-duty' | 'passive'
  });

  // Request Detail Modal State
  const [selectedRequest, setSelectedRequest] = useState<JanitorRequest | null>(null);

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'approve' | 'danger';
    onConfirm: () => void;
  }>({ isOpen: false, title: '', message: '', type: 'approve', onConfirm: () => {} });

  // Stats
  const stats = {
    onDuty: janitors.filter(j => j.status === 'on-duty').length,
    activeRequests: requests.filter(r => r.status === 'pending').length,
    totalStaff: janitors.length
  };

  // Simulate Loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Reset Pagination on Filter Change
  useEffect(() => {
    setStaffPage(1);
  }, [searchTerm]);

  useEffect(() => {
    setRequestPage(1);
  }, [searchTerm, requestTypeFilter, requestStatusSort]);

  // --- Helpers ---
  const getJanitor = (id?: string) => janitors.find(j => j.id === id);

  // --- Handlers ---

  const handleOpenAdd = () => {
    setIsEditing(false);
    setFormData({ id: '', name: '', phone: '', assignedBlocks: [], status: 'on-duty' });
    setShowAddModal(true);
  };

  const handleOpenEdit = (janitor: Janitor) => {
    setIsEditing(true);
    setFormData({ 
      id: janitor.id, 
      name: janitor.name, 
      phone: janitor.phone, 
      assignedBlocks: janitor.assignedBlocks,
      status: janitor.status
    });
    setShowAddModal(true);
  };

  const handleBlockToggle = (block: string) => {
    setFormData(prev => {
      if (prev.assignedBlocks.includes(block)) {
        return { ...prev, assignedBlocks: prev.assignedBlocks.filter(b => b !== block) };
      } else {
        return { ...prev, assignedBlocks: [...prev.assignedBlocks, block] };
      }
    });
  };

  const handleSaveClick = () => {
    if (!formData.name || formData.assignedBlocks.length === 0) return;
    
    setConfirmModal({
        isOpen: true,
        title: isEditing ? 'Personeli Güncelle' : 'Yeni Personel Ekle',
        message: isEditing 
            ? `${formData.name} isimli personelin bilgilerini güncellemek istiyor musunuz?`
            : `${formData.name} isimli yeni personeli sisteme kaydetmek istiyor musunuz?`,
        type: 'approve',
        onConfirm: processSave
    });
  };

  const processSave = () => {
    if (isEditing && formData.id) {
      setJanitors(prev => prev.map(j => j.id === formData.id ? { ...j, ...formData } : j));
    } else {
      const newJanitor: Janitor = {
        id: `j-${Date.now()}`,
        name: formData.name,
        phone: formData.phone,
        assignedBlocks: formData.assignedBlocks,
        status: formData.status,
        tasksCompleted: 0,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random&color=fff`
      };
      setJanitors([...janitors, newJanitor]);
    }
    setShowAddModal(false);
    setConfirmModal(prev => ({...prev, isOpen: false}));
  };

  const handleDeleteClick = (id: string, name: string) => {
    setConfirmModal({
        isOpen: true,
        title: 'Personeli Sil',
        message: `${name} isimli personeli silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`,
        type: 'danger',
        onConfirm: () => processDelete(id)
    });
  };

  const processDelete = (id: string) => {
    setJanitors(prev => prev.filter(j => j.id !== id));
    setConfirmModal(prev => ({...prev, isOpen: false}));
  };

  const handleCompleteRequest = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { 
        ...r, 
        status: 'completed',
        completedAt: new Date().toLocaleTimeString('tr-TR', {hour: '2-digit', minute: '2-digit'}),
        assignedJanitorId: 'j1' // Default assigned to current user for demo
    } : r));
    
    // If modal is open, update it too
    if (selectedRequest && selectedRequest.id === id) {
        setSelectedRequest(prev => prev ? ({
            ...prev,
            status: 'completed',
            completedAt: new Date().toLocaleTimeString('tr-TR', {hour: '2-digit', minute: '2-digit'}),
            assignedJanitorId: 'j1'
        }) : null);
    }
  };

  // Filter Logic & Pagination Slicing
  const filteredJanitors = janitors.filter(j => j.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const paginatedJanitors = useMemo(() => {
    const startIndex = (staffPage - 1) * ITEMS_PER_PAGE;
    return filteredJanitors.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredJanitors, staffPage]);
  
  const filteredRequests = useMemo(() => {
    let result = requests.filter(r => 
        r.residentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.unit.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (requestTypeFilter !== 'all') {
        result = result.filter(r => r.type === requestTypeFilter);
    }

    // Sort by status
    result.sort((a, b) => {
        if (requestStatusSort === 'pending_first') {
            // Pending first (0), Completed last (1)
            const statusA = a.status === 'pending' ? 0 : 1;
            const statusB = b.status === 'pending' ? 0 : 1;
            return statusA - statusB;
        } else {
            const statusA = a.status === 'completed' ? 0 : 1;
            const statusB = b.status === 'completed' ? 0 : 1;
            return statusA - statusB;
        }
    });

    return result;
  }, [requests, searchTerm, requestTypeFilter, requestStatusSort]);

  const paginatedRequests = useMemo(() => {
    const startIndex = (requestPage - 1) * ITEMS_PER_PAGE;
    return filteredRequests.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredRequests, requestPage]);

  // --- Visual Helpers ---
  const getRequestIcon = (type: string) => {
    switch(type) {
      case 'trash': return <Trash2 className="w-5 h-5 text-slate-400" />;
      case 'market': return <ShoppingBag className="w-5 h-5 text-blue-400" />;
      case 'bread': return <Coffee className="w-5 h-5 text-amber-500" />;
      case 'cleaning': return <Sparkles className="w-5 h-5 text-cyan-400" />;
      default: return <Bell className="w-5 h-5 text-purple-400" />;
    }
  };

  const getRequestLabel = (type: string) => {
    switch(type) {
      case 'trash': return 'Çöp Alma';
      case 'market': return 'Market';
      case 'bread': return 'Ekmek Servisi';
      case 'cleaning': return 'Temizlik';
      default: return 'Diğer';
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 overflow-hidden relative">
      
      {/* Header */}
      <header className="h-20 border-b border-slate-800/50 flex items-center justify-between px-8 bg-slate-950 shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold font-heading text-white">Kapıcı Hizmetleri</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder={activeTab === 'staff' ? "Personel ara..." : "Daire veya isim ara..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 w-64 placeholder-slate-500"
            />
          </div>
          
          <div className="h-8 w-px bg-slate-800 mx-2 hidden md:block"></div>

          {/* Tab Toggle */}
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
             <button 
                onClick={() => setActiveTab('staff')}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'staff' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
             >
                <UserCog className="w-4 h-4" /> Personel
             </button>
             <button 
                onClick={() => setActiveTab('requests')}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'requests' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
             >
                <Bell className="w-4 h-4" /> Talepler
                {stats.activeRequests > 0 && <span className="w-5 h-5 rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center">{stats.activeRequests}</span>}
             </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Stats Area */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {isLoading ? (
                <>
                  <StatCardSkeleton />
                  <StatCardSkeleton />
                  <StatCardSkeleton />
                </>
             ) : (
                <>
                  <StatCard title="Toplam Personel" value={stats.totalStaff.toString()} trend="Aktif" trendUp={true} trendText="görevli sayısı" variant="blue" icon={UserCog} />
                  <StatCard title="Mesai Durumu" value={stats.onDuty.toString()} trend="Çalışıyor" trendUp={true} trendText="şu an görevde" variant="green" icon={Briefcase} />
                  <StatCard title="Bekleyen Talep" value={stats.activeRequests.toString()} trend="İstek" trendUp={false} trendText="sakin çağrısı" variant="red" icon={AlertCircle} />
                </>
             )}
          </div>

          {/* === STAFF TAB === */}
          {activeTab === 'staff' && (
            <div className="space-y-6">
               <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <h2 className="text-lg font-bold text-white">Görevli Listesi</h2>
                  
                  <div className="flex items-center gap-4">
                    {/* View Toggle */}
                    <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
                        <button 
                            onClick={() => setStaffViewMode('grid')}
                            className={`p-2 rounded-md ${staffViewMode === 'grid' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={() => setStaffViewMode('list')}
                            className={`p-2 rounded-md ${staffViewMode === 'list' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>

                    <button onClick={handleOpenAdd} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all shadow-lg shadow-blue-900/20">
                        <UserPlus className="w-4 h-4" /> Personel Ekle
                    </button>
                  </div>
               </div>

               {staffViewMode === 'grid' ? (
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {isLoading ? (
                         <>
                           <JanitorCardSkeleton />
                           <JanitorCardSkeleton />
                           <JanitorCardSkeleton />
                         </>
                      ) : (
                         paginatedJanitors.map(janitor => (
                            <div key={janitor.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative group hover:border-slate-700 transition-all">
                               
                               {/* Edit/Delete Actions */}
                               <div className="absolute top-4 right-4 flex gap-1">
                                  <button onClick={() => handleOpenEdit(janitor)} className="p-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors">
                                     <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button onClick={() => handleDeleteClick(janitor.id, janitor.name)} className="p-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-red-400 rounded-lg transition-colors">
                                     <Trash2 className="w-4 h-4" />
                                  </button>
                               </div>
    
                               <div className="flex items-start gap-4 mb-6">
                                  <img src={janitor.avatar} alt={janitor.name} className="w-16 h-16 rounded-full object-cover border-2 border-slate-700" />
                                  <div>
                                     <h3 className="text-lg font-bold text-white">{janitor.name}</h3>
                                     <p className="text-sm text-slate-400 flex items-center gap-1 mt-1"><Phone className="w-3 h-3" /> {janitor.phone}</p>
                                     <div className={`mt-2 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${janitor.status === 'on-duty' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : janitor.status === 'passive' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                                        {janitor.status === 'on-duty' ? 'Mesaide' : janitor.status === 'passive' ? 'Pasif' : 'İzinli'}
                                     </div>
                                  </div>
                               </div>
    
                               <div className="space-y-4">
                                  <div>
                                     <p className="text-xs text-slate-500 font-bold uppercase mb-2 flex items-center gap-1"><Building2 className="w-3 h-3" /> Sorumlu Olduğu Bloklar</p>
                                     <div className="flex flex-wrap gap-2">
                                        {janitor.assignedBlocks.map(block => (
                                           <span key={block} className="bg-slate-950 border border-slate-800 text-slate-300 px-3 py-1 rounded-lg text-xs font-medium">
                                              {block}
                                           </span>
                                        ))}
                                     </div>
                                  </div>
                                  
                                  <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-xs text-slate-500">
                                     <span>Tamamlanan Görevler</span>
                                     <span className="font-bold text-white">{janitor.tasksCompleted}</span>
                                  </div>
                               </div>
                            </div>
                         ))
                      )}
                   </div>
               ) : (
                   // Staff List View
                   <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                       <div className="overflow-x-auto">
                           <table className="w-full text-left">
                               <thead>
                                   <tr className="border-b border-slate-800 bg-slate-950/50 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                                       <th className="px-6 py-4">Personel</th>
                                       <th className="px-6 py-4">İletişim</th>
                                       <th className="px-6 py-4">Sorumlu Bloklar</th>
                                       <th className="px-6 py-4">Durum</th>
                                       <th className="px-6 py-4">Görevler</th>
                                       <th className="px-6 py-4 text-right">İşlemler</th>
                                   </tr>
                               </thead>
                               <tbody className="divide-y divide-slate-800/50">
                                   {isLoading ? (
                                       <>
                                           <JanitorRowSkeleton />
                                           <JanitorRowSkeleton />
                                           <JanitorRowSkeleton />
                                       </>
                                   ) : (
                                       paginatedJanitors.map(janitor => (
                                           <tr key={janitor.id} className="hover:bg-slate-800/30 transition-colors group">
                                               <td className="px-6 py-4">
                                                   <div className="flex items-center gap-3">
                                                       <img src={janitor.avatar} alt={janitor.name} className="w-10 h-10 rounded-full object-cover border border-slate-700" />
                                                       <span className="font-medium text-slate-200">{janitor.name}</span>
                                                   </div>
                                               </td>
                                               <td className="px-6 py-4">
                                                   <div className="text-sm text-slate-300 flex items-center gap-2">
                                                       <Phone className="w-3.5 h-3.5 text-slate-500" /> {janitor.phone}
                                                   </div>
                                               </td>
                                               <td className="px-6 py-4">
                                                   <div className="flex flex-wrap gap-1">
                                                       {janitor.assignedBlocks.map(block => (
                                                           <span key={block} className="text-[10px] bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-slate-400">{block}</span>
                                                       ))}
                                                   </div>
                                               </td>
                                               <td className="px-6 py-4">
                                                   <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${janitor.status === 'on-duty' ? 'bg-emerald-500/10 text-emerald-400' : janitor.status === 'passive' ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-800 text-slate-400'}`}>
                                                       {janitor.status === 'on-duty' ? 'Mesaide' : janitor.status === 'passive' ? 'Pasif' : 'İzinli'}
                                                   </span>
                                               </td>
                                               <td className="px-6 py-4">
                                                   <div className="text-sm text-slate-300 font-mono">{janitor.tasksCompleted}</div>
                                               </td>
                                               <td className="px-6 py-4 text-right">
                                                   <div className="flex items-center justify-end gap-2">
                                                       <button onClick={() => handleOpenEdit(janitor)} className="p-2 bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors border border-slate-800">
                                                           <Edit2 className="w-4 h-4" />
                                                       </button>
                                                       <button onClick={() => handleDeleteClick(janitor.id, janitor.name)} className="p-2 bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-red-400 rounded-lg transition-colors border border-slate-800">
                                                           <Trash2 className="w-4 h-4" />
                                                       </button>
                                                   </div>
                                               </td>
                                           </tr>
                                       ))
                                   )}
                               </tbody>
                           </table>
                       </div>
                   </div>
               )}

               {/* Pagination Controls for Staff */}
               {!isLoading && (
                 <PaginationControls 
                    totalItems={filteredJanitors.length}
                    itemsPerPage={ITEMS_PER_PAGE}
                    currentPage={staffPage}
                    onPageChange={setStaffPage}
                 />
               )}
            </div>
          )}

          {/* === REQUESTS TAB === */}
          {activeTab === 'requests' && (
             <div className="space-y-6">
                
                {/* Filters & Controls */}
                <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4">
                    {/* Chips */}
                    <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto">
                        <button onClick={() => setRequestTypeFilter('all')} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all whitespace-nowrap ${requestTypeFilter === 'all' ? 'bg-slate-800 text-white border-slate-600' : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'}`}>Tümü</button>
                        <button onClick={() => setRequestTypeFilter('trash')} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all whitespace-nowrap flex items-center gap-1 ${requestTypeFilter === 'trash' ? 'bg-slate-800 text-white border-slate-600' : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'}`}><Trash2 className="w-3 h-3"/> Çöp</button>
                        <button onClick={() => setRequestTypeFilter('market')} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all whitespace-nowrap flex items-center gap-1 ${requestTypeFilter === 'market' ? 'bg-slate-800 text-white border-slate-600' : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'}`}><ShoppingBag className="w-3 h-3"/> Market</button>
                        <button onClick={() => setRequestTypeFilter('bread')} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all whitespace-nowrap flex items-center gap-1 ${requestTypeFilter === 'bread' ? 'bg-slate-800 text-white border-slate-600' : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'}`}><Coffee className="w-3 h-3"/> Ekmek</button>
                        <button onClick={() => setRequestTypeFilter('cleaning')} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all whitespace-nowrap flex items-center gap-1 ${requestTypeFilter === 'cleaning' ? 'bg-slate-800 text-white border-slate-600' : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'}`}><Sparkles className="w-3 h-3"/> Temizlik</button>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* View Toggle */}
                        <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
                            <button 
                                onClick={() => setRequestViewMode('grid')}
                                className={`p-2 rounded-md ${requestViewMode === 'grid' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
                            >
                                <LayoutGrid className="w-4 h-4" />
                            </button>
                            <button 
                                onClick={() => setRequestViewMode('list')}
                                className={`p-2 rounded-md ${requestViewMode === 'list' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
                            >
                                <List className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Sorting */}
                        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2">
                            <span className="text-xs text-slate-500 font-bold uppercase">Sırala:</span>
                            <select 
                                value={requestStatusSort}
                                onChange={(e) => setRequestStatusSort(e.target.value as any)}
                                className="bg-transparent text-sm text-slate-200 focus:outline-none cursor-pointer"
                            >
                                <option value="pending_first">Önce Bekleyenler</option>
                                <option value="completed_first">Önce Tamamlananlar</option>
                            </select>
                        </div>
                    </div>
                </div>

                {requestViewMode === 'list' ? (
                    // Request List View
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                        <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-800 bg-slate-950/50 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                                    <th className="px-6 py-4 w-16">Tip</th>
                                    <th className="px-6 py-4">Sakin Bilgisi</th>
                                    <th className="px-6 py-4">Blok / Daire</th>
                                    <th className="px-6 py-4">Talep Konusu</th>
                                    <th className="px-6 py-4">Zaman / Durum</th>
                                    <th className="px-6 py-4 text-right">İşlem</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {isLoading ? (
                                    <>
                                    <RequestRowSkeleton />
                                    <RequestRowSkeleton />
                                    <RequestRowSkeleton />
                                    </>
                                ) : (
                                    paginatedRequests.length > 0 ? paginatedRequests.map(req => {
                                        const assignedJanitor = getJanitor(req.assignedJanitorId);
                                        return (
                                        <tr 
                                            key={req.id} 
                                            onClick={() => setSelectedRequest(req)}
                                            className="hover:bg-slate-800/30 transition-colors group cursor-pointer"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center">
                                                    {getRequestIcon(req.type)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-slate-200">{req.residentName}</div>
                                                <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1 opacity-70">
                                                    <Phone className="w-3 h-3" /> {req.phone}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="bg-slate-950 text-slate-400 px-2 py-1 rounded border border-slate-800 text-xs font-mono">
                                                    {req.blockId} - {req.unit}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-slate-300 font-medium">{getRequestLabel(req.type)}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1.5">
                                                    {req.status === 'pending' ? (
                                                        <div className="flex items-center gap-2">
                                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold uppercase tracking-wide animate-pulse">
                                                                Bekliyor
                                                            </span>
                                                            <span className="text-slate-500 text-xs flex items-center gap-1"><Clock className="w-3 h-3" /> {req.openedAt}</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col gap-1">
                                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wide w-fit">
                                                                Tamamlandı
                                                            </span>
                                                            {/* Assigned Janitor Info */}
                                                            {assignedJanitor && (
                                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                                    <img src={assignedJanitor.avatar} alt="" className="w-4 h-4 rounded-full object-cover border border-slate-700"/>
                                                                    <span className="text-[10px] text-slate-400">{assignedJanitor.name}</span>
                                                                </div>
                                                            )}
                                                            {req.completedAt && <span className="text-[10px] text-emerald-500/50 font-mono">{req.completedAt}</span>}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-100">
                                                    {req.status === 'pending' ? (
                                                        <button 
                                                        onClick={(e) => { e.stopPropagation(); handleCompleteRequest(req.id); }}
                                                        className="p-2 hover:bg-emerald-900/20 text-slate-400 hover:text-emerald-400 rounded-lg transition-colors"
                                                        title="Tamamlandı Olarak İşaretle"
                                                        >
                                                        <CheckCircle className="w-5 h-5" />
                                                        </button>
                                                    ) : (
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); setSelectedRequest(req); }}
                                                            className="p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
                                                        >
                                                            <MoreVertical className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                        );
                                    }) : (
                                    <tr><td colSpan={7} className="px-6 py-12 text-center text-slate-500">Filtrelere uygun talep bulunmuyor.</td></tr>
                                    )
                                )}
                            </tbody>
                        </table>
                        </div>
                    </div>
                ) : (
                    // Request Grid View
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {isLoading ? (
                            <>
                                <RequestCardSkeleton />
                                <RequestCardSkeleton />
                                <RequestCardSkeleton />
                            </>
                        ) : (
                            paginatedRequests.length > 0 ? paginatedRequests.map(req => {
                                const assignedJanitor = getJanitor(req.assignedJanitorId);
                                const isAssigned = !!assignedJanitor;
                                return (
                                <div 
                                    key={req.id} 
                                    onClick={() => setSelectedRequest(req)}
                                    className="bg-slate-900 border border-slate-800 rounded-2xl p-5 transition-all hover:border-slate-700 cursor-pointer"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow-sm">
                                            {getRequestIcon(req.type)}
                                        </div>
                                        {req.status === 'pending' ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold animate-pulse">
                                            Bekliyor
                                            </span>
                                        ) : (
                                            <div className="flex flex-col items-end gap-1">
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                                                Tamamlandı
                                                </span>
                                                {isAssigned && (
                                                    <div className="flex items-center gap-1">
                                                        <img src={assignedJanitor?.avatar} alt="" className="w-4 h-4 rounded-full object-cover border border-slate-700" />
                                                        <span className="text-[10px] text-slate-400">{assignedJanitor?.name}</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-4">
                                        <h3 className="font-bold text-white text-lg mb-1">{getRequestLabel(req.type)}</h3>
                                        <div className="flex items-center gap-2 text-sm text-slate-400">
                                            <span className="font-medium text-slate-300">{req.residentName}</span>
                                            <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                                            <span className="bg-slate-950 px-1.5 rounded border border-slate-800 text-xs font-mono">{req.blockId} - {req.unit}</span>
                                        </div>
                                        <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                            <Phone className="w-3 h-3" /> {req.phone}
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-slate-800 flex justify-between items-end">
                                        <div className="flex flex-col gap-1.5 text-xs">
                                            <div className="flex items-center gap-1.5 text-slate-400">
                                                <Clock className="w-3 h-3" /> <span className="text-slate-300 font-mono">{req.openedAt}</span>
                                            </div>
                                            {/* Completed Info in Grid */}
                                            {req.status === 'completed' && req.completedAt && (
                                                <div className="text-[9px] text-emerald-500/70 leading-tight pl-4.5">{req.completedAt}</div>
                                            )}
                                        </div>
                                        
                                        {req.status === 'pending' ? (
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleCompleteRequest(req.id); }}
                                                className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-emerald-900/20 opacity-100"
                                            >
                                                <CheckCircle className="w-3.5 h-3.5" /> Tamamla
                                            </button>
                                        ) : (
                                            <button className="p-1.5 hover:bg-slate-800 text-slate-500 hover:text-white rounded transition-colors opacity-100">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}) : (
                                <div className="col-span-full text-center py-12 text-slate-500">
                                    Filtrelere uygun talep bulunmuyor.
                                </div>
                            )
                        )}
                    </div>
                )}

                {/* Pagination Controls for Requests */}
                {!isLoading && (
                    <PaginationControls 
                        totalItems={filteredRequests.length}
                        itemsPerPage={ITEMS_PER_PAGE}
                        currentPage={requestPage}
                        onPageChange={setRequestPage}
                    />
                )}
             </div>
          )}

        </div>
      </div>

      {/* Add/Edit Staff Modal */}
      {showAddModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
               <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                     <UserCog className="w-5 h-5 text-blue-500" />
                     {isEditing ? 'Personel Düzenle' : 'Yeni Personel Ekle'}
                  </h2>
                  <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
               </div>
               
               <div className="p-6 space-y-4">
                  <div className="space-y-2">
                     <label className="text-xs font-medium text-slate-400 uppercase">Ad Soyad</label>
                     <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Ad Soyad"
                     />
                  </div>

                  <div className="space-y-2">
                     <label className="text-xs font-medium text-slate-400 uppercase">Telefon</label>
                     <input 
                        type="text" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="05XX XXX XX XX"
                     />
                  </div>

                  <div className="space-y-2">
                     <label className="text-xs font-medium text-slate-400 uppercase mb-2 block">Sorumlu Olduğu Bloklar</label>
                     <div className="grid grid-cols-2 gap-3">
                        {BLOCKS.map(block => {
                           const isSelected = formData.assignedBlocks.includes(block);
                           return (
                              <button
                                 key={block}
                                 onClick={() => handleBlockToggle(block)}
                                 className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all flex items-center justify-between ${
                                    isSelected 
                                    ? 'bg-blue-600/10 border-blue-500 text-blue-400' 
                                    : 'bg-slate-950 border-slate-700 text-slate-400 hover:border-slate-500'
                                 }`}
                              >
                                 {block}
                                 {isSelected && <CheckCircle className="w-3.5 h-3.5" />}
                              </button>
                           );
                        })}
                     </div>
                     <p className="text-[10px] text-slate-500 mt-1">* Birden fazla blok seçebilirsiniz.</p>
                  </div>

                  <div className="space-y-2">
                     <label className="text-xs font-medium text-slate-400 uppercase mb-2 block">Durum</label>
                     <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-700">
                        <button onClick={() => setFormData({...formData, status: 'on-duty'})} className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${formData.status === 'on-duty' ? 'bg-slate-800 text-emerald-400 shadow' : 'text-slate-400 hover:text-white'}`}>Mesaide</button>
                        <button onClick={() => setFormData({...formData, status: 'off-duty'})} className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${formData.status === 'off-duty' ? 'bg-slate-800 text-slate-200 shadow' : 'text-slate-400 hover:text-white'}`}>İzinli</button>
                        <button onClick={() => setFormData({...formData, status: 'passive'})} className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${formData.status === 'passive' ? 'bg-slate-800 text-amber-400 shadow' : 'text-slate-400 hover:text-white'}`}>Pasif</button>
                     </div>
                  </div>
               </div>

               <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex gap-3">
                  <button onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors text-sm">İptal</button>
                  <button onClick={handleSaveClick} className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium shadow-lg transition-colors text-sm">
                     {isEditing ? 'Güncelle' : 'Kaydet'}
                  </button>
               </div>
            </div>
         </div>
      )}

      {/* Request Details Modal */}
      {selectedRequest && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden relative" onClick={(e) => e.stopPropagation()}>
               {/* Header */}
               <div className="p-6 border-b border-slate-800 bg-slate-900 flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        {getRequestIcon(selectedRequest.type)}
                        {getRequestLabel(selectedRequest.type)}
                    </h2>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">{selectedRequest.id}</p>
                  </div>
                  <button onClick={() => setSelectedRequest(null)} className="text-slate-400 hover:text-white transition-colors p-1 bg-slate-800 rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
               </div>

               <div className="p-6 space-y-6">
                  {/* Status & Time */}
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="text-xs text-slate-500 font-medium uppercase mb-1">Durum</p>
                        {selectedRequest.status === 'pending' ? (
                           <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              <Clock className="w-4 h-4" /> Bekliyor
                           </span>
                        ) : (
                           <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              <CheckCircle className="w-4 h-4" /> Tamamlandı
                           </span>
                        )}
                     </div>
                     <div className="text-right">
                        <p className="text-xs text-slate-500 font-medium uppercase mb-1">Talep Zamanı</p>
                        <p className="text-white font-mono text-sm">{selectedRequest.openedAt}</p>
                     </div>
                  </div>

                  {/* Resident Info */}
                  <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 flex items-center gap-4">
                     <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                        <UserCog className="w-6 h-6 text-blue-500" />
                     </div>
                     <div>
                        <h3 className="text-white font-bold text-base">{selectedRequest.residentName}</h3>
                        <p className="text-slate-400 text-sm font-mono">{selectedRequest.blockId} - {selectedRequest.unit}</p>
                        <p className="text-slate-500 text-xs mt-1 flex items-center gap-1"><Phone className="w-3 h-3" /> {selectedRequest.phone}</p>
                     </div>
                  </div>

                  {/* Note / Details */}
                  {selectedRequest.note && (
                     <div className="bg-blue-900/10 border border-blue-900/20 p-4 rounded-xl">
                        <p className="text-xs font-bold text-blue-400 uppercase mb-1">Not</p>
                        <p className="text-sm text-blue-100 italic">"{selectedRequest.note}"</p>
                     </div>
                  )}

                  {/* Completion Info */}
                  {selectedRequest.status === 'completed' && selectedRequest.completedAt && (
                     <div className="bg-emerald-900/10 border border-emerald-900/20 p-4 rounded-xl flex justify-between items-center">
                        <div>
                           <p className="text-xs font-bold text-emerald-500 uppercase mb-1">Tamamlanma Zamanı</p>
                           <p className="text-sm text-emerald-100 font-mono">{selectedRequest.completedAt}</p>
                        </div>
                        {selectedRequest.assignedJanitorId && (
                           <div className="text-right">
                              <p className="text-xs font-bold text-emerald-500 uppercase mb-1">Tamamlayan</p>
                              <p className="text-sm text-emerald-100">{getJanitor(selectedRequest.assignedJanitorId)?.name}</p>
                           </div>
                        )}
                     </div>
                  )}
               </div>

               <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex gap-3">
                  <button onClick={() => setSelectedRequest(null)} className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors text-sm">
                     Kapat
                  </button>
                  {selectedRequest.status === 'pending' && (
                     <button 
                        onClick={() => handleCompleteRequest(selectedRequest.id)}
                        className="flex-[2] px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-lg shadow-emerald-900/20 transition-colors text-sm flex items-center justify-center gap-2"
                     >
                        <CheckCircle className="w-4 h-4" /> Tamamla
                     </button>
                  )}
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
                    {confirmModal.type === 'danger' ? <AlertTriangle className="w-8 h-8" /> : <Save className="w-8 h-8" />}
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
                       onClick={confirmModal.onConfirm} 
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

export default JanitorPage;
