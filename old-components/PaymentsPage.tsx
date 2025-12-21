
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, Calendar, CheckCircle, XCircle, DollarSign, Wallet, AlertTriangle, X, ChevronDown, Download, RefreshCcw, CreditCard, ArrowUpDown, TrendingDown, Receipt, Wrench, Users, Droplets, Zap, Shield, FileText, Plus, Trash2, Flame, Sprout, Bell, Square, PlusCircle, Settings, Lock, CalendarRange, CheckSquare, Layers, Upload, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import StatCard from './StatCards';

// --- Types ---
interface PaymentRecord {
  id: string;
  unit: string;
  residentName: string;
  amount: number;
  status: 'paid' | 'unpaid';
  date?: string; // Payment date string (includes time)
  avatar: string;
  type: 'aidat' | 'demirbas' | 'yakit';
  phone: string;
}

interface ExpenseRecord {
  id: string;
  title: string;
  category: 'utilities' | 'maintenance' | 'personnel' | 'general';
  amount: number;
  date: string;
  status: 'paid' | 'pending';
  description?: string;
  attachment?: string;
}

// --- Constants ---
const ITEMS_PER_PAGE = 20;

const MONTHS = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = [
  (CURRENT_YEAR - 1).toString(),
  CURRENT_YEAR.toString(),
  (CURRENT_YEAR + 1).toString(),
  (CURRENT_YEAR + 2).toString()
];

const EXPENSE_CATEGORIES = [
  { 
    id: 'utilities', 
    label: 'Faturalar', 
    icon: Receipt, 
    color: 'blue', 
    subItems: [
      { label: 'Su Faturası', icon: Droplets },
      { label: 'Doğalgaz', icon: Flame },
      { label: 'Ortak Elektrik', icon: Zap }
    ] 
  },
  { 
    id: 'maintenance', 
    label: 'Bakım & Onarım', 
    icon: Wrench, 
    color: 'orange', 
    subItems: [
      { label: 'Asansör Bakımı', icon: RefreshCcw },
      { label: 'Havuz Bakımı', icon: Droplets },
      { label: 'Bahçe Düzenlemesi', icon: Sprout }
    ] 
  },
  { 
    id: 'personnel', 
    label: 'Personel & Güvenlik', 
    icon: Shield, 
    color: 'purple', 
    subItems: [
      { label: 'Güvenlik Personeli', icon: Shield },
      { label: 'Kapıcı Maaşı', icon: Users }
    ] 
  },
  { 
    id: 'general', 
    label: 'Genel Giderler', 
    icon: FileText, 
    color: 'slate', 
    subItems: [
      { label: 'Yönetim Giderleri', icon: FileText },
      { label: 'Kırtasiye', icon: FileText }
    ] 
  },
];

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

const PaymentRowSkeleton = () => (
  <tr className="border-b border-slate-800/50 animate-pulse">
     <td className="px-6 py-4 text-center"><div className="w-5 h-5 bg-slate-800 rounded mx-auto" /></td>
     <td className="px-6 py-4"><div className="h-6 w-12 bg-slate-800 rounded" /></td>
     <td className="px-6 py-4">
        <div className="flex items-center gap-3">
           <div className="w-9 h-9 rounded-full bg-slate-800 shrink-0" />
           <div className="space-y-2">
              <div className="h-4 w-32 bg-slate-800 rounded" />
              <div className="h-3 w-20 bg-slate-800 rounded" />
           </div>
        </div>
     </td>
     <td className="px-6 py-4"><div className="h-4 w-16 bg-slate-800 rounded" /></td>
     <td className="px-6 py-4"><div className="h-5 w-20 bg-slate-800 rounded" /></td>
     <td className="px-6 py-4"><div className="h-6 w-24 bg-slate-800 rounded-full" /></td>
     <td className="px-6 py-4 text-right"><div className="h-8 w-8 bg-slate-800 rounded ml-auto" /></td>
  </tr>
);

const ExpenseGroupSkeleton = () => (
  <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm animate-pulse">
     <div className="p-4 bg-slate-950/50 border-b border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 rounded-lg bg-slate-800" />
           <div className="h-5 w-32 bg-slate-800 rounded" />
        </div>
        <div className="h-4 w-20 bg-slate-800 rounded" />
     </div>
     <div className="divide-y divide-slate-800/50">
        {[1, 2].map(i => (
           <div key={i} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-slate-800" />
                 <div className="space-y-2">
                    <div className="h-4 w-40 bg-slate-800 rounded" />
                    <div className="h-3 w-24 bg-slate-800 rounded" />
                 </div>
              </div>
              <div className="flex items-center gap-6">
                 <div className="space-y-2 text-right">
                    <div className="h-5 w-20 bg-slate-800 rounded ml-auto" />
                    <div className="h-3 w-12 bg-slate-800 rounded ml-auto" />
                 </div>
                 <div className="w-8 h-8 bg-slate-800 rounded" />
              </div>
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

// --- Helper Functions ---
const getMonthIndex = (monthName: string) => MONTHS.indexOf(monthName);

const isDateInPast = (month: string, year: string) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  
  const targetYear = parseInt(year);
  const targetMonth = getMonthIndex(month);

  if (targetYear < currentYear) return true;
  if (targetYear === currentYear && targetMonth < currentMonth) return true;
  return false;
};

// --- Mock Data Generator ---
const generateMockData = (month: string, year: string): PaymentRecord[] => {
  const baseResidents = [
    { unit: 'A-1', name: 'Ahmet Yılmaz', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=64&h=64' },
    { unit: 'A-2', name: 'Mehmet Demir', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=64&h=64' },
    { unit: 'A-3', name: 'Ayşe Kaya', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&h=64' },
    { unit: 'A-4', name: 'Fatma Çelik', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=64&h=64' },
    { unit: 'B-1', name: 'Caner Erkin', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&h=64' },
    { unit: 'B-2', name: 'Zeynep Su', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=64&h=64' },
    { unit: 'B-3', name: 'Ali Veli', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=64&h=64' },
    { unit: 'C-1', name: 'Selin Yılmaz', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64' },
  ];

  // Generate ~50 more residents for pagination demo
  const generatedResidents = Array.from({ length: 42 }, (_, i) => ({
    unit: `${['A','B','C','D'][Math.floor(Math.random()*4)]}-${Math.floor(Math.random()*15)+1}`,
    name: `Sakin ${i + 9}`,
    avatar: `https://ui-avatars.com/api/?name=Sakin+${i+9}&background=random&color=fff`
  }));

  const allResidents = [...baseResidents, ...generatedResidents];

  return allResidents.map((res, index) => {
    const isPaid = Math.random() > 0.4;
    const day = Math.floor(Math.random() * 28) + 1;
    const hour = String(Math.floor(Math.random() * 14) + 8).padStart(2, '0');
    const minute = String(Math.floor(Math.random() * 60)).padStart(2, '0');
    const dateStr = `${day} ${month} ${year} ${hour}:${minute}`;

    return {
        id: `pay-${index}-${month}-${year}`,
        unit: res.unit,
        residentName: res.name,
        avatar: res.avatar,
        amount: 1250, // Fixed Dues
        type: 'aidat',
        status: isPaid ? 'paid' : 'unpaid',
        date: isPaid ? dateStr : undefined,
        phone: `05${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 90) + 10}`
    };
  });
};

const generateMockExpenses = (month: string, year: string): ExpenseRecord[] => {
  return [
    { id: 'exp-1', title: 'Asansör Bakımı', category: 'maintenance', amount: 3500, date: `5 ${month} ${year}`, status: 'paid' },
    { id: 'exp-2', title: 'Ortak Elektrik', category: 'utilities', amount: 8450, date: `12 ${month} ${year}`, status: 'pending' },
    { id: 'exp-3', title: 'Güvenlik Personeli', category: 'personnel', amount: 24000, date: `1 ${month} ${year}`, status: 'paid' },
    { id: 'exp-4', title: 'Su Faturası', category: 'utilities', amount: 1200, date: `14 ${month} ${year}`, status: 'paid' },
    { id: 'exp-5', title: 'Bahçe Düzenlemesi', category: 'maintenance', amount: 1500, date: `20 ${month} ${year}`, status: 'pending' },
    { id: 'exp-6', title: 'Kırtasiye', category: 'general', amount: 450, date: `8 ${month} ${year}`, status: 'paid' },
  ];
};

// --- Custom Dropdown Component ---
interface CustomDropdownProps {
  options: string[];
  value: string;
  onChange: (val: string) => void;
  icon?: React.ElementType;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ options, value, onChange, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-200 min-w-[140px] justify-between ${
          isOpen 
            ? 'bg-slate-800 border-blue-500 text-white shadow-lg shadow-blue-900/20' 
            : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-600 hover:bg-slate-800'
        }`}
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon className={`w-4 h-4 ${isOpen ? 'text-blue-400' : 'text-slate-500'}`} />}
          <span className="font-medium text-sm">{value}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-400' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100 max-h-64 overflow-y-auto custom-scrollbar">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between group ${
                value === option 
                  ? 'bg-blue-600/10 text-blue-400 font-medium' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {option}
              {value === option && <CheckCircle className="w-3.5 h-3.5" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const PaymentsPage = () => {
  // --- State ---
  const [activeTab, setActiveTab] = useState<'income' | 'expenses'>('income');
  const [selectedMonth, setSelectedMonth] = useState<string>(MONTHS[new Date().getMonth()]);
  const [selectedYear, setSelectedYear] = useState<string>(CURRENT_YEAR.toString());
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // Pagination State
  
  // Income States
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'unpaid'>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
  const [payments, setPayments] = useState<PaymentRecord[]>(() => {
    return Math.random() > 0.2 ? generateMockData(selectedMonth, selectedYear) : [];
  });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Dues Generation State
  const [showDuesModal, setShowDuesModal] = useState(false);
  const [duesMode, setDuesMode] = useState<'single' | 'bulk'>('single');
  const [duesAmountInput, setDuesAmountInput] = useState<number>(1250);
  const [bulkDuesList, setBulkDuesList] = useState<{month: string, year: string, amount: number}[]>([]);

  // Expense States
  const [expenses, setExpenses] = useState<ExpenseRecord[]>(() => {
     return generateMockExpenses(selectedMonth, selectedYear);
  });
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [newExpense, setNewExpense] = useState<Partial<ExpenseRecord>>({
    title: '', category: 'utilities', amount: 0, status: 'pending', date: '', attachment: ''
  });

  // Confirmation Modal State (Income)
  const [pendingToggleId, setPendingToggleId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'pay' | 'cancel'>('pay');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

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
  }, [selectedMonth, selectedYear, searchTerm, statusFilter, activeTab]);

  // Re-generate data if month/year changes
  useEffect(() => {
    // Ideally would be async fetch
    setIsLoading(true);
    const timer = setTimeout(() => {
        const hasData = Math.random() > 0.2;
        setPayments(hasData ? generateMockData(selectedMonth, selectedYear) : []);
        setExpenses(generateMockExpenses(selectedMonth, selectedYear));
        setSelectedIds([]); // Clear selections on period change
        setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [selectedMonth, selectedYear]);

  // Initial setup for Bulk Dues
  useEffect(() => {
    if (showDuesModal) {
      // Generate Jan-Dec for the selected year
      const fullYearList = MONTHS.map(month => ({
        month: month,
        year: selectedYear,
        amount: 1250 // Default
      }));
      setBulkDuesList(fullYearList);
      setDuesAmountInput(1250);
    }
  }, [showDuesModal, selectedYear]);

  // --- Derived Data (Income) ---
  const filteredPayments = useMemo(() => {
    let result = payments.filter(p => 
      p.residentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.unit.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (statusFilter === 'paid') {
        result = result.filter(p => p.status === 'paid');
    } else if (statusFilter === 'unpaid') {
        result = result.filter(p => p.status === 'unpaid');
    }

    if (sortOrder) {
        result.sort((a, b) => {
            if (a.status === b.status) return 0;
            const scoreA = a.status === 'paid' ? 1 : 0;
            const scoreB = b.status === 'paid' ? 1 : 0;
            return sortOrder === 'asc' ? (scoreB - scoreA) : (scoreA - scoreB);
        });
    }

    return result;
  }, [payments, searchTerm, statusFilter, sortOrder]);

  // Paginated Data
  const paginatedPayments = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPayments.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredPayments, currentPage]);

  // Filter only unpaid payments for checkbox selection (from ALL filtered items, not just page)
  const selectablePayments = useMemo(() => {
    return filteredPayments.filter(p => p.status === 'unpaid');
  }, [filteredPayments]);

  const incomeStats = useMemo(() => {
    const total = payments.reduce((acc, curr) => acc + curr.amount, 0);
    const collected = payments.filter(p => p.status === 'paid').reduce((acc, curr) => acc + curr.amount, 0);
    const pending = total - collected;
    const rate = total > 0 ? Math.round((collected / total) * 100) : 0;
    return { total, collected, pending, rate };
  }, [payments]);

  // --- Derived Data (Expenses) ---
  const expenseStats = useMemo(() => {
    const total = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const paid = expenses.filter(e => e.status === 'paid').reduce((acc, curr) => acc + curr.amount, 0);
    const pending = total - paid;
    return { total, paid, pending };
  }, [expenses]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter(e => e.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [expenses, searchTerm]);

  const isSelectedPeriodPast = isDateInPast(selectedMonth, selectedYear);
  const targetPayment = pendingToggleId ? payments.find(p => p.id === pendingToggleId) : null;

  // --- Handlers (Selection) ---
  const toggleSelectAll = () => {
    // Select all selectables on current view or all? Usually all filtered.
    const allSelectableIds = selectablePayments.map(p => p.id);
    const isAllSelected = allSelectableIds.length > 0 && allSelectableIds.every(id => selectedIds.includes(id));

    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(allSelectableIds);
    }
  };

  const toggleSelectRow = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(prev => prev.filter(i => i !== id));
    } else {
      setSelectedIds(prev => [...prev, id]);
    }
  };

  // --- Handlers (Income) ---
  const handleToggleClick = (id: string, currentStatus: 'paid' | 'unpaid') => {
    setPendingToggleId(id);
    if (currentStatus === 'unpaid') {
      setActionType('pay');
    } else {
      setActionType('cancel');
    }
    setShowConfirmModal(true);
  };

  const processTransaction = () => {
    if (pendingToggleId) {
      const today = new Date();
      const hour = String(today.getHours()).padStart(2, '0');
      const minute = String(today.getMinutes()).padStart(2, '0');
      const dateStr = `${today.getDate()} ${selectedMonth} ${selectedYear} ${hour}:${minute}`;
      
      setPayments(prev => prev.map(p => {
        if (p.id !== pendingToggleId) return p;
        if (actionType === 'pay') {
           return { ...p, status: 'paid', date: dateStr };
        } else {
           return { ...p, status: 'unpaid', date: undefined };
        }
      }));
      setShowConfirmModal(false);
      setPendingToggleId(null);
    }
  };

  const toggleSort = () => {
    if (sortOrder === null) setSortOrder('asc');
    else if (sortOrder === 'asc') setSortOrder('desc');
    else setSortOrder(null);
  };

  const handleSendReminder = (id: string) => {
    alert(`Hatırlatma mesajı gönderildi! (ID: ${id})`);
  };

  const handleBulkRemind = () => {
    alert(`${selectedIds.length} kişi için hatırlatma mesajı kuyruğa eklendi.`);
    setSelectedIds([]);
  };

  const handleApplyBulkAmount = () => {
    setBulkDuesList(prev => prev.map(item => ({...item, amount: duesAmountInput})));
  };

  const handleGenerateDues = () => {
    if (duesMode === 'single') {
        const newPayments = payments.map(p => ({
          ...p,
          amount: duesAmountInput,
        }));
        setPayments(newPayments);
        alert(`${selectedMonth} ${selectedYear} için ${duesAmountInput}₺ tutarında aidat kayıtları güncellendi.`);
    } else {
        // Bulk logic mock
        alert(`Gelecek 12 ay için aidat planlaması başarıyla kaydedildi. \nÖrn: ${bulkDuesList[0].month} - ${bulkDuesList[0].amount}₺`);
    }
    setShowDuesModal(false);
  };

  // --- Handlers (Expenses) ---
  const handleAddExpense = () => {
    if(!newExpense.title || !newExpense.amount) return;
    const expense: ExpenseRecord = {
      id: `new-exp-${Date.now()}`,
      title: newExpense.title || '',
      category: newExpense.category as any,
      amount: Number(newExpense.amount),
      date: newExpense.date || `${new Date().getDate()} ${selectedMonth} ${selectedYear}`,
      status: newExpense.status as any,
      attachment: newExpense.attachment // Include the attachment
    };
    setExpenses([...expenses, expense]);
    setShowAddExpenseModal(false);
    setNewExpense({ title: '', category: 'utilities', amount: 0, status: 'pending', date: '', attachment: '' });
  };

  const handleDeleteExpense = (id: string) => {
    if(window.confirm('Bu gider kaydını silmek istediğinize emin misiniz?')) {
      setExpenses(prev => prev.filter(e => e.id !== id));
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 overflow-hidden relative">
      
      {/* Header */}
      <header className="h-20 border-b border-slate-800/50 flex items-center justify-between px-8 bg-slate-950 shrink-0 z-20">
         <div className="flex items-center gap-4">
           <h1 className="text-2xl font-bold font-heading text-white">Mali Yönetim</h1>
         </div>
         
         <div className="flex items-center gap-4">
            {/* Custom Dropdowns */}
            <div className="flex items-center gap-3">
               <CustomDropdown 
                  options={MONTHS} 
                  value={selectedMonth} 
                  onChange={setSelectedMonth} 
                  icon={Calendar}
               />
               <CustomDropdown 
                  options={YEARS} 
                  value={selectedYear} 
                  onChange={setSelectedYear} 
                  icon={CreditCard}
               />
            </div>

            {/* Generate Dues Button */}
            {activeTab === 'income' && (
              <button 
                onClick={() => setShowDuesModal(true)}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-900/20"
              >
                <PlusCircle className="w-4 h-4" />
                <span className="hidden lg:inline">Aidat Oluştur</span>
              </button>
            )}

            <div className="h-8 w-px bg-slate-800 mx-2"></div>

            <button className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all border border-slate-800 hover:border-slate-700">
               <Download className="w-4 h-4" />
               <span className="hidden lg:inline">Rapor</span>
            </button>
         </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
         <div className="max-w-7xl mx-auto space-y-8 pb-20">
            
            {/* Large Date Display & Tab Switcher */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                   <h2 className="text-4xl md:text-5xl font-bold font-heading text-white tracking-tight mb-4 flex items-center gap-4">
                     {selectedMonth} <span className="text-slate-600">{selectedYear}</span>
                     {activeTab === 'income' && isSelectedPeriodPast && (
                        <div className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1 flex items-center gap-2 animate-in fade-in">
                           <Lock className="w-5 h-5 text-slate-500" />
                           <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Arşiv Dönemi</span>
                        </div>
                     )}
                   </h2>
                   
                   {/* Tab Switcher */}
                   <div className="inline-flex bg-slate-900 p-1.5 rounded-xl border border-slate-800">
                      <button 
                        onClick={() => setActiveTab('income')}
                        className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'income' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                      >
                         <Wallet className="w-4 h-4" />
                         Gelirler (Aidat)
                      </button>
                      <button 
                        onClick={() => setActiveTab('expenses')}
                        className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'expenses' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                      >
                         <TrendingDown className="w-4 h-4" />
                         Giderler
                      </button>
                   </div>
                </div>
                
                {/* Search Bar */}
                <div className="relative w-full md:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input 
                    type="text" 
                    placeholder={activeTab === 'income' ? "Sakin veya daire ara..." : "Gider kalemi ara..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder-slate-500 transition-all shadow-lg"
                  />
               </div>
            </div>
            
            {/* VIEW: INCOME (RESIDENTS PAYMENTS) */}
            {activeTab === 'income' && (
              <>
                {/* Stats Overview */}
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
                          title="Toplanan Aidat" 
                          value={`₺${incomeStats.collected.toLocaleString()}`} 
                          trend={`%${incomeStats.rate}`} 
                          trendUp={incomeStats.rate > 50} 
                          trendText="tahsilat oranı"
                          variant="green"
                          icon={Wallet}
                        />
                        <StatCard 
                          title="Bekleyen Ödeme" 
                          value={`₺${incomeStats.pending.toLocaleString()}`} 
                          trend={`${payments.filter(p => p.status === 'unpaid').length} Kişi`}
                          trendUp={false} 
                          trendText="henüz ödemedi"
                          variant="orange"
                          icon={AlertTriangle}
                        />
                        <StatCard 
                          title="Toplam Beklenti" 
                          value={`₺${incomeStats.total.toLocaleString()}`} 
                          trend={selectedMonth} 
                          trendUp={true} 
                          trendText={`${selectedYear} bütçesi`}
                          variant="blue"
                          icon={DollarSign}
                        />
                      </>
                   )}
                </div>

                {/* Filter Chips */}
                <div className="flex items-center gap-2">
                    <button onClick={() => setStatusFilter('all')} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${statusFilter === 'all' ? 'bg-blue-600 border-blue-500 text-white shadow-lg' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-white'}`}>TÜMÜ</button>
                    <button onClick={() => setStatusFilter('paid')} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${statusFilter === 'paid' ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-white'}`}>ÖDEYENLER</button>
                    <button onClick={() => setStatusFilter('unpaid')} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${statusFilter === 'unpaid' ? 'bg-red-600 border-red-500 text-white shadow-lg' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-white'}`}>ÖDEMEYENLER</button>
                </div>

                {/* Payments List */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                   <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                         <thead>
                            <tr className="bg-slate-950/50 border-b border-slate-800 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                               <th className="px-6 py-4 w-12 text-center">
                                  <button 
                                      onClick={toggleSelectAll} 
                                      className={`flex items-center justify-center ${selectablePayments.length === 0 ? 'opacity-50 cursor-not-allowed' : 'text-slate-400 hover:text-white'}`}
                                      disabled={selectablePayments.length === 0}
                                  >
                                    {selectablePayments.length > 0 && selectedIds.length === selectablePayments.length ? <CheckSquare className="w-5 h-5 text-blue-500" /> : <Square className="w-5 h-5" />}
                                  </button>
                               </th>
                               <th className="px-6 py-4 w-24">Daire</th>
                               <th className="px-6 py-4">Sakin</th>
                               <th className="px-6 py-4">Ödeme Türü</th>
                               <th className="px-6 py-4">Tutar</th>
                               <th className="px-6 py-4 cursor-pointer hover:text-white transition-colors group select-none" onClick={toggleSort}>
                                  <div className="flex items-center gap-1">Durum <ArrowUpDown className={`w-3.5 h-3.5 transition-opacity ${sortOrder ? 'opacity-100 text-blue-400' : 'opacity-40 group-hover:opacity-100'}`} /></div>
                               </th>
                               <th className="px-6 py-4 text-right">İşlem</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-800/50">
                            {isLoading ? (
                               <>
                                  <PaymentRowSkeleton />
                                  <PaymentRowSkeleton />
                                  <PaymentRowSkeleton />
                                  <PaymentRowSkeleton />
                                  <PaymentRowSkeleton />
                               </>
                            ) : (
                               <>
                                  {paginatedPayments.length > 0 ? (
                                     paginatedPayments.map((payment) => {
                                        const isSelected = selectedIds.includes(payment.id);
                                        const isSelectable = payment.status === 'unpaid';
                                        
                                        return (
                                        <tr key={payment.id} className={`transition-colors group animate-in fade-in duration-300 ${isSelected ? 'bg-blue-900/10' : 'hover:bg-slate-800/30'}`}>
                                           <td className="px-6 py-4 text-center">
                                              <button 
                                                  onClick={() => isSelectable && toggleSelectRow(payment.id)} 
                                                  disabled={!isSelectable}
                                                  className={`flex items-center justify-center ${isSelected ? 'text-blue-500' : 'text-slate-600 group-hover:text-slate-400'} ${!isSelectable ? 'opacity-20 cursor-not-allowed' : ''}`}
                                              >
                                                 {isSelected ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                                              </button>
                                           </td>
                                           <td className="px-6 py-4">
                                              <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded-md font-mono text-sm font-bold border border-slate-700">{payment.unit}</span>
                                           </td>
                                           <td className="px-6 py-4">
                                              <div className="flex items-center gap-3">
                                                 <img src={payment.avatar} alt={payment.residentName} className="w-9 h-9 rounded-full border border-slate-700 object-cover" />
                                                 <div>
                                                    <div className="font-medium text-slate-200">{payment.residentName}</div>
                                                    <div className="text-xs text-slate-500 opacity-60 font-mono tracking-wide">{payment.phone}</div>
                                                 </div>
                                              </div>
                                           </td>
                                           <td className="px-6 py-4"><span className="text-sm text-slate-400 capitalize">{payment.type}</span></td>
                                           <td className="px-6 py-4"><span className="font-bold text-slate-200">₺{payment.amount.toLocaleString()}</span></td>
                                           <td className="px-6 py-4">
                                              {payment.status === 'paid' ? (
                                                 <div className="flex flex-col">
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 w-fit"><CheckCircle className="w-3 h-3" /> Ödendi</span>
                                                    <span className="text-[10px] text-emerald-500/60 mt-1 pl-1 font-medium font-mono">{payment.date}</span>
                                                 </div>
                                              ) : (
                                                 <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20"><XCircle className="w-3 h-3" /> Ödenmedi</span>
                                              )}
                                           </td>
                                           <td className="px-6 py-4 text-right">
                                              <div className="flex items-center justify-end gap-3">
                                                 {payment.status === 'unpaid' && (
                                                   <button 
                                                      onClick={() => handleSendReminder(payment.id)}
                                                      className="p-1.5 text-slate-500 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors"
                                                      title="Hatırlatma Gönder"
                                                   >
                                                      <Bell className="w-4 h-4" />
                                                   </button>
                                                 )}
                                                 <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" className="sr-only peer" checked={payment.status === 'paid'} onChange={() => handleToggleClick(payment.id, payment.status)} />
                                                    <div className={`w-11 h-6 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${payment.status === 'paid' ? 'bg-emerald-600 after:border-white' : 'bg-red-600/60 hover:bg-red-600/80'}`}></div>
                                                 </label>
                                              </div>
                                           </td>
                                        </tr>
                                        );
                                     })
                                  ) : (
                                     <tr><td colSpan={7} className="px-6 py-20 text-center text-slate-500"><p>Arama kriterlerine uygun kayıt bulunamadı.</p></td></tr>
                                  )}
                               </>
                            )}
                         </tbody>
                      </table>
                   </div>
                </div>
                
                {/* Pagination Controls */}
                {!isLoading && (
                    <PaginationControls 
                        totalItems={filteredPayments.length}
                        itemsPerPage={ITEMS_PER_PAGE}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                    />
                )}
              </>
            )}

            {/* VIEW: EXPENSES (MANAGER EXPENSES) */}
            {activeTab === 'expenses' && (
               <>
                  {/* Expense Stats */}
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
                              title="Toplam Gider" 
                              value={`₺${expenseStats.total.toLocaleString()}`} 
                              trend={selectedMonth}
                              trendUp={false}
                              trendText="toplam fatura"
                              variant="blue"
                              icon={TrendingDown}
                           />
                           <StatCard 
                              title="Ödenen" 
                              value={`₺${expenseStats.paid.toLocaleString()}`} 
                              trend="%100"
                              trendUp={true}
                              trendText="başarıyla ödendi"
                              variant="green"
                              icon={CheckCircle}
                           />
                           <StatCard 
                              title="Ödenecek" 
                              value={`₺${expenseStats.pending.toLocaleString()}`} 
                              trend={`${expenses.filter(e => e.status === 'pending').length} Kalem`}
                              trendUp={false}
                              trendText="bekleyen fatura"
                              variant="orange"
                              icon={AlertTriangle}
                           />
                        </>
                     )}
                  </div>

                  {/* Add Expense Button */}
                  <div className="flex justify-end">
                     <button 
                        onClick={() => setShowAddExpenseModal(true)}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-900/20 transition-all hover:scale-105"
                     >
                        <Plus className="w-5 h-5" />
                        Yeni Gider Ekle
                     </button>
                  </div>

                  {/* Grouped Expenses List */}
                  <div className="space-y-6">
                     {isLoading ? (
                        <>
                           <ExpenseGroupSkeleton />
                           <ExpenseGroupSkeleton />
                           <ExpenseGroupSkeleton />
                        </>
                     ) : (
                        <>
                           {EXPENSE_CATEGORIES.map(category => {
                              const categoryExpenses = filteredExpenses.filter(e => e.category === category.id);
                              if(categoryExpenses.length === 0) return null;

                              return (
                                 <div key={category.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm animate-in fade-in duration-300">
                                    {/* Group Header */}
                                    <div className="p-4 bg-slate-950/50 border-b border-slate-800 flex justify-between items-center">
                                       <div className="flex items-center gap-3">
                                          <div className={`p-2 rounded-lg bg-${category.color}-500/10 border border-${category.color}-500/20`}>
                                             <category.icon className={`w-5 h-5 text-${category.color}-500`} />
                                          </div>
                                          <h3 className="font-bold text-white">{category.label}</h3>
                                       </div>
                                       <span className="text-slate-500 text-sm font-medium">Top: ₺{categoryExpenses.reduce((a, b) => a + b.amount, 0).toLocaleString()}</span>
                                    </div>

                                    {/* Items */}
                                    <div className="divide-y divide-slate-800/50">
                                       {categoryExpenses.map(expense => (
                                          <div key={expense.id} className="p-4 flex items-center justify-between hover:bg-slate-800/20 transition-colors group">
                                             <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 overflow-hidden relative">
                                                    {expense.attachment ? (
                                                      <img src={expense.attachment} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                      <FileText className="w-5 h-5" />
                                                    )}
                                                </div>
                                                <div>
                                                   <h4 className="font-bold text-slate-200">{expense.title}</h4>
                                                   <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                                                      <Calendar className="w-3 h-3" /> {expense.date}
                                                   </div>
                                                </div>
                                             </div>
                                             
                                             <div className="flex items-center gap-6">
                                                <div className="text-right">
                                                   <div className="font-bold text-slate-200">₺{expense.amount.toLocaleString()}</div>
                                                   <div className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 ${expense.status === 'paid' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                                      {expense.status === 'paid' ? 'Ödendi' : 'Bekliyor'}
                                                   </div>
                                                </div>
                                                <button 
                                                   onClick={() => handleDeleteExpense(expense.id)}
                                                   className="p-2 text-slate-600 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                                >
                                                   <Trash2 className="w-4 h-4" />
                                                </button>
                                             </div>
                                          </div>
                                       ))}
                                    </div>
                                 </div>
                              );
                           })}

                           {filteredExpenses.length === 0 && (
                              <div className="text-center py-12 text-slate-500">
                                 <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                 <p>Bu dönem için kayıtlı gider bulunmuyor.</p>
                              </div>
                           )}
                        </>
                     )}
                  </div>
               </>
            )}

         </div>
      </div>

      {/* Bulk Action Bar (Floating) */}
      {selectedIds.length > 0 && activeTab === 'income' && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-6 py-3 rounded-full shadow-2xl border border-slate-700 flex items-center gap-6 animate-in slide-in-from-bottom-5 z-40">
           <div className="flex items-center gap-3 border-r border-slate-600 pr-6">
              <div className="bg-blue-600 text-xs font-bold rounded px-2 py-0.5">{selectedIds.length}</div>
              <span className="text-sm font-medium">Kişi Seçildi</span>
           </div>
           <div className="flex items-center gap-3">
              <button onClick={handleBulkRemind} className="flex items-center gap-2 text-sm font-bold text-amber-400 hover:text-amber-300 transition-colors">
                 <Bell className="w-4 h-4" />
                 Hatırlatma Gönder
              </button>
              <button onClick={() => setSelectedIds([])} className="text-sm text-slate-400 hover:text-white ml-2">
                 İptal
              </button>
           </div>
        </div>
      )}

      {/* Confirmation Modal (Income) */}
      {showConfirmModal && targetPayment && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200">
            <div className={`bg-slate-900 border rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden relative ${actionType === 'pay' ? 'border-blue-500/30' : 'border-red-500/30'}`}>
               <div className="p-6 text-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border ${actionType === 'pay' ? 'bg-blue-500/10 border-blue-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                     {actionType === 'pay' ? <Wallet className="w-8 h-8 text-blue-500" /> : <RefreshCcw className="w-8 h-8 text-red-500" />}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{actionType === 'pay' ? 'Ödeme Onayı' : 'Ödeme İptali'}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">
                     <strong className="text-white font-bold">{targetPayment.residentName}</strong> isimli sakinin <br/>
                     <strong className={`font-bold text-lg ${actionType === 'pay' ? 'text-emerald-400' : 'text-red-400'}`}>₺{targetPayment.amount.toLocaleString()}</strong> <br/>
                     tutarındaki ödemesini {actionType === 'pay' ? 'onaylıyor musunuz?' : 'iptal etmek istiyor musunuz?'}
                  </p>
                  <div className="flex gap-3">
                     <button onClick={() => { setShowConfirmModal(false); setPendingToggleId(null); }} className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors text-sm">Vazgeç</button>
                     <button onClick={processTransaction} className={`flex-1 px-4 py-2.5 text-white rounded-xl font-bold shadow-lg transition-colors text-sm ${actionType === 'pay' ? 'bg-blue-600 hover:bg-blue-500' : 'bg-red-600 hover:bg-red-500'}`}>{actionType === 'pay' ? 'Onayla' : 'İptal Et'}</button>
                  </div>
               </div>
            </div>
         </div>
      )}

      {/* Dues Generator Modal */}
      {showDuesModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200">
            <div className={`bg-slate-900 border border-slate-800 rounded-2xl w-full ${duesMode === 'bulk' ? 'max-w-5xl' : 'max-w-md'} shadow-2xl overflow-hidden relative transition-all duration-300`}>
               <div className="p-6 border-b border-slate-800 bg-slate-900 flex justify-between items-center">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                     <Settings className="w-5 h-5 text-indigo-500" /> Aidat Planlaması
                  </h2>
                  <button onClick={() => setShowDuesModal(false)} className="text-slate-400 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
               </div>
               
               <div className="p-6 space-y-6">
                  {/* Mode Switcher */}
                  <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                     <button 
                        onClick={() => setDuesMode('single')} 
                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${duesMode === 'single' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                     >
                        Tek Ay
                     </button>
                     <button 
                        onClick={() => setDuesMode('bulk')} 
                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${duesMode === 'bulk' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                     >
                        Yıllık Plan (12 Ay)
                     </button>
                  </div>

                  {/* Mode 1: Single Month */}
                  {duesMode === 'single' && (
                     <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                        {isSelectedPeriodPast ? (
                           <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
                               <Lock className="w-10 h-10 text-red-500 mx-auto mb-3 opacity-60" />
                               <h3 className="text-red-400 font-bold mb-1">Dönem Kilitli</h3>
                               <p className="text-slate-400 text-sm">
                                 Geçmiş dönemler ({selectedMonth} {selectedYear}) için aidat düzenlemesi yapılamaz. 
                                 Lütfen mevcut veya gelecek bir dönem seçiniz.
                               </p>
                           </div>
                        ) : (
                           <>
                              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
                                 <p className="text-sm text-indigo-200">
                                    <span className="font-bold">{selectedMonth} {selectedYear}</span> dönemi için tüm dairelere toplu aidat borcu oluşturulacaktır.
                                 </p>
                              </div>

                              <div className="space-y-2">
                                 <label className="text-xs font-medium text-slate-400 uppercase">Aidat Tutarı (₺)</label>
                                 <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₺</span>
                                    <input 
                                       type="number" 
                                       value={duesAmountInput}
                                       onChange={(e) => setDuesAmountInput(parseInt(e.target.value))}
                                       className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-3 py-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold text-lg"
                                    />
                                 </div>
                              </div>
                           </>
                        )}
                     </div>
                  )}

                  {/* Mode 2: Bulk (12 Months) - Grid Layout */}
                  {duesMode === 'bulk' && (
                     <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-800 flex items-end gap-4">
                           <div className="flex-1 space-y-2">
                              <label className="text-xs font-medium text-slate-400 uppercase">Varsayılan Tutar</label>
                              <div className="relative">
                                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₺</span>
                                 <input 
                                    type="number" 
                                    value={duesAmountInput}
                                    onChange={(e) => setDuesAmountInput(parseInt(e.target.value))}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                 />
                              </div>
                           </div>
                           <button 
                              onClick={handleApplyBulkAmount}
                              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-bold transition-colors mb-0.5"
                           >
                              Tümüne Uygula
                           </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto custom-scrollbar p-1">
                           {bulkDuesList.map((item, index) => {
                              const isLocked = isDateInPast(item.month, item.year);
                              return (
                              <div key={`${item.month}-${item.year}`} className={`bg-slate-950/50 border border-slate-800 rounded-xl p-4 flex flex-col gap-3 transition-all group ${isLocked ? 'opacity-50 grayscale' : 'hover:border-indigo-500/30'}`}>
                                 <div className="flex justify-between items-center pb-2 border-b border-slate-800 group-hover:border-indigo-500/20">
                                    <span className="font-bold text-white text-sm">{item.month}</span>
                                    <span className="text-xs text-slate-500 font-medium bg-slate-900 px-2 py-0.5 rounded">{item.year}</span>
                                    {isLocked && <Lock className="w-3 h-3 text-red-500" />}
                                 </div>
                                 <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-xs">₺</span>
                                    <input 
                                       type="number" 
                                       value={item.amount}
                                       disabled={isLocked}
                                       onChange={(e) => {
                                          const newList = [...bulkDuesList];
                                          newList[index].amount = parseInt(e.target.value);
                                          setBulkDuesList(newList);
                                       }}
                                       className={`w-full bg-slate-900 border border-slate-700 rounded-lg pl-6 pr-2 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 font-medium text-right ${isLocked ? 'cursor-not-allowed text-slate-500' : ''}`}
                                    />
                                 </div>
                              </div>
                           )})}
                        </div>
                     </div>
                  )}

               </div>

               <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex gap-3">
                  <button onClick={() => setShowDuesModal(false)} className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors text-sm">İptal</button>
                  <button 
                     onClick={handleGenerateDues} 
                     disabled={duesMode === 'single' && isSelectedPeriodPast}
                     className={`flex-1 px-4 py-2 rounded-xl font-medium shadow-lg transition-colors text-sm ${
                        duesMode === 'single' && isSelectedPeriodPast 
                           ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                           : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                     }`}
                  >
                     {duesMode === 'single' ? 'Oluştur' : 'Planı Kaydet'}
                  </button>
               </div>
            </div>
         </div>
      )}

      {/* Add Expense Modal */}
      {showAddExpenseModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar">
               <div className="p-6 border-b border-slate-800 bg-slate-900 flex justify-between items-center sticky top-0 z-10">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                     <Plus className="w-5 h-5 text-blue-500" /> Yeni Gider Ekle
                  </h2>
                  <button onClick={() => setShowAddExpenseModal(false)} className="text-slate-400 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
               </div>
               <div className="p-6 space-y-4">
                  <div className="space-y-2">
                     <label className="text-xs font-medium text-slate-400 uppercase">Gider Kategorisi</label>
                     <select 
                        value={newExpense.category}
                        onChange={(e) => {
                           setNewExpense({...newExpense, category: e.target.value as any, title: ''}); // Reset title when category changes
                        }}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                     >
                        {EXPENSE_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                     </select>
                  </div>

                  <div className="space-y-2">
                     <label className="text-xs font-medium text-slate-400 uppercase">Gider Başlığı / Alt Grup</label>
                     <select
                        value={newExpense.title}
                        onChange={(e) => setNewExpense({...newExpense, title: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                     >
                        <option value="">Seçiniz</option>
                        {EXPENSE_CATEGORIES.find(c => c.id === newExpense.category)?.subItems.map(item => (
                           <option key={item.label} value={item.label}>{item.label}</option>
                        ))}
                        <option value="Diğer">Diğer...</option>
                     </select>
                  </div>
                  
                  {newExpense.title === 'Diğer' && (
                     <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-400 uppercase">Açıklama</label>
                        <input type="text" placeholder="Örn: Ekstra Tamirat" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                     </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-400 uppercase">Tutar (₺)</label>
                        <input 
                           type="number" 
                           value={newExpense.amount}
                           onChange={(e) => setNewExpense({...newExpense, amount: parseInt(e.target.value)})}
                           className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-400 uppercase">Durum</label>
                        <select 
                           value={newExpense.status}
                           onChange={(e) => setNewExpense({...newExpense, status: e.target.value as any})}
                           className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                           <option value="paid">Ödendi</option>
                           <option value="pending">Ödenecek</option>
                        </select>
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-xs font-medium text-slate-400 uppercase">Fatura / Fiş Görseli</label>
                     <div className="border-2 border-dashed border-slate-700 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:border-blue-500/50 hover:bg-slate-800/50 transition-all cursor-pointer group relative overflow-hidden">
                        <input 
                           type="file" 
                           accept="image/*"
                           className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                           onChange={(e) => {
                              if(e.target.files && e.target.files[0]) {
                                 setNewExpense({...newExpense, attachment: URL.createObjectURL(e.target.files[0])});
                              }
                           }}
                        />
                        
                        {newExpense.attachment ? (
                           <div className="relative w-full h-32 rounded-lg overflow-hidden group-hover:opacity-50 transition-opacity">
                              <img src={newExpense.attachment} alt="Preview" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 flex items-center justify-center">
                                 <span className="bg-black/50 text-white px-2 py-1 rounded text-xs backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">Değiştir</span>
                              </div>
                           </div>
                        ) : (
                           <div className="py-4">
                              <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center mb-2 mx-auto group-hover:scale-110 transition-transform">
                                 <Upload className="w-5 h-5 text-blue-400" />
                              </div>
                              <p className="text-slate-300 text-xs font-medium">Görsel Yükle</p>
                              <p className="text-slate-500 text-[10px] mt-0.5">JPG, PNG, PDF</p>
                           </div>
                        )}
                     </div>
                  </div>
               </div>
               <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex gap-3 sticky bottom-0 z-10">
                  <button onClick={() => setShowAddExpenseModal(false)} className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors text-sm">İptal</button>
                  <button onClick={handleAddExpense} className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium shadow-lg transition-colors text-sm">Kaydet</button>
               </div>
            </div>
         </div>
      )}

    </div>
  );
};

export default PaymentsPage;
