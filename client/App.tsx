
import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './components/Sidebar';
import DashboardHome from './components/DashboardHome';
import MaintenancePage from './components/MaintenancePage';
import ReportsPage from './components/ReportsPage';
import ResidentsPage from './components/ResidentsPage';
import BookingsPage from './components/BookingsPage';
import AnnouncementsPage from './components/AnnouncementsPage';
import SettingsPage from './components/SettingsPage';
import PaymentsPage from './components/PaymentsPage';
import CargoPage from './components/CargoPage';
import CommunityPage from './components/CommunityPage';
import LoginPage from './components/LoginPage';
import SecurityLoginPage from './components/SecurityLoginPage';
import JanitorPage from './components/JanitorPage';

const App = () => {
  const [activePage, setActivePage] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavigate = (page: string) => {
    setActivePage(page);
    setIsMobileMenuOpen(false); // Close menu on navigation (mobile)
  };

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardHome />;
      case 'announcements':
        return <AnnouncementsPage />;
      case 'community':
        return <CommunityPage />;
      case 'tenants':
        return <ResidentsPage />;
      case 'payments':
        return <PaymentsPage />;
      case 'maintenance':
        return <MaintenancePage />;
      case 'bookings':
        return <BookingsPage />;
      case 'cargo':
        return <CargoPage />;
      case 'janitor':
        return <JanitorPage />;
      case 'reports':
        return <ReportsPage />;
      case 'settings':
        return <SettingsPage />;
      case 'login':
        return <LoginPage onLoginSuccess={() => setActivePage('dashboard')} />;
      case 'security-login':
        return <SecurityLoginPage onLoginSuccess={() => setActivePage('cargo')} />; // Redirect security to cargo/courier page
      default:
        return (
          <div className="flex-1 flex items-center justify-center text-slate-500">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-300 mb-2">Hazırlanıyor...</h2>
              <p>Bu sayfa henüz geliştirme aşamasında.</p>
            </div>
          </div>
        );
    }
  };

  // Check if current page is a full-screen auth page
  const isAuthPage = ['login', 'security-login'].includes(activePage);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30 overflow-hidden">
      {/* Mobile Menu Button - Absolute positioned on top left for mobile. Hidden on Auth Pages */}
      {!isAuthPage && (
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="md:hidden absolute top-4 left-4 z-40 p-2 bg-slate-800 text-white rounded-lg border border-slate-700 shadow-lg"
        >
          <Menu className="w-6 h-6" />
        </button>
      )}

      {/* Sidebar with mobile state - Hidden on Auth Pages */}
      {!isAuthPage && (
        <Sidebar
          activePage={activePage}
          onNavigate={handleNavigate}
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 h-full overflow-hidden relative w-full">
        {renderContent()}
      </div>
    </div>
  );
};

export default App;
