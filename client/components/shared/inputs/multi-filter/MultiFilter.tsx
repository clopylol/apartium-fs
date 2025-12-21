import type { FC, ReactNode } from "react";
import { Dropdown } from "@/components/shared/inputs/dropdown";
import { ActiveFilterTag, type ActiveFilter } from "@/components/shared/inputs/active-filter-tag";

export interface FilterOption {
  value: string;
  label: string;
  icon?: ReactNode;
}

export interface FilterConfig {
  key: string;
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  icon?: ReactNode;
  variant?: ActiveFilter["variant"];
}

interface MultiFilterProps {
  filters: FilterConfig[];
  activeFilters: ActiveFilter[];
  className?: string;
  rightContent?: ReactNode;
}

export const MultiFilter: FC<MultiFilterProps> = ({
  filters,
  activeFilters,
  className = "",
  rightContent,
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {activeFilters.map((filter) => (
            <ActiveFilterTag key={filter.key} filter={filter} />
          ))}
        </div>
      )}

      {/* Filter Dropdowns and Right Content */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3 flex-wrap">
          {filters.map((filter) => {
            const dropdownOptions = filter.options.map((opt) => ({
              value: opt.value,
              label: opt.label,
            }));

            return (
              <Dropdown
                key={filter.key}
                options={dropdownOptions}
                value={filter.value}
                onChange={filter.onChange}
                placeholder={filter.label}
                className="min-w-[140px]"
              />
            );
          })}
        </div>
        {rightContent && <div className="flex-shrink-0">{rightContent}</div>}
      </div>
    </div>
  );
};

