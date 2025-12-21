
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Plus, MessageSquare, BarChart2, ThumbsUp, ThumbsDown, Clock, CheckCircle, X, User, MoreVertical, Trash2, PlayCircle, AlertCircle, Bell, CheckSquare, Square, PieChart, Send, Calendar, AlertTriangle, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import StatCard from './StatCards';

// --- Constants ---
const ITEMS_PER_PAGE = 10;

// --- Types ---
interface Request {
  id: string;
  type: 'wish' | 'suggestion';
  title: string;
  description: string;
  author: string;
  unit: string;
  date: string;
  status: 'pending' | 'in-progress' | 'resolved' | 'rejected';
}

interface Vote {
  residentId: string;
  residentName: string;
  choice: 'yes' | 'no';
  timestamp: string;
}

interface Poll {
  id: string;
  title: string;
  description: string;
  author: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'closed';
  votes: Vote[];
}

interface ResidentMock {
  id: string;
  name: string;
  unit: string;
}

// --- Mock Data ---
const MOCK_RESIDENTS: ResidentMock[] = [
  { id: 'r1', name: 'Ahmet Yılmaz', unit: 'A-1' },
  { id: 'r2', name: 'Mehmet Demir', unit: 'A-2' },
  { id: 'r3', name: 'Ayşe Kaya', unit: 'A-3' },
  { id: 'r4', name: 'Caner Erkin', unit: 'B-1' },
  { id: 'r5', name: 'Zeynep Su', unit: 'B-2' },
  { id: 'r6', name: 'Selin Yılmaz', unit: 'C-1' },
  { id: 'r7', name: 'Ali Veli', unit: 'C-2' },
];

const INITIAL_REQUESTS: Request[] = [
  { id: 'req-1', type: 'suggestion', title: 'Bisiklet Park Yeri', description: 'B Blok girişine kapalı bisiklet park yeri yapılmasını öneriyorum. Çocukların bisikletleri dışarıda paslanıyor.', author: 'Zeynep Su', unit: 'B-2', date: '2024-10-25', status: 'pending' },
  { id: 'req-2', type: 'wish', title: 'Kamelya İsteği', description: 'Arka bahçeye ek bir kamelya konulmasını rica ediyoruz, mevcut olan yetersiz kalıyor.', author: 'Mehmet Demir', unit: 'A-2', date: '2024-10-24', status: 'in-progress' },
  { id: 'req-3', type: 'suggestion', title: 'Çardak Yenilemesi', description: 'Bahçedeki çardakların boyanması ve ışıklandırılması güzel olurdu.', author: 'Ayşe Kaya', unit: 'A-3', date: '2024-10-20', status: 'resolved' },
];

const GENERATED_REQUESTS: Request[] = Array.from({ length: 45 }, (_, i) => ({
  id: `gen-req-${i}`,
  type: Math.random() > 0.5 ? 'wish' : 'suggestion',
  title: `Otomatik Talep Başlığı ${i + 1}`,
  description: `Site yönetimi için oluşturulmuş otomatik talep veya öneri metni. Detaylar burada yer alır #${i + 1}.`,
  author: `Sakin ${i + 1}`,
  unit: `${['A', 'B', 'C'][Math.floor(Math.random() * 3)]}-${Math.floor(Math.random() * 10) + 1}`,
  date: '2024-10-15',
  status: ['pending', 'in-progress', 'resolved', 'rejected'][Math.floor(Math.random() * 4)] as any
}));

const INITIAL_POLLS: Poll[] = [
  {
    id: 'poll-1',
    title: 'Dış Cephe Mantolama Kararı',
    description: 'Yönetim toplantısında görüşülen A Blok dış cephe mantolama işlemi için Filli Boya firmasından alınan 450.000₺\'lik teklifin kabulünü oylarınıza sunuyoruz.',
    author: 'Yönetim',
    startDate: '2024-10-26',
    endDate: '2024-11-05',
    status: 'active',
    votes: [
      { residentId: 'r1', residentName: 'Ahmet Yılmaz', choice: 'yes', timestamp: '2024-10-26 10:00' },
      { residentId: 'r2', residentName: 'Mehmet Demir', choice: 'no', timestamp: '2024-10-26 11:30' },
      { residentId: 'r4', residentName: 'Caner Erkin', choice: 'yes', timestamp: '2024-10-26 12:45' },
    ]
  },
  {
    id: 'poll-2',
    title: 'Havuz Kapanış Saati Değişikliği',
    description: 'Havuzun kapanış saatinin 22:00\'dan 23:00\'a uzatılması önerisi.',
    author: 'Zeynep Su',
    startDate: '2024-10-20',
    endDate: '2024-10-25',
    status: 'closed',
    votes: [
      { residentId: 'r1', residentName: 'Ahmet Yılmaz', choice: 'no', timestamp: '2024-10-20' },
      { residentId: 'r2', residentName: 'Mehmet Demir', choice: 'yes', timestamp: '2024-10-20' },
      { residentId: 'r3', residentName: 'Ayşe Kaya', choice: 'yes', timestamp: '2024-10-21' },
      { residentId: 'r5', residentName: 'Zeynep Su', choice: 'yes', timestamp: '2024-10-21' },
      { residentId: 'r6', residentName: 'Selin Yılmaz', choice: 'no', timestamp: '2024-10-22' },
    ]
  }
];

const GENERATED_POLLS: Poll[] = Array.from({ length: 35 }, (_, i) => ({
  id: `gen-poll-${i}`,
  title: `Genel Kurul Kararı Oylaması #${i + 1}`,
  description: `Site bütçesi ve gelecek dönem planlamaları hakkında alınan kararların onaylanması.`,
  author: 'Yönetim',
  startDate: '2024-09-01',
  endDate: '2024-09-10',
  status: Math.random() > 0.3 ? 'closed' : 'active',
  votes: Array.from({ length: Math.floor(Math.random() * 30) }, (_, j) => ({
      residentId: `r-${j}`,
      residentName: `Sakin ${j}`,
      choice: Math.random() > 0.5 ? 'yes' : 'no',
      timestamp: '2024-09-02'
  }))
}));

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

const RequestRowSkeleton = () => (
  <tr className="border-b border-slate-800/50 animate-pulse">
    <td className="px-6 py-4">
      <div className="space-y-2">
        <div className="h-5 w-32 bg-slate-800 rounded" />
        <div className="h-3 w-48 bg-slate-800 rounded" />
      </div>
    </td>
    <td className="px-6 py-4"><div className="h-6 w-16 bg-slate-800 rounded-md" /></td>
    <td className="px-6 py-4">
      <div className="space-y-2">
        <div className="h-4 w-24 bg-slate-800 rounded" />
        <div className="h-3 w-16 bg-slate-800 rounded" />
      </div>
    </td>
    <td className="px-6 py-4"><div className="h-4 w-20 bg-slate-800 rounded" /></td>
    <td className="px-6 py-4"><div className="h-6 w-20 bg-slate-800 rounded-md" /></td>
    <td className="px-6 py-4 text-right"><div className="h-8 w-24 bg-slate-800 rounded-lg ml-auto" /></td>
  </tr>
);

const PollCardSkeleton = () => (
  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 animate-pulse h-[280px] flex flex-col">
    <div className="flex justify-between items-start mb-4">
      <div className="space-y-3 w-3/4">
        <div className="h-6 w-3/4 bg-slate-800 rounded" />
        <div className="h-4 w-full bg-slate-800 rounded" />
        <div className="h-4 w-2/3 bg-slate-800 rounded" />
      </div>
      <div className="h-6 w-16 bg-slate-800 rounded-full" />
    </div>
    <div className="flex-1 space-y-3 my-4">
      <div className="flex justify-between">
        <div className="h-4 w-12 bg-slate-800 rounded" />
        <div className="h-4 w-12 bg-slate-800 rounded" />
      </div>
      <div className="h-3 w-full bg-slate-800 rounded-full" />
      <div className="flex gap-3 pt-2">
        <div className="h-10 flex-1 bg-slate-800 rounded-lg" />
        <div className="h-10 flex-1 bg-slate-800 rounded-lg" />
      </div>
    </div>
    <div className="pt-4 border-t border-slate-800 flex justify-between">
      <div className="h-4 w-24 bg-slate-800 rounded" />
      <div className="h-4 w-24 bg-slate-800 rounded" />
      <div className="h-4 w-16 bg-slate-800 rounded" />
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
           // Show first, last, and near current pages logic could be added here for very large lists
           // For < 10 pages, showing all is fine.
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

const CommunityPage = () => {
  const [activeTab, setActiveTab] = useState<'requests' | 'polls'>('requests');
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize with 80% chance of data, 20% chance of empty state
  const [requests, setRequests] = useState<Request[]>(() => {
    return Math.random() > 0.2 ? [...INITIAL_REQUESTS, ...GENERATED_REQUESTS] : [];
  });
  const [polls, setPolls] = useState<Poll[]>(() => {
    return Math.random() > 0.2 ? [...INITIAL_POLLS, ...GENERATED_POLLS] : [];
  });

  const [searchTerm, setSearchTerm] = useState('');

  // Pagination State
  const [requestPage, setRequestPage] = useState(1);
  const [pollPage, setPollPage] = useState(1);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPollDetailModal, setShowPollDetailModal] = useState(false);
  const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null);
  const [createType, setCreateType] = useState<'request' | 'poll'>('request');

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    action: () => void;
    type: 'approve' | 'danger';
  }>({ isOpen: false, title: '', message: '', action: () => {}, type: 'approve' });

  // Forms
  const [newItem, setNewItem] = useState({ title: '', description: '', type: 'wish', startDate: '', endDate: '' });
  const [notificationSelection, setNotificationSelection] = useState<string[]>([]);

  // Simulate Loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Reset Pagination on Filter Change
  useEffect(() => {
    setRequestPage(1);
    setPollPage(1);
  }, [searchTerm, activeTab]);

  // Filter Logic
  const filteredRequests = useMemo(() => requests.filter(r => 
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.description.toLowerCase().includes(searchTerm.toLowerCase())
  ), [requests, searchTerm]);

  const paginatedRequests = useMemo(() => {
    const startIndex = (requestPage - 1) * ITEMS_PER_PAGE;
    return filteredRequests.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredRequests, requestPage]);

  const filteredPolls = useMemo(() => polls.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  ), [polls, searchTerm]);

  const paginatedPolls = useMemo(() => {
    const startIndex = (pollPage - 1) * ITEMS_PER_PAGE;
    return filteredPolls.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredPolls, pollPage]);

  // --- Handlers ---

  const handleCreateSubmit = () => {
    if (!newItem.title) return;

    if (createType === 'request') {
      // Direct create for requests
      const req: Request = {
        id: `req-${Date.now()}`,
        type: newItem.type as any,
        title: newItem.title,
        description: newItem.description,
        author: 'Yönetici', 
        unit: 'Yönetim',
        date: new Date().toISOString().split('T')[0],
        status: 'pending'
      };
      setRequests([req, ...requests]);
      setShowCreateModal(false);
      setNewItem({ title: '', description: '', type: 'wish', startDate: '', endDate: '' });
    } else {
      // For Polls, ask for confirmation
      setConfirmModal({
        isOpen: true,
        title: 'Oylama Başlat',
        message: `"${newItem.title}" başlıklı oylamayı başlatmak istediğinize emin misiniz?`,
        type: 'approve',
        action: () => {
            const poll: Poll = {
                id: `poll-${Date.now()}`,
                title: newItem.title,
                description: newItem.description,
                author: 'Yönetim',
                startDate: newItem.startDate || new Date().toISOString().split('T')[0],
                endDate: newItem.endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                status: 'active',
                votes: []
            };
            setPolls([poll, ...polls]);
            setActiveTab('polls');
            setShowCreateModal(false);
            setNewItem({ title: '', description: '', type: 'wish', startDate: '', endDate: '' });
        }
      });
    }
  };

  const handleDeleteRequestRequest = (id: string) => {
    setConfirmModal({
        isOpen: true,
        title: 'Kaydı Sil',
        message: 'Bu kaydı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.',
        type: 'danger',
        action: () => setRequests(requests.filter(r => r.id !== id))
    });
  };

  const handleConvertToSuggestion = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, type: 'suggestion' } : r));
  };

  const handleDeletePollRequest = (id: string) => {
    setConfirmModal({
        isOpen: true,
        title: 'Oylamayı Sil',
        message: 'Bu oylamayı ve tüm sonuçlarını silmek istediğinize emin misiniz?',
        type: 'danger',
        action: () => {
            setPolls(polls.filter(p => p.id !== id));
            setShowPollDetailModal(false);
        }
    });
  };

  const handleClosePollRequest = (id: string) => {
    setConfirmModal({
        isOpen: true,
        title: 'Oylamayı Bitir',
        message: 'Oylamayı sonlandırmak istiyor musunuz? Artık oy kullanılamayacak.',
        type: 'approve',
        action: () => {
            setPolls(polls.map(p => p.id === id ? { ...p, status: 'closed' } : p));
            if (selectedPoll?.id === id) {
                setSelectedPoll(prev => prev ? ({ ...prev, status: 'closed' }) : null);
            }
        }
    });
  };

  const handleVote = (pollId: string, choice: 'yes' | 'no') => {
    // Simulating "Current User" voting.
    const currentUser = { id: 'r7', name: 'Ali Veli' };
    
    setPolls(prev => prev.map(p => {
      if (p.id !== pollId) return p;
      if (p.votes.some(v => v.residentId === currentUser.id)) {
        alert('Zaten oy kullandınız.');
        return p;
      }
      return {
        ...p,
        votes: [...p.votes, { 
          residentId: currentUser.id, 
          residentName: currentUser.name, 
          choice, 
          timestamp: new Date().toISOString() 
        }]
      };
    }));
  };

  const convertSuggestionToPoll = (req: Request) => {
    setCreateType('poll');
    // Default 1 week duration
    const today = new Date().toISOString().split('T')[0];
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    setNewItem({ 
        title: req.title, 
        description: req.description, 
        type: 'poll',
        startDate: today,
        endDate: nextWeek
    });
    setShowCreateModal(true);
  };

  // Notification Logic
  const getNonVoters = (poll: Poll) => {
    const votedIds = poll.votes.map(v => v.residentId);
    return MOCK_RESIDENTS.filter(r => !votedIds.includes(r.id));
  };

  const handleSelectNonVoter = (id: string) => {
    if (notificationSelection.includes(id)) {
      setNotificationSelection(prev => prev.filter(i => i !== id));
    } else {
      setNotificationSelection(prev => [...prev, id]);
    }
  };

  const handleSelectAllNonVoters = (poll: Poll) => {
    const nonVoters = getNonVoters(poll);
    if (notificationSelection.length === nonVoters.length) {
      setNotificationSelection([]);
    } else {
      setNotificationSelection(nonVoters.map(r => r.id));
    }
  };

  const sendNotificationRequest = () => {
    if (notificationSelection.length === 0) return;
    setConfirmModal({
        isOpen: true,
        title: 'Hatırlatma Gönder',
        message: `Seçilen ${notificationSelection.length} kişiye oylama hatırlatması gönderilecek. Onaylıyor musunuz?`,
        type: 'approve',
        action: () => {
            // Mock send
            setNotificationSelection([]);
        }
    });
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 overflow-hidden relative">
      
      {/* Header */}
      <header className="h-20 border-b border-slate-800/50 flex items-center justify-between px-8 bg-slate-950 shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold font-heading text-white">Topluluk & Oylama</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder={activeTab === 'requests' ? "Talep veya öneri ara..." : "Oylama ara..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 w-64 placeholder-slate-500"
            />
          </div>
          
          <div className="h-8 w-px bg-slate-800 mx-2 hidden md:block"></div>

          {/* Tab Toggle */}
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
             <button 
                onClick={() => setActiveTab('requests')}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'requests' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
             >
                <MessageSquare className="w-4 h-4" /> Talepler
             </button>
             <button 
                onClick={() => setActiveTab('polls')}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'polls' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
             >
                <BarChart2 className="w-4 h-4" /> Oylamalar
             </button>
          </div>

          <button 
             onClick={() => { 
                 setShowCreateModal(true); 
                 setCreateType('request');
                 setNewItem({title: '', description: '', type: 'wish', startDate: '', endDate: ''}); 
             }}
             className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all shadow-lg shadow-blue-900/20"
           >
             <Plus className="w-4 h-4" />
             <span className="hidden md:inline">Yeni Oluştur</span>
           </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Stats Area (Contextual) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {isLoading ? (
               <>
                 <StatCardSkeleton />
                 <StatCardSkeleton />
                 <StatCardSkeleton />
               </>
             ) : activeTab === 'requests' ? (
               <>
                 <StatCard title="Açık İstekler" value={requests.filter(r => r.status !== 'resolved' && r.type === 'wish').length.toString()} trend="Bekleyen" trendUp={true} trendText="talep var" variant="purple" icon={AlertCircle} />
                 <StatCard title="Yeni Öneriler" value={requests.filter(r => r.type === 'suggestion' && r.status === 'pending').length.toString()} trend="Fikir" trendUp={true} trendText="değerlendirilecek" variant="blue" icon={MessageSquare} />
                 <StatCard title="Tamamlanan" value={requests.filter(r => r.status === 'resolved').length.toString()} trend="Çözüldü" trendUp={true} trendText="bu ay" variant="green" icon={CheckCircle} />
               </>
             ) : (
               <>
                 <StatCard title="Aktif Oylama" value={polls.filter(p => p.status === 'active').length.toString()} trend="Süren" trendUp={true} trendText="katılım bekleniyor" variant="green" icon={PlayCircle} />
                 <StatCard title="Toplam Katılım" value={polls.reduce((acc, p) => acc + p.votes.length, 0).toString()} trend="Kişi" trendUp={true} trendText="toplam oy" variant="blue" icon={User} />
                 <StatCard title="Tamamlanan" value={polls.filter(p => p.status === 'closed').length.toString()} trend="Biten" trendUp={false} trendText="sonuçlandı" variant="purple" icon={CheckCircle} />
               </>
             )}
          </div>

          {/* === REQUESTS TAB === */}
          {activeTab === 'requests' && (
            <div className="space-y-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-800 bg-slate-950/50 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                            <th className="px-6 py-4">Konu</th>
                            <th className="px-6 py-4">Tipi</th>
                            <th className="px-6 py-4">Gönderen</th>
                            <th className="px-6 py-4">Tarih</th>
                            <th className="px-6 py-4">Durum</th>
                            <th className="px-6 py-4 text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {isLoading ? (
                                <>
                                    <RequestRowSkeleton />
                                    <RequestRowSkeleton />
                                    <RequestRowSkeleton />
                                    <RequestRowSkeleton />
                                    <RequestRowSkeleton />
                                </>
                            ) : paginatedRequests.length > 0 ? paginatedRequests.map(req => (
                            <tr key={req.id} className="hover:bg-slate-800/30 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-slate-200">{req.title}</div>
                                    <div className="text-xs text-slate-500 mt-1 max-w-md truncate">{req.description}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${req.type === 'wish' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                                        {req.type === 'wish' ? 'İstek' : 'Öneri'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-slate-300">{req.author}</div>
                                    <div className="text-xs text-slate-500">Daire {req.unit}</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-400">{req.date}</td>
                                <td className="px-6 py-4">
                                    {req.status === 'pending' && <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded">Bekliyor</span>}
                                    {req.status === 'in-progress' && <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-1 rounded">İşleniyor</span>}
                                    {req.status === 'resolved' && <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">Çözüldü</span>}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        {/* Convert Wish to Suggestion */}
                                        {req.type === 'wish' && req.status !== 'resolved' && (
                                        <button 
                                            onClick={() => handleConvertToSuggestion(req.id)}
                                            className="p-1.5 text-purple-400 hover:bg-purple-500/10 border border-purple-500/20 rounded-lg transition-colors"
                                            title="Öneriye Dönüştür"
                                        >
                                            <RefreshCw className="w-4 h-4" />
                                        </button>
                                        )}

                                        {/* Convert to Poll (Available for both Suggestion and Wish) */}
                                        {(req.type === 'suggestion' || req.type === 'wish') && req.status !== 'resolved' && (
                                        <button 
                                            onClick={() => convertSuggestionToPoll(req)}
                                            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-colors shadow-lg shadow-indigo-900/20 flex items-center gap-1"
                                        >
                                            <BarChart2 className="w-3 h-3" /> Oylamaya Sun
                                        </button>
                                        )}
                                        <button onClick={() => handleDeleteRequestRequest(req.id)} className="p-2 hover:bg-slate-800 text-slate-500 hover:text-red-400 rounded-lg transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            )) : (
                            <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-500"><MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" /><p>Kayıt bulunamadı.</p></td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
                </div>
                {!isLoading && requests.length > 0 && (
                  <PaginationControls 
                      totalItems={filteredRequests.length}
                      itemsPerPage={ITEMS_PER_PAGE}
                      currentPage={requestPage}
                      onPageChange={setRequestPage}
                  />
                )}
            </div>
          )}

          {/* === POLLS TAB === */}
          {activeTab === 'polls' && (
             <div className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-300">
                    {isLoading ? (
                        <>
                            <PollCardSkeleton />
                            <PollCardSkeleton />
                            <PollCardSkeleton />
                            <PollCardSkeleton />
                        </>
                    ) : paginatedPolls.length > 0 ? paginatedPolls.map(poll => {
                    const totalVotes = poll.votes.length;
                    const yesVotes = poll.votes.filter(v => v.choice === 'yes').length;
                    const noVotes = poll.votes.filter(v => v.choice === 'no').length;
                    const yesPercent = totalVotes > 0 ? Math.round((yesVotes / totalVotes) * 100) : 0;
                    const noPercent = totalVotes > 0 ? Math.round((noVotes / totalVotes) * 100) : 0;

                    return (
                        <div 
                            key={poll.id} 
                            className={`relative bg-slate-900 border rounded-2xl p-6 transition-all group hover:shadow-xl cursor-pointer ${poll.status === 'active' ? 'border-emerald-500/30 shadow-emerald-900/10' : 'border-slate-800 opacity-80 hover:opacity-100'}`}
                            onClick={() => { setSelectedPoll(poll); setShowPollDetailModal(true); setNotificationSelection([]); }}
                        >
                            {poll.status === 'active' && (
                                <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wide animate-pulse">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Aktif
                                </div>
                            )}
                            {poll.status === 'closed' && (
                                <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-[10px] font-bold uppercase tracking-wide">
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-500"></div> Kapandı
                                </div>
                            )}

                            <div className="mb-4 pr-16">
                                <h3 className="text-lg font-bold text-white mb-1 leading-tight">{poll.title}</h3>
                                <p className="text-sm text-slate-400 line-clamp-2">{poll.description}</p>
                            </div>

                            <div className="space-y-3">
                                {/* Progress Bars */}
                                <div className="space-y-1">
                                <div className="flex justify-between text-xs font-bold mb-1">
                                    <span className="text-emerald-400 flex items-center gap-1"><ThumbsUp className="w-3 h-3" /> Evet (%{yesPercent})</span>
                                    <span className="text-red-400 flex items-center gap-1">Hayır (%{noPercent}) <ThumbsDown className="w-3 h-3" /></span>
                                </div>
                                <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden flex">
                                    <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${yesPercent}%` }}></div>
                                    <div className="h-full bg-red-500 transition-all duration-1000" style={{ width: `${noPercent}%` }}></div>
                                </div>
                                </div>

                                {/* Interaction (Vote Buttons) */}
                                {poll.status === 'active' && (
                                <div className="flex gap-3 pt-2" onClick={(e) => e.stopPropagation()}>
                                    <button onClick={() => handleVote(poll.id, 'yes')} className="flex-1 py-2 bg-emerald-900/20 hover:bg-emerald-900/40 border border-emerald-900/50 text-emerald-400 rounded-lg text-xs font-bold transition-colors">
                                        EVET
                                    </button>
                                    <button onClick={() => handleVote(poll.id, 'no')} className="flex-1 py-2 bg-red-900/20 hover:bg-red-900/40 border border-red-900/50 text-red-400 rounded-lg text-xs font-bold transition-colors">
                                        HAYIR
                                    </button>
                                </div>
                                )}
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center text-xs text-slate-500">
                                <span className="flex items-center gap-1"><User className="w-3 h-3" /> {poll.author}</span>
                                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {poll.startDate} / {poll.endDate}</span>
                                <span className="font-bold text-slate-300">{totalVotes} Oy</span>
                            </div>
                        </div>
                    );
                    }) : (
                    <div className="col-span-2 py-20 text-center text-slate-500 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/20">
                        <BarChart2 className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>Aktif veya geçmiş oylama bulunamadı.</p>
                    </div>
                    )}
                </div>
                {!isLoading && polls.length > 0 && (
                  <PaginationControls 
                      totalItems={filteredPolls.length}
                      itemsPerPage={ITEMS_PER_PAGE}
                      currentPage={pollPage}
                      onPageChange={setPollPage}
                  />
                )}
             </div>
          )}

        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
               <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                     <Plus className="w-5 h-5 text-blue-500" />
                     {createType === 'poll' ? 'Yeni Oylama Başlat' : 'Yeni İstek/Öneri Oluştur'}
                  </h2>
                  <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
               </div>
               
               <div className="p-6 space-y-4">
                  <div className="space-y-2">
                     <label className="text-xs font-medium text-slate-400 uppercase">Tip</label>
                     <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-700">
                        <button onClick={() => { setCreateType('request'); setNewItem({...newItem, type: 'wish'}); }} className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${createType === 'request' ? 'bg-slate-800 text-white shadow' : 'text-slate-400'}`}>İstek/Öneri</button>
                        <button onClick={() => { setCreateType('poll'); setNewItem({...newItem, type: 'poll'}); }} className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${createType === 'poll' ? 'bg-slate-800 text-white shadow' : 'text-slate-400'}`}>Oylama</button>
                     </div>
                  </div>

                  {createType === 'request' && (
                     <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-400 uppercase">Kategori</label>
                        <select 
                           value={newItem.type}
                           onChange={(e) => setNewItem({...newItem, type: e.target.value})}
                           className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                           <option value="wish">İstek</option>
                           <option value="suggestion">Öneri</option>
                        </select>
                     </div>
                  )}

                  <div className="space-y-2">
                     <label className="text-xs font-medium text-slate-400 uppercase">Başlık</label>
                     <input 
                        type="text" 
                        value={newItem.title}
                        onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder={createType === 'poll' ? "Örn: Cephe Boyası Seçimi" : "Örn: Bahçeye Çardak"}
                     />
                  </div>

                  {createType === 'poll' && (
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <label className="text-xs font-medium text-slate-400 uppercase">Başlangıç Tarihi</label>
                           <input 
                              type="date" 
                              value={newItem.startDate}
                              onChange={(e) => setNewItem({...newItem, startDate: e.target.value})}
                              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 [color-scheme:dark]"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-xs font-medium text-slate-400 uppercase">Bitiş Tarihi</label>
                           <input 
                              type="date" 
                              value={newItem.endDate}
                              onChange={(e) => setNewItem({...newItem, endDate: e.target.value})}
                              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 [color-scheme:dark]"
                           />
                        </div>
                     </div>
                  )}

                  <div className="space-y-2">
                     <label className="text-xs font-medium text-slate-400 uppercase">Açıklama</label>
                     <textarea 
                        value={newItem.description}
                        onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 h-32 resize-none"
                        placeholder="Detayları buraya yazınız..."
                     />
                  </div>
               </div>

               <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex gap-3">
                  <button onClick={() => setShowCreateModal(false)} className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors text-sm">İptal</button>
                  <button onClick={handleCreateSubmit} className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium shadow-lg transition-colors text-sm">
                     {createType === 'poll' ? 'Başlat' : 'Oluştur'}
                  </button>
               </div>
            </div>
         </div>
      )}

      {/* Poll Detail & Notification Modal */}
      {showPollDetailModal && selectedPoll && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
               {/* Modal Header */}
               <div className="p-6 border-b border-slate-800 flex justify-between items-start bg-slate-900 shrink-0">
                  <div>
                     <h2 className="text-xl font-bold text-white leading-tight flex items-center gap-2">
                        {selectedPoll.title}
                        {selectedPoll.status === 'closed' && <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full border border-slate-700">KAPANDI</span>}
                     </h2>
                     <p className="text-slate-400 text-sm mt-1 line-clamp-1">{selectedPoll.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                     {selectedPoll.status === 'active' && (
                        <button onClick={() => handleClosePollRequest(selectedPoll.id)} className="px-3 py-1.5 bg-amber-600/10 text-amber-500 hover:bg-amber-600/20 border border-amber-600/20 rounded-lg text-xs font-bold transition-colors">
                           Oylamayı Bitir
                        </button>
                     )}
                     <button onClick={() => handleDeletePollRequest(selectedPoll.id)} className="p-2 bg-slate-800 hover:bg-red-900/20 hover:text-red-400 text-slate-400 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                     </button>
                     <button onClick={() => setShowPollDetailModal(false)} className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors ml-2">
                        <X className="w-5 h-5" />
                     </button>
                  </div>
               </div>

               {/* Modal Content */}
               <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
                  
                  {/* Left: Results & Voters */}
                  <div className="flex-1 border-r border-slate-800 overflow-y-auto custom-scrollbar p-6">
                     <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><PieChart className="w-4 h-4 text-blue-500" /> Oylama Sonuçları</h3>
                     
                     {/* Result Summary */}
                     <div className="flex gap-4 mb-6">
                        <div className="flex-1 bg-emerald-900/10 border border-emerald-900/30 p-4 rounded-xl text-center">
                           <div className="text-2xl font-bold text-emerald-400">{selectedPoll.votes.filter(v => v.choice === 'yes').length}</div>
                           <div className="text-xs text-emerald-200/60 font-bold uppercase">Evet</div>
                        </div>
                        <div className="flex-1 bg-red-900/10 border border-red-900/30 p-4 rounded-xl text-center">
                           <div className="text-2xl font-bold text-red-400">{selectedPoll.votes.filter(v => v.choice === 'no').length}</div>
                           <div className="text-xs text-red-200/60 font-bold uppercase">Hayır</div>
                        </div>
                     </div>

                     {/* Voters List */}
                     <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Oy Kullananlar</h4>
                     <div className="space-y-2">
                        {selectedPoll.votes.length > 0 ? selectedPoll.votes.map((vote, idx) => (
                           <div key={idx} className="flex justify-between items-center p-3 bg-slate-950 border border-slate-800 rounded-lg">
                              <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 text-xs border border-slate-700">
                                    {vote.residentName.charAt(0)}
                                 </div>
                                 <div>
                                    <div className="text-sm font-medium text-slate-200">{vote.residentName}</div>
                                    <div className="text-[10px] text-slate-500">{vote.timestamp.split('T')[0]}</div>
                                 </div>
                              </div>
                              <span className={`text-xs font-bold px-2 py-1 rounded ${vote.choice === 'yes' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                 {vote.choice === 'yes' ? 'EVET' : 'HAYIR'}
                              </span>
                           </div>
                        )) : (
                           <p className="text-sm text-slate-500 italic">Henüz oy kullanılmadı.</p>
                        )}
                     </div>
                  </div>

                  {/* Right: Non-Voters & Notifications */}
                  <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-slate-950/30">
                     <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2"><Bell className="w-4 h-4 text-amber-500" /> Katılım Durumu</h3>
                        <div className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                           {getNonVoters(selectedPoll).length} Kişi Bekliyor
                        </div>
                     </div>

                     <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-[350px]">
                        <div className="p-3 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
                           <button 
                              onClick={() => handleSelectAllNonVoters(selectedPoll)}
                              className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                           >
                              {notificationSelection.length === getNonVoters(selectedPoll).length ? <CheckSquare className="w-3 h-3" /> : <Square className="w-3 h-3" />}
                              Tümünü Seç
                           </button>
                           <span className="text-xs text-slate-500">{notificationSelection.length} seçildi</span>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-2 space-y-1">
                           {getNonVoters(selectedPoll).map(resident => (
                              <div 
                                 key={resident.id} 
                                 onClick={() => handleSelectNonVoter(resident.id)}
                                 className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${notificationSelection.includes(resident.id) ? 'bg-blue-900/20 border border-blue-500/30' : 'hover:bg-slate-800 border border-transparent'}`}
                              >
                                 <div className="flex items-center gap-3">
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${notificationSelection.includes(resident.id) ? 'bg-blue-500 border-blue-500' : 'border-slate-600'}`}>
                                       {notificationSelection.includes(resident.id) && <CheckSquare className="w-3 h-3 text-white" />}
                                    </div>
                                    <span className="text-sm text-slate-300">{resident.name}</span>
                                 </div>
                                 <span className="text-xs text-slate-500 font-mono bg-slate-950 px-1.5 rounded">{resident.unit}</span>
                              </div>
                           ))}
                        </div>
                     </div>

                     <div className="mt-4">
                        <button 
                           onClick={sendNotificationRequest}
                           disabled={notificationSelection.length === 0}
                           className="w-full py-3 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-lg shadow-amber-900/20 transition-colors flex items-center justify-center gap-2"
                        >
                           <Send className="w-4 h-4" />
                           Hatırlatma Gönder ({notificationSelection.length})
                        </button>
                        <p className="text-[10px] text-slate-500 text-center mt-2">Seçilen kişilere mobil uygulama üzerinden bildirim gönderilecektir.</p>
                     </div>
                  </div>

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

export default CommunityPage;
