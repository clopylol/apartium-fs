import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Trash2, FileText } from 'lucide-react';
import type { ExpenseRecord } from '@/types/payments';

interface ExpenseItemProps {
    expense: ExpenseRecord;
    onDelete: (id: string) => void;
}

export const ExpenseItem: FC<ExpenseItemProps> = ({ expense, onDelete }) => {
    const { t } = useTranslation();

    return (
        <div className="p-4 flex items-center justify-between hover:bg-ds-muted-dark/20 transition-colors group">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-ds-muted-dark flex items-center justify-center text-ds-muted-light overflow-hidden relative">
                    {expense.attachment ? (
                        <img src={expense.attachment} alt="" className="w-full h-full object-cover" />
                    ) : (
                        <FileText className="w-5 h-5" />
                    )}
                </div>
                <div>
                    <h4 className="font-bold text-ds-secondary-light dark:text-ds-secondary-dark">{expense.title}</h4>
                    <div className="text-xs text-ds-muted-light flex items-center gap-2 mt-0.5">
                        <Calendar className="w-3 h-3" /> {expense.date}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="text-right">
                    <div className={`font-bold ${expense.status === 'paid' ? 'text-ds-success' : 'text-ds-destructive'}`}>₺{expense.amount.toLocaleString()}</div>
                    <div className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 ${expense.status === 'paid' ? 'text-ds-success' : 'text-ds-destructive'}`}>
                        {expense.status === 'paid' ? t('payments.expenses.status.paid') : t('payments.expenses.status.pending')}
                    </div>
                </div>
                <button
                    onClick={() => onDelete(expense.id)}
                    className="p-2 text-ds-destructive-light hover:bg-ds-destructive-light/10 rounded-lg transition-all hover:animate-pulse"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};
