const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface FetchOptions extends RequestInit {
    data?: any;
}

// Global logout callback - AuthProvider tarafından set edilecek
let onUnauthorizedCallback: (() => void) | null = null;

/**
 * API Client'a logout callback'i set etmek için kullanılır
 */
export function setOnUnauthorizedCallback(callback: () => void): void {
    onUnauthorizedCallback = callback;
}

/**
 * API Client
 * Tüm API çağrıları bu fonksiyon üzerinden yapılır
 * Otomatik credentials (cookie) gönderir
 * 401 hatalarında otomatik logout yapar
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
        // 401 Unauthorized - Oturum geçersiz, logout yap
        if (response.status === 401) {
            // Auth endpoint'leri hariç (login, logout, me) - bunlar zaten auth işlemleri
            if (!endpoint.startsWith('/auth/')) {
                if (onUnauthorizedCallback) {
                    onUnauthorizedCallback();
                } else {
                    // Fallback: window.location ile redirect
                    window.location.href = '/login';
                }
            }
        }

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

    // Sites
    sites: {
        getAll: () => apiClient('/sites'),
        getById: (id: string) => apiClient(`/sites/${id}`),
        getBuildings: (siteId: string) => apiClient(`/sites/${siteId}/buildings`),
        create: (data: any) => apiClient('/sites', { method: 'POST', data }),
        update: (id: string, data: any) => apiClient(`/sites/${id}`, { method: 'PUT', data }),
        delete: (id: string) => apiClient(`/sites/${id}`, { method: 'DELETE' }),
        assignUser: (siteId: string, userId: string) => apiClient(`/sites/${siteId}/assign/${userId}`, { method: 'POST' }),
        unassignUser: (siteId: string, userId: string) => apiClient(`/sites/${siteId}/unassign/${userId}`, { method: 'DELETE' }),
    },

    // Buildings
    buildings: {
        getAll: () => apiClient('/buildings'),
        getBySiteId: (siteId: string) => apiClient(`/sites/${siteId}/buildings`),
        create: (data: any) => apiClient('/buildings', { method: 'POST', data }),
        update: (id: string, data: any) => apiClient(`/buildings/${id}`, { method: 'PATCH', data }),
        delete: (id: string) => apiClient(`/buildings/${id}`, { method: 'DELETE' }),
    },

    // Residents
    residents: {
        // Full building data (JOIN ile)
        getBuildingData: (buildingId: string) =>
            apiClient(`/residents/building-data/${buildingId}`),
        
        // CRUD - Residents
        createResident: (data: any) =>
            apiClient('/residents', { method: 'POST', data }),
        updateResident: (id: string, data: any) =>
            apiClient(`/residents/${id}`, { method: 'PATCH', data }),
        deleteResident: (id: string) =>
            apiClient(`/residents/${id}`, { method: 'DELETE' }),
        
        // CRUD - Vehicles
        createVehicle: (data: any) =>
            apiClient('/vehicles', { method: 'POST', data }),
        updateVehicle: (id: string, data: any) =>
            apiClient(`/vehicles/${id}`, { method: 'PATCH', data }),
        deleteVehicle: (id: string) =>
            apiClient(`/vehicles/${id}`, { method: 'DELETE' }),
        
        // CRUD - Parking Spots
        createParkingSpot: (data: any) =>
            apiClient('/parking-spots', { method: 'POST', data }),
        updateParkingSpot: (id: string, data: any) =>
            apiClient(`/parking-spots/${id}`, { method: 'PATCH', data }),
        deleteParkingSpot: (id: string) =>
            apiClient(`/parking-spots/${id}`, { method: 'DELETE' }),
        
        // Guest Visits
        getGuestVisits: (page: number, limit: number, filters?: { status?: string; search?: string }) => {
            const params = new URLSearchParams();
            params.append('page', page.toString());
            params.append('limit', limit.toString());
            if (filters?.status) params.append('status', filters.status);
            if (filters?.search) params.append('search', filters.search);
            return apiClient(`/guest-visits?${params.toString()}`);
        },
        createGuestVisit: (data: any) =>
            apiClient('/guest-visits', { method: 'POST', data }),
        updateGuestVisit: (id: string, data: any) =>
            apiClient(`/guest-visits/${id}`, { method: 'PATCH', data }),
        deleteGuestVisit: (id: string) =>
            apiClient(`/guest-visits/${id}`, { method: 'DELETE' }),
        updateGuestVisitStatus: (id: string, status: string, timestamp?: Date) =>
            apiClient(`/guest-visits/${id}/status`, { 
                method: 'PATCH', 
                data: { status, timestamp: timestamp?.toISOString() } 
            }),
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
