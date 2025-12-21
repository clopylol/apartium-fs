import { useState, useRef, useEffect } from 'react';
import type { FC } from 'react';
import { ChevronDown, CheckCircle } from 'lucide-react';

interface CustomDropdownProps {
    options: string[];
    value: string;
    onChange: (val: string) => void;
    icon?: React.ElementType;
}

export const CustomDropdown: FC<CustomDropdownProps> = ({ options, value, onChange, icon: Icon }) => {
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

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-200 min-w-[140px] justify-between ${isOpen
                        ? 'bg-ds-muted-dark border-ds-in-indigo-light text-ds-secondary-dark shadow-lg shadow-ds-in-indigo-dark/20'
                        : 'bg-ds-card-dark border-ds-border-dark text-ds-secondary-dark hover:border-ds-muted-light hover:bg-ds-muted-dark'
                    }`}
            >
                <div className="flex items-center gap-2">
                    {Icon && <Icon className={`w-4 h-4 ${isOpen ? 'text-ds-in-indigo-light' : 'text-ds-muted-light'}`} />}
                    <span className="font-medium text-sm">{value}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-ds-muted-light transition-transform duration-200 ${isOpen ? 'rotate-180 text-ds-in-indigo-light' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-full bg-ds-card-dark border border-ds-border-dark rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100 max-h-64 overflow-y-auto custom-scrollbar">
                    {options.map((option) => (
                        <button
                            key={option}
                            onClick={() => {
                                onChange(option);
                                setIsOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between group ${value === option
                                    ? 'bg-ds-in-indigo-dark/10 text-ds-in-indigo-light font-medium'
                                    : 'text-ds-secondary-dark hover:bg-ds-muted-dark hover:text-ds-secondary-light'
                                }`}
                        >
                            {option}
                            {value === option && <CheckCircle className="w-3.5 h-3.5" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
