import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingDown, Plus } from 'lucide-react';
import { Button } from '@/components/shared/button';

interface ExpensesEmptyStateProps {
    onAddExpense?: () => void;
}

export const ExpensesEmptyState: FC<ExpensesEmptyStateProps> = ({ onAddExpense }) => {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col items-center justify-center py-16 animate-in fade-in duration-500">
            <div className="w-20 h-20 bg-ds-card-dark rounded-full flex items-center justify-center mb-6 ring-1 ring-ds-border-dark shadow-inner">
                <TrendingDown className="w-10 h-10 text-ds-muted-light opacity-50" />
            </div>
            <h3 className="text-ds-secondary-light dark:text-ds-secondary-dark font-bold text-xl mb-2">
                {t('payments.expenses.emptyState.title')}
            </h3>
            <p className="text-ds-muted-light mb-8 leading-relaxed text-center max-w-md">
                {t('payments.expenses.emptyState.description')}
            </p>
            {onAddExpense && (
                <Button
                    onClick={onAddExpense}
                    leftIcon={<Plus className="w-4 h-4" />}
                    className="bg-ds-in-indigo-light hover:bg-ds-in-indigo-dark shadow-lg shadow-ds-in-indigo-dark/20"
                >
                    {t('payments.expenses.emptyState.addButton')}
                </Button>
            )}
        </div>
    );
};

