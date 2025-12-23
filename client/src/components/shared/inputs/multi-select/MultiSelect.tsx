import type { FC } from "react";
import { CheckCircle } from "lucide-react";

export interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  gridCols?: 1 | 2 | 3 | 4;
  className?: string;
}

export const MultiSelect: FC<MultiSelectProps> = ({
  options,
  selectedValues,
  onChange,
  gridCols = 2,
  className = "",
}) => {
  const handleToggle = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  const gridClasses = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
  };

  return (
    <div className={`grid ${gridClasses[gridCols]} gap-3 ${className}`}>
      {options.map((option) => {
        const isSelected = selectedValues.includes(option.value);
        return (
          <button
            key={option.value}
            onClick={() => handleToggle(option.value)}
            className={`py-2 px-3 rounded-xl border text-sm font-medium transition-all flex items-center justify-between ${
              isSelected
                ? "bg-[#151821] border-[#3B82F6] text-white shadow-[0_0_15px_-5px_rgba(59,130,246,0.3)]"
                : "bg-[#151821] border-white/10 text-slate-400 hover:border-white/20"
            }`}
          >
            {option.label}
            {isSelected && <CheckCircle className="w-3.5 h-3.5 text-[#3B82F6]" />}
          </button>
        );
      })}
    </div>
  );
};

