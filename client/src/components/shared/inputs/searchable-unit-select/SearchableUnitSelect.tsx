import { useState, useRef, useEffect, useMemo } from "react";
import { Search, ChevronDown, X, Home } from "lucide-react";
import type { UnitWithResidents } from "@/types/residents.types";

interface SearchableUnitSelectProps {
    value: string;
    onChange: (unitId: string) => void;
    units: UnitWithResidents[];
    disabled?: boolean;
    placeholder?: string;
}

export function SearchableUnitSelect({
    value,
    onChange,
    units,
    disabled = false,
    placeholder = "Daire numarası veya sakin adı ara...",
}: SearchableUnitSelectProps) {
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

    // Filter units based on search term
    const filteredUnits = useMemo(() => {
        if (!searchTerm.trim()) return units;
        const term = searchTerm.toLowerCase();
        return units.filter((unit) => {
            // Search in unit number
            if (unit.number.toLowerCase().includes(term)) return true;
            // Search in resident names
            if (unit.residents && unit.residents.some((r) => r.name.toLowerCase().includes(term))) {
                return true;
            }
            return false;
        });
    }, [units, searchTerm]);

    // Get selected unit
    const selectedUnit = units.find((u) => u.id === value);

    // Get display text for selected unit
    const displayText = selectedUnit
        ? `Daire ${selectedUnit.number}${selectedUnit.residents && selectedUnit.residents.length > 0 ? ` (${selectedUnit.residents[0].name})` : ""}`
        : "";

    const handleSelect = (unitId: string) => {
        onChange(unitId);
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
                <span className={value ? "text-white" : "text-slate-500"}>
                    {displayText || placeholder}
                </span>
                <div className="flex items-center gap-2">
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

                    {/* Unit List */}
                    <div className="overflow-y-auto max-h-48 custom-scrollbar">
                        {filteredUnits.length > 0 ? (
                            filteredUnits.map((unit) => {
                                const isSelected = value === unit.id;
                                const firstResident = unit.residents && unit.residents.length > 0 ? unit.residents[0] : null;
                                
                                return (
                                    <button
                                        key={unit.id}
                                        type="button"
                                        onClick={() => handleSelect(unit.id)}
                                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-3 group ${
                                            isSelected
                                                ? "bg-blue-500/10 text-blue-400 font-medium"
                                                : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                        }`}
                                    >
                                        <Home className={`w-4 h-4 shrink-0 ${isSelected ? "text-blue-400" : "text-slate-500"}`} />
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium">
                                                Daire {unit.number}
                                            </div>
                                            {firstResident && (
                                                <div className="text-xs text-slate-500 mt-0.5">
                                                    {firstResident.name}
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
                                {searchTerm ? "Sonuç bulunamadı" : "Daire bulunamadı"}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

