import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useDashboardData() {
    const statsQuery = useQuery({
        queryKey: ['dashboard', 'stats'],
        queryFn: () => api.dashboard.getStats(),
    });

    const recentDataQuery = useQuery({
        queryKey: ['dashboard', 'recent-data'],
        queryFn: () => api.dashboard.getRecentData(),
    });

    const currentYear = new Date().getFullYear();
    const monthlyIncomeQuery = useQuery({
        queryKey: ['dashboard', 'monthly-income', currentYear],
        queryFn: () => api.dashboard.getMonthlyIncome(currentYear),
    });

    return {
        stats: statsQuery.data,
        recentPayments: recentDataQuery.data?.payments || [],
        recentMaintenance: recentDataQuery.data?.maintenance || [],
        todayBookings: recentDataQuery.data?.bookings || [],
        monthlyIncome: monthlyIncomeQuery.data?.data || [],
        isLoading: statsQuery.isLoading || recentDataQuery.isLoading || monthlyIncomeQuery.isLoading,
        error: statsQuery.error || recentDataQuery.error || monthlyIncomeQuery.error,
    };
}

