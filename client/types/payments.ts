export interface PaymentRecord {
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
    amount: number;
    date: string;
    status: 'paid' | 'pending';
    description?: string;
    attachment?: string;
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
