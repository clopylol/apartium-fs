import type { FC, ButtonHTMLAttributes, ReactNode } from 'react';

export type IconButtonVariant = 'default' | 'destructive';
export type IconButtonSize = 'sm' | 'md' | 'lg';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: IconButtonVariant;
    size?: IconButtonSize;
    icon: ReactNode;
    ariaLabel: string;
}

const variantStyles: Record<IconButtonVariant, string> = {
    default: 'text-ds-muted-light dark:text-ds-muted-dark hover:text-ds-primary-light dark:hover:text-ds-primary-dark hover:bg-ds-background-light dark:hover:bg-ds-background-dark',
    destructive: 'text-ds-muted-light dark:text-ds-muted-dark hover:text-ds-in-destructive-400 hover:bg-ds-background-light dark:hover:bg-ds-background-dark',
};

const sizeStyles: Record<IconButtonSize, string> = {
    sm: 'w-8 h-8 p-1.5',
    md: 'w-9 h-9 p-2',
    lg: 'w-10 h-10 p-2.5',
};

export const IconButton: FC<IconButtonProps> = ({
    variant = 'default',
    size = 'md',
    icon,
    ariaLabel,
    className = '',
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-ds-ring-light dark:focus:ring-ds-ring-dark focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed';

    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`.trim();

    return (
        <button
            className={combinedClassName}
            aria-label={ariaLabel}
            {...props}
        >
            {icon}
        </button>
    );
};
