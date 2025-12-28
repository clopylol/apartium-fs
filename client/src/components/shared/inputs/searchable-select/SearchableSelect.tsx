import { useState, useRef, useEffect, useMemo } from "react";
import { Search, ChevronDown, X } from "lucide-react";

export interface SearchableSelectOption {
    id: string;
    label: string;
    subtitle?: string;
}

interface SearchableSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: SearchableSelectOption[];
    disabled?: boolean;
    placeholder?: string;
    icon?: React.ReactNode;
    emptyMessage?: string;
}

export function SearchableSelect({
    value,
    onChange,
    options,
    disabled = false,
    placeholder = "Seçin...",
    icon,
    emptyMessage = "Sonuç bulunamadı",
}: SearchableSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchTerm("");
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Focus input when dropdown opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Filter options based on search term
    const filteredOptions = useMemo(() => {
        if (!searchTerm.trim()) return options;
        const term = searchTerm.toLowerCase();
        return options.filter((option) => {
            // Search in label
            if (option.label.toLowerCase().includes(term)) return true;
            // Search in subtitle if available
            if (option.subtitle && option.subtitle.toLowerCase().includes(term)) {
                return true;
            }
            return false;
        });
    }, [options, searchTerm]);

    // Get selected option
    const selectedOption = options.find((o) => o.id === value);

    // Get display text for selected option
    const displayText = selectedOption ? selectedOption.label : "";

    const handleSelect = (optionId: string) => {
        onChange(optionId);
        setIsOpen(false);
        setSearchTerm("");
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange("");
        setSearchTerm("");
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={`w-full bg-[#151821] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#3B82F6] transition-colors appearance-none cursor-pointer flex items-center justify-between ${
                    disabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    {icon && <span className="shrink-0">{icon}</span>}
                    <span className={`truncate ${value ? "text-white" : "text-slate-500"}`}>
                        {displayText || placeholder}
                    </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    {value && !disabled && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="p-0.5 hover:bg-slate-700 rounded transition-colors"
                        >
                            <X className="w-3.5 h-3.5 text-slate-400" />
                        </button>
                    )}
                    <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                </div>
            </button>

            {/* Dropdown Menu */}
            {isOpen && !disabled && (
                <div className="absolute top-full left-0 mt-2 w-full bg-[#151821] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 max-h-64 flex flex-col">
                    {/* Search Input */}
                    <div className="p-3 border-b border-white/10">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder={placeholder}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-slate-600"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    </div>

                    {/* Options List */}
                    <div className="overflow-y-auto max-h-48 custom-scrollbar">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => {
                                const isSelected = value === option.id;
                                
                                return (
                                    <button
                                        key={option.id}
                                        type="button"
                                        onClick={() => handleSelect(option.id)}
                                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-3 group ${
                                            isSelected
                                                ? "bg-blue-500/10 text-blue-400 font-medium"
                                                : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                        }`}
                                    >
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium truncate">
                                                {option.label}
                                            </div>
                                            {option.subtitle && (
                                                <div className="text-xs text-slate-500 mt-0.5 truncate">
                                                    {option.subtitle}
                                                </div>
                                            )}
                                        </div>
                                        {isSelected && (
                                            <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                                        )}
                                    </button>
                                );
                            })
                        ) : (
                            <div className="px-4 py-8 text-center text-slate-500 text-sm">
                                {emptyMessage}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

