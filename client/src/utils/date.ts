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

// ==================== GUEST VISIT DATE/TIME UTILITIES ====================

/**
 * Format guest visit time for display
 * @param date - Date object or null
 * @returns Formatted time string (HH:MM) or empty string
 */
export function formatGuestVisitTime(date: Date | null | undefined): string {
    if (!date) return '';

    return new Intl.DateTimeFormat('tr-TR', {
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);
}

/**
 * Format guest visit date for display
 * @param dateString - ISO date string (YYYY-MM-DD)
 * @returns Formatted date string (DD.MM.YYYY)
 */
export function formatGuestVisitDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR').format(date);
}

/**
 * Get guest visit status label with time info
 * @param visit - Guest visit object
 * @returns Status label with time info
 */
export function getGuestVisitStatusLabel(visit: {
    status: 'pending' | 'active' | 'completed';
    entryTime?: Date | null;
    exitTime?: Date | null;
}): string {
    switch (visit.status) {
        case 'pending':
            return 'Bekleniyor';
        case 'active':
            return visit.entryTime
                ? `İçeride (${formatGuestVisitTime(visit.entryTime)})`
                : 'İçeride';
        case 'completed':
            return visit.exitTime
                ? `Çıkış Yaptı (${formatGuestVisitTime(visit.exitTime)})`
                : 'Tamamlandı';
        default:
            return 'Bilinmiyor';
    }
}

/**
 * Converts display date string (DD.MM.YYYY - HH:mm) to ISO datetime string (YYYY-MM-DDTHH:mm:ss)
 * @param displayDate - Date string in format "DD.MM.YYYY - HH:mm" or "DD.MM.YYYY"
 * @returns ISO datetime string or empty string if invalid
 */
export function parseDisplayDateToISO(displayDate: string): string {
    if (!displayDate || displayDate === '-') return '';

    try {
        // Handle "DD.MM.YYYY - HH:mm" format
        const parts = displayDate.split(' - ');
        const datePart = parts[0]; // "DD.MM.YYYY"
        const timePart = parts[1] || '00:00'; // "HH:mm" or default

        const [day, month, year] = datePart.split('.');
        const [hours, minutes] = timePart.split(':');

        if (!day || !month || !year) return '';

        // Validate time parts
        const hoursNum = hours ? parseInt(hours, 10) : 0;
        const minutesNum = minutes ? parseInt(minutes, 10) : 0;

        if (isNaN(hoursNum) || hoursNum < 0 || hoursNum > 23) return '';
        if (isNaN(minutesNum) || minutesNum < 0 || minutesNum > 59) return '';

        // Create ISO string: YYYY-MM-DDTHH:mm:ss
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${String(hoursNum).padStart(2, '0')}:${String(minutesNum).padStart(2, '0')}:00`;
    } catch {
        return '';
    }
}

/**
 * Format ISO date string to date and time with "Today/Yesterday" support
 * @param date - ISO date string or Date object
 * @returns Formatted date and time (e.g., "Bugün, 23:52" or "30.12.2025 • 23:52")
 */
export function formatDateTime(date: string | Date | null | undefined): string {
    if (!date) return '-';

    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        const now = new Date();

        const time = dateObj.toLocaleTimeString('tr-TR', {
            hour: '2-digit',
            minute: '2-digit'
        });

        const isToday = dateObj.toDateString() === now.toDateString();
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        const isYesterday = dateObj.toDateString() === yesterday.toDateString();

        if (isToday) return `Bugün, ${time}`;
        if (isYesterday) return `Dün, ${time}`;

        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const year = dateObj.getFullYear();

        return `${day}.${month}.${year} • ${time}`;
    } catch {
        return '-';
    }
}
