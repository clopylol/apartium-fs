import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Trash2, FileText, MapPin, Building2, Equal, Ruler, Edit } from 'lucide-react';
import type { ExpenseRecordLegacy } from '@/types/payments';

interface ExpenseItemProps {
    expense: ExpenseRecordLegacy;
    onDelete: (id: string) => void;
    onEdit?: (expense: ExpenseRecordLegacy) => void;
    onClick?: () => void;
    isPeriodPast?: boolean;
}

export const ExpenseItem: FC<ExpenseItemProps> = ({ expense, onDelete, onEdit, onClick, isPeriodPast = false }) => {
    const { t } = useTranslation();

    return (
        <div 
            className={`p-4 flex items-center justify-between transition-colors group ${
                isPeriodPast 
                    ? 'opacity-60 cursor-not-allowed' 
                    : onClick 
                        ? 'hover:bg-ds-muted-dark/20 cursor-pointer' 
                        : 'hover:bg-ds-muted-dark/20'
            }`}
            onClick={() => !isPeriodPast && onClick?.()}
        >
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-ds-muted-dark flex items-center justify-center text-ds-muted-light overflow-hidden relative">
                    {expense.attachment ? (
                        <img src={expense.attachment} alt="" className="w-full h-full object-cover" />
                    ) : (
                        <FileText className="w-5 h-5" />
                    )}
                </div>
                <div className="flex-1">
                    <h4 className="font-bold text-ds-secondary-light dark:text-ds-secondary-dark">{expense.title}</h4>
                    <div className="text-xs text-ds-muted-light flex items-center gap-2 mt-0.5">
                        <Calendar className="w-3 h-3" /> {expense.date}
                    </div>
                    {/* Scope and Distribution Type Badges */}
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {/* Scope Badge */}
                        {/* IMPORTANT: Check buildingId first, because building-specific expenses now have both siteId and buildingId */}
                        {expense.buildingId ? (
                            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-ds-in-teal-500/20 dark:bg-ds-in-teal-500/20 border border-ds-in-teal-500/30 dark:border-ds-in-teal-500/30">
                                <Building2 className="w-3 h-3 text-ds-in-teal-500" />
                                <span className="text-xs font-medium text-ds-in-teal-500">
                                    {expense.buildingName 
                                        ? `${t('payments.expenses.scope.building', { defaultValue: 'Spesifik Blok' })} - ${expense.buildingName}`
                                        : t('payments.expenses.scope.building', { defaultValue: 'Spesifik Blok' })
                                    }
                                </span>
                            </div>
                        ) : expense.siteId ? (
                            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-ds-in-indigo-500/20 dark:bg-ds-in-indigo-500/20 border border-ds-in-indigo-500/30 dark:border-ds-in-indigo-500/30">
                                <MapPin className="w-3 h-3 text-ds-in-indigo-500" />
                                <span className="text-xs font-medium text-ds-in-indigo-500">
                                    {t('payments.expenses.scope.site', { defaultValue: 'Tüm Site' })}
                                </span>
                            </div>
                        ) : null}
                        
                        {/* Distribution Type Badge */}
                        {expense.distributionType && (
                            <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border ${
                                expense.distributionType === 'equal'
                                    ? 'bg-ds-in-indigo-500/20 dark:bg-ds-in-indigo-500/20 border-ds-in-indigo-500/30 dark:border-ds-in-indigo-500/30'
                                    : 'bg-ds-warning-light/20 dark:bg-ds-warning-dark/20 border-ds-warning-light/30 dark:border-ds-warning-dark/30'
                            }`}>
                                {expense.distributionType === 'equal' ? (
                                    <Equal className="w-3 h-3 text-ds-in-indigo-500" />
                                ) : (
                                    <Ruler className="w-3 h-3 text-ds-warning-light dark:text-ds-warning-dark" />
                                )}
                                <span className={`text-xs font-medium ${
                                    expense.distributionType === 'equal'
                                        ? 'text-ds-in-indigo-500'
                                        : 'text-ds-warning-light dark:text-ds-warning-dark'
                                }`}>
                                    {expense.distributionType === 'equal'
                                        ? t('payments.expenses.distributionType.equal', { defaultValue: 'Eşit Dağıtım' })
                                        : t('payments.expenses.distributionType.areaBased', { defaultValue: 'Metrekareye Göre' })
                                    }
                                </span>
                            </div>
                        )}
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
                <div className="flex items-center gap-2">
                    {onEdit && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (!isPeriodPast) onEdit(expense);
                            }}
                            disabled={isPeriodPast}
                            className={`p-2 text-ds-action-light dark:text-ds-action-dark rounded-lg transition-all ${
                                isPeriodPast 
                                    ? 'opacity-50 cursor-not-allowed' 
                                    : 'hover:bg-ds-action-light/10 dark:hover:bg-ds-action-dark/10'
                            }`}
                            title={isPeriodPast ? t('payments.archive.label') || 'Geçmiş dönem - düzenlenemez' : t('payments.modals.editExpense.title', { defaultValue: 'Düzenle' })}
                        >
                            <Edit className="w-4 h-4" />
                        </button>
                    )}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!isPeriodPast) onDelete(expense.id);
                        }}
                        disabled={isPeriodPast}
                        className={`p-2 text-ds-destructive-light rounded-lg transition-all ${
                            isPeriodPast 
                                ? 'opacity-50 cursor-not-allowed' 
                                : 'hover:bg-ds-destructive-light/10 hover:animate-pulse'
                        }`}
                        title={isPeriodPast ? t('payments.archive.label') || 'Geçmiş dönem - düzenlenemez' : undefined}
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};
