
import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Megaphone, Filter, MoreVertical, X, Calendar, Globe, AlertTriangle, Eye, Edit2, Trash2, CheckCircle, Clock, BarChart2, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import StatCard from './StatCards';

// Types
interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'High' | 'Medium' | 'Low';
  visibility: 'All Residents' | 'Building A' | 'Building B' | 'Building C';
  status: 'Published' | 'Scheduled' | 'Draft';
  publishDate: string;
}

// Constants
const ITEMS_PER_PAGE = 10;

// Mock Data matching the user's reference image style
const BASE_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'a1',
    title: 'Yıllık Yangın Güvenliği Denetimi',
    content: 'Tüm bloklarda yıllık yangın güvenliği denetimi yapılacaktır. Lütfen belirtilen saatlerde evde bulununuz.',
    priority: 'High',
    visibility: 'All Residents',
    status: 'Published',
    publishDate: '2024-10-26'
  },
  {
    id: 'a2',
    title: 'Havuz Bakım Çalışması',
    content: 'Açık yüzme havuzu klorlama ve filtre değişimi nedeniyle 2 gün kapalı kalacaktır.',
    priority: 'Medium',
    visibility: 'Building A',
    status: 'Scheduled',
    publishDate: '2024-10-28'
  },
  {
    id: 'a3',
    title: 'Yeni Geri Dönüşüm Programı',
    content: 'Sitemizde sıfır atık projesi kapsamında yeni geri dönüşüm kutuları yerleştirilmiştir.',
    priority: 'Low',
    visibility: 'All Residents',
    status: 'Published',
    publishDate: '2024-10-25'
  },
  {
    id: 'a4',
    title: 'Bayram Tatili Yönetim Ofisi Saatleri',
    content: 'Bayram tatili süresince yönetim ofisi kapalı olacaktır. Acil durumlar için güvenlik ile iletişime geçiniz.',
    priority: 'Medium',
    visibility: 'All Residents',
    status: 'Draft',
    publishDate: '2024-11-15'
  },
  {
    id: 'a5',
    title: 'Kargo Odası Güncellemesi',
    content: 'Kargo odası raf sistemi yenilenmiştir. Lütfen paketlerinizi alırken numara sırasına dikkat ediniz.',
    priority: 'Low',
    visibility: 'All Residents',
    status: 'Published',
    publishDate: '2024-10-22'
  }
];

// Generate additional mock data
const GENERATED_ANNOUNCEMENTS: Announcement[] = Array.from({ length: 35 }, (_, i) => ({
  id: `gen-ann-${i}`,
  title: `Site Yönetimi Duyurusu #${i + 1}`,
  content: 'Bu, sistem tarafından oluşturulan örnek bir duyuru metnidir. Site sakinlerini bilgilendirmek amaçlıdır.',
  priority: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)] as any,
  visibility: ['All Residents', 'Building A', 'Building B'][Math.floor(Math.random() * 3)] as any,
  status: ['Published', 'Scheduled', 'Draft'][Math.floor(Math.random() * 3)] as any,
  publishDate: '2024-10-10'
}));

const INITIAL_ANNOUNCEMENTS = [...BASE_ANNOUNCEMENTS, ...GENERATED_ANNOUNCEMENTS];

// --- Skeleton Components ---

const StatCardSkeleton = () => (
  <div className="relative overflow-hidden rounded-2xl p-6 border border-slate-800 bg-slate-900 h-full min-h-[160px] shadow-lg">
    <div className="flex justify-between items-start">
      <div className="space-y-3 w-full">
        <div className="h-4 w-24 bg-slate-800 rounded animate-pulse" />
        <div className="h-8 w-32 bg-slate-800 rounded animate-pulse" />
      </div>
      <div className="w-12 h-12 bg-slate-800 rounded-xl animate-pulse shrink-0" />
    </div>
    <div className="mt-6 flex gap-2">
      <div className="h-6 w-16 bg-slate-800 rounded-full animate-pulse" />
      <div className="h-6 w-24 bg-slate-800 rounded animate-pulse" />
    </div>
  </div>
);

const AnnouncementSkeletonRow = () => (
  <tr className="border-b border-slate-800/50">
    <td className="px-6 py-4">
      <div className="w-4 h-4 bg-slate-800 rounded animate-pulse" />
    </td>
    <td className="px-6 py-4">
      <div className="space-y-2">
        <div className="h-4 w-48 bg-slate-800 rounded animate-pulse" />
        <div className="h-3 w-64 bg-slate-800/50 rounded animate-pulse" />
      </div>
    </td>
    <td className="px-6 py-4">
      <div className="h-6 w-20 bg-slate-800 rounded-full animate-pulse" />
    </td>
    <td className="px-6 py-4">
      <div className="h-4 w-32 bg-slate-800 rounded animate-pulse" />
    </td>
    <td className="px-6 py-4">
      <div className="h-4 w-24 bg-slate-800 rounded animate-pulse" />
    </td>
    <td className="px-6 py-4">
      <div className="h-7 w-24 bg-slate-800 rounded-md animate-pulse" />
    </td>
    <td className="px-6 py-4 text-right">
      <div className="flex justify-end gap-2">
        <div className="w-8 h-8 bg-slate-800 rounded-lg animate-pulse" />
        <div className="w-8 h-8 bg-slate-800 rounded-lg animate-pulse" />
      </div>
    </td>
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

const AnnouncementsPage = () => {
  // Initialize with 80% chance of data, 20% chance of empty state for demo purposes
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    return Math.random() > 0.2 ? INITIAL_ANNOUNCEMENTS : [];
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');
  const [isLoading, setIsLoading] = useState(true);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState<Partial<Announcement>>({
    title: '',
    content: '',
    priority: 'Medium',
    visibility: 'All Residents',
    status: 'Draft',
    publishDate: new Date().toISOString().split('T')[0]
  });

  // Simulate Loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Reset Page on Filter Change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, filterPriority]);

  // Filter Logic
  const filteredAnnouncements = useMemo(() => {
    return announcements.filter(ann => {
      const matchesSearch = ann.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'All' || ann.status === filterStatus;
      const matchesPriority = filterPriority === 'All' || ann.priority === filterPriority;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [announcements, searchTerm, filterStatus, filterPriority]);

  // Pagination Slicing
  const paginatedAnnouncements = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAnnouncements.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAnnouncements, currentPage]);

  // Stats Logic
  const activeCount = announcements.filter(a => a.status === 'Published').length;
  const scheduledCount = announcements.filter(a => a.status === 'Scheduled').length;
  const highPriorityCount = announcements.filter(a => a.priority === 'High' && a.status === 'Published').length;

  // Actions
  const handleOpenAdd = () => {
    setIsEditing(false);
    setCurrentAnnouncement({
      title: '',
      content: '',
      priority: 'Medium',
      visibility: 'All Residents',
      status: 'Draft',
      publishDate: new Date().toISOString().split('T')[0]
    });
    setShowModal(true);
  };

  const handleOpenEdit = (ann: Announcement) => {
    setIsEditing(true);
    setCurrentAnnouncement({ ...ann });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bu duyuruyu silmek istediğinize emin misiniz?')) {
      setAnnouncements(prev => prev.filter(a => a.id !== id));
    }
  };

  const handleSave = () => {
    if (!currentAnnouncement.title || !currentAnnouncement.publishDate) return;

    if (isEditing && currentAnnouncement.id) {
      setAnnouncements(prev => prev.map(a => a.id === currentAnnouncement.id ? { ...a, ...currentAnnouncement } as Announcement : a));
    } else {
      const newAnn: Announcement = {
        ...currentAnnouncement as Announcement,
        id: `ann-${Date.now()}`
      };
      setAnnouncements([newAnn, ...announcements]);
    }
    setShowModal(false);
  };

  // Helper for Colors
  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'High': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'Medium': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Low': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      default: return 'bg-slate-800 text-slate-400';
    }
  };

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'Published': return 'bg-emerald-500/20 text-emerald-400';
      case 'Scheduled': return 'bg-blue-500/20 text-blue-400';
      case 'Draft': return 'bg-slate-700 text-slate-300';
      default: return 'bg-slate-700 text-slate-300';
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 overflow-hidden relative">
      
      {/* Header */}
      <header className="h-20 border-b border-slate-800/50 flex items-center justify-between px-8 bg-slate-950 shrink-0">
         <div className="flex items-center gap-4">
           <h1 className="text-2xl font-bold font-heading text-white tracking-tight">Topluluk Duyuruları</h1>
         </div>
         
         <div className="flex items-center gap-4">
           <button 
             onClick={handleOpenAdd}
             className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all shadow-lg shadow-blue-900/20"
           >
             <Plus className="w-4 h-4" />
             Yeni Duyuru Oluştur
           </button>
         </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
        <div className="space-y-8">
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
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
                  title="Aktif Duyurular" 
                  value={activeCount.toString()} 
                  trend="+2" 
                  trendUp={true} 
                  trendText="bu hafta"
                  variant="blue"
                  icon={Megaphone}
                />
                <StatCard 
                  title="Yüksek Öncelikli" 
                  value={highPriorityCount.toString()} 
                  trend="Acil" 
                  trendUp={true} 
                  trendText="dikkat gerektiren"
                  variant="red"
                  icon={AlertTriangle}
                />
                <StatCard 
                  title="Planlanmış" 
                  value={scheduledCount.toString()} 
                  trend="Gelecek" 
                  trendUp={true} 
                  trendText="yayın bekleyen"
                  variant="purple"
                  icon={Calendar}
                />
                <StatCard 
                  title="Toplam Erişim" 
                  value="2.4k" 
                  trend="%92" 
                  trendUp={true} 
                  trendText="okunma oranı"
                  variant="green"
                  icon={Eye}
                />
              </>
            )}
          </div>

          {/* Filters & Search & Priority Chips */}
          <div className="flex flex-col gap-4 bg-slate-900/50 p-3 rounded-xl border border-slate-800">
             
             {/* Top Row: Chips and Search */}
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* Priority Chips */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                   <span className="text-xs font-bold text-slate-500 uppercase mr-1">Öncelik:</span>
                   <button 
                      onClick={() => setFilterPriority('All')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${filterPriority === 'All' ? 'bg-slate-800 text-white border-slate-600' : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'}`}
                   >
                      Tümü
                   </button>
                   <button 
                      onClick={() => setFilterPriority('High')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border flex items-center gap-1.5 ${filterPriority === 'High' ? 'bg-red-500/20 text-red-400 border-red-500/40' : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-red-900/50 hover:text-red-400'}`}
                   >
                      <AlertTriangle className="w-3 h-3" /> Yüksek
                   </button>
                   <button 
                      onClick={() => setFilterPriority('Medium')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border flex items-center gap-1.5 ${filterPriority === 'Medium' ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-amber-900/50 hover:text-amber-400'}`}
                   >
                      <Info className="w-3 h-3" /> Orta
                   </button>
                   <button 
                      onClick={() => setFilterPriority('Low')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border flex items-center gap-1.5 ${filterPriority === 'Low' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-emerald-900/50 hover:text-emerald-400'}`}
                   >
                      <CheckCircle className="w-3 h-3" /> Düşük
                   </button>
                </div>

                {/* Search & Status Filter */}
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input 
                        type="text" 
                        placeholder="Başlığa göre ara..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500/50"
                        />
                    </div>
                    
                    <div className="relative group shrink-0">
                        <select 
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="bg-slate-900 border border-slate-800 text-slate-300 text-sm rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer hover:border-slate-700 transition-colors"
                        >
                            <option value="All">Tüm Durumlar</option>
                            <option value="Published">Yayında</option>
                            <option value="Scheduled">Planlandı</option>
                            <option value="Draft">Taslak</option>
                        </select>
                        <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
                    </div>
                </div>
             </div>
          </div>

          {/* List/Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/50 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                    <th className="px-6 py-4 w-10">
                      <input type="checkbox" className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-offset-slate-900 accent-blue-600" />
                    </th>
                    <th className="px-6 py-4">Başlık</th>
                    <th className="px-6 py-4">Öncelik</th>
                    <th className="px-6 py-4">Görünürlük</th>
                    <th className="px-6 py-4">Yayın Tarihi</th>
                    <th className="px-6 py-4">Durum</th>
                    <th className="px-6 py-4 text-right">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {isLoading ? (
                    <>
                      <AnnouncementSkeletonRow />
                      <AnnouncementSkeletonRow />
                      <AnnouncementSkeletonRow />
                      <AnnouncementSkeletonRow />
                      <AnnouncementSkeletonRow />
                    </>
                  ) : (
                    <>
                      {paginatedAnnouncements.length > 0 ? (
                        paginatedAnnouncements.map((ann) => (
                          <tr key={ann.id} className="hover:bg-slate-800/30 transition-colors group animate-in fade-in duration-300">
                            <td className="px-6 py-4">
                               <input type="checkbox" className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-offset-slate-900 accent-blue-600" />
                            </td>
                            <td className="px-6 py-4">
                               <div className="font-medium text-slate-200">{ann.title}</div>
                               <div className="text-xs text-slate-500 mt-1 line-clamp-1 max-w-xs">{ann.content}</div>
                            </td>
                            <td className="px-6 py-4">
                               <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getPriorityColor(ann.priority)}`}>
                                 {ann.priority === 'High' ? 'Yüksek' : ann.priority === 'Medium' ? 'Orta' : 'Düşük'}
                               </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-400">
                               {ann.visibility === 'All Residents' ? 'Tüm Sakinler' : ann.visibility}
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-400 font-mono">
                               {ann.publishDate}
                            </td>
                            <td className="px-6 py-4">
                               <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${getStatusColor(ann.status)}`}>
                                  {ann.status === 'Published' && <CheckCircle className="w-3 h-3" />}
                                  {ann.status === 'Scheduled' && <Clock className="w-3 h-3" />}
                                  {ann.status === 'Draft' && <Edit2 className="w-3 h-3" />}
                                  {ann.status === 'Published' ? 'Yayında' : ann.status === 'Scheduled' ? 'Planlandı' : 'Taslak'}
                               </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                               <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button 
                                    onClick={() => handleOpenEdit(ann)}
                                    className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded transition-colors"
                                  >
                                     <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={() => handleDelete(ann.id)}
                                    className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-red-400 rounded transition-colors"
                                  >
                                     <Trash2 className="w-4 h-4" />
                                  </button>
                                  <button className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded transition-colors">
                                     <MoreVertical className="w-4 h-4" />
                                  </button>
                               </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                           <td colSpan={7} className="px-6 py-20 text-center text-slate-500">
                              {announcements.length === 0 ? (
                                <div className="flex flex-col items-center justify-center max-w-md mx-auto animate-in fade-in duration-500">
                                   <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-6 ring-1 ring-slate-800 shadow-inner">
                                      <Megaphone className="w-10 h-10 text-slate-600 opacity-50" />
                                   </div>
                                   <h3 className="text-white font-bold text-xl mb-2">Henüz Duyuru Eklenmemiş</h3>
                                   <p className="text-slate-400 mb-8 leading-relaxed">
                                      Sakinleri bilgilendirmek için yeni bir duyuru oluşturun. Planlanmış bakım çalışmaları, toplantılar veya genel bilgilendirmeler paylaşabilirsiniz.
                                   </p>
                                   <button 
                                     onClick={handleOpenAdd}
                                     className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg shadow-blue-900/20 transition-all hover:scale-105 flex items-center gap-2"
                                   >
                                     <Plus className="w-4 h-4" />
                                     İlk Duyuruyu Oluştur
                                   </button>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center">
                                   <Filter className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                   <p className="text-lg font-medium text-slate-400">Aradığınız kriterlere uygun duyuru bulunamadı.</p>
                                   <button onClick={() => {setSearchTerm(''); setFilterStatus('All'); setFilterPriority('All');}} className="mt-4 text-blue-400 hover:text-blue-300 underline font-medium">Filtreleri Temizle</button>
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
          </div>
          
          {!isLoading && (
            <PaginationControls 
                totalItems={filteredAnnouncements.length}
                itemsPerPage={ITEMS_PER_PAGE}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
             <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                   {isEditing ? <Edit2 className="w-5 h-5 text-blue-500" /> : <Megaphone className="w-5 h-5 text-blue-500" />}
                   {isEditing ? 'Duyuruyu Düzenle' : 'Yeni Duyuru Oluştur'}
                </h2>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
             </div>
             
             <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh] custom-scrollbar">
                
                <div className="space-y-2">
                   <label className="text-xs font-medium text-slate-400 uppercase">Duyuru Başlığı</label>
                   <input 
                      type="text" 
                      value={currentAnnouncement.title}
                      onChange={(e) => setCurrentAnnouncement({...currentAnnouncement, title: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-slate-600"
                      placeholder="Örn: Su Kesintisi Hakkında"
                   />
                </div>

                <div className="space-y-2">
                   <label className="text-xs font-medium text-slate-400 uppercase">İçerik</label>
                   <textarea 
                      value={currentAnnouncement.content}
                      onChange={(e) => setCurrentAnnouncement({...currentAnnouncement, content: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-slate-600 h-32 resize-none"
                      placeholder="Duyuru detaylarını buraya yazınız..."
                   />
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <label className="text-xs font-medium text-slate-400 uppercase">Öncelik</label>
                      <select 
                         value={currentAnnouncement.priority}
                         onChange={(e) => setCurrentAnnouncement({...currentAnnouncement, priority: e.target.value as any})}
                         className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer"
                      >
                         <option value="High">Yüksek (Acil)</option>
                         <option value="Medium">Orta</option>
                         <option value="Low">Düşük</option>
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-medium text-slate-400 uppercase">Durum</label>
                      <select 
                         value={currentAnnouncement.status}
                         onChange={(e) => setCurrentAnnouncement({...currentAnnouncement, status: e.target.value as any})}
                         className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer"
                      >
                         <option value="Published">Hemen Yayınla</option>
                         <option value="Scheduled">Planla</option>
                         <option value="Draft">Taslak Olarak Kaydet</option>
                      </select>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <label className="text-xs font-medium text-slate-400 uppercase">Hedef Kitle</label>
                      <div className="relative">
                         <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                         <select 
                            value={currentAnnouncement.visibility}
                            onChange={(e) => setCurrentAnnouncement({...currentAnnouncement, visibility: e.target.value as any})}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-3 py-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer"
                         >
                            <option value="All Residents">Tüm Sakinler</option>
                            <option value="Building A">A Blok Sakinleri</option>
                            <option value="Building B">B Blok Sakinleri</option>
                            <option value="Building C">C Blok Sakinleri</option>
                         </select>
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-medium text-slate-400 uppercase">Yayın Tarihi</label>
                      <div className="relative">
                         <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                         <input 
                            type="date" 
                            value={currentAnnouncement.publishDate}
                            onChange={(e) => setCurrentAnnouncement({...currentAnnouncement, publishDate: e.target.value})}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-3 py-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 [color-scheme:dark]"
                         />
                      </div>
                   </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-start gap-3">
                   <AlertTriangle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                   <p className="text-xs text-blue-200 leading-relaxed">
                      "Hemen Yayınla" seçeneği işaretlendiğinde, duyuru anında tüm hedef kitleye mobil bildirim olarak gönderilecektir.
                   </p>
                </div>
             </div>

             <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex gap-3">
                <button 
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors text-sm"
                >
                  İptal
                </button>
                <button 
                  onClick={handleSave}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium shadow-lg shadow-blue-900/20 transition-colors text-sm"
                >
                  {isEditing ? 'Güncelle' : 'Oluştur'}
                </button>
             </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AnnouncementsPage;
