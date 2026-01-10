/**
 * Facility Constants
 * Tesis tipleri, fiyatlandırma seçenekleri ve saat seçenekleri
 */

// Sık kullanılan tesis tipleri (Türkiye)
export const FACILITY_TYPES = [
    { id: 'gym', labelKey: 'bookings.facilities.types.gym', defaultIcon: '🏋️' },
    { id: 'pool', labelKey: 'bookings.facilities.types.pool', defaultIcon: '🏊' },
    { id: 'meeting_room', labelKey: 'bookings.facilities.types.meetingRoom', defaultIcon: '🏢' },
    { id: 'bbq', labelKey: 'bookings.facilities.types.bbq', defaultIcon: '🍖' },
    { id: 'playground', labelKey: 'bookings.facilities.types.playground', defaultIcon: '🎢' },
    { id: 'tennis', labelKey: 'bookings.facilities.types.tennis', defaultIcon: '🎾' },
    { id: 'basketball', labelKey: 'bookings.facilities.types.basketball', defaultIcon: '🏀' },
    { id: 'sauna', labelKey: 'bookings.facilities.types.sauna', defaultIcon: '🧖' },
    { id: 'turkish_bath', labelKey: 'bookings.facilities.types.turkishBath', defaultIcon: '🛁' },
    { id: 'parking', labelKey: 'bookings.facilities.types.parking', defaultIcon: '🅿️' },
    { id: 'garden', labelKey: 'bookings.facilities.types.garden', defaultIcon: '🌳' },
    { id: 'laundry', labelKey: 'bookings.facilities.types.laundry', defaultIcon: '🧺' },
    { id: 'cinema', labelKey: 'bookings.facilities.types.cinema', defaultIcon: '🎬' },
    { id: 'library', labelKey: 'bookings.facilities.types.library', defaultIcon: '📚' },
    { id: 'other', labelKey: 'bookings.facilities.types.other', defaultIcon: '🏠' },
] as const;

export type FacilityTypeId = typeof FACILITY_TYPES[number]['id'];

// Fiyatlandırma tipleri
export const PRICING_TYPES = [
    { id: 'free', labelKey: 'bookings.facilities.pricing.free', showPrice: false },
    { id: 'per_entry', labelKey: 'bookings.facilities.pricing.perEntry', showPrice: true, unit: '₺/giriş' },
    { id: 'hourly', labelKey: 'bookings.facilities.pricing.hourly', showPrice: true, unit: '₺/saat' },
    { id: 'monthly', labelKey: 'bookings.facilities.pricing.monthly', showPrice: true, unit: '₺/ay' },
    { id: 'yearly', labelKey: 'bookings.facilities.pricing.yearly', showPrice: true, unit: '₺/yıl' },
] as const;

export type PricingTypeId = typeof PRICING_TYPES[number]['id'];

// Saat seçenekleri (30 dakika aralıklı)
export const TIME_OPTIONS: string[] = [];
for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
        const hour = h.toString().padStart(2, '0');
        const minute = m.toString().padStart(2, '0');
        TIME_OPTIONS.push(`${hour}:${minute}`);
    }
}

// Varsayılan çalışma saatleri
export const DEFAULT_OPEN_TIME = '08:00';
export const DEFAULT_CLOSE_TIME = '22:00';

// Tesis tipi ID'sinden tesis adını al
export function getFacilityTypeName(typeId: FacilityTypeId, t: (key: string) => string): string {
    const type = FACILITY_TYPES.find(ft => ft.id === typeId);
    return type ? t(type.labelKey) : typeId;
}

// Fiyatlandırma tipi ID'sinden label al
export function getPricingTypeLabel(pricingId: PricingTypeId, t: (key: string) => string): string {
    const type = PRICING_TYPES.find(pt => pt.id === pricingId);
    return type ? t(type.labelKey) : pricingId;
}
