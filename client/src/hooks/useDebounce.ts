import { useState, useEffect } from 'react';

/**
 * Debounce hook - Değer değişimlerini geciktirir
 * @param value - Debounce edilecek değer
 * @param delay - Gecikme süresi (ms)
 * @returns Debounce edilmiş değer
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        // Delay sonrasında değeri güncelle
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Cleanup: yeni değer gelirse önceki timer'ı iptal et
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

