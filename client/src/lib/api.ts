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

    try {
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
    } catch (error) {
        // Network error veya fetch hatası
        if (error instanceof TypeError && error.message === 'Failed to fetch') {
            throw new Error(
                `Sunucuya bağlanılamıyor. Lütfen backend sunucusunun çalıştığından emin olun. (${API_BASE_URL})`
            );
        }
        // Diğer hataları olduğu gibi fırlat
        throw error;
    }
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
        getByPeriod: (
            month: string,
            year: number,
            page: number = 1,
            limit: number = 20,
            filters?: { search?: string; status?: 'paid' | 'unpaid'; siteId?: string; buildingId?: string }
        ) => {
            const params = new URLSearchParams();
            params.append('month', month);
            params.append('year', year.toString());
            params.append('page', page.toString());
            params.append('limit', limit.toString());
            if (filters?.search && filters.search.trim().length >= 3) {
                params.append('search', filters.search.trim());
            }
            if (filters?.status) {
                params.append('status', filters.status);
            }
            if (filters?.buildingId) {
                params.append('buildingId', filters.buildingId);
            } else if (filters?.siteId) {
                params.append('siteId', filters.siteId);
            }
            return apiClient(`/payments?${params.toString()}`);
        },
        create: (payment: any) =>
            apiClient('/payments', { method: 'POST', data: payment }),
        updateStatus: (id: string, status: 'paid' | 'unpaid', paymentDate?: string) =>
            apiClient(`/payments/${id}/status`, {
                method: 'PATCH',
                data: { status, paymentDate }
            }),
        bulkAmountUpdate: (month: string, year: number, amount: number) =>
            apiClient('/payments/bulk-amount', {
                method: 'PATCH',
                data: { month, year, amount }
            }),
    },

    // Expenses
    expenses: {
        getByPeriod: (
            month: string,
            year: number,
            page: number = 1,
            limit: number = 20,
            filters?: { search?: string; category?: string; siteId?: string; buildingId?: string }
        ) => {
            const params = new URLSearchParams();
            params.append('month', month);
            params.append('year', year.toString());
            params.append('page', page.toString());
            params.append('limit', limit.toString());
            if (filters?.search && filters.search.trim().length >= 3) {
                params.append('search', filters.search.trim());
            }
            if (filters?.category) {
                params.append('category', filters.category);
            }
            if (filters?.buildingId) {
                params.append('buildingId', filters.buildingId);
            } else if (filters?.siteId) {
                params.append('siteId', filters.siteId);
            }
            return apiClient(`/expenses?${params.toString()}`);
        },
        getById: (id: string) =>
            apiClient(`/expenses/${id}`),
        create: (expense: any) =>
            apiClient('/expenses', { method: 'POST', data: expense }),
        update: (id: string, data: any) =>
            apiClient(`/expenses/${id}`, { method: 'PATCH', data }),
        delete: (id: string) =>
            apiClient(`/expenses/${id}`, { method: 'DELETE' }),
        getAllocations: (expenseId: string) =>
            apiClient(`/expenses/${expenseId}/allocations`),
        getUnitAllocations: (unitId: string) =>
            apiClient(`/units/${unitId}/expense-allocations`),
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

    // Units
    units: {
        create: (data: { buildingId: string; number: string; floor: number }) =>
            apiClient('/units', { method: 'POST', data: { ...data, status: 'empty' } }),
        update: (id: string, data: any) =>
            apiClient(`/units/${id}`, { method: 'PATCH', data }),
        delete: (id: string) =>
            apiClient(`/units/${id}`, { method: 'DELETE' }),
    },

    // Vehicle Brands & Models
    vehicleBrands: {
        getAll: () => apiClient('/vehicle-brands'),
        getModelsByBrandId: (brandId: string) =>
            apiClient(`/vehicle-brands/${brandId}/models`),
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
        getVehiclesByResidentId: (residentId: string) =>
            apiClient(`/residents/${residentId}/vehicles`),
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
        getRequests: async (page: number, limit: number, filters?: {
            search?: string;
            status?: string;
            type?: string;
            siteId?: string;
            buildingId?: string;
            sortBy?: string;
            sortOrder?: 'asc' | 'desc';
        }) => {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
            });

            if (filters?.search) params.append('search', filters.search);
            if (filters?.status) params.append('status', filters.status);
            if (filters?.type) params.append('type', filters.type);
            if (filters?.siteId) params.append('siteId', filters.siteId);
            if (filters?.buildingId) params.append('buildingId', filters.buildingId);
            if (filters?.sortBy) params.append('sortBy', filters.sortBy);
            if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);
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
                data
            }),
        update: (id: string, data: any) =>
            apiClient(`/announcements/${id}`, {
                method: 'PATCH',
                data
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
    // Janitor
    janitor: {
        getStats: () =>
            apiClient('/janitors/stats'),

        getJanitors: (filters?: { siteId?: string }) => {
            const params = new URLSearchParams();
            if (filters?.siteId) params.append('siteId', filters.siteId);
            return apiClient(`/janitors?${params.toString()}`);
        },

        getRequests: (
            page: number,
            limit: number,
            filters?: {
                search?: string;
                status?: string;
                type?: string;
                siteId?: string;
                buildingId?: string;
                sortBy?: string;
                sortOrder?: 'asc' | 'desc';
            }
        ) => {
            const params = new URLSearchParams();
            params.append('page', page.toString());
            params.append('limit', limit.toString());
            if (filters?.search) params.append('search', filters.search);
            if (filters?.status) params.append('status', filters.status);
            if (filters?.type) params.append('type', filters.type);
            if (filters?.sortBy) params.append('sortBy', filters.sortBy);
            if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);
            if (filters?.buildingId) {
                params.append('buildingId', filters.buildingId);
            } else if (filters?.siteId) {
                params.append('siteId', filters.siteId);
            }
            return apiClient(`/janitor-requests?${params.toString()}`);
        },

        createJanitor: (data: any) =>
            apiClient('/janitors', { method: 'POST', data }),

        updateJanitor: (id: string, data: any) =>
            apiClient(`/janitors/${id}`, { method: 'PATCH', data }),

        deleteJanitor: (id: string) =>
            apiClient(`/janitors/${id}`, { method: 'DELETE' }),

        createRequest: (data: any) =>
            apiClient('/janitor-requests', { method: 'POST', data }),

        updateRequestStatus: (id: string, status: string, completedAt?: string, completionNote?: string) =>
            apiClient(`/janitor-requests/${id}/status`, {
                method: 'PATCH',
                data: { status, completedAt, completionNote }
            }),

        deleteRequest: (id: string) =>
            apiClient(`/janitor-requests/${id}`, { method: 'DELETE' }),

        assignToBuilding: (janitorId: string, buildingId: string) =>
            apiClient('/janitors/assignments', { method: 'POST', data: { janitorId, buildingId } }),

        unassignFromBuilding: (janitorId: string, buildingId: string) =>
            apiClient('/janitors/assignments', { method: 'DELETE', data: { janitorId, buildingId } }),
    },
};
