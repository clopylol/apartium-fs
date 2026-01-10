import type { ReactNode } from "react";

export interface TabItem<T extends string> {
    id: T;
    label: string;
    icon?: ReactNode;
}

interface TabToggleProps<T extends string> {
    items: TabItem<T>[];
    activeTab: T;
    onChange: (id: T) => void;
    className?: string;
}

export const TabToggle = <T extends string>({
    items,
    activeTab,
    onChange,
    className = "",
}: TabToggleProps<T>) => {
    return (
        <div className={`flex bg-ds-card-light dark:bg-ds-card-dark p-1 rounded-xl border border-ds-border-light dark:border-ds-border-dark ${className}`}>
            {items.map((item) => (
                <button
                    key={item.id}
                    onClick={() => onChange(item.id)}
                    className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${activeTab === item.id
                        ? "bg-ds-muted-light dark:bg-ds-muted-dark text-ds-primary-light dark:text-ds-primary-dark shadow-sm"
                        : "text-ds-muted-light dark:text-ds-muted-dark hover:text-ds-primary-light dark:hover:text-ds-primary-dark"
                        }`}
                >
                    {item.icon && <span className="w-4 h-4">{item.icon}</span>}
                    {item.label}
                </button>
            ))}
        </div>
    );
};

