
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Plus, Package, Truck, CheckCircle, Clock, RotateCcw, MoreVertical, X, Calendar, User, MapPin, Box, ArrowRight, Bell, Smartphone, ArrowDownCircle, Bike, ShoppingBag, LogIn, LogOut, History, Utensils, AlertTriangle, UserCheck, Hash } from 'lucide-react';
import StatCard from './StatCards';

// --- Types ---
interface CargoItem {
  id: string;
  trackingNo: string;
  carrier: string;
  recipientName: string;
  unit: string;
  arrivalDate: string; // ISO String for sorting
  arrivalTime: string;
  status: 'received' | 'delivered' | 'returned';
  deliveredDate?: string;
  type: 'Small' | 'Medium' | 'Large';
}

interface ExpectedCargo {
  id: string;
  residentName: string;
  unit: string;
  trackingNo: string;
  carrier: string;
  expectedDate: string; // ISO date
  note: string;
  createdAt: string; // time ago
}

interface CourierVisit {
  id: string;
  company: string;
  residentName: string;
  unit: string;
  status: 'pending' | 'inside' | 'completed';
  entryTime?: string;
  exitTime?: string;
  method: 'app' | 'manual'; // app = notification, manual = security entry
  note?: string;
  plate?: string; // Added plate
}

// --- Mock Data ---
const MOCK_RESIDENTS = [
  { id: 'r1', name: 'Ahmet Yılmaz', unit: 'A-1' },
  { id: 'r2', name: 'Mehmet Demir', unit: 'A-2' },
  { id: 'r3', name: 'Ayşe Kaya', unit: 'A-3' },
  { id: 'r4', name: 'Caner Erkin', unit: 'B-1' },
  { id: 'r5', name: 'Zeynep Su', unit: 'B-2' },
  { id: 'r6', name: 'Selin Yılmaz', unit: 'C-1' },
];

const INITIAL_CARGO: CargoItem[] = [
  {
    id: 'crg-1',
    trackingNo: '12345678901',
    carrier: 'Yurtiçi Kargo',
    recipientName: 'Ahmet Yılmaz',
    unit: 'A-1',
    arrivalDate: '2024-10-25',
    arrivalTime: '10:30',
    status: 'received',
    type: 'Medium'
  },
  {
    id: 'crg-2',
    trackingNo: 'TR-99887766',
    carrier: 'Aras Kargo',
    recipientName: 'Zeynep Su',
    unit: 'B-2',
    arrivalDate: '2024-10-25',
    arrivalTime: '11:45',
    status: 'delivered',
    deliveredDate: '2024-10-25 18:30',
    type: 'Small'
  },
  {
    id: 'crg-3',
    trackingNo: 'MNG-554433',
    carrier: 'MNG Kargo',
    recipientName: 'Caner Erkin',
    unit: 'B-1',
    arrivalDate: '2024-10-24',
    arrivalTime: '09:15',
    status: 'returned',
    type: 'Large'
  },
  {
    id: 'crg-4',
    trackingNo: 'TY-11223344',
    carrier: 'Trendyol Express',
    recipientName: 'Selin Yılmaz',
    unit: 'C-1',
    arrivalDate: '2024-10-26',
    arrivalTime: '14:20',
    status: 'received',
    type: 'Small'
  },
  {
    id: 'crg-5',
    trackingNo: 'UPS-998811',
    carrier: 'UPS',
    recipientName: 'Mehmet Demir',
    unit: 'A-2',
    arrivalDate: '2024-10-26',
    arrivalTime: '15:00',
    status: 'received',
    type: 'Medium'
  }
];

const INITIAL_EXPECTED: ExpectedCargo[] = [
  {
    id: 'exp-1',
    residentName: 'Ayşe Demir',
    unit: 'A-3',
    trackingNo: '7788990011',
    carrier: 'Trendyol Express',
    expectedDate: '2024-10-27',
    note: 'Kargom gelince güvenliğe bırakılabilir.',
    createdAt: '2 saat önce'
  },
  {
    id: 'exp-2',
    residentName: 'Murat Can',
    unit: 'B-4',
    trackingNo: 'AA123456',
    carrier: 'Yurtiçi Kargo',
    expectedDate: '2024-10-27',
    note: 'Evde yokum, lütfen teslim alınız.',
    createdAt: '5 saat önce'
  }
];

const INITIAL_COURIERS: CourierVisit[] = [
  {
    id: 'cour-1',
    company: 'Getir',
    residentName: 'Ahmet Yılmaz',
    unit: 'A-1',
    status: 'inside',
    entryTime: '19:45',
    method: 'app',
    plate: '34 AB 123'
  },
  {
    id: 'cour-2',
    company: 'Yemeksepeti',
    residentName: 'Zeynep Su',
    unit: 'B-2',
    status: 'pending',
    method: 'app',
    note: 'Zili çalmasın, kapıya bıraksın.'
  },
  {
    id: 'cour-3',
    company: 'Trendyol Yemek',
    residentName: 'Caner Erkin',
    unit: 'B-1',
    status: 'completed',
    entryTime: '18:15',
    exitTime: '18:25',
    method: 'manual',
    plate: '06 ZT 99'
  }
];

const CARRIERS = ['Yurtiçi Kargo', 'Aras Kargo', 'MNG Kargo', 'Trendyol Express', 'UPS', 'DHL', 'PTT Kargo', 'Amazon Lojistik', 'Diğer'];
const COURIER_COMPANIES = ['Getir', 'Yemeksepeti', 'Trendyol Yemek', 'Migros Hemen', 'Domino\'s', 'Burger King', 'Mahalle Esnafı', 'Diğer'];

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

const CargoRowSkeleton = () => (
  <tr className="border-b border-slate-800/50 animate-pulse">
    <td className="px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-slate-800 shrink-0" />
        <div className="space-y-2">
          <div className="h-4 w-20 bg-slate-800 rounded" />
          <div className="h-3 w-32 bg-slate-800 rounded" />
        </div>
      </div>
    </td>
    <td className="px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-slate-800 shrink-0" />
        <div className="space-y-2">
          <div className="h-4 w-24 bg-slate-800 rounded" />
          <div className="h-3 w-16 bg-slate-800 rounded" />
        </div>
      </div>
    </td>
    <td className="px-6 py-4">
      <div className="space-y-2">
        <div className="h-4 w-24 bg-slate-800 rounded" />
        <div className="h-3 w-16 bg-slate-800 rounded" />
      </div>
    </td>
    <td className="px-6 py-4"><div className="h-6 w-20 bg-slate-800 rounded-md" /></td>
    <td className="px-6 py-4 text-right"><div className="h-8 w-8 bg-slate-800 rounded ml-auto" /></td>
  </tr>
);

const ExpectedCargoSkeleton = () => (
  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 animate-pulse h-[220px] flex flex-col">
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-slate-800 shrink-0" />
        <div className="space-y-2">
          <div className="h-4 w-32 bg-slate-800 rounded" />
          <div className="h-3 w-20 bg-slate-800 rounded" />
        </div>
      </div>
    </div>
    <div className="flex-1 space-y-3 mb-5">
      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
        <div className="h-3 w-full bg-slate-800 rounded" />
        <div className="h-3 w-3/4 bg-slate-800 rounded" />
      </div>
    </div>
    <div className="flex justify-between items-center pt-3 border-t border-slate-800">
      <div className="h-3 w-24 bg-slate-800 rounded" />
      <div className="h-8 w-28 bg-slate-800 rounded-lg" />
    </div>
  </div>
);

const CourierRowSkeleton = () => (
  <tr className="border-b border-slate-800/50 animate-pulse">
    <td className="px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-slate-800 shrink-0" />
        <div className="space-y-2">
          <div className="h-4 w-24 bg-slate-800 rounded" />
          <div className="h-3 w-16 bg-slate-800 rounded" />
        </div>
      </div>
    </td>
    <td className="px-6 py-4">
      <div className="space-y-2">
        <div className="h-4 w-32 bg-slate-800 rounded" />
        <div className="h-3 w-20 bg-slate-800 rounded" />
      </div>
    </td>
    <td className="px-6 py-4">
      <div className="space-y-2">
        <div className="h-4 w-20 bg-slate-800 rounded" />
        <div className="h-3 w-16 bg-slate-800 rounded" />
      </div>
    </td>
    <td className="px-6 py-4"><div className="h-6 w-24 bg-slate-800 rounded-md" /></td>
    <td className="px-6 py-4 text-right"><div className="h-8 w-24 bg-slate-800 rounded-lg ml-auto" /></td>
  </tr>
);

const CargoPage = () => {
  // Main View Toggle
  const [activeCategory, setActiveCategory] = useState<'cargo' | 'courier'>('cargo');

  // Cargo States
  const [activeTab, setActiveTab] = useState<'inventory' | 'expected'>('inventory');
  const [cargoList, setCargoList] = useState<CargoItem[]>(INITIAL_CARGO);
  const [expectedList, setExpectedList] = useState<ExpectedCargo[]>(INITIAL_EXPECTED);
  const [statusFilter, setStatusFilter] = useState<'all' | 'received' | 'delivered' | 'returned'>('all');
  const [showCargoModal, setShowCargoModal] = useState(false);
  const [convertingId, setConvertingId] = useState<string | null>(null);
  const [newCargo, setNewCargo] = useState<Partial<CargoItem>>({
    trackingNo: '', carrier: 'Yurtiçi Kargo', recipientName: '', unit: '', type: 'Small'
  });

  // Courier States
  const [courierList, setCourierList] = useState<CourierVisit[]>(INITIAL_COURIERS);
  const [showCourierModal, setShowCourierModal] = useState(false);
  const [courierFilter, setCourierFilter] = useState<'all' | 'pending' | 'inside'>('all');
  const [newCourier, setNewCourier] = useState<Partial<CourierVisit>>({
    company: 'Getir', residentName: '', unit: '', note: '', plate: ''
  });
  const [selectedResidentId, setSelectedResidentId] = useState<string>('');
  const [isManualCourier, setIsManualCourier] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Confirmation Modal State
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'cargo_deliver' | 'cargo_return' | 'courier_in' | 'courier_out' | null>(null);
  const [targetId, setTargetId] = useState<string | null>(null);

  // Simulate Loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // --- Helpers for Confirmation ---
  const getTargetItemName = () => {
    if (!targetId) return '';
    if (confirmAction?.startsWith('cargo')) {
        const item = cargoList.find(c => c.id === targetId);
        return item ? `${item.recipientName} (${item.carrier})` : '';
    }
    if (confirmAction?.startsWith('courier')) {
        const item = courierList.find(c => c.id === targetId);
        return item ? `${item.company} Kuryesi - ${item.residentName}` : '';
    }
    return '';
  };

  const handleOpenConfirm = (action: typeof confirmAction, id: string) => {
    setConfirmAction(action);
    setTargetId(id);
    setShowConfirmModal(true);
  };

  const processConfirmation = () => {
    if (!targetId || !confirmAction) return;

    if (confirmAction === 'cargo_deliver') {
        const now = new Date();
        const dateStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
        setCargoList(prev => prev.map(item => item.id === targetId ? { ...item, status: 'delivered', deliveredDate: dateStr } : item));
    } else if (confirmAction === 'cargo_return') {
        setCargoList(prev => prev.map(item => item.id === targetId ? { ...item, status: 'returned' } : item));
    } else if (confirmAction === 'courier_in') {
        setCourierList(prev => prev.map(c => c.id === targetId ? { 
            ...c, 
            status: 'inside', 
            entryTime: new Date().toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'}) 
          } : c));
    } else if (confirmAction === 'courier_out') {
        setCourierList(prev => prev.map(c => c.id === targetId ? { 
            ...c, 
            status: 'completed', 
            exitTime: new Date().toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'}) 
          } : c));
    }

    setShowConfirmModal(false);
    setTargetId(null);
    setConfirmAction(null);
  };

  // --- Cargo Logic ---
  const filteredCargo = useMemo(() => {
    return cargoList.filter(item => {
      const matchesSearch = item.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.trackingNo.includes(searchTerm);
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    }).sort((a, b) => new Date(b.arrivalDate).getTime() - new Date(a.arrivalDate).getTime());
  }, [cargoList, searchTerm, statusFilter]);

  const filteredExpected = useMemo(() => {
    return expectedList.filter(item => 
       item.residentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
       item.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
       item.trackingNo.includes(searchTerm)
    );
  }, [expectedList, searchTerm]);

  const cargoStats = {
    totalPending: cargoList.filter(c => c.status === 'received').length,
    todayIncoming: cargoList.filter(c => c.arrivalDate === new Date().toISOString().split('T')[0]).length,
    delivered: cargoList.filter(c => c.status === 'delivered').length
  };

  const handleAddCargo = () => {
    if (!newCargo.recipientName || !newCargo.unit) return;
    const today = new Date();
    const item: CargoItem = {
      id: `crg-${Date.now()}`,
      trackingNo: newCargo.trackingNo || 'Belirtilmedi',
      carrier: newCargo.carrier || 'Diğer',
      recipientName: newCargo.recipientName,
      unit: newCargo.unit,
      arrivalDate: today.toISOString().split('T')[0],
      arrivalTime: `${String(today.getHours()).padStart(2, '0')}:${String(today.getMinutes()).padStart(2, '0')}`,
      status: 'received',
      type: newCargo.type as any || 'Medium'
    };
    setCargoList([item, ...cargoList]);
    if (convertingId) {
      setExpectedList(prev => prev.filter(e => e.id !== convertingId));
      setConvertingId(null);
    }
    setShowCargoModal(false);
    setNewCargo({ trackingNo: '', carrier: 'Yurtiçi Kargo', recipientName: '', unit: '', type: 'Small' });
  };

  const handleQuickAccept = (expected: ExpectedCargo) => {
    setNewCargo({
      trackingNo: expected.trackingNo,
      carrier: expected.carrier,
      recipientName: expected.residentName,
      unit: expected.unit,
      type: 'Medium'
    });
    setConvertingId(expected.id);
    setShowCargoModal(true);
  };

  const getCarrierColor = (carrier: string) => {
    if (carrier.includes('Yurtiçi')) return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    if (carrier.includes('Aras')) return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
    if (carrier.includes('MNG')) return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
    if (carrier.includes('Trendyol')) return 'bg-orange-600/10 text-orange-500 border-orange-600/20';
    return 'bg-slate-800 text-slate-300 border-slate-700';
  };

  // --- Courier Logic ---
  const filteredCouriers = useMemo(() => {
    return courierList.filter(item => {
      const matchesSearch = item.residentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (item.plate && item.plate.toLowerCase().includes(searchTerm.toLowerCase()));
      
      if (courierFilter === 'all') return matchesSearch;
      return matchesSearch && item.status === courierFilter;
    }).sort((a, b) => {
        // Status sort: Pending > Inside > Completed
        const order = { 'inside': 0, 'pending': 1, 'completed': 2 };
        return order[a.status] - order[b.status];
    });
  }, [courierList, searchTerm, courierFilter]);

  const courierStats = {
    inside: courierList.filter(c => c.status === 'inside').length,
    pending: courierList.filter(c => c.status === 'pending').length,
    todayTotal: courierList.length
  };

  const handleResidentSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedResidentId(val);
    
    if (val === 'manual') {
        setIsManualCourier(true);
        setNewCourier(prev => ({ ...prev, residentName: '', unit: '' }));
    } else {
        setIsManualCourier(false);
        const resident = MOCK_RESIDENTS.find(r => r.id === val);
        if (resident) {
            setNewCourier(prev => ({ ...prev, residentName: resident.name, unit: resident.unit }));
        } else {
            setNewCourier(prev => ({ ...prev, residentName: '', unit: '' }));
        }
    }
  };

  const handleAddCourier = () => {
    if (!newCourier.company || !newCourier.residentName || !newCourier.unit) return;
    const item: CourierVisit = {
      id: `cour-${Date.now()}`,
      company: newCourier.company,
      residentName: newCourier.residentName,
      unit: newCourier.unit,
      status: 'inside', // Manual entry starts as inside
      entryTime: new Date().toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'}),
      method: 'manual',
      note: newCourier.note,
      plate: newCourier.plate ? newCourier.plate.toUpperCase() : ''
    };
    setCourierList([item, ...courierList]);
    setShowCourierModal(false);
    setNewCourier({ company: 'Getir', residentName: '', unit: '', note: '', plate: '' });
    setSelectedResidentId('');
    setIsManualCourier(false);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 overflow-hidden relative">
      
      {/* Header */}
      <header className="h-20 border-b border-slate-800/50 flex items-center justify-between px-8 bg-slate-950 shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold font-heading text-white">Kargolar & Kuryeler</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder={activeCategory === 'cargo' ? "Takip no, isim veya daire..." : "Firma, daire veya kurye..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 w-64 placeholder-slate-500"
            />
          </div>
          
          <div className="h-8 w-px bg-slate-800 mx-2 hidden md:block"></div>

          {/* Main Category Switcher (Residents Page Style) */}
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
             <button 
                onClick={() => setActiveCategory('cargo')}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeCategory === 'cargo' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
             >
                <Package className="w-4 h-4" /> Kargolar
             </button>
             <button 
                onClick={() => setActiveCategory('courier')}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeCategory === 'courier' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
             >
                <Bike className="w-4 h-4" /> Kuryeler
             </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* ==================== CARGO VIEW ==================== */}
          {activeCategory === 'cargo' && (
            <div className="space-y-8 animate-in fade-in duration-300">
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
                            title="Teslim Bekleyen" 
                            value={cargoStats.totalPending.toString()} 
                            trend="Aktif" 
                            trendUp={true} 
                            trendText="dağıtım bekliyor"
                            variant="orange"
                            icon={Package}
                            />
                            <StatCard 
                            title="Gelecek Bildirimi" 
                            value={expectedList.length.toString()} 
                            trend="Mobil" 
                            trendUp={true} 
                            trendText="sakin bildirimi"
                            variant="blue"
                            icon={Smartphone}
                            />
                            <StatCard 
                            title="Teslim Edilen" 
                            value={cargoStats.delivered.toString()} 
                            trend="Başarılı" 
                            trendUp={true} 
                            trendText="bu ay toplam"
                            variant="green"
                            icon={CheckCircle}
                            />
                        </>
                    )}
                </div>

                {/* Sub Tab Toggle (Inventory vs Expected) */}
                <div className="flex justify-between items-center">
                    <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
                        <button 
                            onClick={() => setActiveTab('inventory')}
                            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'inventory' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                        >
                            Envanter
                        </button>
                        <button 
                            onClick={() => setActiveTab('expected')}
                            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'expected' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                        >
                            Bildirimler
                            {expectedList.length > 0 && <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center">{expectedList.length}</span>}
                        </button>
                    </div>

                    {activeTab === 'inventory' && (
                        <div className="flex items-center gap-3">
                            <div className="hidden md:flex items-center gap-2 text-sm text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                                <button onClick={() => setStatusFilter('all')} className={`px-2 hover:text-white ${statusFilter === 'all' ? 'text-white font-bold' : ''}`}>Tümü</button>
                                <span className="text-slate-700">|</span>
                                <button onClick={() => setStatusFilter('received')} className={`px-2 hover:text-white ${statusFilter === 'received' ? 'text-white font-bold' : ''}`}>Bekleyen</button>
                                <span className="text-slate-700">|</span>
                                <button onClick={() => setStatusFilter('delivered')} className={`px-2 hover:text-white ${statusFilter === 'delivered' ? 'text-white font-bold' : ''}`}>Teslim</button>
                            </div>
                            <button 
                                onClick={() => { setConvertingId(null); setShowCargoModal(true); }}
                                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all shadow-lg shadow-blue-900/20"
                            >
                                <Plus className="w-4 h-4" /> Kargo Kabul
                            </button>
                        </div>
                    )}
                </div>

                {/* Cargo Inventory Table */}
                {activeTab === 'inventory' && (
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                        <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                            <tr className="border-b border-slate-800 bg-slate-950/50 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                                <th className="px-6 py-4">Kargo Bilgisi</th>
                                <th className="px-6 py-4">Alıcı / Daire</th>
                                <th className="px-6 py-4">Geliş Zamanı</th>
                                <th className="px-6 py-4">Durum</th>
                                <th className="px-6 py-4 text-right">İşlemler</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                            {isLoading ? (
                                <>
                                    <CargoRowSkeleton />
                                    <CargoRowSkeleton />
                                    <CargoRowSkeleton />
                                    <CargoRowSkeleton />
                                    <CargoRowSkeleton />
                                </>
                            ) : (
                                <>
                                    {filteredCargo.length > 0 ? (
                                        filteredCargo.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-800/30 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 text-slate-400">
                                                    <Package className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded border w-fit mb-1 ${getCarrierColor(item.carrier)}`}>
                                                        {item.carrier}
                                                    </div>
                                                    <div className="text-xs text-slate-500 font-mono tracking-wide">{item.trackingNo}</div>
                                                </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 text-xs font-bold shrink-0">
                                                    {item.unit}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-slate-200 text-sm">{item.recipientName}</div>
                                                    <div className="text-xs text-slate-500">{item.type} Paket</div>
                                                </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col text-sm text-slate-300">
                                                <span className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5 text-slate-500" /> {item.arrivalDate}</span>
                                                <span className="flex items-center gap-2 text-xs text-slate-500 mt-0.5"><Clock className="w-3.5 h-3.5" /> {item.arrivalTime}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {item.status === 'received' && (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse">
                                                    <Clock className="w-3.5 h-3.5" /> Bekliyor
                                                </span>
                                                )}
                                                {item.status === 'delivered' && (
                                                <div>
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                        <CheckCircle className="w-3.5 h-3.5" /> Teslim Edildi
                                                    </span>
                                                    <div className="text-[10px] text-emerald-500/60 mt-1 pl-1">{item.deliveredDate}</div>
                                                </div>
                                                )}
                                                {item.status === 'returned' && (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                                                    <RotateCcw className="w-3.5 h-3.5" /> İade
                                                </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {item.status === 'received' ? (
                                                <div className="flex items-center justify-end gap-2">
                                                    <button 
                                                        onClick={() => handleOpenConfirm('cargo_return', item.id)}
                                                        className="p-2 bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-slate-400 rounded-lg transition-colors border border-transparent hover:border-red-500/30"
                                                        title="İade Et"
                                                    >
                                                        <RotateCcw className="w-4 h-4" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleOpenConfirm('cargo_deliver', item.id)}
                                                        className="flex items-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-emerald-900/20"
                                                    >
                                                        Teslim Et <ArrowRight className="w-3 h-3" />
                                                    </button>
                                                </div>
                                                ) : (
                                                <button className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                                )}
                                            </td>
                                        </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                            <Package className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                            <p>Kayıt bulunamadı.</p>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            )}
                            </tbody>
                        </table>
                        </div>
                    </div>
                )}

                {/* Expected Cargo List */}
                {activeTab === 'expected' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                         <div className="bg-blue-900/10 border border-blue-900/20 rounded-xl p-4 flex items-start gap-3">
                            <Smartphone className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-blue-200 font-bold text-sm">Mobil Uygulama Bildirimleri</h4>
                                <p className="text-blue-400/60 text-xs mt-1">Bu liste, sakinlerin mobil uygulama üzerinden "Kargom Gelecek" bildirimi yaptığı paketleri içerir.</p>
                            </div>
                         </div>
          
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {isLoading ? (
                                <>
                                    <ExpectedCargoSkeleton />
                                    <ExpectedCargoSkeleton />
                                    <ExpectedCargoSkeleton />
                                </>
                            ) : (
                                <>
                                    {filteredExpected.length > 0 ? filteredExpected.map(item => (
                                    <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-blue-500/30 transition-all group">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 border border-slate-700">
                                                <User className="w-5 h-5" />
                                                </div>
                                                <div>
                                                <h3 className="text-white font-bold text-sm">{item.residentName}</h3>
                                                <span className="text-xs font-bold bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20">Daire {item.unit}</span>
                                                </div>
                                            </div>
                                        </div>
                
                                        <div className="space-y-3 mb-5">
                                            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                                                <div className="flex justify-between items-center text-xs">
                                                <span className="text-slate-500">Kargo Firması</span>
                                                <span className={`font-bold px-1.5 py-0.5 rounded border ${getCarrierColor(item.carrier)}`}>{item.carrier}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-xs">
                                                <span className="text-slate-500">Takip No</span>
                                                <span className="text-slate-300 font-mono tracking-wider bg-slate-900 px-1 rounded">{item.trackingNo}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-xs">
                                                <span className="text-slate-500">Beklenen Tarih</span>
                                                <span className="text-slate-300">{item.expectedDate}</span>
                                                </div>
                                            </div>
                                            
                                            {item.note && (
                                                <div className="text-xs text-slate-400 italic bg-slate-800/30 p-2 rounded-lg border border-slate-800">
                                                "{item.note}"
                                                </div>
                                            )}
                                        </div>
                
                                        <div className="flex justify-between items-center pt-3 border-t border-slate-800">
                                            <span className="text-[10px] text-slate-500 flex items-center gap-1"><Bell className="w-3 h-3" /> {item.createdAt}</span>
                                            <button 
                                                onClick={() => handleQuickAccept(item)}
                                                className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-blue-900/20"
                                            >
                                                <ArrowDownCircle className="w-3.5 h-3.5" /> Giriş Yap
                                            </button>
                                        </div>
                                    </div>
                                    )) : (
                                    <div className="col-span-full py-12 text-center text-slate-500 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/20">
                                        <Smartphone className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                        <p>Beklenen kargo bildirimi yok.</p>
                                    </div>
                                    )}
                                </>
                            )}
                         </div>
                    </div>
                )}
            </div>
          )}

          {/* ==================== COURIER VIEW ==================== */}
          {activeCategory === 'courier' && (
            <div className="space-y-8 animate-in fade-in duration-300">
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
                            title="İçerideki Kurye" 
                            value={courierStats.inside.toString()} 
                            trend="Aktif" 
                            trendUp={true} 
                            trendText="şu an sitede"
                            variant="blue"
                            icon={Bike}
                            />
                            <StatCard 
                            title="Beklenen Sipariş" 
                            value={courierStats.pending.toString()} 
                            trend="Talep" 
                            trendUp={true} 
                            trendText="sakin bildirimi"
                            variant="orange"
                            icon={ShoppingBag}
                            />
                            <StatCard 
                            title="Bugün Giriş" 
                            value={courierStats.todayTotal.toString()} 
                            trend="Toplam" 
                            trendUp={true} 
                            trendText="kurye hareketi"
                            variant="green"
                            icon={History}
                            />
                        </>
                    )}
                </div>

                {/* Controls */}
                <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4">
                   <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
                      <button onClick={() => setCourierFilter('all')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border whitespace-nowrap ${courierFilter === 'all' ? 'bg-slate-800 border-slate-600 text-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'}`}>Tümü</button>
                      <button onClick={() => setCourierFilter('pending')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border flex items-center gap-2 whitespace-nowrap ${courierFilter === 'pending' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'}`}>
                         <Smartphone className="w-4 h-4" /> Bekleyenler
                      </button>
                      <button onClick={() => setCourierFilter('inside')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border flex items-center gap-2 whitespace-nowrap ${courierFilter === 'inside' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'}`}>
                         <LogIn className="w-4 h-4" /> İçeridekiler
                      </button>
                   </div>
                   
                   <button 
                      onClick={() => setShowCourierModal(true)}
                      className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all shadow-lg shadow-blue-900/20 whitespace-nowrap"
                   >
                      <Plus className="w-4 h-4" />
                      Kurye Girişi
                   </button>
                </div>

                {/* List */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                   <div className="overflow-x-auto">
                      <table className="w-full text-left">
                         <thead>
                            <tr className="border-b border-slate-800 bg-slate-950/50 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                               <th className="px-6 py-4">Firma / Plaka</th>
                               <th className="px-6 py-4">Sipariş Sahibi</th>
                               <th className="px-6 py-4">Zaman</th>
                               <th className="px-6 py-4">Durum</th>
                               <th className="px-6 py-4 text-right">İşlemler</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-800/50">
                            {isLoading ? (
                                <>
                                    <CourierRowSkeleton />
                                    <CourierRowSkeleton />
                                    <CourierRowSkeleton />
                                    <CourierRowSkeleton />
                                    <CourierRowSkeleton />
                                </>
                            ) : (
                                <>
                                    {filteredCouriers.length > 0 ? filteredCouriers.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-800/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                                                    {item.company.includes('Yemek') || item.company.includes('Domino') || item.company.includes('Burger') ? (
                                                        <Utensils className="w-5 h-5 text-orange-400" />
                                                    ) : (
                                                        <ShoppingBag className="w-5 h-5 text-blue-400" />
                                                    )}
                                                </div>
                                                <div>
                                                <div className="text-sm font-bold text-white mb-0.5">{item.company}</div>
                                                {item.plate ? (
                                                    <div className="font-mono text-xs text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 w-fit">{item.plate}</div>
                                                ) : (
                                                    <div className="text-xs text-slate-500 font-medium">Yaya Kurye</div>
                                                )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-200 text-sm">{item.residentName}</div>
                                            <div className="text-xs text-slate-500">Daire {item.unit}</div>
                                            {item.note && <div className="text-[10px] text-amber-500/80 mt-1 italic">"{item.note}"</div>}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.entryTime ? (
                                                <div className="flex flex-col text-sm text-slate-300">
                                                <span className="flex items-center gap-2"><LogIn className="w-3.5 h-3.5 text-emerald-500" /> {item.entryTime}</span>
                                                {item.exitTime && <span className="flex items-center gap-2 text-xs text-slate-500 mt-0.5"><LogOut className="w-3.5 h-3.5 text-red-500" /> {item.exitTime}</span>}
                                                </div>
                                            ) : (
                                                <span className="text-xs text-slate-500">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.status === 'pending' && (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                                <Smartphone className="w-3.5 h-3.5" /> App Bildirimi
                                                </span>
                                            )}
                                            {item.status === 'inside' && (
                                                <div>
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 animate-pulse">
                                                    <Bike className="w-3.5 h-3.5" /> İçeride
                                                </span>
                                                </div>
                                            )}
                                            {item.status === 'completed' && (
                                                <div>
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-slate-800 text-slate-400 border border-slate-700">
                                                    <CheckCircle className="w-3.5 h-3.5" /> Çıkış Yaptı
                                                </span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {item.status === 'pending' && (
                                                <button 
                                                onClick={() => handleOpenConfirm('courier_in', item.id)}
                                                className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-blue-900/20"
                                                >
                                                <LogIn className="w-3.5 h-3.5" /> Giriş Yap
                                                </button>
                                            )}
                                            {item.status === 'inside' && (
                                                <button 
                                                onClick={() => handleOpenConfirm('courier_out', item.id)}
                                                className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-bold transition-all border border-slate-700"
                                                >
                                                <LogOut className="w-3.5 h-3.5" /> Çıkış Yap
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                    )) : (
                                    <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500"><Bike className="w-12 h-12 mx-auto mb-3 opacity-20" /><p>Kayıt bulunamadı.</p></td></tr>
                                    )}
                                </>
                            )}
                         </tbody>
                      </table>
                   </div>
                </div>
            </div>
          )}

        </div>
      </div>

      {/* Cargo Modal */}
      {showCargoModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
               <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                     <Package className="w-5 h-5 text-blue-500" />
                     {convertingId ? 'Bildirilen Kargoyu Kabul Et' : 'Yeni Kargo Girişi'}
                  </h2>
                  <button onClick={() => setShowCargoModal(false)} className="text-slate-400 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
               </div>
               
               <div className="p-6 space-y-4">
                  {convertingId && (
                     <div className="mb-4 bg-blue-500/10 border border-blue-500/20 p-3 rounded-lg flex gap-3 items-center">
                        <CheckCircle className="w-5 h-5 text-blue-400 shrink-0" />
                        <p className="text-xs text-blue-200">
                           Sakin bildiriminden gelen bilgiler otomatik dolduruldu. Lütfen kontrol edip onaylayın.
                        </p>
                     </div>
                  )}

                  <div className="space-y-2">
                     <label className="text-xs font-medium text-slate-400 uppercase">Kargo Firması</label>
                     <select 
                        value={newCargo.carrier}
                        onChange={(e) => setNewCargo({...newCargo, carrier: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer"
                     >
                        {CARRIERS.map(c => <option key={c} value={c}>{c}</option>)}
                     </select>
                  </div>

                  <div className="space-y-2">
                     <label className="text-xs font-medium text-slate-400 uppercase">Takip Numarası</label>
                     <div className="relative">
                        <Box className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input 
                           type="text" 
                           value={newCargo.trackingNo}
                           onChange={(e) => setNewCargo({...newCargo, trackingNo: e.target.value})}
                           className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-3 py-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                           placeholder="Opsiyonel"
                        />
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-400 uppercase">Alıcı Adı</label>
                        <div className="relative">
                           <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                           <input 
                              type="text" 
                              value={newCargo.recipientName}
                              onChange={(e) => setNewCargo({...newCargo, recipientName: e.target.value})}
                              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-3 py-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              placeholder="Ad Soyad"
                           />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-400 uppercase">Daire No</label>
                        <div className="relative">
                           <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                           <input 
                              type="text" 
                              value={newCargo.unit}
                              onChange={(e) => setNewCargo({...newCargo, unit: e.target.value})}
                              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-3 py-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              placeholder="Örn: A-5"
                           />
                        </div>
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-xs font-medium text-slate-400 uppercase">Paket Tipi / Boyut</label>
                     <div className="flex gap-2">
                        {['Small', 'Medium', 'Large'].map(type => (
                           <button
                              key={type}
                              onClick={() => setNewCargo({...newCargo, type: type as any})}
                              className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                                 newCargo.type === type 
                                 ? 'bg-blue-600 border-blue-500 text-white' 
                                 : 'bg-slate-950 border-slate-700 text-slate-400 hover:border-slate-500'
                              }`}
                           >
                              {type === 'Small' ? 'Küçük' : type === 'Medium' ? 'Orta' : 'Büyük'}
                           </button>
                        ))}
                     </div>
                  </div>
               </div>

               <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex gap-3">
                  <button onClick={() => setShowCargoModal(false)} className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors text-sm">İptal</button>
                  <button onClick={handleAddCargo} className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium shadow-lg transition-colors text-sm">
                     {convertingId ? 'Kabul Et & Ekle' : 'Kaydet'}
                  </button>
               </div>
            </div>
         </div>
      )}

      {/* Courier Modal */}
      {showCourierModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
               <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                     <Bike className="w-5 h-5 text-blue-500" />
                     Kurye Girişi Yap
                  </h2>
                  <button onClick={() => setShowCourierModal(false)} className="text-slate-400 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
               </div>
               
               <div className="p-6 space-y-4">
                  <div className="space-y-2">
                     <label className="text-xs font-medium text-slate-400 uppercase">Firma</label>
                     <select 
                        value={newCourier.company}
                        onChange={(e) => setNewCourier({...newCourier, company: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer"
                     >
                        {COURIER_COMPANIES.map(c => <option key={c} value={c}>{c}</option>)}
                     </select>
                  </div>

                  <div className="space-y-2">
                      <label className="text-xs font-medium text-slate-400 uppercase">Motor Plakası</label>
                      <div className="relative">
                          <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                          <input 
                              type="text" 
                              value={newCourier.plate}
                              onChange={(e) => setNewCourier({...newCourier, plate: e.target.value.toUpperCase()})}
                              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-3 py-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono tracking-wide"
                              placeholder="34 ABC 123"
                          />
                      </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-xs font-medium text-slate-400 uppercase">Sipariş Sahibi</label>
                     <select 
                        value={selectedResidentId}
                        onChange={handleResidentSelect}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer mb-2"
                     >
                        <option value="">Seçiniz</option>
                        {MOCK_RESIDENTS.map(r => <option key={r.id} value={r.id}>{r.name} - {r.unit}</option>)}
                        <option value="manual">Diğer / Manuel Giriş</option>
                     </select>
                     
                     {isManualCourier && (
                        <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                            <input 
                                type="text" 
                                value={newCourier.residentName}
                                onChange={(e) => setNewCourier({...newCourier, residentName: e.target.value})}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Ad Soyad"
                            />
                            <input 
                                type="text" 
                                value={newCourier.unit}
                                onChange={(e) => setNewCourier({...newCourier, unit: e.target.value})}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Daire"
                            />
                        </div>
                     )}
                     {!isManualCourier && selectedResidentId && (
                         <div className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg flex items-center gap-2">
                             <UserCheck className="w-4 h-4 text-emerald-500" />
                             <span className="text-sm text-slate-300">{newCourier.residentName} <span className="text-slate-500">({newCourier.unit})</span></span>
                         </div>
                     )}
                  </div>

                  <div className="space-y-2">
                     <label className="text-xs font-medium text-slate-400 uppercase">Güvenlik Notu (Opsiyonel)</label>
                     <input 
                        type="text" 
                        value={newCourier.note}
                        onChange={(e) => setNewCourier({...newCourier, note: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Örn: Onay alındı, paketi kapıya bırakacak"
                     />
                  </div>
               </div>

               <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex gap-3">
                  <button onClick={() => setShowCourierModal(false)} className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors text-sm">İptal</button>
                  <button onClick={handleAddCourier} className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium shadow-lg transition-colors text-sm">
                     Giriş Yap
                  </button>
               </div>
            </div>
         </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && confirmAction && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200">
            <div className={`bg-slate-900 border rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden relative ${
                confirmAction === 'cargo_return' ? 'border-red-500/30' : 'border-blue-500/30'
            }`}>
               <div className="p-6 text-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border ${
                      confirmAction === 'cargo_return' ? 'bg-red-500/10 border-red-500/20' : 
                      confirmAction.includes('courier') ? 'bg-blue-500/10 border-blue-500/20' : 
                      'bg-emerald-500/10 border-emerald-500/20'
                  }`}>
                     {confirmAction === 'cargo_deliver' && <CheckCircle className="w-8 h-8 text-emerald-500" />}
                     {confirmAction === 'cargo_return' && <RotateCcw className="w-8 h-8 text-red-500" />}
                     {confirmAction === 'courier_in' && <LogIn className="w-8 h-8 text-blue-500" />}
                     {confirmAction === 'courier_out' && <LogOut className="w-8 h-8 text-slate-400" />}
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2">
                     {confirmAction === 'cargo_deliver' && 'Kargo Teslimatı'}
                     {confirmAction === 'cargo_return' && 'Kargo İadesi'}
                     {confirmAction === 'courier_in' && 'Kurye Girişi'}
                     {confirmAction === 'courier_out' && 'Kurye Çıkışı'}
                  </h3>
                  
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">
                     <strong className="text-white block mb-1">{getTargetItemName()}</strong>
                     {confirmAction === 'cargo_deliver' && 'Paketi alıcıya teslim etmek istediğinize emin misiniz?'}
                     {confirmAction === 'cargo_return' && 'Paketi iade olarak işaretlemek istediğinize emin misiniz?'}
                     {confirmAction === 'courier_in' && 'Kuryenin siteye girişini onaylıyor musunuz?'}
                     {confirmAction === 'courier_out' && 'Kuryenin siteden çıkışını onaylıyor musunuz?'}
                  </p>

                  <div className="flex gap-3">
                     <button 
                        onClick={() => setShowConfirmModal(false)} 
                        className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors text-sm"
                     >
                        Vazgeç
                     </button>
                     <button 
                        onClick={processConfirmation} 
                        className={`flex-1 px-4 py-2.5 text-white rounded-xl font-bold shadow-lg transition-colors text-sm ${
                           confirmAction === 'cargo_return' ? 'bg-red-600 hover:bg-red-500' : 
                           confirmAction === 'courier_out' ? 'bg-slate-700 hover:bg-slate-600' :
                           'bg-blue-600 hover:bg-blue-500'
                        }`}
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

export default CargoPage;
