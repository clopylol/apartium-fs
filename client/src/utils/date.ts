/**
 * Date utility functions for formatting dates in Turkish locale
 */

/**
 * Format ISO date string to Turkish locale
 * @param date - ISO date string or Date object
 * @returns Formatted date string (e.g., "24 Aralık 2025")
 */
export function formatDate(date: string | Date | null | undefined): string {
    if (!date) return '-';
    
    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return dateObj.toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    } catch {
        return '-';
    }
}

/**
 * Format ISO date string to short format
 * @param date - ISO date string or Date object
 * @returns Short formatted date (e.g., "24.12.2025")
 */
export function formatDateShort(date: string | Date | null | undefined): string {
    if (!date) return '-';
    
    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return dateObj.toLocaleDateString('tr-TR');
    } catch {
        return '-';
    }
}

/**
 * Format date for form input (YYYY-MM-DD)
 * @param date - ISO date string or Date object
 * @returns Date in YYYY-MM-DD format
 */
export function formatDateForInput(date: string | Date | null | undefined): string {
    if (!date) return new Date().toISOString().split('T')[0];
    
    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return dateObj.toISOString().split('T')[0];
    } catch {
        return new Date().toISOString().split('T')[0];
    }
}

/**
 * Get relative time (e.g., "2 saat önce", "3 gün önce")
 * @param date - ISO date string or Date object
 * @returns Relative time string
 */
export function formatRelativeTime(date: string | Date | null | undefined): string {
    if (!date) return '-';
    
    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        const now = new Date();
        const diffMs = now.getTime() - dateObj.getTime();
        const diffSecs = Math.floor(diffMs / 1000);
        const diffMins = Math.floor(diffSecs / 60);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);
        
        if (diffSecs < 60) return 'Az önce';
        if (diffMins < 60) return `${diffMins} dakika önce`;
        if (diffHours < 24) return `${diffHours} saat önce`;
        if (diffDays < 7) return `${diffDays} gün önce`;
        
        return formatDateShort(dateObj);
    } catch {
        return '-';
    }
}

