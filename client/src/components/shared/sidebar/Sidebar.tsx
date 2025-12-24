// 1. External & React
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

// 2. Contexts
import { useAuth } from '@/contexts/auth';

// 3. Components
import { ConfirmationModal } from '@/components/shared/modals';

// 4. Icons
import { LayoutDashboard, Users, CreditCard, Wrench, Calendar, BarChart3, Settings, Building2, Megaphone, X, Package, LogOut, ShieldCheck, MessageSquare, UserCog, Palette } from 'lucide-react';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogoutClick = () => {
        setShowLogoutModal(true);
    };

    const handleLogoutConfirm = async () => {
        setShowLogoutModal(false);
        await logout();
        navigate('/login');
        onClose();
    };

    // Role Türkçe çevirisi
    const getRoleLabel = (role: string): string => {
        const roleMap: Record<string, string> = {
            admin: 'Yönetici',
            manager: 'Apartman Yöneticisi',
            staff: 'Personel',
            resident: 'Sakin',
        };
        return roleMap[role] || role;
    };

    const menuItems = [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Panel' },
        { path: '/announcements', icon: Megaphone, label: 'Duyurular' },
        { path: '/community', icon: MessageSquare, label: 'Topluluk & Oylama' },
        { path: '/tenants', icon: Users, label: 'Kiracılar' },
        { path: '/payments', icon: CreditCard, label: 'Ödemeler' },
        { path: '/janitor', icon: UserCog, label: 'Kapıcı Hizmetleri' },
        { path: '/cargo', icon: Package, label: 'Kargolar & Kuryeler' },
        { path: '/maintenance', icon: Wrench, label: 'Bakım & Tamirat' },
        { path: '/bookings', icon: Calendar, label: 'Rezervasyonlar' },
        { path: '/reports', icon: BarChart3, label: 'Raporlar' },
    ];

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-ds-background-dark/80 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
                    onClick={onClose}
                />
            )}

            {/* Sidebar Container */}
            <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-ds-sidebar-background-light dark:bg-ds-sidebar-background-dark border-r border-ds-sidebar-border-light dark:border-ds-sidebar-border-dark flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:shrink-0
        ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>

                {/* Logo Area */}
                <div className="h-20 flex items-center justify-between px-6 border-b border-ds-sidebar-border-light dark:border-ds-sidebar-border-dark">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-600 rounded-lg">
                            <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold font-heading text-ds-sidebar-foreground-light dark:text-ds-sidebar-foreground-dark tracking-tight">Apartium</span>
                    </div>
                    {/* Close Button (Mobile Only) */}
                    <button onClick={onClose} className="md:hidden text-ds-muted-light dark:text-ds-muted-dark hover:text-ds-sidebar-foreground-light dark:hover:text-ds-sidebar-foreground-dark">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={onClose} // Close on mobile navigate
                            className={({ isActive }) => `w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group ${isActive
                                ? 'bg-ds-sidebar-accent-light dark:bg-ds-sidebar-accent-dark text-ds-sidebar-foreground-light dark:text-ds-sidebar-foreground-dark shadow-sm'
                                : 'text-ds-muted-light dark:text-ds-muted-dark hover:bg-ds-sidebar-accent-light/50 dark:hover:bg-ds-sidebar-accent-dark/50 hover:text-ds-sidebar-foreground-light dark:hover:text-ds-sidebar-foreground-dark'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium text-sm">{item.label}</span>
                        </NavLink>
                    ))}

                    <div className="pt-4 mt-4 border-t border-ds-sidebar-border-light dark:border-ds-sidebar-border-dark space-y-2">
                        <NavLink
                            to="/settings"
                            onClick={onClose}
                            className={({ isActive }) => `w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group ${isActive
                                ? 'bg-ds-sidebar-accent-light dark:bg-ds-sidebar-accent-dark text-ds-sidebar-foreground-light dark:text-ds-sidebar-foreground-dark shadow-sm'
                                : 'text-ds-muted-light dark:text-ds-muted-dark hover:bg-ds-sidebar-accent-light/50 dark:hover:bg-ds-sidebar-accent-dark/50 hover:text-ds-sidebar-foreground-light dark:hover:text-ds-sidebar-foreground-dark'
                                }`}
                        >
                            <Settings className="w-5 h-5" />
                            <span className="font-medium text-sm">Ayarlar</span>
                        </NavLink>


                        <NavLink
                            to="/security-login"
                            onClick={onClose}
                            className={({ isActive }) => `w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group ${isActive
                                ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50 shadow-sm'
                                : 'text-ds-muted-light dark:text-ds-muted-dark hover:bg-ds-sidebar-accent-light/50 dark:hover:bg-ds-sidebar-accent-dark/50 hover:text-ds-sidebar-foreground-light dark:hover:text-ds-sidebar-foreground-dark'
                                }`}
                        >
                            <ShieldCheck className="w-5 h-5" />
                            <span className="font-medium text-sm">Güvenlik Giriş</span>
                        </NavLink>

                        <NavLink
                            to="/design-system"
                            onClick={onClose}
                            className={({ isActive }) => `w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group ${isActive
                                ? 'bg-ds-sidebar-accent-light dark:bg-ds-sidebar-accent-dark text-ds-sidebar-foreground-light dark:text-ds-sidebar-foreground-dark shadow-sm'
                                : 'text-ds-muted-light dark:text-ds-muted-dark hover:bg-ds-sidebar-accent-light/50 dark:hover:bg-ds-sidebar-accent-dark/50 hover:text-ds-sidebar-foreground-light dark:hover:text-ds-sidebar-foreground-dark'
                                }`}
                        >
                            <Palette className="w-5 h-5" />
                            <span className="font-medium text-sm">Design System</span>
                        </NavLink>
                    </div>
                </nav>

                {/* User Profile */}
                {user && (
                <div className="p-4 border-t border-ds-sidebar-border-light dark:border-ds-sidebar-border-dark">
                        <div className="flex items-center gap-3 px-2 mb-3">
                            <div className="w-10 h-10 rounded-full bg-ds-action dark:bg-ds-action flex items-center justify-center border-2 border-ds-sidebar-border-light dark:border-ds-sidebar-border-dark">
                                <span className="text-white font-semibold text-sm">
                                    {user.name
                                        .split(' ')
                                        .map((n) => n[0])
                                        .join('')
                                        .toUpperCase()
                                        .slice(0, 2)}
                                </span>
                            </div>
                            <div className="flex-1 flex flex-col min-w-0">
                                <span className="text-sm font-semibold text-ds-sidebar-foreground-light dark:text-ds-sidebar-foreground-dark truncate">
                                    {user.name}
                                </span>
                                <span className="text-xs text-ds-muted-light dark:text-ds-muted-dark">
                                    {getRoleLabel(user.role)}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={handleLogoutClick}
                            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 text-ds-muted-light dark:text-ds-muted-dark hover:bg-ds-sidebar-accent-light/50 dark:hover:bg-ds-sidebar-accent-dark/50 hover:text-ds-destructive dark:hover:text-ds-destructive group"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="font-medium text-sm">Çıkış Yap</span>
                        </button>
                    </div>
                )}

            </aside>

            {/* Logout Confirmation Modal - Sayfanın ortasında */}
            <ConfirmationModal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={handleLogoutConfirm}
                title="Çıkış Yap"
                message="Hesabınızdan çıkmak istediğinize emin misiniz?"
                variant="danger"
                confirmText="Evet, Çıkış Yap"
                cancelText="İptal"
            />
        </>
    );
};
