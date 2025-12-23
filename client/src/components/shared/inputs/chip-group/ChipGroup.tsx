import type { FC } from "react";

export interface ChipGroupItem {
    id: string;
    label: string;
}

interface ChipGroupProps {
    items: ChipGroupItem[];
    activeId: string;
    onChange: (id: string) => void;
    className?: string;
}

export const ChipGroup: FC<ChipGroupProps> = ({
    items,
    activeId,
    onChange,
    className = "",
}) => {
    return (
        <div className={`inline-flex bg-ds-card-light dark:bg-ds-card-dark p-1 rounded-xl border border-ds-border-light dark:border-ds-border-dark ${className}`}>
            {items.map((item, index) => (
                <div key={item.id} className="flex items-center">
                    <button
                        onClick={() => onChange(item.id)}
                        className={`px-4 py-2.5 rounded-lg text-sm font-heading font-semibold transition-all whitespace-nowrap ${
                            activeId === item.id
                                ? "bg-ds-muted-light dark:bg-ds-muted-dark text-white"
                                : "text-ds-secondary-light dark:text-ds-secondary-dark hover:text-ds-primary-light dark:hover:text-ds-primary-dark"
                        }`}
                    >
                        {item.label}
                    </button>
                    {index < items.length - 1 && (
                        <div className="h-6 w-px bg-ds-border-light dark:bg-ds-border-dark mx-1" />
                    )}
                </div>
            ))}
        </div>
    );
};

