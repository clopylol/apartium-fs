/**
 * Vehicle Brands & Models Cache Utility
 * localStorage kullanarak vehicle brands ve models'i kalıcı olarak cache'ler
 * Bu veriler çok sık değişmediği için localStorage'da tutmak performans sağlar
 */

const CACHE_KEYS = {
    BRANDS: 'apartium_vehicle_brands',
    MODELS: 'apartium_vehicle_models',
    CACHE_TIMESTAMP: 'apartium_vehicle_cache_timestamp',
} as const;

// Cache süresi: 7 gün (marka/model listesi çok sık değişmez)
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 gün (milisaniye)

interface CacheData<T> {
    data: T;
    timestamp: number;
}

/**
 * localStorage'dan cache'lenmiş veriyi okur
 */
export function getCachedData<T>(key: string): T | null {
    try {
        const cached = localStorage.getItem(key);
        if (!cached) return null;

        const parsed: CacheData<T> = JSON.parse(cached);
        const now = Date.now();

        // Cache süresi dolmuş mu kontrol et
        if (now - parsed.timestamp > CACHE_DURATION) {
            localStorage.removeItem(key);
            return null;
        }

        return parsed.data;
    } catch (error) {
        console.error(`Error reading cache for ${key}:`, error);
        return null;
    }
}

/**
 * Veriyi localStorage'a cache'ler
 */
export function setCachedData<T>(key: string, data: T): void {
    try {
        const cacheData: CacheData<T> = {
            data,
            timestamp: Date.now(),
        };
        localStorage.setItem(key, JSON.stringify(cacheData));
    } catch (error) {
        console.error(`Error writing cache for ${key}:`, error);
        // localStorage dolu olabilir, hata verme ama log'la
    }
}

/**
 * Vehicle brands'i cache'den okur
 */
export function getCachedBrands() {
    return getCachedData<{ brands: any[] }>(CACHE_KEYS.BRANDS);
}

/**
 * Vehicle brands'i cache'ler
 */
export function setCachedBrands(data: { brands: any[] }): void {
    setCachedData(CACHE_KEYS.BRANDS, data);
}

/**
 * Vehicle models'i cache'den okur (brandId'ye göre)
 */
export function getCachedModels(brandId: string) {
    const key = `${CACHE_KEYS.MODELS}_${brandId}`;
    return getCachedData<{ models: any[] }>(key);
}

/**
 * Vehicle models'i cache'ler (brandId'ye göre)
 */
export function setCachedModels(brandId: string, data: { models: any[] }): void {
    const key = `${CACHE_KEYS.MODELS}_${brandId}`;
    setCachedData(key, data);
}

/**
 * Tüm vehicle cache'lerini temizler
 */
export function clearVehicleCache(): void {
    try {
        // Tüm brands cache'ini temizle
        localStorage.removeItem(CACHE_KEYS.BRANDS);
        
        // Tüm models cache'lerini temizle (tüm key'leri bul)
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key?.startsWith(CACHE_KEYS.MODELS)) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
        
        localStorage.removeItem(CACHE_KEYS.CACHE_TIMESTAMP);
    } catch (error) {
        console.error('Error clearing vehicle cache:', error);
    }
}

