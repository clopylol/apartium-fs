
import React from 'react';
import { LayoutDashboard, Users, CreditCard, Wrench, Calendar, BarChart3, Settings, Building2, Megaphone, X, Package, LogIn, ShieldCheck, MessageSquare, UserCog } from 'lucide-react';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  isOpen: boolean;       // New prop for mobile state
  onClose: () => void;   // New prop to close mobile menu
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate, isOpen, onClose }) => {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Panel' },
    { id: 'announcements', icon: Megaphone, label: 'Duyurular' },
    { id: 'community', icon: MessageSquare, label: 'Topluluk & Oylama' },
    { id: 'tenants', icon: Users, label: 'Kiracılar' },
    { id: 'payments', icon: CreditCard, label: 'Ödemeler' },
    { id: 'janitor', icon: UserCog, label: 'Kapıcı Hizmetleri' },
    { id: 'cargo', icon: Package, label: 'Kargolar & Kuryeler' },
    { id: 'maintenance', icon: Wrench, label: 'Bakım & Tamirat' },
    { id: 'bookings', icon: Calendar, label: 'Rezervasyonlar' },
    { id: 'reports', icon: BarChart3, label: 'Raporlar' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-950 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:shrink-0
        ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>
        
        {/* Logo Area */}
        <div className="h-20 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold font-heading text-white tracking-tight">Apartium</span>
          </div>
          {/* Close Button (Mobile Only) */}
          <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                activePage === item.id 
                  ? 'bg-slate-800 text-white shadow-lg shadow-black/20' 
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <item.icon className={`w-5 h-5 ${activePage === item.id ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          ))}
          
          <div className="pt-4 mt-4 border-t border-slate-800 space-y-2">
             <button
              onClick={() => onNavigate('settings')}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                activePage === 'settings' 
                  ? 'bg-slate-800 text-white shadow-lg shadow-black/20' 
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <Settings className={`w-5 h-5 ${activePage === 'settings' ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
              <span className="font-medium text-sm">Ayarlar</span>
            </button>

            <button
              onClick={() => onNavigate('login')}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                activePage === 'login' 
                  ? 'bg-slate-800 text-white shadow-lg shadow-black/20' 
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <LogIn className={`w-5 h-5 ${activePage === 'login' ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
              <span className="font-medium text-sm">Giriş Yap</span>
            </button>

            <button
              onClick={() => onNavigate('security-login')}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                activePage === 'security-login' 
                  ? 'bg-amber-900/20 text-amber-400 border border-amber-900/50 shadow-lg shadow-black/20' 
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <ShieldCheck className={`w-5 h-5 ${activePage === 'security-login' ? 'text-amber-400' : 'text-slate-500 group-hover:text-amber-400'}`} />
              <span className="font-medium text-sm">Güvenlik Giriş</span>
            </button>
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-2">
            <img 
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=64&h=64" 
              alt="User" 
              className="w-10 h-10 rounded-full border-2 border-slate-700 object-cover"
            />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-white">Ahmet Yılmaz</span>
              <span className="text-xs text-slate-500">Yönetici</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
