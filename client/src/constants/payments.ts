import { Receipt, Droplets, Flame, Zap, Wrench, RefreshCcw, Sprout, Shield, Users, FileText } from 'lucide-react';
import type { ExpenseCategory } from '@/types/payments';

export const ITEMS_PER_PAGE = 20;

export const MONTHS = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

export const CURRENT_YEAR = new Date().getFullYear();
export const YEARS = [
    (CURRENT_YEAR - 1).toString(),
    CURRENT_YEAR.toString(),
    (CURRENT_YEAR + 1).toString(),
    (CURRENT_YEAR + 2).toString()
];

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
    {
        id: 'utilities',
        label: 'Faturalar',
        icon: Receipt,
        color: 'blue',
        subItems: [
            { label: 'Su Faturası', icon: Droplets },
            { label: 'Doğalgaz', icon: Flame },
            { label: 'Ortak Elektrik', icon: Zap }
        ]
    },
    {
        id: 'maintenance',
        label: 'Bakım & Onarım',
        icon: Wrench,
        color: 'orange',
        subItems: [
            { label: 'Asansör Bakımı', icon: RefreshCcw },
            { label: 'Havuz Bakımı', icon: Droplets },
            { label: 'Bahçe Düzenlemesi', icon: Sprout }
        ]
    },
    {
        id: 'personnel',
        label: 'Personel & Güvenlik',
        icon: Shield,
        color: 'purple',
        subItems: [
            { label: 'Güvenlik Personeli', icon: Shield },
            { label: 'Kapıcı Maaşı', icon: Users }
        ]
    },
    {
        id: 'general',
        label: 'Genel Giderler',
        icon: FileText,
        color: 'slate',
        subItems: [
            { label: 'Yönetim Giderleri', icon: FileText },
            { label: 'Kırtasiye', icon: FileText }
        ]
    },
];
