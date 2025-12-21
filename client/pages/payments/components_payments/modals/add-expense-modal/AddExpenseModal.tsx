import { useState } from 'react';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { FileUpload } from '@/components/shared/inputs';
import { FormModal } from '@/components/shared/modals';
import { EXPENSE_CATEGORIES } from '@/constants/payments';
import type { ExpenseRecord } from '@/types/payments';

interface AddExpenseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (expense: Partial<ExpenseRecord>) => void;
    selectedMonth: string;
    selectedYear: string;
}

const OTHER_OPTION_VALUE = 'other';

export const AddExpenseModal: FC<AddExpenseModalProps> = ({ isOpen, onClose, onAdd, selectedMonth, selectedYear }) => {
    const { t } = useTranslation();
    const [newExpense, setNewExpense] = useState<Partial<ExpenseRecord>>({
        title: '', category: 'utilities', amount: 0, status: 'pending', date: '', attachment: ''
    });

    const handleAddExpense = () => {
        if (!newExpense.title || !newExpense.amount) return;
        onAdd(newExpense);
        setNewExpense({ title: '', category: 'utilities', amount: 0, status: 'pending', date: '', attachment: '' });
    };

    const footer = (
        <div className="flex gap-3">
            <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl bg-[#1A1D26] hover:bg-[#20242F] text-slate-400 font-bold text-sm transition-colors border border-white/5"
            >
                {t('payments.modals.addExpense.buttons.cancel')}
            </button>
            <button
                onClick={handleAddExpense}
                className="flex-1 py-3 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold text-sm transition-colors shadow-lg shadow-blue-500/20"
            >
                {t('payments.modals.addExpense.buttons.save')}
            </button>
        </div>
    );

    return (
        <FormModal
            isOpen={isOpen}
            onClose={onClose}
            title={t('payments.modals.addExpense.title')}
            titleIcon={<Plus className="w-5 h-5" />}
            footer={footer}
            maxWidth="md"
            zIndex={50}
        >
            <div className="space-y-5">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">{t('payments.modals.addExpense.labels.category')}</label>
                    <select
                        value={newExpense.category}
                        onChange={(e) => {
                            setNewExpense({ ...newExpense, category: e.target.value as any, title: '' });
                        }}
                        className="w-full bg-[#151821] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#3B82F6] transition-colors appearance-none cursor-pointer"
                    >
                        {EXPENSE_CATEGORIES.map(c => <option key={c.id} value={c.id}>{t(`payments.categories.${c.id}`)}</option>)}
                    </select>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">{t('payments.modals.addExpense.labels.title')}</label>
                    <select
                        value={newExpense.title}
                        onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
                        className="w-full bg-[#151821] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#3B82F6] transition-colors appearance-none cursor-pointer"
                    >
                        <option value="">{t('payments.modals.addExpense.labels.select')}</option>
                        {EXPENSE_CATEGORIES.find(c => c.id === newExpense.category)?.subItems.map(item => (
                            <option key={item.label} value={item.label}>{item.label}</option>
                        ))}
                        <option value={OTHER_OPTION_VALUE}>{t('payments.modals.addExpense.labels.other')}</option>
                    </select>
                </div>

                {newExpense.title === OTHER_OPTION_VALUE && (
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">{t('payments.modals.addExpense.labels.description')}</label>
                        <input
                            type="text"
                            value={newExpense.title || ''}
                            onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
                            placeholder={t('payments.modals.addExpense.placeholders.description')}
                            className="w-full bg-[#151821] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#3B82F6] transition-colors"
                        />
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">{t('payments.modals.addExpense.labels.amount')}</label>
                        <input
                            type="number"
                            value={newExpense.amount}
                            onChange={(e) => setNewExpense({ ...newExpense, amount: parseInt(e.target.value) })}
                            className="w-full bg-[#151821] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#3B82F6] transition-colors"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">{t('payments.modals.addExpense.labels.status')}</label>
                        <select
                            value={newExpense.status}
                            onChange={(e) => setNewExpense({ ...newExpense, status: e.target.value as any })}
                            className="w-full bg-[#151821] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#3B82F6] transition-colors appearance-none cursor-pointer"
                        >
                            <option value="paid">{t('payments.modals.addExpense.status.paid')}</option>
                            <option value="pending">{t('payments.modals.addExpense.status.pending')}</option>
                        </select>
                    </div>
                </div>

                <FileUpload
                    accept="image/*"
                    value={newExpense.attachment || null}
                    onChange={(fileUrl) => setNewExpense({ ...newExpense, attachment: fileUrl || undefined })}
                    label={t('payments.modals.addExpense.labels.attachment')}
                    placeholder={{
                        title: t('payments.modals.addExpense.upload.title'),
                        formats: t('payments.modals.addExpense.upload.formats'),
                        change: t('payments.modals.addExpense.upload.change'),
                    }}
                />
            </div>
        </FormModal>
    );
};
