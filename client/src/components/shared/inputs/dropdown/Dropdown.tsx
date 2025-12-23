import { useState, useRef, useEffect } from 'react';
import type { FC, ElementType } from 'react';
import { ChevronDown, CheckCircle } from 'lucide-react';

export type DropdownOption = string | { value: string; label: string };

interface DropdownProps {
    options: DropdownOption[];
    value: string;
    onChange: (val: string) => void;
    icon?: ElementType;
    placeholder?: string;
    className?: string;
}

export const Dropdown: FC<DropdownProps> = ({
    options,
    value,
    onChange,
    icon: Icon,
    placeholder,
    className = ""
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getOptionLabel = (option: DropdownOption) => {
        return typeof option === 'string' ? option : option.label;
    };

    const getOptionValue = (option: DropdownOption) => {
        return typeof option === 'string' ? option : option.value;
    };

    const selectedOption = options.find(opt => getOptionValue(opt) === value);
    const displayValue = selectedOption ? getOptionLabel(selectedOption) : value;

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-200 min-w-[140px] justify-between w-full ${isOpen
                    ? 'bg-ds-muted-light dark:bg-ds-muted-dark border-ds-in-indigo-500 dark:border-ds-in-indigo-400 text-ds-primary-light dark:text-ds-secondary-dark shadow-lg shadow-ds-in-indigo-500/20 dark:shadow-ds-in-indigo-900/20'
                    : 'bg-ds-card-light dark:bg-ds-card-dark border-ds-border-light dark:border-ds-border-dark text-ds-primary-light dark:text-ds-secondary-dark hover:border-ds-muted-light dark:hover:border-ds-muted-light hover:bg-ds-muted-light/50 dark:hover:bg-ds-muted-dark'
                    }`}
            >
                <div className="flex items-center gap-2">
                    {Icon && <Icon className={`w-4 h-4 ${isOpen ? 'text-ds-in-indigo-500 dark:text-ds-in-indigo-400' : 'text-ds-muted-light dark:text-ds-muted-dark'}`} />}
                    <span className="font-medium text-sm truncate">{displayValue || placeholder}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-ds-muted-light dark:text-ds-muted-dark transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-ds-in-indigo-500 dark:text-ds-in-indigo-400' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-full bg-ds-card-light dark:bg-ds-card-dark border border-ds-border-light dark:border-ds-border-dark rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100 max-h-64 overflow-y-auto custom-scrollbar">
                    {options.map((option) => {
                        const optValue = getOptionValue(option);
                        const optLabel = getOptionLabel(option);
                        return (
                            <button
                                key={optValue}
                                onClick={() => {
                                    onChange(optValue);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between group ${value === optValue
                                    ? 'bg-ds-in-indigo-500/10 dark:bg-ds-in-indigo-900/10 text-ds-in-indigo-600 dark:text-ds-in-indigo-400 font-medium'
                                    : 'text-ds-primary-light dark:text-ds-secondary-dark hover:bg-ds-muted-light/50 dark:hover:bg-ds-muted-dark hover:text-ds-primary-light dark:hover:text-ds-secondary-light'
                                    }`}
                            >
                                <span className="truncate">{optLabel}</span>
                                {value === optValue && <CheckCircle className="w-3.5 h-3.5 shrink-0 text-ds-in-indigo-600 dark:text-ds-in-indigo-400" />}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

