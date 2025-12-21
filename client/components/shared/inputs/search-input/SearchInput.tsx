import type { FC, InputHTMLAttributes } from "react";
import { Search } from "lucide-react";

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export const SearchInput: FC<SearchInputProps> = ({
    value,
    onChange,
    placeholder,
    className = "",
    ...props
}) => {
    return (
        <div className={`relative ${className}`}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ds-muted-light dark:text-ds-muted-dark" />
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-ds-card-light dark:bg-ds-card-dark border border-ds-border-light dark:border-ds-border-dark rounded-xl pl-10 pr-4 py-2.5 text-sm text-ds-secondary-light dark:text-ds-secondary-dark focus:outline-none focus:ring-1 focus:ring-ds-primary-light dark:focus:ring-ds-primary-dark placeholder-ds-muted-light dark:placeholder-ds-muted-dark transition-all"
                {...props}
            />
        </div>
    );
};

