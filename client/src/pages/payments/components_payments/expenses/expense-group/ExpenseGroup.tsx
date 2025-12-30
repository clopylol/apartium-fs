import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import type { ExpenseRecord, ExpenseCategory, ExpenseRecordLegacy } from '@/types/payments';
import { ExpenseItem } from './ExpenseItem';

interface ExpenseGroupProps {
    category: ExpenseCategory;
    expenses: ExpenseRecordLegacy[];
    onDelete: (id: string) => void;
    onEdit?: (expense: ExpenseRecordLegacy) => void;
    onViewDetail?: (expense: ExpenseRecordLegacy) => void;
    isPeriodPast?: boolean;
}

export const ExpenseGroup: FC<ExpenseGroupProps> = ({ category, expenses, onDelete, onEdit, onViewDetail, isPeriodPast = false }) => {
    const { t } = useTranslation();
    if (expenses.length === 0) return null;

    // Dynamic color handling for category icons
    // Since we can't easily map 'blue', 'orange' etc to DS tokens dynamically without a map,
    // we will use a simple mapping or just use the color prop if it matches tailwind classes.
    // The original code used `bg-${category.color}-500/10`.
    // We should map these to DS tokens if possible, or use style for dynamic colors if strictly needed,
    // but better to map to DS semantic colors.

    const getColorClasses = (color: string) => {
        switch (color) {
            case 'blue': return 'bg-ds-action border-ds-action text-white';
            case 'orange': return 'bg-ds-warning-light border-ds-warning-light text-white';
            case 'purple': return 'bg-ds-in-violet-500 border-ds-in-violet-500 text-white';
            case 'slate': return 'bg-ds-in-sky-400 border-ds-in-sky-400 text-white';
            default: return 'bg-ds-muted-light border-ds-muted-light text-white';
        }
    };

    const colorClass = getColorClasses(category.color);

    return (
        <div className="bg-ds-card-dark border border-ds-border-dark rounded-2xl overflow-hidden shadow-sm animate-in fade-in duration-300">
            {/* Group Header */}
            <div className="p-4 bg-ds-background-dark/50 border-b border-ds-border-dark flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center shadow-lg ${colorClass}`}>
                        <category.icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-ds-secondary-light dark:text-ds-secondary-dark">{t(`payments.categories.${category.id}`)}</h3>
                </div>
                <span className="text-ds-muted-light text-sm font-medium">{t('payments.expenses.total')} ₺{expenses.reduce((a, b) => a + b.amount, 0).toLocaleString()}</span>
            </div>

            {/* Items */}
            <div className="divide-y divide-ds-border-dark/50">
                {expenses.map(expense => (
                    <ExpenseItem
                        key={expense.id}
                        expense={expense}
                        onDelete={onDelete}
                        onEdit={onEdit}
                        onClick={() => onViewDetail?.(expense as ExpenseRecordLegacy)}
                        isPeriodPast={isPeriodPast}
                    />
                ))}
            </div>
        </div>
    );
};
