/**
 * Input validation ve sanitization utilities
 */

/**
 * Search query'yi sanitize eder
 * - Maksimum uzunluk kontrolü
 * - Tehlikeli karakterleri temizler
 * - SQL wildcard karakterlerini escape eder
 */
export function sanitizeSearchQuery(query: string | undefined): string | undefined {
    if (!query) return undefined;

    // Trim ve boşluk kontrolü
    const trimmed = query.trim();
    if (trimmed.length === 0) return undefined;

    // Maksimum uzunluk kontrolü (100 karakter)
    const MAX_SEARCH_LENGTH = 100;
    if (trimmed.length > MAX_SEARCH_LENGTH) {
        return trimmed.substring(0, MAX_SEARCH_LENGTH);
    }

    // SQL wildcard karakterlerini escape et (%, _)
    // Drizzle ORM zaten SQL injection'a karşı korumalı ama ekstra güvenlik
    let sanitized = trimmed
        .replace(/[%_]/g, '\\$&'); // % ve _ karakterlerini escape et

    // Tehlikeli HTML/Script karakterlerini temizle (ekstra güvenlik katmanı)
    sanitized = sanitized
        .replace(/[<>]/g, ''); // < ve > karakterlerini kaldır

    return sanitized;
}

/**
 * Enum değerlerini validate eder
 */
export function validateEnum<T extends string>(
    value: string | undefined,
    allowedValues: readonly T[]
): T | undefined {
    if (!value) return undefined;
    return allowedValues.includes(value as T) ? (value as T) : undefined;
}

/**
 * Pagination parametrelerini validate eder
 */
export function validatePagination(page: number, limit: number): { page: number; limit: number } {
    const MAX_LIMIT = 100;
    const MIN_PAGE = 1;
    const MIN_LIMIT = 1;

    return {
        page: Math.max(MIN_PAGE, Math.floor(page)),
        limit: Math.max(MIN_LIMIT, Math.min(MAX_LIMIT, Math.floor(limit))),
    };
}

