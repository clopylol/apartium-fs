/**
 * Centralized logging utility
 * In production, can be extended to send logs to external service (e.g., Sentry, LogRocket)
 */

export const logger = {
    error: (message: string, error?: unknown, context?: Record<string, unknown>) => {
        if (process.env.NODE_ENV === 'development') {
            console.error(`[ERROR] ${message}`, error, context);
        } else {
            // In production, send to logging service (e.g., Sentry, LogRocket)
            // For now, still log to console but can be extended
            console.error(`[ERROR] ${message}`, error);
        }
    },
    warn: (message: string, context?: Record<string, unknown>) => {
        if (process.env.NODE_ENV === 'development') {
            console.warn(`[WARN] ${message}`, context);
        }
    },
    info: (message: string, context?: Record<string, unknown>) => {
        if (process.env.NODE_ENV === 'development') {
            console.info(`[INFO] ${message}`, context);
        }
    },
};

