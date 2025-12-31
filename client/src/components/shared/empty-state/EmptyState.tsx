import type { FC, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/shared/button";

interface EmptyStateProps {
    icon: LucideIcon | ReactNode;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
    className?: string;
}

export const EmptyState: FC<EmptyStateProps> = ({
    icon: Icon,
    title,
    description,
    actionLabel,
    onAction,
    className = "",
}) => {
    return (
        <div className={`flex flex-col items-center justify-center py-16 px-4 text-center animate-in fade-in slide-in-from-bottom-4 duration-500 ${className}`}>
            <div className="w-20 h-20 rounded-full bg-ds-accent-light/10 dark:bg-ds-accent-dark/10 flex items-center justify-center mb-6 ring-8 ring-ds-accent-light/5 dark:ring-ds-accent-dark/5">
                {Icon && (typeof Icon === 'function' || (typeof Icon === 'object' && 'render' in (Icon as any))) ? (
                    <Icon {...({ className: "w-10 h-10 text-ds-primary-light dark:text-ds-primary-dark opacity-60" } as any)} />
                ) : (
                    <div className="text-ds-primary-light dark:text-ds-primary-dark opacity-60">
                        {Icon as ReactNode}
                    </div>
                )}
            </div>

            <h3 className="text-xl font-bold text-ds-secondary-light dark:text-ds-secondary-dark mb-2">
                {title}
            </h3>

            <p className="text-ds-muted-light dark:text-ds-muted-dark max-w-sm mx-auto mb-8 text-sm leading-relaxed">
                {description}
            </p>

            {actionLabel && onAction && (
                <Button
                    onClick={onAction}
                    variant="primary"
                    className="shadow-xl shadow-ds-primary-light/20 dark:shadow-ds-primary-dark/10 px-8"
                >
                    {actionLabel}
                </Button>
            )}
        </div>
    );
};
