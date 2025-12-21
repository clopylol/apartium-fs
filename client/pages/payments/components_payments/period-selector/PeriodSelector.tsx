import type { FC } from 'react';
import { Calendar, CreditCard } from 'lucide-react';
import { Dropdown } from '@/components/shared/inputs/dropdown';
import { MONTHS, YEARS } from '@/constants/payments';

interface PeriodSelectorProps {
    selectedMonth: string;
    selectedYear: string;
    onMonthChange: (month: string) => void;
    onYearChange: (year: string) => void;
}

export const PeriodSelector: FC<PeriodSelectorProps> = ({ selectedMonth, selectedYear, onMonthChange, onYearChange }) => {
    return (
        <div className="flex items-center gap-3">
            <Dropdown
                options={MONTHS}
                value={selectedMonth}
                onChange={onMonthChange}
                icon={Calendar}
            />
            <Dropdown
                options={YEARS}
                value={selectedYear}
                onChange={onYearChange}
                icon={CreditCard}
            />
        </div>
    );
};

