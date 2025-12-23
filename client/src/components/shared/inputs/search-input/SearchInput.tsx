import type { FC, InputHTMLAttributes } from "react";
import { Search, AlertCircle } from "lucide-react";

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    minLength?: number;
    showMinLengthWarning?: boolean;
}

export const SearchInput: FC<SearchInputProps> = ({
    value,
    onChange,
    placeholder,
    className = "",
    minLength = 3,
    showMinLengthWarning = true,
    ...props
}) => {
    const hasValue = value.trim().length > 0;
    const isBelowMinLength = hasValue && value.trim().length < minLength;

    return (
        <div className={`relative ${className}`}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ds-muted-light dark:text-ds-muted-dark" />
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={`w-full bg-ds-card-light dark:bg-ds-card-dark border rounded-xl pl-10 pr-4 py-2.5 text-sm text-ds-secondary-light dark:text-ds-secondary-dark focus:outline-none focus:ring-1 placeholder-ds-muted-light dark:placeholder-ds-muted-dark transition-all ${
                    isBelowMinLength && showMinLengthWarning
                        ? "border-ds-warning-light dark:border-ds-warning-dark focus:ring-ds-warning-light dark:focus:ring-ds-warning-dark"
                        : "border-ds-border-light dark:border-ds-border-dark focus:ring-ds-primary-light dark:focus:ring-ds-primary-dark"
                }`}
                {...props}
            />
            {isBelowMinLength && showMinLengthWarning && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-ds-warning-light dark:text-ds-warning-dark">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Min {minLength} karakter</span>
                </div>
            )}
        </div>
    );
};

