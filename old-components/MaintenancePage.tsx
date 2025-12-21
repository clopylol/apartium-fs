
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Plus, LayoutList, LayoutGrid, Eye, MoreVertical, X, Calendar, MapPin, Tag, Clock, Upload, ArrowUpDown, Filter, PlayCircle, CheckCircle, AlertCircle, Wrench, Timer, Activity, ChevronLeft, ChevronRight } from 'lucide-react';
import StatCard from './StatCards';

const ITEMS_PER_PAGE = 10;

const BASE_REQUESTS = [
  { id: '#1024', title: 'Mutfak lavabosu su kaçırıyor', user: 'Zeynep Kaya', unit: '4B', category: 'Tesisat', date: '2024-07-21', priority: 'Urgent', status: 'In Progress', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&h=64' },
  { id: '#1023', title: 'Pencere mandalı kırık', user: 'Murat Demir', unit: '12C', category: 'Genel', date: '2024-07-20', priority: 'Medium', status: 'Completed', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=64&h=64' },
  { id: '#1022', title: 'Klima soğutmuyor', user: 'Ayşe Yılmaz', unit: '8A', category: 'Isıtma/Soğutma', date: '2024-07-20', priority: 'High', status: 'New', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=64&h=64' },
  { id: '#1021', title: 'Yatak odası prizi çalışmıyor', user: 'Caner Erkin', unit: '2D', category: 'Elektrik', date: '2024-07-19', priority: 'Low', status: 'Completed', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&h=64' },
  { id: '#1020', title: 'Koridor ışığı yanıp sönüyor', user: 'Selin Tekin', unit: '5B', category: 'Elektrik', date: '2024-07-18', priority: 'Low', status: 'New', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=64&h=64' },
  { id: '#1019', title: 'Banyo gideri tıkalı', user: 'Mehmet Öz', unit: '1A', category: 'Tesisat', date: '2024-07-15', priority: 'High', status: 'New', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=64&h=64' },
];

// Generate more mock data for pagination
const GENERATED_REQUESTS = Array.from({ length: 35 }, (_, i) => {
  const priorities = ['Low', 'Medium', 'High', 'Urgent'];
  const statuses = ['New', 'In Progress', 'Completed'];
  const categories = ['Tesisat', 'Elektrik', 'Isıtma/Soğutma', 'Genel'];
  
  return {
    id: `#${1000 - i}`,
    title: `Otomatik Bakım Kaydı ${i + 1}`,
    user: `Sakin ${i + 1}`,
    unit: `${Math.floor(Math.random() * 20) + 1}${['A', 'B', 'C'][Math.floor(Math.random() * 3)]}`,
    category: categories[Math.floor(Math.random() * categories.length)],
    date: `2024-06-${String(Math.floor(Math.random() * 30) + 1).padStart(2, '0')}`,
    priority: priorities[Math.floor(Math.random() * priorities.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    avatar: `https://ui-avatars.com/api/?name=Sakin+${i}&background=random&color=fff`
  };
});

const INITIAL_REQUESTS = [...BASE_REQUESTS, ...GENERATED_REQUESTS];

// --- Skeleton Components ---

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

const MaintenanceCardSkeleton = () => (
  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between h-[220px] animate-pulse">
    <div>
      <div className="flex justify-between items-start mb-4">
        <div className="h-6 w-20 bg-slate-800 rounded-full" />
        <div className="h-6 w-16 bg-slate-800 rounded" />
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-6 w-3/4 bg-slate-800 rounded" />
        <div className="h-4 w-1/3 bg-slate-800 rounded" />
      </div>
      <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-slate-950/50 border border-slate-800/50">
        <div className="w-10 h-10 rounded-full bg-slate-800 shrink-0" />
        <div className="space-y-2 w-full">
          <div className="h-4 w-24 bg-slate-800 rounded" />
          <div className="h-3 w-16 bg-slate-800 rounded" />
        </div>
      </div>
    </div>
    <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
      <div className="h-4 w-20 bg-slate-800 rounded" />
      <div className="h-6 w-12 bg-slate-800 rounded" />
    </div>
  </div>
);

const MaintenanceRowSkeleton = () => (
  <tr className="border-b border-slate-800/50 animate-pulse">
    <td className="p-4"><div className="h-4 w-12 bg-slate-800 rounded" /></td>
    <td className="p-4"><div className="h-5 w-48 bg-slate-800 rounded" /></td>
    <td className="p-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-slate-800 shrink-0" />
        <div className="space-y-1">
          <div className="h-4 w-24 bg-slate-800 rounded" />
          <div className="h-3 w-16 bg-slate-800 rounded" />
        </div>
      </div>
    </td>
    <td className="p-4"><div className="h-4 w-20 bg-slate-800 rounded" /></td>
    <td className="p-4"><div className="h-4 w-24 bg-slate-800 rounded" /></td>
    <td className="p-4"><div className="h-6 w-20 bg-slate-800 rounded-full" /></td>
    <td className="p-4"><div className="h-6 w-20 bg-slate-800 rounded-full" /></td>
    <td className="p-4 text-right"><div className="h-8 w-8 bg-slate-800 rounded ml-auto" /></td>
  </tr>
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

const MaintenancePage = () => {
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // View Mode State
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Filter & Sort States
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  // Requests Data State
  const [requests, setRequests] = useState<typeof INITIAL_REQUESTS>([]);

  // Simulate Loading
  useEffect(() => {
    const timer = setTimeout(() => {
      const hasData = Math.random() > 0.1; // 90% chance of data
      setRequests(hasData ? INITIAL_REQUESTS : []);
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Reset Pagination on Filter Change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterCategory, filterPriority, filterStatus]);

  // Handle Status Update
  const handleStatusUpdate = (id: string, newStatus: string) => {
    // Update main list
    setRequests(prevRequests => 
      prevRequests.map(req => 
        req.id === id ? { ...req, status: newStatus } : req
      )
    );

    // Update selected request view if it's the same one
    if (selectedRequest && selectedRequest.id === id) {
      setSelectedRequest({ ...selectedRequest, status: newStatus });
    }
  };

  // Derived State: Filtered & Sorted Requests
  const filteredRequests = useMemo(() => {
    return requests.filter(req => {
      const matchesSearch = 
        req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = filterCategory === 'All' || req.category === filterCategory;
      const matchesPriority = filterPriority === 'All' || req.priority === filterPriority;
      const matchesStatus = filterStatus === 'All' || req.status === filterStatus;

      return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
    }).sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }, [requests, searchTerm, filterCategory, filterPriority, filterStatus, sortOrder]);

  // Pagination Slicing
  const paginatedRequests = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRequests.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredRequests, currentPage]);

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'Urgent': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'High': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };
  
  const getPriorityLabel = (p: string) => {
      switch (p) {
      case 'Urgent': return 'Acil';
      case 'High': return 'Yüksek';
      case 'Medium': return 'Orta';
      default: return 'Düşük';
    }
  };

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'In Progress': return 'bg-amber-500/20 text-amber-400';
      case 'Completed': return 'bg-emerald-500/20 text-emerald-400';
      case 'New': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-slate-700 text-slate-300';
    }
  };
  
  const getStatusLabel = (s: string) => {
      switch (s) {
      case 'In Progress': return 'İşleniyor';
      case 'Completed': return 'Tamamlandı';
      case 'New': return 'Yeni';
      default: return s;
    }
  };

  // Helper to check if any filter is active
  const isFilterActive = searchTerm !== '' || filterStatus !== 'All' || filterPriority !== 'All' || filterCategory !== 'All';

  return (
    <div className="flex h-full relative overflow-hidden">
      {/* Main List Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden transition-all duration-300">
        
        {/* Header */}
        <header className="h-20 border-b border-slate-800/50 flex items-center justify-between px-8 bg-slate-950 shrink-0">
           <div className="flex items-center gap-4">
             <h1 className="text-2xl font-bold font-heading text-white">Bakım & Destek</h1>
           </div>
           
           <div className="flex items-center gap-4">
             {/* Create Button - Moved to Header */}
             <button 
                onClick={() => setShowNewRequest(true)}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all shadow-lg shadow-blue-900/20 mr-2"
               >
                 <Plus className="w-4 h-4" />
                 <span className="hidden md:inline">Talep Oluştur</span>
               </button>

             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Ara..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 w-64 placeholder-slate-500"
                />
             </div>
             <div className="flex items-center gap-3">
                <button className="p-2 text-slate-400 hover:text-white transition-colors">
                  <span className="sr-only">Bildirimler</span>
                  <div className="w-2 h-2 bg-red-500 rounded-full absolute ml-3 mb-3"></div>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                </button>
                <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=64&h=64" className="w-9 h-9 rounded-full border border-slate-700" alt="Profile" />
             </div>
           </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          
          {/* Top Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            {isLoading ? (
                <>
                    <StatCardSkeleton />
                    <StatCardSkeleton />
                    <StatCardSkeleton />
                    <StatCardSkeleton />
                </>
            ) : (
                <>
                    <StatCard 
                    title="Açık Talepler" 
                    value={requests.filter(r => r.status !== 'Completed').length.toString()} 
                    trend="+3" 
                    trendUp={true} 
                    trendText="geçen haftaya göre"
                    variant="blue"
                    icon={Wrench}
                    />
                    <StatCard 
                    title="Acil Durumlar" 
                    value={requests.filter(r => r.priority === 'Urgent' && r.status !== 'Completed').length.toString()} 
                    trend="-1" 
                    trendUp={true} 
                    trendText="bekleyen kayıt"
                    variant="red"
                    icon={AlertCircle}
                    />
                    <StatCard 
                    title="Tamamlanan" 
                    value={requests.filter(r => r.status === 'Completed').length.toString()} 
                    trend="+8" 
                    trendUp={true} 
                    trendText="bu ay"
                    variant="green"
                    icon={CheckCircle}
                    />
                    <StatCard 
                    title="Ort. Çözüm Süresi" 
                    value="24sa" 
                    trend="-4sa" 
                    trendUp={true} 
                    trendText="iyileşme"
                    variant="purple"
                    icon={Timer}
                    />
                </>
            )}
          </div>

          {/* Filters & Controls */}
          <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-slate-400 text-sm mr-2">
                <Filter className="w-4 h-4" />
                <span>Filtrele:</span>
              </div>
              
              {/* Status Filter */}
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-slate-900 text-slate-300 border border-slate-700 rounded-lg text-sm font-medium px-3 py-2 hover:border-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option value="All">Tüm Durumlar</option>
                <option value="New">Yeni</option>
                <option value="In Progress">İşleniyor</option>
                <option value="Completed">Tamamlandı</option>
              </select>

              {/* Priority Filter */}
              <select 
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="bg-slate-900 text-slate-300 border border-slate-700 rounded-lg text-sm font-medium px-3 py-2 hover:border-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option value="All">Tüm Öncelikler</option>
                <option value="Low">Düşük</option>
                <option value="Medium">Orta</option>
                <option value="High">Yüksek</option>
                <option value="Urgent">Acil</option>
              </select>

              {/* Category Filter */}
              <select 
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-slate-900 text-slate-300 border border-slate-700 rounded-lg text-sm font-medium px-3 py-2 hover:border-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option value="All">Tüm Kategoriler</option>
                <option value="Tesisat">Tesisat</option>
                <option value="Elektrik">Elektrik</option>
                <option value="Isıtma/Soğutma">Isıtma/Soğutma</option>
                <option value="Genel">Genel</option>
              </select>

              {/* Reset Filters Button (only shows if filters are active) */}
              {isFilterActive && (
                <button 
                  onClick={() => {
                    setFilterStatus('All');
                    setFilterPriority('All');
                    setFilterCategory('All');
                    setSearchTerm('');
                  }}
                  className="text-xs text-red-400 hover:text-red-300 underline underline-offset-2 ml-2"
                >
                  Temizle
                </button>
              )}
            </div>

            <div className="bg-slate-900 p-1 rounded-lg border border-slate-800 flex">
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-all ${viewMode === 'list' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                title="Liste Görünümü"
              >
                <LayoutList className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-all ${viewMode === 'grid' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                title="Kart Görünümü"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* View Content */}
          {viewMode === 'list' ? (
            // LIST VIEW
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-950/50 border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                    <th className="p-4 font-semibold">ID</th>
                    <th className="p-4 font-semibold">Başlık</th>
                    <th className="p-4 font-semibold">Talep Eden</th>
                    <th className="p-4 font-semibold">Kategori</th>
                    <th 
                      className="p-4 font-semibold cursor-pointer hover:text-white transition-colors group flex items-center gap-1"
                      onClick={toggleSortOrder}
                    >
                      Tarih
                      <ArrowUpDown className={`w-3 h-3 transition-opacity ${sortOrder ? 'opacity-100' : 'opacity-50'}`} />
                    </th>
                    <th className="p-4 font-semibold">Öncelik</th>
                    <th className="p-4 font-semibold">Durum</th>
                    <th className="p-4 font-semibold text-right">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {isLoading ? (
                      <>
                        <MaintenanceRowSkeleton />
                        <MaintenanceRowSkeleton />
                        <MaintenanceRowSkeleton />
                        <MaintenanceRowSkeleton />
                        <MaintenanceRowSkeleton />
                      </>
                  ) : (
                      <>
                        {paginatedRequests.length > 0 ? (
                            paginatedRequests.map((req) => (
                            <tr key={req.id} className="hover:bg-slate-800/30 transition-colors group animate-in fade-in duration-300">
                                <td className="p-4 text-slate-500 font-mono text-sm">{req.id}</td>
                                <td className="p-4 font-medium text-slate-200">{req.title}</td>
                                <td className="p-4">
                                <div className="flex items-center gap-3">
                                    <img src={req.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                                    <div>
                                    <div className="text-sm font-medium text-slate-200">{req.user}</div>
                                    <div className="text-xs text-slate-500">Daire {req.unit}</div>
                                    </div>
                                </div>
                                </td>
                                <td className="p-4 text-slate-400 text-sm">{req.category}</td>
                                <td className="p-4 text-slate-500 text-sm">{req.date}</td>
                                <td className="p-4">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getPriorityColor(req.priority)}`}>
                                    {getPriorityLabel(req.priority)}
                                </span>
                                </td>
                                <td className="p-4">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(req.status)}`}>
                                    {getStatusLabel(req.status)}
                                </span>
                                </td>
                                <td className="p-4 text-right">
                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => setSelectedRequest(req)}
                                        className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-blue-400 transition-colors"
                                        title="Detaylar"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <button className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors"><MoreVertical className="w-4 h-4" /></button>
                                </div>
                                </td>
                            </tr>
                            ))
                        ) : (
                            <tr>
                            <td colSpan={8} className="p-12 text-center text-slate-500">
                                {requests.length === 0 ? (
                                    <div className="flex flex-col items-center">
                                    <Wrench className="w-12 h-12 mb-4 opacity-20" />
                                    <h3 className="text-white font-bold text-lg mb-1">Henüz Bakım Talebi Yok</h3>
                                    <p className="text-slate-400 mb-6 max-w-sm">
                                        Şu an sistemde kayıtlı bir arıza veya bakım talebi bulunmuyor. Yeni bir talep oluşturmak için aşağıdaki butonu kullanabilirsiniz.
                                    </p>
                                    <button 
                                        onClick={() => setShowNewRequest(true)}
                                        className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl text-sm font-medium shadow-lg shadow-blue-900/20"
                                    >
                                        İlk Talebi Oluştur
                                    </button>
                                    </div>
                                ) : (
                                    <div>
                                    <Search className="w-10 h-10 mx-auto mb-3 opacity-20" />
                                    <p>Arama kriterlerine uygun kayıt bulunamadı.</p>
                                    <button onClick={() => {setSearchTerm(''); setFilterStatus('All'); setFilterPriority('All'); setFilterCategory('All');}} className="mt-2 text-blue-400 hover:text-blue-300 underline font-medium text-sm">Filtreleri Temizle</button>
                                    </div>
                                )}
                            </td>
                            </tr>
                        )}
                      </>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            // GRID VIEW
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {isLoading ? (
                    <>
                        <MaintenanceCardSkeleton />
                        <MaintenanceCardSkeleton />
                        <MaintenanceCardSkeleton />
                        <MaintenanceCardSkeleton />
                        <MaintenanceCardSkeleton />
                        <MaintenanceCardSkeleton />
                        <MaintenanceCardSkeleton />
                        <MaintenanceCardSkeleton />
                    </>
                ) : (
                    <>
                        {paginatedRequests.length > 0 ? (
                            paginatedRequests.map((req) => (
                            <div 
                                key={req.id} 
                                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-blue-500/30 transition-all group flex flex-col justify-between animate-in fade-in duration-300"
                            >
                                <div>
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getPriorityColor(req.priority)}`}>
                                    {getPriorityLabel(req.priority)}
                                    </span>
                                    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide ${
                                        req.status === 'New' ? 'bg-blue-500/10 text-blue-400' : 
                                        req.status === 'In Progress' ? 'bg-amber-500/10 text-amber-400' :
                                        'bg-emerald-500/10 text-emerald-400'
                                    }`}>
                                    {req.status === 'New' ? 'YENİ' : req.status === 'In Progress' ? 'İŞLENİYOR' : 'BİTTİ'}
                                    </span>
                                </div>
                                
                                <div className="mb-4">
                                    <h3 className="text-white font-bold text-lg leading-tight mb-1 group-hover:text-blue-400 transition-colors cursor-pointer" onClick={() => setSelectedRequest(req)}>{req.title}</h3>
                                    <div className="flex items-center gap-2 text-slate-500 text-xs">
                                    <Tag className="w-3 h-3" />
                                    {req.category}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-slate-950/50 border border-slate-800/50">
                                    <img src={req.avatar} alt="" className="w-10 h-10 rounded-full object-cover border border-slate-700" />
                                    <div>
                                    <div className="text-sm font-medium text-slate-200">{req.user}</div>
                                    <div className="text-xs text-slate-500 flex items-center gap-1">
                                        <MapPin className="w-3 h-3" /> Daire {req.unit}
                                    </div>
                                    </div>
                                </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-800/50 text-xs text-slate-500">
                                <div className="flex items-center gap-1.5 font-medium">
                                    <Clock className="w-3.5 h-3.5" />
                                    {req.date}
                                </div>
                                <div className="flex gap-2">
                                    <span className="font-mono opacity-50">{req.id}</span>
                                    <button 
                                    onClick={() => setSelectedRequest(req)}
                                    className="hover:text-white transition-colors"
                                    >
                                    <Eye className="w-4 h-4" />
                                    </button>
                                </div>
                                </div>
                            </div>
                            ))
                        ) : (
                            <div className="col-span-full flex flex-col items-center justify-center p-12 text-slate-500 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/20">
                            {requests.length === 0 ? (
                                <>
                                    <Wrench className="w-12 h-12 mb-4 opacity-20" />
                                    <h3 className="text-white font-bold text-lg mb-1">Henüz Bakım Talebi Yok</h3>
                                    <p className="text-slate-400 mb-6 max-w-sm text-center">
                                    Şu an sistemde kayıtlı bir arıza veya bakım talebi bulunmuyor.
                                    </p>
                                    <button 
                                    onClick={() => setShowNewRequest(true)}
                                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl text-sm font-medium shadow-lg shadow-blue-900/20"
                                    >
                                    İlk Talebi Oluştur
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Search className="w-12 h-12 mb-4 opacity-20" />
                                    <p>Kriterlere uygun kayıt bulunamadı.</p>
                                    <button onClick={() => {setSearchTerm(''); setFilterStatus('All'); setFilterPriority('All'); setFilterCategory('All');}} className="mt-2 text-blue-400 hover:text-blue-300 underline font-medium text-sm">Filtreleri Temizle</button>
                                </>
                            )}
                            </div>
                        )}
                    </>
                )}
            </div>
          )}

          {/* Pagination Controls */}
          {!isLoading && (
            <PaginationControls 
                totalItems={filteredRequests.length}
                itemsPerPage={ITEMS_PER_PAGE}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
            />
          )}

        </div>
      </div>

      {/* Right Slide-over Panel (New Request) */}
      <div className={`w-[400px] bg-slate-900 border-l border-slate-800 flex flex-col transition-all duration-300 absolute right-0 top-0 bottom-0 shadow-2xl z-20 ${showNewRequest ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800 shrink-0">
          <h2 className="text-lg font-bold font-heading text-white">Yeni Bakım Talebi</h2>
          <button onClick={() => setShowNewRequest(false)} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Başlık</label>
            <input 
              type="text" 
              placeholder="Örn: Mutfak lavabosu damlatıyor"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder-slate-600"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Öncelik</label>
            <div className="grid grid-cols-4 gap-2">
              {['Düşük', 'Orta', 'Yüksek', 'Acil'].map((p) => (
                <button key={p} className={`py-2 rounded-lg text-xs font-medium border transition-all ${p === 'Acil' ? 'bg-red-500/20 text-red-400 border-red-500/50 hover:bg-red-500/30' : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-600'}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Kategori</label>
            <div className="relative">
              <select className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none cursor-pointer">
                <option>Tesisat</option>
                <option>Elektrik</option>
                <option>Isıtma & Soğutma</option>
                <option>Genel</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Fotoğraf Ekle</label>
            <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-slate-500 hover:bg-slate-800/30 transition-all cursor-pointer group">
              <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6 text-blue-400" />
              </div>
              <p className="text-blue-400 font-medium text-sm">Dosya Yükle</p>
              <p className="text-slate-500 text-xs mt-1">veya sürükle bırak<br/>PNG, JPG (max 5MB)</p>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-800 flex justify-end gap-3 bg-slate-900">
          <button onClick={() => setShowNewRequest(false)} className="px-6 py-2.5 rounded-xl font-medium text-slate-300 hover:bg-slate-800 transition-colors">İptal</button>
          <button className="px-6 py-2.5 rounded-xl font-medium bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20 transition-all">Talep Oluştur</button>
        </div>
      </div>
      
      {/* Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm transition-all" onClick={() => setSelectedRequest(null)}>
          <div 
            className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-200" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-slate-800 bg-slate-900/50">
                <div>
                   <h3 className="text-xl font-bold font-heading text-white flex items-center gap-2">
                     Talep Detayları
                     <span className="text-slate-500 text-base font-normal font-sans">{selectedRequest.id}</span>
                   </h3>
                </div>
                <button onClick={() => setSelectedRequest(null)} className="text-slate-400 hover:text-white transition-colors bg-slate-800 p-1 rounded-lg hover:bg-slate-700">
                    <X className="w-5 h-5"/>
                </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 space-y-6">
                
                {/* Issue Header */}
                <div>
                    <div className="flex justify-between items-start gap-4 mb-2">
                          <h4 className="text-lg font-semibold text-slate-100 leading-tight">{selectedRequest.title}</h4>
                          <span className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-medium border ${getPriorityColor(selectedRequest.priority)}`}>
                            {getPriorityLabel(selectedRequest.priority)}
                          </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <Tag className="w-4 h-4 text-blue-400" />
                        <span>{selectedRequest.category}</span>
                    </div>
                </div>

                {/* User Card */}
                <div className="bg-slate-950/50 rounded-xl p-4 flex items-center gap-4 border border-slate-800/50">
                    <img src={selectedRequest.avatar} className="w-12 h-12 rounded-full ring-2 ring-slate-800" alt="User" />
                    <div>
                        <p className="text-white font-medium text-base">{selectedRequest.user}</p>
                        <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                            <span className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-800 rounded text-slate-300">
                              <MapPin className="w-3.5 h-3.5" /> Daire {selectedRequest.unit}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-800/50">
                        <p className="text-slate-500 text-xs font-medium mb-1 uppercase tracking-wide">Oluşturulma</p>
                        <div className="flex items-center gap-2 text-slate-200 text-sm font-medium">
                            <Clock className="w-4 h-4 text-slate-400" />
                            {selectedRequest.date}
                        </div>
                    </div>
                    <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-800/50">
                        <p className="text-slate-500 text-xs font-medium mb-1 uppercase tracking-wide">Durum</p>
                          <div className="flex items-center gap-2 text-slate-200 text-sm font-medium">
                            <span className={`w-2.5 h-2.5 rounded-full ${getStatusColor(selectedRequest.status).split(' ')[0].replace('/20', '')}`}></span>
                            {getStatusLabel(selectedRequest.status)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/30 flex justify-end gap-3">
                <button 
                  onClick={() => setSelectedRequest(null)} 
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                    Kapat
                </button>
                
                {/* Dynamic Status Action Buttons */}
                {selectedRequest.status === 'New' && (
                  <button 
                     onClick={() => handleStatusUpdate(selectedRequest.id, 'In Progress')}
                     className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-amber-900/20 flex items-center gap-2"
                  >
                      <PlayCircle className="w-4 h-4" />
                      İşleme Al
                  </button>
                )}
                
                {selectedRequest.status === 'In Progress' && (
                  <button 
                     onClick={() => handleStatusUpdate(selectedRequest.id, 'Completed')}
                     className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-emerald-900/20 flex items-center gap-2"
                  >
                      <CheckCircle className="w-4 h-4" />
                      Tamamla
                  </button>
                )}

                <button 
                   className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-900/20"
                >
                    Düzenle
                </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Overlay backdrop when new request panel is open */}
      {showNewRequest && (
        <div 
          onClick={() => setShowNewRequest(false)}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm z-10 transition-opacity duration-300"
        ></div>
      )}
    </div>
  );
};

export default MaintenancePage;
