import type { FC } from "react";

export interface ToggleOption<T = string> {
  value: T;
  label: string;
}

interface ToggleSwitchProps<T = string> {
  options: ToggleOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export const ToggleSwitch = <T extends string | number = string>({
  options,
  value,
  onChange,
  className = "",
}: ToggleSwitchProps<T>): JSX.Element => {
  return (
    <div className={`flex bg-ds-background-dark p-1 rounded-xl border border-ds-border-dark ${className}`}>
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={String(option.value)}
            onClick={() => onChange(option.value)}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
              isActive
                ? "bg-ds-action text-white shadow-lg shadow-ds-action/20"
                : "text-ds-muted-light hover:text-ds-secondary-light hover:bg-ds-muted-dark/50"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

