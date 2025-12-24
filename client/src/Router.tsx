import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout, BlankLayout } from "@/components/shared/layout";
import { ProtectedRoute } from "@/components/shared/protected-route";
import { DashboardPage } from "@/pages/dashboard";
import { LoginPage } from "@/pages/login";
import { PlaceholderPage } from "@/pages/placeholder";
import { AnnouncementsPage } from "@/pages/announcements";
import { CommunityPage } from "@/pages/community";
import { ResidentsPage } from "@/pages/residents";
import { ReportsPage } from "@/pages/reports";
import { PaymentsPage } from "@/pages/payments";
import { JanitorPage } from "@/pages/janitor";
import { DesignSystemPage } from "@/pages/design-system";
import { CargoPage } from "@/pages/cargo";
import { MaintenancePage } from "@/pages/maintenance";
import { BookingsPage } from "@/pages/bookings";

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Blank Layout Routes - Public */}
        <Route element={<BlankLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/security-login" element={<PlaceholderPage />} />
        </Route>

        {/* Dashboard Layout Routes - Protected */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<DashboardPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/announcements" element={<AnnouncementsPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/tenants" element={<ResidentsPage />} />
          <Route path="/payments" element={<PaymentsPage />} />
          <Route path="/janitor" element={<JanitorPage />} />
          <Route path="/cargo" element={<CargoPage />} />
          <Route path="/maintenance" element={<MaintenancePage />} />
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/design-system" element={<DesignSystemPage />} />
          <Route path="/settings" element={<PlaceholderPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
