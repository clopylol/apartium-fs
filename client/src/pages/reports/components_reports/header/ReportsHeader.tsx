import type { FC } from "react";
import { Calendar, Download, Filter, ChevronDown } from "lucide-react";
import type { TransactionFilter } from "@/types/reports.types";

interface ReportsHeaderProps {
    dateRange: string;
    transactionFilter: TransactionFilter;
    onTransactionFilterChange: (filter: TransactionFilter) => void;
}

export const ReportsHeader: FC<ReportsHeaderProps> = ({
    dateRange,
    transactionFilter,
    onTransactionFilterChange,
}) => {
    return (
        <header className="h-20 border-b border-ds-border-dark/50 dark:border-ds-border-dark/50 flex items-center justify-between px-8 bg-ds-background-dark dark:bg-ds-background-dark shrink-0">
            <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold font-heading text-ds-primary-dark dark:text-ds-primary-dark">
                    Finansal Raporlar
                </h1>
            </div>

            <div className="flex items-center gap-3">
                {/* Transaction Type Filter */}
                <div className="relative group">
                    <div className="flex items-center gap-2 bg-ds-card-dark dark:bg-ds-card-dark border border-ds-border-dark dark:border-ds-border-dark rounded-xl px-3 py-2">
                        <Filter className="w-4 h-4 text-ds-secondary-dark dark:text-ds-secondary-dark" />
                        <select
                            value={transactionFilter}
                            onChange={(e) => onTransactionFilterChange(e.target.value as TransactionFilter)}
                            className="bg-transparent text-ds-secondary-light dark:text-ds-secondary-light text-sm font-medium focus:outline-none appearance-none pr-6 cursor-pointer"
                        >
                            <option value="all">Tüm İşlemler</option>
                            <option value="income">Sadece Gelirler</option>
                            <option value="expense">Sadece Giderler</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-ds-secondary-dark dark:text-ds-secondary-dark absolute right-3 pointer-events-none" />
                    </div>
                </div>

                {/* Date Filter */}
                <div className="relative group">
                    <button className="flex items-center gap-2 bg-ds-card-dark dark:bg-ds-card-dark border border-ds-border-dark dark:border-ds-border-dark text-ds-secondary-light dark:text-ds-secondary-light px-4 py-2 rounded-xl text-sm font-medium hover:border-ds-secondary-dark dark:hover:border-ds-secondary-dark transition-colors">
                        <Calendar className="w-4 h-4 text-ds-secondary-dark dark:text-ds-secondary-dark" />
                        <span>{dateRange}</span>
                        <ChevronDown className="w-4 h-4 ml-2 opacity-50" />
                    </button>
                </div>

                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-lg shadow-blue-900/20">
                    <Download className="w-4 h-4" />
                    <span>Rapor İndir (PDF)</span>
                </button>
            </div>
        </header>
    );
};
