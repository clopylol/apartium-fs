import { useState, useMemo, useEffect } from 'react';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Edit } from 'lucide-react';
import { FileUpload, ToggleSwitch, type ToggleOption } from '@/components/shared/inputs';
import { SearchableSelect, type SearchableSelectOption } from '@/components/shared/inputs/searchable-select';
import { FormModal } from '@/components/shared/modals';
import { EXPENSE_CATEGORIES, MONTHS } from '@/constants/payments';
import { formatDateForInput } from '@/utils/date';
import type { ExpenseRecord, ExpenseRecordLegacy } from '@/types/payments';

interface AddExpenseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (expense: Partial<ExpenseRecord>) => void;
    selectedMonth: string;
    selectedYear: string;
    expense?: ExpenseRecordLegacy;
    isEditMode?: boolean;
    isPeriodPast?: boolean;
}

const OTHER_OPTION_VALUE = 'other';

export const AddExpenseModal: FC<AddExpenseModalProps> = ({ isOpen, onClose, onSave, selectedMonth, selectedYear, expense, isEditMode = false, isPeriodPast = false }) => {
    const { t } = useTranslation();
    const [newExpense, setNewExpense] = useState<Partial<ExpenseRecord>>({
        title: '', category: 'utilities', amount: 0, status: 'pending', expenseDate: '', attachmentUrl: '', description: ''
    });
    const [expenseDate, setExpenseDate] = useState<string>(''); // YYYY-MM-DD
    const [expenseTime, setExpenseTime] = useState<string>(''); // HH:mm

    // Parse expense datetime
    const parseExpenseDateTime = (expenseDate: string): { date: string; time: string } => {
        if (!expenseDate) return { date: '', time: '' };
        
        try {
            const dateObj = new Date(expenseDate);
            const date = formatDateForInput(dateObj);
            const hours = String(dateObj.getHours()).padStart(2, '0');
            const minutes = String(dateObj.getMinutes()).padStart(2, '0');
            return { 
                date, 
                time: `${hours}:${minutes}`
            };
        } catch {
            // Eğer sadece tarih formatındaysa (YYYY-MM-DD)
            if (/^\d{4}-\d{2}-\d{2}$/.test(expenseDate)) {
                return { date: expenseDate, time: '' };
            }
            return { date: '', time: '' };
        }
    };

    // Get date constraints for selected month
    const getDateConstraints = () => {
        const monthIndex = MONTHS.indexOf(selectedMonth);
        if (monthIndex === -1) return { min: '', max: '' };
        
        const year = parseInt(selectedYear);
        const firstDay = new Date(year, monthIndex, 1);
        const lastDay = new Date(year, monthIndex + 1, 0);
        
        return {
            min: formatDateForInput(firstDay),
            max: formatDateForInput(lastDay)
        };
    };

    const dateConstraints = useMemo(() => getDateConstraints(), [selectedMonth, selectedYear]);

    // Combine date and time for backend
    const getExpenseDateValue = (): string => {
        if (!expenseDate) return '';
        if (!expenseTime) {
            // Saat yoksa varsayılan olarak 00:00:00
            return `${expenseDate}T00:00:00`;
        }
        return `${expenseDate}T${expenseTime}:00`; // HH:mm:ss formatı
    };

    // Initialize form when modal opens or expense changes
    useEffect(() => {
        if (isOpen && expense && isEditMode) {
            const parsedDateTime = parseExpenseDateTime(expense.date || '');
            setNewExpense({
                title: expense.title,
                category: expense.category,
                amount: typeof expense.amount === 'string' ? parseFloat(expense.amount) : expense.amount,
                status: expense.status,
                expenseDate: expense.date || '',
                attachmentUrl: expense.attachment || '',
                description: expense.description || ''
            });
            setExpenseDate(parsedDateTime.date);
            setExpenseTime(parsedDateTime.time);
        } else if (isOpen && !isEditMode) {
            // Reset form for new expense
            setNewExpense({ title: '', category: 'utilities', amount: 0, status: 'pending', expenseDate: '', attachmentUrl: '', description: '' });
            // Default: Bugünün tarihi (seçili ay içindeyse)
            const today = new Date();
            const currentMonth = MONTHS[today.getMonth()];
            const currentYear = today.getFullYear().toString();
            
            if (selectedMonth === currentMonth && selectedYear === currentYear) {
                setExpenseDate(formatDateForInput(today));
            } else {
                setExpenseDate(''); // Seçili ay bugün değilse boş
            }
            setExpenseTime('');
        }
    }, [isOpen, expense, isEditMode, selectedMonth, selectedYear]);

    // Category options for SearchableSelect
    const categoryOptions = useMemo<SearchableSelectOption[]>(() => 
        EXPENSE_CATEGORIES.map(cat => ({
            id: cat.id,
            label: t(`payments.categories.${cat.id}`)
        }))
    , [t]);

    // Title/Sub-item options for SearchableSelect (dynamic based on selected category)
    const titleOptions = useMemo<SearchableSelectOption[]>(() => {
        const selectedCategory = EXPENSE_CATEGORIES.find(c => c.id === newExpense.category);
        if (!selectedCategory) return [];
        
        const options = selectedCategory.subItems.map(item => ({
            id: item.label,
            label: item.label
        }));
        
        // "Diğer" seçeneğini ekle
        options.push({
            id: OTHER_OPTION_VALUE,
            label: t('payments.modals.addExpense.labels.other')
        });
        
        return options;
    }, [newExpense.category, t]);

    // Status options for ToggleSwitch
    const statusOptions = useMemo<ToggleOption[]>(() => [
        { value: 'pending', label: t('payments.modals.addExpense.status.pending') },
        { value: 'paid', label: t('payments.modals.addExpense.status.paid') }
    ], [t]);

    const handleSaveExpense = () => {
        if (!newExpense.title || !newExpense.amount || !expenseDate) return;
        
        const expenseData = {
            ...newExpense,
            expenseDate: getExpenseDateValue() // YYYY-MM-DDTHH:mm:ss formatı
        };
        
        onSave(expenseData);
        if (!isEditMode) {
            setNewExpense({ title: '', category: 'utilities', amount: 0, status: 'pending', expenseDate: '', attachmentUrl: '', description: '' });
            setExpenseDate('');
            setExpenseTime('');
        }
    };

    const isDisabled = isPeriodPast;

    const footer = (
        <div className="flex gap-3">
            <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl bg-ds-accent-light dark:bg-ds-accent-dark hover:bg-ds-card-light dark:hover:bg-ds-card-dark text-ds-secondary-light dark:text-ds-secondary-dark font-bold text-sm transition-colors border border-ds-border-light dark:border-ds-border-dark"
            >
                {t('payments.modals.addExpense.buttons.cancel')}
            </button>
            <button
                onClick={handleSaveExpense}
                disabled={isDisabled}
                className={`flex-1 py-3 rounded-xl bg-ds-action hover:bg-ds-action-hover text-white font-bold text-sm transition-colors shadow-lg shadow-ds-action/20 ${
                    isDisabled ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
                {t('payments.modals.addExpense.buttons.save')}
            </button>
        </div>
    );

    return (
        <FormModal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditMode ? t('payments.modals.editExpense.title') || 'Gider Düzenle' : t('payments.modals.addExpense.title')}
            titleIcon={isEditMode ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            footer={footer}
            maxWidth="md"
            zIndex={50}
        >
            <div className="space-y-5">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-ds-muted-light dark:text-ds-muted-dark tracking-wider">{t('payments.modals.addExpense.labels.category')}</label>
                    <SearchableSelect
                        value={newExpense.category || ''}
                        onChange={(value) => {
                            setNewExpense({ ...newExpense, category: value as any, title: '' });
                        }}
                        options={categoryOptions}
                        placeholder={t('payments.modals.addExpense.labels.category')}
                        disabled={isDisabled}
                        icon={(() => {
                            const selectedCategory = EXPENSE_CATEGORIES.find(c => c.id === newExpense.category);
                            const CategoryIcon = selectedCategory?.icon;
                            return CategoryIcon ? <CategoryIcon className="w-4 h-4 text-slate-500" /> : undefined;
                        })()}
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-ds-muted-light dark:text-ds-muted-dark tracking-wider">{t('payments.modals.addExpense.labels.title')}</label>
                    <SearchableSelect
                        value={newExpense.title || ''}
                        onChange={(value) => setNewExpense({ ...newExpense, title: value })}
                        options={titleOptions}
                        placeholder={t('payments.modals.addExpense.labels.select')}
                        disabled={!newExpense.category || isDisabled}
                    />
                </div>

                {newExpense.title === OTHER_OPTION_VALUE && (
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase text-ds-muted-light dark:text-ds-muted-dark tracking-wider">{t('payments.modals.addExpense.labels.description')}</label>
                        <input
                            type="text"
                            value={newExpense.title || ''}
                            onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
                            placeholder={t('payments.modals.addExpense.placeholders.description')}
                            disabled={isDisabled}
                            className={`w-full bg-ds-input-light dark:bg-ds-input-dark border border-ds-border-light dark:border-ds-border-dark rounded-xl px-4 py-3 text-sm text-ds-primary-light dark:text-ds-primary-dark placeholder-ds-muted-light dark:placeholder-ds-muted-dark focus:outline-none focus:border-ds-action transition-colors ${
                                isDisabled ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        />
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase text-ds-muted-light dark:text-ds-muted-dark tracking-wider">{t('payments.modals.addExpense.labels.amount')}</label>
                        <input
                            type="number"
                            value={newExpense.amount || ''}
                            onChange={(e) => {
                                const value = e.target.value;
                                const numValue = value === '' ? undefined : parseInt(value, 10);
                                if (value === '' || (!isNaN(numValue!) && numValue! > 0)) {
                                    setNewExpense({ ...newExpense, amount: numValue });
                                }
                            }}
                            disabled={isDisabled}
                            className={`w-full bg-ds-input-light dark:bg-ds-input-dark border border-ds-border-light dark:border-ds-border-dark rounded-xl px-4 py-3 text-sm text-ds-primary-light dark:text-ds-primary-dark placeholder-ds-muted-light dark:placeholder-ds-muted-dark focus:outline-none focus:border-ds-action transition-colors ${
                                isDisabled ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        />
                        <p className="text-xs text-ds-muted-light dark:text-ds-muted-dark mt-1">
                            {t('payments.modals.addExpense.hints.amount')}
                        </p>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase text-ds-muted-light dark:text-ds-muted-dark tracking-wider">{t('payments.modals.addExpense.labels.status')}</label>
                        <div className={isDisabled ? 'opacity-50 pointer-events-none' : ''}>
                            <ToggleSwitch
                                options={statusOptions}
                                value={newExpense.status || 'pending'}
                                onChange={(value) => setNewExpense({ ...newExpense, status: value as any })}
                                getActiveClassName={(option) => {
                                    if (option.value === 'pending') {
                                        return 'bg-ds-in-warning-500 text-white shadow-lg shadow-ds-in-warning-500/20';
                                    }
                                    if (option.value === 'paid') {
                                        return 'bg-ds-in-success-500 text-white shadow-lg shadow-ds-in-success-500/20';
                                    }
                                    return 'bg-ds-action text-white shadow-lg shadow-ds-action/20';
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase text-ds-muted-light dark:text-ds-muted-dark tracking-wider">
                            {t('payments.modals.addExpense.labels.date')}
                        </label>
                        <input
                            type="date"
                            value={expenseDate}
                            onChange={(e) => setExpenseDate(e.target.value)}
                            min={dateConstraints.min}
                            max={dateConstraints.max}
                            disabled={isDisabled}
                            className={`w-full bg-ds-input-light dark:bg-ds-input-dark border border-ds-border-light dark:border-ds-border-dark rounded-xl px-4 py-3 text-sm text-ds-primary-light dark:text-ds-primary-dark focus:outline-none focus:border-ds-action transition-colors [color-scheme:dark] ${
                                isDisabled ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase text-ds-muted-light dark:text-ds-muted-dark tracking-wider">
                            {t('payments.modals.addExpense.labels.time')}
                        </label>
                        <input
                            type="time"
                            value={expenseTime}
                            onChange={(e) => setExpenseTime(e.target.value)}
                            disabled={isDisabled}
                            className={`w-full bg-ds-input-light dark:bg-ds-input-dark border border-ds-border-light dark:border-ds-border-dark rounded-xl px-4 py-3 text-sm text-ds-primary-light dark:text-ds-primary-dark focus:outline-none focus:border-ds-action transition-colors [color-scheme:dark] ${
                                isDisabled ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-ds-muted-light dark:text-ds-muted-dark tracking-wider">{t('payments.modals.addExpense.labels.notes')}</label>
                    <textarea
                        value={newExpense.description || ''}
                        onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                        placeholder={t('payments.modals.addExpense.placeholders.notes')}
                        rows={3}
                        disabled={isDisabled}
                        className={`w-full bg-ds-input-light dark:bg-ds-input-dark border border-ds-border-light dark:border-ds-border-dark rounded-xl px-4 py-3 text-sm text-ds-primary-light dark:text-ds-primary-dark placeholder-ds-muted-light dark:placeholder-ds-muted-dark focus:outline-none focus:border-ds-action transition-colors resize-none ${
                            isDisabled ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    />
                </div>

                <FileUpload
                    accept="image/*"
                    value={newExpense.attachmentUrl || null}
                    onChange={(fileUrl) => setNewExpense({ ...newExpense, attachmentUrl: fileUrl || undefined })}
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
