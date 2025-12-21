import type { FC, ReactNode } from "react";

export type FilterChipVariant = "default" | "primary" | "secondary" | "success" | "warning" | "destructive" | "info";

interface FilterChipProps {
    label: string;
    isActive: boolean;
    onClick: () => void;
    icon?: ReactNode;
    variant?: FilterChipVariant;
    className?: string;
}

const baseInactive = "bg-ds-card-light dark:bg-ds-card-dark border border-ds-border-light dark:border-ds-border-dark text-ds-secondary-light dark:text-ds-secondary-dark hover:border-ds-muted-light dark:hover:border-ds-muted-dark hover:text-ds-primary-light dark:hover:text-ds-primary-dark";

const variantStyles: Record<FilterChipVariant, { active: string; inactive: string }> = {
    default: {
        active: "bg-ds-muted-light dark:bg-ds-muted-dark text-white border-ds-muted-light dark:border-ds-muted-dark shadow-sm",
        inactive: baseInactive,
    },
    primary: {
        active: "bg-ds-primary-light/10 dark:bg-ds-primary-dark/10 text-ds-primary-light dark:text-ds-primary-dark border-ds-primary-light/50 dark:border-ds-primary-dark/50",
        inactive: baseInactive,
    },
    secondary: {
        active: "bg-ds-secondary-light/10 dark:bg-ds-secondary-dark/10 text-ds-secondary-light dark:text-ds-secondary-dark border-ds-secondary-light/50 dark:border-ds-secondary-dark/50",
        inactive: baseInactive,
    },
    success: {
        active: "bg-ds-in-success-500/10 text-ds-in-success-400 border-ds-in-success-500/50",
        inactive: baseInactive,
    },
    warning: {
        active: "bg-ds-in-warning-500/10 text-ds-in-warning-400 border-ds-in-warning-500/50",
        inactive: baseInactive,
    },
    destructive: {
        active: "bg-ds-in-destructive-500/10 text-ds-in-destructive-400 border-ds-in-destructive-500/50",
        inactive: baseInactive,
    },
    info: {
        active: "bg-ds-in-sky-500/10 text-ds-in-sky-400 border-ds-in-sky-500/50",
        inactive: baseInactive,
    },
};

export const FilterChip: FC<FilterChipProps> = ({
    label,
    isActive,
    onClick,
    icon,
    variant = "default",
    className = "",
}) => {
    const styles = variantStyles[variant];

    return (
        <button
            onClick={onClick}
            className={`px-3 py-1.5 rounded-lg text-xs font-heading font-semibold border transition-all whitespace-nowrap flex items-center justify-center gap-2 ${isActive ? styles.active : styles.inactive
                } ${className}`}
        >
            {icon && <span className="flex-shrink-0 flex items-center">{icon}</span>}
            {label}
        </button>
    );
};

