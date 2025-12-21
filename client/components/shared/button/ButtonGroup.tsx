import type { FC, ReactNode } from 'react';

interface ButtonGroupItem {
    id: string;
    label: string;
    icon?: ReactNode;
    badge?: number;
}

interface ButtonGroupProps {
    items: ButtonGroupItem[];
    activeId: string;
    onChange: (id: string) => void;
    className?: string;
}

export const ButtonGroup: FC<ButtonGroupProps> = ({
    items,
    activeId,
    onChange,
    className = '',
}) => {
    return (
        <div className={`flex bg-ds-card-light dark:bg-ds-card-dark p-1 rounded-xl border border-ds-border-light dark:border-ds-border-dark ${className}`}>
            {items.map((item) => (
                <button
                    key={item.id}
                    onClick={() => onChange(item.id)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${activeId === item.id
                            ? 'bg-ds-accent-light dark:bg-ds-accent-dark text-ds-primary-light dark:text-ds-primary-dark shadow-sm'
                            : 'text-ds-secondary-light dark:text-ds-secondary-dark hover:text-ds-primary-light dark:hover:text-ds-primary-dark'
                        }`}
                >
                    {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                    {item.label}
                    {item.badge !== undefined && item.badge > 0 && (
                        <span className="w-5 h-5 rounded-full bg-ds-in-destructive-500 text-white text-[10px] flex items-center justify-center">
                            {item.badge}
                        </span>
                    )}
                </button>
            ))}
        </div>
    );
};
