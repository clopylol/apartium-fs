export interface DashboardStats {
    totalResidents: number;
    totalUnits: number;
    occupiedUnits: number;
    vacancyRate: number;
    pendingMaintenance: number;
    pendingJanitor: number;
    pendingCargo: number;
    dailyBookings: number;
    unpaidDues: number;
}

export interface MonthlyIncome {
    month: number;
    value: number;
}

