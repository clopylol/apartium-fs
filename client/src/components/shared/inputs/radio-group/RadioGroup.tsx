import type { FC } from "react";

export interface RadioOption<T = string> {
  value: T;
  label: string;
}

interface RadioGroupProps<T = string> {
  options: RadioOption<T>[];
  value: T;
  onChange: (value: T) => void;
  gridCols?: 1 | 2 | 3 | 4;
  className?: string;
}

export const RadioGroup = <T extends string | number = string>({
  options,
  value,
  onChange,
  gridCols = 2,
  className = "",
}: RadioGroupProps<T>): JSX.Element => {
  const gridClasses = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
  };

  return (
    <div className={`grid ${gridClasses[gridCols]} gap-3 ${className}`}>
      {options.map((option) => {
        const isSelected = option.value === value;
        return (
          <button
            key={String(option.value)}
            type="button"
            onClick={() => onChange(option.value)}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all border ${
              isSelected
                ? "bg-[#151821] border-[#3B82F6] text-white shadow-[0_0_15px_-5px_rgba(59,130,246,0.3)]"
                : "bg-[#151821] border-white/5 text-slate-500 hover:border-white/10"
            }`}
          >
            <div
              className={`w-2.5 h-2.5 rounded-full border ${
                isSelected ? "bg-[#3B82F6] border-[#3B82F6]" : "border-slate-500"
              }`}
            ></div>
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

