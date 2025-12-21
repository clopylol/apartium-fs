
import React, { useState, useRef, useEffect } from 'react';
import StatCard from './StatCards';
import { RecentPaymentsList, MaintenanceList, BookingsList, TenantsList } from './DashboardLists';
import { Search, Bell, Plus, Wallet, Wrench, UserPlus, Calendar as CalendarIcon, ArrowUpRight, Filter, Info, X } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CHART_DATA_INCOME, NEW_TENANTS } from '../constants';

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

const ChartSkeleton = () => (
  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-[420px] shadow-xl relative overflow-hidden">
    <div className="flex justify-between mb-8">
      <div className="space-y-3">
        <div className="h-6 w-48 bg-slate-800 rounded animate-pulse" />
        <div className="h-4 w-32 bg-slate-800 rounded animate-pulse" />
      </div>
      <div className="w-8 h-8 bg-slate-800 rounded animate-pulse" />
    </div>
    <div className="w-full h-[280px] flex items-end gap-4 px-2">
       <div className="w-full h-[40%] bg-slate-800/30 rounded-t animate-pulse" style={{animationDelay: '0.1s'}} />
       <div className="w-full h-[60%] bg-slate-800/30 rounded-t animate-pulse" style={{animationDelay: '0.2s'}} />
       <div className="w-full h-[30%] bg-slate-800/30 rounded-t animate-pulse" style={{animationDelay: '0.3s'}} />
       <div className="w-full h-[70%] bg-slate-800/30 rounded-t animate-pulse" style={{animationDelay: '0.4s'}} />
       <div className="w-full h-[50%] bg-slate-800/30 rounded-t animate-pulse" style={{animationDelay: '0.5s'}} />
       <div className="w-full h-[80%] bg-slate-800/30 rounded-t animate-pulse" style={{animationDelay: '0.6s'}} />
       <div className="w-full h-[45%] bg-slate-800/30 rounded-t animate-pulse" style={{animationDelay: '0.7s'}} />
    </div>
  </div>
);

const ListSkeleton = () => (
  <div className="bg-slate-900 border border-slate-800 rounded-2xl h-[380px] flex flex-col shadow-lg overflow-hidden">
    <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/30">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-slate-800 rounded-lg animate-pulse" />
        <div className="h-6 w-32 bg-slate-800 rounded animate-pulse" />
      </div>
      <div className="h-4 w-16 bg-slate-800 rounded animate-pulse" />
    </div>
    <div className="p-2 space-y-1">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="flex items-center justify-between p-3">
          <div className="flex items-center gap-4 w-full">
            <div className="w-10 h-10 rounded-full bg-slate-800 animate-pulse shrink-0" />
            <div className="space-y-2 w-full">
              <div className="h-4 w-32 bg-slate-800 rounded animate-pulse" />
              <div className="h-3 w-24 bg-slate-800 rounded animate-pulse" />
            </div>
          </div>
          <div className="h-4 w-12 bg-slate-800 rounded animate-pulse shrink-0" />
        </div>
      ))}
    </div>
  </div>
);

const PromoSkeleton = () => (
  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-[180px] flex flex-col justify-between relative overflow-hidden shadow-xl">
     <div className="absolute top-0 right-0 w-32 h-32 bg-slate-800/30 rounded-full -mr-10 -mt-10 animate-pulse" />
     <div className="space-y-3 relative z-10">
       <div className="h-6 w-32 bg-slate-800 rounded animate-pulse" />
       <div className="h-4 w-48 bg-slate-800 rounded animate-pulse" />
     </div>
     <div className="h-10 w-32 bg-slate-800 rounded-xl animate-pulse relative z-10" />
  </div>
);

const DashboardHome = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const notificationRef = useRef<HTMLDivElement>(null);
  const currentDate = new Date().toLocaleDateString('tr-TR', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Simulate Data Loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Handle click outside for notifications
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col h-full overflow-hidden bg-slate-950">
        {/* Top Header */}
        <header className="h-20 border-b border-slate-800/50 flex items-center justify-between px-8 bg-slate-950/80 backdrop-blur-xl shrink-0 z-20 sticky top-0 pl-16 md:pl-8">
          <div className="relative w-96 hidden md:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-500" />
            </div>
            <input 
              type="text" 
              placeholder="Kiracı, ödeme veya talep ara..." 
              className="block w-full pl-10 pr-3 py-2.5 border border-slate-800 rounded-xl leading-5 bg-slate-900/50 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500/50 focus:bg-slate-900 sm:text-sm transition-all"
            />
          </div>
          
          <div className="flex items-center gap-6 ml-auto">
            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`relative p-2.5 rounded-full transition-colors border border-transparent ${showNotifications ? 'bg-slate-800 text-white' : 'hover:bg-slate-800 text-slate-400 hover:text-white hover:border-slate-700'}`}
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-950 animate-pulse"></span>
                </button>

                {/* Notification Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-3 w-80 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                     <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
                        <h3 className="font-bold text-white">Bildirimler</h3>
                        <span className="text-xs font-medium text-blue-400 cursor-pointer hover:text-blue-300">Tümünü Okundu İşaretle</span>
                     </div>
                     <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                        {NEW_TENANTS.length > 0 ? (
                          NEW_TENANTS.map((alert) => (
                             <div key={alert.id} className="p-4 border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors cursor-pointer group relative">
                                <div className="flex gap-3">
                                   <div className="mt-1">
                                      {alert.type === 'info' ? (
                                        <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                                           <Info className="w-4 h-4" />
                                        </div>
                                      ) : (
                                        <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                           <UserPlus className="w-4 h-4" />
                                        </div>
                                      )}
                                   </div>
                                   <div>
                                      <p className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">{alert.title} {alert.description}</p>
                                      <p className="text-xs text-slate-500 mt-1">{alert.time}</p>
                                   </div>
                                   <div className="w-2 h-2 rounded-full bg-blue-500 absolute right-4 top-5 opacity-100 group-hover:opacity-0 transition-opacity"></div>
                                </div>
                             </div>
                          ))
                        ) : (
                          <div className="p-8 text-center text-slate-500">
                             <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                             <p className="text-sm">Yeni bildiriminiz yok.</p>
                          </div>
                        )}
                     </div>
                     <div className="p-3 bg-slate-950/50 border-t border-slate-800 text-center">
                        <button className="text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-wider">
                           Tüm Geçmişi Gör
                        </button>
                     </div>
                  </div>
                )}
            </div>

            <div className="w-px h-8 bg-slate-800"></div>
            <div className="flex items-center gap-3 pl-2 cursor-pointer group">
               <div className="text-right hidden md:block">
                  <p className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">Ahmet Yılmaz</p>
                  <p className="text-xs text-slate-500">Site Yöneticisi</p>
               </div>
               <img 
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=64&h=64" 
                alt="Profile" 
                className="w-10 h-10 rounded-full border-2 border-slate-700 group-hover:border-blue-500 transition-all object-cover"
              />
            </div>
          </div>
        </header>

        {/* Dashboard Content - Scrollable */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 relative">
          
          {/* Background Gradient Spotlights */}
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-emerald-600/5 rounded-full blur-3xl pointer-events-none translate-x-1/3"></div>

          <div className="max-w-[1600px] mx-auto space-y-8 relative z-10">
            
            {/* Hero & Quick Actions */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 pb-2">
               <div>
                  {isLoading ? (
                    <div className="space-y-2">
                      <div className="h-8 w-64 bg-slate-800 rounded animate-pulse" />
                      <div className="h-5 w-40 bg-slate-800 rounded animate-pulse" />
                    </div>
                  ) : (
                    <>
                      <h1 className="text-3xl font-bold font-heading text-white tracking-tight mb-2 animate-in fade-in slide-in-from-bottom-2 duration-500">Hoşgeldin, Ahmet Bey 👋</h1>
                      <p className="text-slate-400 font-medium flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-700">
                        <CalendarIcon className="w-4 h-4 text-blue-500" />
                        {currentDate}
                      </p>
                    </>
                  )}
               </div>
               
               <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-slate-800 hover:border-slate-600 text-slate-300 rounded-xl text-sm font-medium transition-all hover:text-white group">
                     <div className="p-1 rounded-md bg-slate-800 group-hover:bg-blue-600 transition-colors">
                       <Plus className="w-3 h-3 text-white" />
                     </div>
                     Hızlı İşlem
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 hover:-translate-y-0.5">
                     <Wallet className="w-4 h-4" />
                     Ödeme Al
                  </button>
               </div>
            </div>

            {/* Stats Grid */}
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
                    title="Toplam Gelir (Bu Ay)" 
                    value="₺452.318" 
                    trend="+12.5%" 
                    trendUp={true} 
                    trendText="geçen aya göre"
                    variant="green"
                    hasChart={true}
                    icon={Wallet}
                  />
                  <StatCard 
                    title="Doluluk Oranı" 
                    value="%92" 
                    trend="-1.2%" 
                    trendUp={false} 
                    trendText="geçen aya göre"
                    variant="orange"
                    hasChart={true}
                    icon={UserPlus}
                  />
                  <StatCard 
                    title="Açık Talepler" 
                    value="14" 
                    trend="+5" 
                    trendUp={true} 
                    trendText="bu hafta"
                    variant="blue"
                    icon={Wrench}
                  />
                  <StatCard 
                    title="Yaklaşan Etkinlikler" 
                    value="8" 
                    trend="Yeni" 
                    trendUp={true} 
                    trendText="bu ay rezervasyon"
                    variant="purple"
                    icon={CalendarIcon}
                  />
                </>
              )}
            </div>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column (Charts & Financials) - Spans 2 cols */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* Main Revenue Chart */}
                {isLoading ? (
                  <ChartSkeleton />
                ) : (
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
                     <div className="flex justify-between items-center mb-6">
                        <div>
                          <h3 className="text-lg font-bold text-white">Yıllık Gelir Analizi</h3>
                          <p className="text-sm text-slate-500">Aylık aidat ve kira gelirleri</p>
                        </div>
                        <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors border border-transparent hover:border-slate-700">
                           <Filter className="w-4 h-4" />
                        </button>
                     </div>
                     
                     <div className="h-[300px] w-full">
                       <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={CHART_DATA_INCOME} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorIncomeMain" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                            <XAxis 
                              dataKey="value" 
                              stroke="#475569" 
                              tick={{fontSize: 12, fill: '#64748b'}} 
                              axisLine={false} 
                              tickLine={false} 
                              tickFormatter={(i) => ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem'][i] || ''}
                            />
                            <YAxis 
                               stroke="#475569" 
                               tick={{fontSize: 12, fill: '#64748b'}} 
                               axisLine={false} 
                               tickLine={false}
                               tickFormatter={(value) => `₺${value/1000}k`}
                            />
                            <Tooltip 
                              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#f8fafc' }}
                              itemStyle={{ color: '#3b82f6' }}
                            />
                            <Area 
                              type="monotone" 
                              dataKey="value" 
                              stroke="#3b82f6" 
                              strokeWidth={3} 
                              fillOpacity={1} 
                              fill="url(#colorIncomeMain)" 
                            />
                          </AreaChart>
                       </ResponsiveContainer>
                     </div>
                  </div>
                )}

                {/* Secondary Lists (Side by Side) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {isLoading ? (
                    <>
                      <ListSkeleton />
                      <ListSkeleton />
                    </>
                  ) : (
                    <>
                      <div className="animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
                        <RecentPaymentsList />
                      </div>
                      <div className="animate-in fade-in slide-in-from-bottom-5 duration-700 delay-200">
                        <MaintenanceList />
                      </div>
                    </>
                  )}
                </div>

              </div>

              {/* Right Column (Activity & Notifications) */}
              <div className="space-y-6">
                 {/* Quick Status Card */}
                 {isLoading ? (
                   <PromoSkeleton />
                 ) : (
                   <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden animate-in fade-in slide-in-from-right-4 duration-700">
                      <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                         <UserPlus className="w-48 h-48" />
                      </div>
                      <h3 className="text-lg font-bold mb-1 relative z-10">Yeni Kiracı Girişi</h3>
                      <p className="text-indigo-100 text-sm mb-4 relative z-10">Bu ay 3 yeni daire kiraya verildi.</p>
                      <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all relative z-10 flex items-center gap-2">
                         Detayları Gör <ArrowUpRight className="w-4 h-4" />
                      </button>
                   </div>
                 )}

                 {isLoading ? (
                   <>
                     <ListSkeleton />
                     <ListSkeleton />
                   </>
                 ) : (
                   <>
                     <div className="animate-in fade-in slide-in-from-right-5 duration-700 delay-100">
                       <BookingsList />
                     </div>
                     <div className="animate-in fade-in slide-in-from-right-5 duration-700 delay-200">
                       <TenantsList />
                     </div>
                   </>
                 )}
              </div>
            </div>
            
          </div>
        </main>
      </div>
  );
};

export default DashboardHome;
