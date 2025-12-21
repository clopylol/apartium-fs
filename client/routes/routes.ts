
// 1. External & React
import type { ComponentType } from "react";

// 3. Components (Layouts)
import { DashboardLayout, BlankLayout } from "@/components/shared/layout";

// Pages
import { DashboardPage } from "@/pages/dashboard";
import { LoginPage } from "@/pages/login";
import { PlaceholderPage } from "@/pages/placeholder";
import { AnnouncementsPage } from "@/pages/announcements";
import { ResidentsPage } from "@/pages/residents";
import { ReportsPage } from "@/pages/reports";
import { PaymentsPage } from "@/pages/payments";
import { JanitorPage } from "@/pages/janitor";
import { DesignSystemPage } from "@/pages/design-system";
import { CargoPage } from "@/pages/cargo";
import { MaintenancePage } from "@/pages/maintenance";
import { BookingsPage } from "@/pages/bookings";

export interface RouteConfig {
    path: string;
    component: ComponentType;
    layout: ComponentType<{ children: React.ReactNode }>;
    title: string;
}

export const routes: RouteConfig[] = [
    {
        path: "/",
        component: DashboardPage,
        layout: DashboardLayout,
        title: "Dashboard",
    },
    {
        path: "/dashboard",
        component: DashboardPage,
        layout: DashboardLayout,
        title: "Dashboard",
    },
    {
        path: "/login",
        component: LoginPage,
        layout: BlankLayout,
        title: "Login",
    },
    {
        path: "/announcements",
        component: AnnouncementsPage,
        layout: DashboardLayout,
        title: "Duyurular",
    },
    {
        path: "/community",
        component: PlaceholderPage,
        layout: DashboardLayout,
        title: "Topluluk",
    },
    {
        path: "/tenants",
        component: ResidentsPage,
        layout: DashboardLayout,
        title: "Kiracılar & Otopark",
    },
    {
        path: "/payments",
        component: PaymentsPage,
        layout: DashboardLayout,
        title: "Ödemeler",
    },
    {
        path: "/janitor",
        component: JanitorPage,
        layout: DashboardLayout,
        title: "Kapıcı",
    },
    {
        path: "/cargo",
        component: CargoPage,
        layout: DashboardLayout,
        title: "Kargolar",
    },
    {
        path: "/maintenance",
        component: MaintenancePage,
        layout: DashboardLayout,
        title: "Bakım",
    },
    {
        path: "/bookings",
        component: BookingsPage,
        layout: DashboardLayout,
        title: "Rezervasyonlar",
    },
    {
        path: "/reports",
        component: ReportsPage,
        layout: DashboardLayout,
        title: "Finansal Raporlar",
    },
    {
        path: "/design-system",
        component: DesignSystemPage,
        layout: DashboardLayout,
        title: "Design System",
    },
    {
        path: "/settings",
        component: PlaceholderPage,
        layout: DashboardLayout,
        title: "Ayarlar",
    },
    {
        path: "/security-login",
        component: PlaceholderPage,
        layout: BlankLayout,
        title: "Güvenlik Giriş",
    },
];
