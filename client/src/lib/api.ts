const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface FetchOptions extends RequestInit {
    data?: any;
}

/**
 * API Client
 * Tüm API çağrıları bu fonksiyon üzerinden yapılır
 * Otomatik credentials (cookie) gönderir
 */
export async function apiClient<T = any>(
    endpoint: string,
    { data, ...customConfig }: FetchOptions = {}
): Promise<T> {
    const config: RequestInit = {
        method: data ? 'POST' : 'GET',
        credentials: 'include', // Cookie gönder
        headers: {
            'Content-Type': 'application/json',
        },
        ...customConfig,
    };

    if (data) {
        config.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE_URL}/api${endpoint}`, config);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API Error: ${response.status}`);
    }

    return await response.json();
}

// API fonksiyonları
export const api = {
    // Auth
    auth: {
        login: (email: string, password: string) =>
            apiClient('/auth/login', { data: { email, password } }),
        logout: () =>
            apiClient('/auth/logout', { method: 'POST' }),
        me: () =>
            apiClient('/auth/me'),
    },

    // Payments
    payments: {
        getByPeriod: (month: string, year: number) =>
            apiClient(`/payments?month=${month}&year=${year}`),
        create: (payment: any) =>
            apiClient('/payments', { data: payment }),
        updateStatus: (id: string, status: 'paid' | 'unpaid') =>
            apiClient(`/payments/${id}/status`, {
                method: 'PATCH',
                data: { status }
            }),
    },

    // Expenses
    expenses: {
        getByPeriod: (month: string, year: number) =>
            apiClient(`/expenses?month=${month}&year=${year}`),
        create: (expense: any) =>
            apiClient('/expenses', { data: expense }),
        delete: (id: string) =>
            apiClient(`/expenses/${id}`, { method: 'DELETE' }),
    },

    // Buildings
    buildings: {
        getAll: () => apiClient('/buildings'),
    },

    // Dashboard
    dashboard: {
        getStats: () => apiClient('/stats'),
        getRecentData: () => apiClient('/dashboard/recent-data'),
        getMonthlyIncome: (year: number) => 
            apiClient(`/dashboard/monthly-income?year=${year}`),
    },

    // Announcements
    announcements: {
        getStats: () => 
            apiClient('/announcements/stats'),
        getAll: (page: number, limit: number) => 
            apiClient(`/announcements?page=${page}&limit=${limit}`),
        getById: (id: string) => 
            apiClient(`/announcements/${id}`),
        create: (data: any) => 
            apiClient('/announcements', { 
                method: 'POST', 
                body: JSON.stringify(data) 
            }),
        update: (id: string, data: any) => 
            apiClient(`/announcements/${id}`, { 
                method: 'PATCH', 
                body: JSON.stringify(data) 
            }),
        delete: (id: string) => 
            apiClient(`/announcements/${id}`, { method: 'DELETE' }),
    },

    // Community
    community: {
        getStats: () => 
            apiClient('/community/stats'),
        
        // Requests
        getRequests: (page: number, limit: number, filters?: { search?: string; status?: string; type?: 'wish' | 'suggestion' }) => {
            const params = new URLSearchParams();
            params.append('page', page.toString());
            params.append('limit', limit.toString());
            if (filters?.search) params.append('search', filters.search);
            if (filters?.status) params.append('status', filters.status);
            if (filters?.type) params.append('type', filters.type);
            return apiClient(`/community/requests?${params.toString()}`);
        },
        getAllRequests: () => 
            apiClient('/community/requests?page=1&limit=1000'),
        createRequest: (data: any) =>
            apiClient('/community/requests', { method: 'POST', data }),
        updateRequestType: (id: string, type: 'wish' | 'suggestion') =>
            apiClient(`/community/requests/${id}/type`, { method: 'PATCH', data: { type } }),
        updateRequestStatus: (id: string, status: string) =>
            apiClient(`/community/requests/${id}/status`, { method: 'PATCH', data: { status } }),
        deleteRequest: (id: string) =>
            apiClient(`/community/requests/${id}`, { method: 'DELETE' }),
        
        // Polls
        getPolls: (page: number, limit: number, filters?: { search?: string; status?: 'active' | 'closed' }) => {
            const params = new URLSearchParams();
            params.append('page', page.toString());
            params.append('limit', limit.toString());
            if (filters?.search) params.append('search', filters.search);
            if (filters?.status) params.append('status', filters.status);
            return apiClient(`/community/polls?${params.toString()}`);
        },
        getAllPolls: () => 
            apiClient('/community/polls?page=1&limit=1000'),
        createPoll: (data: any) =>
            apiClient('/community/polls', { method: 'POST', data }),
        updatePollStatus: (id: string, status: 'active' | 'closed') =>
            apiClient(`/community/polls/${id}/status`, { method: 'PATCH', data: { status } }),
        deletePoll: (id: string) =>
            apiClient(`/community/polls/${id}`, { method: 'DELETE' }),
        vote: (pollId: string, residentId: string, choice: 'yes' | 'no') =>
            apiClient(`/community/polls/${pollId}/vote`, { method: 'POST', data: { residentId, choice } }),
    },
};
