import type { FC, ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
    primary: 'bg-ds-action hover:bg-ds-action-hover text-white shadow-lg shadow-ds-action/30 hover:scale-105',
    secondary: 'bg-ds-card-light dark:bg-ds-card-dark hover:bg-ds-muted-light dark:hover:bg-ds-muted-dark border border-ds-border-light dark:border-ds-border-dark text-ds-primary-light dark:text-ds-primary-dark hover:border-ds-muted-light dark:hover:border-ds-muted-dark',
    outline: 'bg-transparent border border-ds-border-light dark:border-ds-border-dark text-ds-primary-light dark:text-ds-primary-dark hover:bg-ds-background-light/50 dark:hover:bg-ds-background-dark/50 hover:border-ds-secondary-light dark:hover:border-ds-secondary-dark',
    ghost: 'bg-transparent text-ds-primary-light dark:text-ds-primary-dark hover:bg-ds-background-light/50 dark:hover:bg-ds-background-dark/50',
    destructive: 'bg-ds-in-destructive-500 hover:bg-ds-in-destructive-600 text-white shadow-lg shadow-ds-in-destructive-500/30',
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-xs rounded-lg',
    md: 'px-4 py-2.5 text-sm rounded-xl',
    lg: 'px-5 py-3 text-base rounded-xl',
};

export const Button: FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    disabled,
    className = '',
    children,
    ...props
}) => {
    const baseStyles = 'font-medium flex items-center justify-center gap-2 transition-all focus:outline-none focus:ring-2 focus:ring-ds-ring-light dark:focus:ring-ds-ring-dark focus:ring-offset-2 focus:ring-offset-ds-background-light dark:focus:ring-offset-ds-background-dark disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100';

    const widthStyles = fullWidth ? 'w-full' : '';

    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${className}`.trim();

    return (
        <button
            className={combinedClassName}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {children}
                </>
            ) : (
                <>
                    {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
                    {children}
                    {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
                </>
            )}
        </button>
    );
};
