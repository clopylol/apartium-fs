export interface PaymentRecord {
    id: string | null; // null for placeholder payment records
    residentId: string;
    unitId: string;
    amount: number | string; // Can be decimal string from DB
    type: 'aidat' | 'demirbas' | 'yakit';
    status: 'paid' | 'unpaid';
    paymentDate: string | null; // ISO timestamp from DB
    periodMonth: string;
    periodYear: number;
    createdAt: string | null; // null for placeholder records
    updatedAt: string | null; // null for placeholder records
    // JOIN data from API
    residentName: string;
    residentPhone: string;
    residentAvatar: string | null;
    unitNumber: string;
    buildingId: string;
    buildingName: string | null;
}

// Legacy format for components (temporary compatibility)
export interface PaymentRecordLegacy {
    id: string;
    unit: string;
    residentName: string;
    amount: number;
    status: 'paid' | 'unpaid';
    date?: string; // Payment date string (includes time)
    avatar: string;
    type: 'aidat' | 'demirbas' | 'yakit';
    phone: string;
}

export interface ExpenseRecord {
    id: string;
    title: string;
    category: 'utilities' | 'maintenance' | 'personnel' | 'general';
    amount: number | string; // Can be decimal string from DB
    expenseDate: string; // Date string from DB
    status: 'paid' | 'pending';
    description: string | null;
    attachmentUrl: string | null;
    siteId: string | null;
    buildingId: string | null;
    distributionType?: 'equal' | 'area_based'; // Dağıtım tipi
    periodMonth: string;
    periodYear: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}

// Legacy format for components (temporary compatibility)
export interface ExpenseRecordLegacy {
    id: string;
    title: string;
    category: 'utilities' | 'maintenance' | 'personnel' | 'general';
    amount: number;
    date: string;
    status: 'paid' | 'pending';
    description?: string;
    attachment?: string;
    siteId?: string | null;
    buildingId?: string | null;
}

export interface ExpenseCategory {
    id: 'utilities' | 'maintenance' | 'personnel' | 'general';
    label: string;
    icon: React.ElementType;
    color: string;
    subItems: { label: string; icon: React.ElementType }[];
}

export interface IncomeStats {
    total: number;
    collected: number;
    pending: number;
    rate: number;
}

export interface ExpenseStats {
    total: number;
    paid: number;
    pending: number;
}

// API Response Types
export interface PaymentsApiResponse {
    payments: PaymentRecord[];
    total: number;
    stats: IncomeStats;
}

export interface ExpensesApiResponse {
    expenses: ExpenseRecord[];
    total: number;
    stats: ExpenseStats;
}

// Form Data Types
export interface PaymentStatusUpdateData {
    status: 'paid' | 'unpaid';
    paymentDate?: string;
    paymentInfo?: {
        residentName: string;
        amount: number;
    };
}

export interface BulkAmountUpdateData {
    month: string;
    year: number;
    amount: number;
}

export interface BulkDuesItem {
    month: string;
    year: string;
    amount: number;
}

export interface ExpenseFormData {
    title: string;
    category: 'utilities' | 'maintenance' | 'personnel' | 'general';
    amount: number;
    expenseDate: string;
    status: 'paid' | 'pending';
    description?: string;
    siteId?: string;
    buildingId?: string;
    periodMonth: string;
    periodYear: number;
}

export interface ExpenseAllocation {
    id: string;
    expenseId: string;
    unitId: string;
    allocatedAmount: number | string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    // JOIN data from API
    unitNumber?: string | null;
    buildingName?: string | null;
    expenseTitle?: string | null;
    expenseCategory?: 'utilities' | 'maintenance' | 'personnel' | 'general' | null;
    expenseDate?: string | null;
}
