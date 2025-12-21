
import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { Calendar, Download, TrendingUp, DollarSign, Wallet, FileText, Filter, ChevronDown, CheckCircle, Clock, Receipt, ArrowUpRight, ArrowDownRight, File } from 'lucide-react';
import StatCard from './StatCards';

// Mock Data
const MONTHLY_DATA = [
  { name: 'Oca', income: 45000, expense: 32000 },
  { name: 'Şub', income: 52000, expense: 28000 },
  { name: 'Mar', income: 48000, expense: 34000 },
  { name: 'Nis', income: 61000, expense: 30000 },
  { name: 'May', income: 55000, expense: 38000 },
  { name: 'Haz', income: 67000, expense: 32000 },
  { name: 'Tem', income: 72000, expense: 35000 },
];

const EXPENSE_DATA = [
  { name: 'Personel', value: 35, amount: 64470, color: '#3b82f6' },
  { name: 'Bakım & Onarım', value: 25, amount: 46050, color: '#10b981' },
  { name: 'Faturalar', value: 20, amount: 36840, color: '#f59e0b' },
  { name: 'Vergi & Harç', value: 10, amount: 18420, color: '#ef4444' },
  { name: 'Diğer', value: 10, amount: 18420, color: '#8b5cf6' },
];

const TRANSACTIONS = [
  { id: 1, desc: 'Daire 4B Aidat Ödemesi', category: 'Gelir', subCategory: 'Aidat', date: '21 Tem 2024', amount: '+₺1,500', status: 'completed' },
  { id: 2, desc: 'Asansör Bakım Ücreti', category: 'Gider', subCategory: 'Bakım', date: '20 Tem 2024', amount: '-₺4,200', status: 'completed' },
  { id: 3, desc: 'Bahçıvan Hizmet Bedeli', category: 'Gider', subCategory: 'Personel', date: '19 Tem 2024', amount: '-₺2,800', status: 'pending' },
  { id: 4, desc: 'Daire 12A Kira Ödemesi', category: 'Gelir', subCategory: 'Kira', date: '18 Tem 2024', amount: '+₺18,000', status: 'completed' },
  { id: 5, desc: 'Ortak Alan Elektrik Faturası', category: 'Gider', subCategory: 'Faturalar', date: '15 Tem 2024', amount: '-₺3,450', status: 'completed' },
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

const ChartSkeleton = () => (
  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-[380px] animate-pulse flex flex-col">
    <div className="flex justify-between items-center mb-8">
      <div className="h-6 w-48 bg-slate-800 rounded" />
      <div className="h-8 w-8 bg-slate-800 rounded" />
    </div>
    <div className="flex-1 w-full bg-slate-800/30 rounded-xl" />
  </div>
);

const DonutChartSkeleton = () => (
  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-[380px] animate-pulse flex flex-col">
    <div className="h-6 w-32 bg-slate-800 rounded mb-6" />
    <div className="flex-1 flex items-center justify-center">
       <div className="w-40 h-40 rounded-full border-8 border-slate-800 bg-transparent" />
    </div>
    <div className="mt-6 space-y-3">
       {[1, 2, 3, 4].map(i => (
         <div key={i} className="flex justify-between">
            <div className="flex gap-2 items-center">
               <div className="w-3 h-3 rounded-full bg-slate-800" />
               <div className="h-3 w-20 bg-slate-800 rounded" />
            </div>
            <div className="h-3 w-12 bg-slate-800 rounded" />
         </div>
       ))}
    </div>
  </div>
);

const TransactionRowSkeleton = () => (
  <tr className="border-b border-slate-800/50 animate-pulse">
    <td className="px-6 py-4">
      <div className="space-y-2">
        <div className="h-4 w-48 bg-slate-800 rounded" />
        <div className="h-3 w-24 bg-slate-800 rounded" />
      </div>
    </td>
    <td className="px-6 py-4">
      <div className="h-6 w-24 bg-slate-800 rounded-lg" />
    </td>
    <td className="px-6 py-4">
      <div className="h-3 w-24 bg-slate-800 rounded" />
    </td>
    <td className="px-6 py-4 text-right">
      <div className="h-5 w-20 bg-slate-800 rounded ml-auto" />
    </td>
    <td className="px-6 py-4 text-center">
      <div className="h-6 w-20 bg-slate-800 rounded-full mx-auto" />
    </td>
    <td className="px-6 py-4 text-center">
      <div className="h-8 w-8 bg-slate-800 rounded-lg mx-auto" />
    </td>
  </tr>
);

// Custom Tooltip for Area Chart
const CustomAreaTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl shadow-2xl">
        <p className="text-slate-400 text-xs font-medium mb-2">{label} 2024</p>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-3 min-w-[120px]">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
              <span className="text-slate-300 text-sm font-medium flex-1">{entry.name}</span>
              <span className="text-white text-sm font-bold">
                ₺{entry.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const ReportsPage = () => {
  const [dateRange, setDateRange] = useState('Bu Yıl');
  const [transactionFilter, setTransactionFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Simulate Data Loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Initialize transactions with 80% chance of data, 20% empty
  const [transactions, setTransactions] = useState(() => {
    return Math.random() > 0.2 ? TRANSACTIONS : [];
  });

  // Filter Transactions
  const filteredTransactions = transactions.filter(t => {
    if (transactionFilter === 'all') return true;
    if (transactionFilter === 'income') return t.category === 'Gelir';
    if (transactionFilter === 'expense') return t.category === 'Gider';
    return true;
  });

  return (
    <div className="flex flex-col h-full overflow-hidden bg-slate-950">
      
      {/* Header */}
      <header className="h-20 border-b border-slate-800/50 flex items-center justify-between px-8 bg-slate-950 shrink-0">
         <div className="flex items-center gap-4">
           <h1 className="text-2xl font-bold font-heading text-white">Finansal Raporlar</h1>
         </div>
         
         <div className="flex items-center gap-3">
            {/* Transaction Type Filter */}
            <div className="relative group">
               <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2">
                  <Filter className="w-4 h-4 text-slate-500" />
                  <select 
                    value={transactionFilter}
                    onChange={(e) => setTransactionFilter(e.target.value as any)}
                    className="bg-transparent text-slate-300 text-sm font-medium focus:outline-none appearance-none pr-6 cursor-pointer"
                  >
                    <option value="all">Tüm İşlemler</option>
                    <option value="income">Sadece Gelirler</option>
                    <option value="expense">Sadece Giderler</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 pointer-events-none" />
               </div>
            </div>

            {/* Date Filter */}
            <div className="relative group">
              <button className="flex items-center gap-2 bg-slate-900 border border-slate-700 text-slate-300 px-4 py-2 rounded-xl text-sm font-medium hover:border-slate-500 transition-colors">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>{dateRange}</span>
                <ChevronDown className="w-4 h-4 ml-2 opacity-50" />
              </button>
            </div>

            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-lg shadow-blue-900/20">
              <Download className="w-4 h-4" />
              <span>Rapor İndir (PDF)</span>
            </button>
         </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  title="Toplam Gelir" 
                  value="₺452,318" 
                  trend="+12.5%" 
                  trendUp={true} 
                  trendText="geçen aya göre"
                  variant="green"
                  icon={Wallet}
                />
                <StatCard 
                  title="Toplam Gider" 
                  value="₺184,200" 
                  trend="-2.4%" 
                  trendUp={false} 
                  trendText="geçen aya göre"
                  variant="red"
                  icon={DollarSign}
                />
                <StatCard 
                  title="Kasa Bakiyesi" 
                  value="₺268,118" 
                  trend="%59" 
                  trendUp={true} 
                  trendText="mevcut nakit"
                  variant="blue"
                  icon={TrendingUp}
                />
                <StatCard 
                  title="Tahsilat Oranı" 
                  value="%94.2" 
                  trend="₺24.5k" 
                  trendUp={true} 
                  trendText="bekleyen ödeme"
                  variant="orange"
                  icon={FileText}
                />
              </>
            )}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Main Chart (Income vs Expense) */}
            {isLoading ? (
              <div className="lg:col-span-2">
                <ChartSkeleton />
              </div>
            ) : (
              <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 h-[380px]">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold font-heading text-white">Gelir & Gider Analizi</h3>
                  <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors">
                    <Filter className="w-4 h-4" />
                  </button>
                </div>
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={MONTHLY_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis 
                        dataKey="name" 
                        stroke="#64748b" 
                        tick={{fontSize: 12, fill: '#64748b'}} 
                        axisLine={false} 
                        tickLine={false} 
                      />
                      <YAxis 
                        stroke="#64748b" 
                        tick={{fontSize: 12, fill: '#64748b'}} 
                        axisLine={false} 
                        tickLine={false} 
                        tickFormatter={(value) => `₺${value/1000}k`} 
                      />
                      <Tooltip content={<CustomAreaTooltip />} cursor={{ stroke: '#334155', strokeWidth: 1, strokeDasharray: '4 4' }} />
                      <Legend iconType="circle" />
                      <Area 
                        type="monotone" 
                        dataKey="income" 
                        name="Gelir" 
                        stroke="#3b82f6" 
                        strokeWidth={3} 
                        fillOpacity={1} 
                        fill="url(#colorIncome)" 
                        activeDot={{ r: 6, strokeWidth: 0 }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="expense" 
                        name="Gider" 
                        stroke="#ef4444" 
                        strokeWidth={3} 
                        fillOpacity={1} 
                        fill="url(#colorExpense)" 
                        activeDot={{ r: 6, strokeWidth: 0 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Side Chart (Expense Categories - Donut) */}
            {isLoading ? (
              <DonutChartSkeleton />
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col h-[380px]">
                <h3 className="text-lg font-bold font-heading text-white mb-4 shrink-0">Gider Dağılımı</h3>
                
                <div className="flex-1 flex flex-col min-h-0">
                   {/* Chart Container */}
                   <div className="relative h-[180px] w-full flex items-center justify-center shrink-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={EXPENSE_DATA}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={4}
                            dataKey="value"
                            stroke="none"
                          >
                            {EXPENSE_DATA.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      
                      {/* Centered Total */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                         <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">Toplam</span>
                         <span className="text-2xl font-bold text-white tracking-tight">₺184.2k</span>
                      </div>
                   </div>

                   {/* Custom Legend - Scrollable */}
                   <div className="mt-4 space-y-3 overflow-y-auto custom-scrollbar flex-1 pr-2">
                      {EXPENSE_DATA.map((item, index) => (
                         <div key={index} className="flex items-center justify-between text-sm group py-1">
                            <div className="flex items-center gap-3">
                               <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }}></div>
                               <span className="text-slate-300 font-medium group-hover:text-white transition-colors truncate max-w-[120px]">{item.name}</span>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                               <span className="text-slate-500 text-xs">₺{item.amount.toLocaleString()}</span>
                               <span className="text-slate-200 font-bold w-8 text-right">{item.value}%</span>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>
              </div>
            )}

          </div>

          {/* Transactions Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
             <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                <h3 className="text-lg font-bold font-heading text-white">Son Finansal Hareketler</h3>
                <div className="flex gap-2">
                   <span className="text-xs font-medium text-slate-500 px-2 py-1 bg-slate-800 rounded">{filteredTransactions.length} kayıt</span>
                   <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">Tümünü Gör</button>
                </div>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-slate-500 bg-slate-950/50 text-xs uppercase font-semibold tracking-wider">
                      <th className="px-6 py-4">Açıklama</th>
                      <th className="px-6 py-4">Kategori</th>
                      <th className="px-6 py-4">Tarih</th>
                      <th className="px-6 py-4 text-right">Tutar</th>
                      <th className="px-6 py-4 text-center">Durum</th>
                      <th className="px-6 py-4 text-center">Belge</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {isLoading ? (
                      <>
                        <TransactionRowSkeleton />
                        <TransactionRowSkeleton />
                        <TransactionRowSkeleton />
                        <TransactionRowSkeleton />
                        <TransactionRowSkeleton />
                      </>
                    ) : (
                      <>
                        {filteredTransactions.length > 0 ? (
                          filteredTransactions.map((tx) => (
                            <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors group">
                              <td className="px-6 py-4">
                                 <div className="font-bold text-slate-200">{tx.desc}</div>
                                 <div className="text-xs text-slate-500 mt-0.5">ID: #TRX-{tx.id}</div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 text-xs font-medium">
                                  {tx.amount.startsWith('+') 
                                    ? <ArrowDownRight className="w-3.5 h-3.5 text-emerald-500" /> 
                                    : <ArrowUpRight className="w-3.5 h-3.5 text-rose-500" />
                                  }
                                  {tx.subCategory}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-slate-400 font-mono text-xs">{tx.date}</td>
                              <td className={`px-6 py-4 text-right font-bold text-base ${tx.amount.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {tx.amount}
                              </td>
                              <td className="px-6 py-4 text-center">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                                    tx.status === 'completed' 
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                }`}>
                                    {tx.status === 'completed' ? 'Tamamlandı' : 'Bekliyor'}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-center">
                                 <button className="p-2 text-slate-500 hover:text-white hover:bg-slate-700 rounded-lg transition-colors" title="Fatura/Makbuz Görüntüle">
                                    <Receipt className="w-4 h-4" />
                                 </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                              <div className="flex flex-col items-center justify-center">
                                <FileText className="w-12 h-12 mb-3 opacity-20" />
                                <p className="text-sm font-medium">Bu filtre için kayıtlı finansal hareket bulunmuyor.</p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    )}
                  </tbody>
               </table>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
