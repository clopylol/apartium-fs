import { useState, useMemo, useEffect } from 'react';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Edit, Building2, MapPin, Info } from 'lucide-react';
import { FileUpload, ToggleSwitch, type ToggleOption } from '@/components/shared/inputs';
import { SearchableSelect, type SearchableSelectOption } from '@/components/shared/inputs/searchable-select';
import { FormModal } from '@/components/shared/modals';
import { EXPENSE_CATEGORIES, MONTHS } from '@/constants/payments';
import { formatDateForInput } from '@/utils/date';
import type { ExpenseRecord, ExpenseRecordLegacy } from '@/types/payments';
import type { Building, Site } from '@/types/residents.types';

interface AddExpenseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (expense: Partial<ExpenseRecord>) => void;
    selectedMonth: string;
    selectedYear: string;
    expense?: ExpenseRecordLegacy;
    isEditMode?: boolean;
    isPeriodPast?: boolean;
    sites: Site[];
    activeSiteId: string | null;
    buildings: Building[];
    activeBuildingId: string | null;
}

const OTHER_OPTION_VALUE = 'other';

export const AddExpenseModal: FC<AddExpenseModalProps> = ({
    isOpen,
    onClose,
    onSave,
    selectedMonth,
    selectedYear,
    expense,
    isEditMode = false,
    isPeriodPast = false,
    sites,
    activeSiteId,
    buildings,
    activeBuildingId
}) => {
    const { t } = useTranslation();
    const [newExpense, setNewExpense] = useState<Partial<ExpenseRecord>>({
        title: '', category: 'utilities', amount: 0, status: 'pending', expenseDate: '', attachmentUrl: '', description: ''
    });
    const [expenseDate, setExpenseDate] = useState<string>(''); // YYYY-MM-DD
    const [expenseTime, setExpenseTime] = useState<string>(''); // HH:mm

    // Scope selection: site-wide or building-specific
    const [expenseScope, setExpenseScope] = useState<'site' | 'building'>('building');
    
    // Distribution type: equal or area_based
    // Note: Site-wide expenses always use 'equal' distribution
    const [distributionType, setDistributionType] = useState<'equal' | 'area_based'>('equal');
    
    // Auto-set distribution type to 'equal' when scope is 'site'
    useEffect(() => {
        if (expenseScope === 'site') {
            setDistributionType('equal');
        }
    }, [expenseScope]);

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
            
            // Determine scope based on expense's siteId/buildingId
            // Check both ExpenseRecord and ExpenseRecordLegacy types
            const expenseSiteId = (expense as any).siteId;
            const expenseBuildingId = (expense as any).buildingId;
            
            if (expenseSiteId) {
                setExpenseScope('site');
            } else if (expenseBuildingId) {
                setExpenseScope('building');
            } else {
                setExpenseScope('building'); // Default
            }
            
            // Set distribution type from expense
            const expenseDistributionType = (expense as any).distributionType;
            if (expenseDistributionType === 'area_based' || expenseDistributionType === 'equal') {
                setDistributionType(expenseDistributionType);
            } else {
                setDistributionType('equal'); // Default
            }
        } else if (isOpen && !isEditMode) {
            // Reset form for new expense
            setNewExpense({ title: '', category: 'utilities', amount: 0, status: 'pending', expenseDate: '', attachmentUrl: '', description: '' });
            setExpenseScope('building'); // Reset to default for new expense
            setDistributionType('equal'); // Reset to default for new expense
            
            // Default: Bugünün tarihi ve saati (seçili ay içindeyse)
            const today = new Date();
            const currentMonth = MONTHS[today.getMonth()];
            const currentYear = today.getFullYear().toString();
            
            // Seçili ay bugünün ayıysa, bugünün tarih ve saatini ayarla
            if (selectedMonth === currentMonth && selectedYear === currentYear) {
                setExpenseDate(formatDateForInput(today));
                // Bugünün saatini HH:mm formatında ayarla
                const hours = String(today.getHours()).padStart(2, '0');
                const minutes = String(today.getMinutes()).padStart(2, '0');
                setExpenseTime(`${hours}:${minutes}`);
            } else {
                // Seçili ay bugün değilse, seçili ayın ilk gününü ve 00:00'ı ayarla
                const monthIndex = MONTHS.indexOf(selectedMonth);
                const year = parseInt(selectedYear);
                const firstDayOfMonth = new Date(year, monthIndex, 1);
                setExpenseDate(formatDateForInput(firstDayOfMonth));
                setExpenseTime('00:00');
            }
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

    // Scope options for ToggleSwitch
    const scopeOptions = useMemo<ToggleOption[]>(() => [
        { value: 'site', label: t('payments.modals.addExpense.scope.site') },
        { value: 'building', label: t('payments.modals.addExpense.scope.building') }
    ], [t]);

    // Distribution type options for ToggleSwitch
    const distributionTypeOptions = useMemo<ToggleOption[]>(() => [
        { value: 'equal', label: t('payments.modals.addExpense.distributionType.equal', { defaultValue: 'Eşit Dağıtım' }) },
        { value: 'area_based', label: t('payments.modals.addExpense.distributionType.areaBased', { defaultValue: 'Metrekareye Göre' }) }
    ], [t]);

    const handleSaveExpense = () => {
        if (!newExpense.title || !newExpense.amount || !expenseDate) return;

        // Set siteId and buildingId based on scope
        let siteId: string | null = null;
        let buildingId: string | null = null;

        if (expenseScope === 'site') {
            // Site-wide expense
            siteId = activeSiteId || null;
            buildingId = null;
        } else {
            // Building-specific expense
            siteId = null;
            buildingId = activeBuildingId || null;
        }

        const expenseData = {
            ...newExpense,
            expenseDate: getExpenseDateValue(), // YYYY-MM-DDTHH:mm:ss formatı
            siteId,
            buildingId,
            distributionType // Add distribution type
        };

        onSave(expenseData);
        if (!isEditMode) {
            setNewExpense({ title: '', category: 'utilities', amount: 0, status: 'pending', expenseDate: '', attachmentUrl: '', description: '' });
            setExpenseDate('');
            setExpenseTime('');
            setExpenseScope('building'); // Reset to default
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
                        <div className="flex items-center gap-2 mt-2">
                            <Info className="w-3.5 h-3.5 text-ds-secondary-light dark:text-ds-secondary-dark flex-shrink-0" />
                            <p className="text-xs text-ds-secondary-light dark:text-ds-secondary-dark">
                                {t('payments.modals.addExpense.hints.amount', { defaultValue: 'Örn: 1500, 2500, 5000' })}
                            </p>
                        </div>
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

                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-ds-muted-light dark:text-ds-muted-dark tracking-wider">{t('payments.modals.addExpense.labels.scope')}</label>
                    <div className={isDisabled ? 'opacity-50 pointer-events-none' : ''}>
                        <ToggleSwitch
                            options={scopeOptions}
                            value={expenseScope}
                            onChange={(value) => setExpenseScope(value as 'site' | 'building')}
                            getActiveClassName={(option) => {
                                if (option.value === 'site') {
                                    return 'bg-ds-in-indigo-500 text-white shadow-lg shadow-ds-in-indigo-500/20';
                                }
                                if (option.value === 'building') {
                                    return 'bg-ds-in-teal-500 text-white shadow-lg shadow-ds-in-teal-500/20';
                                }
                                return 'bg-ds-action text-white shadow-lg shadow-ds-action/20';
                            }}
                        />
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                        {expenseScope === 'site' ? (
                            <>
                                <MapPin className="w-4 h-4 text-ds-in-indigo-500" />
                                <span className="text-xs text-ds-in-indigo-500">
                                    {sites.find(s => s.id === activeSiteId)?.name || 'Seçili Site'}
                                </span>
                            </>
                        ) : (
                            <>
                                <Building2 className="w-4 h-4 text-ds-in-teal-500" />
                                <span className="text-xs text-ds-in-teal-500">
                                    {buildings.find(b => b.id === activeBuildingId)?.name || 'Seçili Blok'}
                                </span>
                            </>
                        )}
                    </div>
                </div>

                {/* Distribution Type Selection - Only show for building-specific expenses */}
                {expenseScope === 'building' && (
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase text-ds-muted-light dark:text-ds-muted-dark tracking-wider">
                            {t('payments.modals.addExpense.labels.distributionType', { defaultValue: 'Dağıtım Tipi' })}
                        </label>
                        <div className={isDisabled ? 'opacity-50 pointer-events-none' : ''}>
                            <ToggleSwitch
                                options={distributionTypeOptions}
                                value={distributionType}
                                onChange={(value) => setDistributionType(value as 'equal' | 'area_based')}
                                getActiveClassName={(option) => {
                                    if (option.value === 'equal') {
                                        return 'bg-ds-in-indigo-500 text-white shadow-lg shadow-ds-in-indigo-500/20';
                                    }
                                    if (option.value === 'area_based') {
                                        return 'bg-ds-in-teal-500 text-white shadow-lg shadow-ds-in-teal-500/20';
                                    }
                                    return 'bg-ds-action text-white shadow-lg shadow-ds-action/20';
                                }}
                            />
                        </div>
                        <p className="text-xs text-ds-muted-light dark:text-ds-muted-dark mt-1">
                            {distributionType === 'equal' 
                                ? t('payments.modals.addExpense.distributionType.equalDesc', { defaultValue: 'Gider tüm dairelere eşit olarak dağıtılır' })
                                : t('payments.modals.addExpense.distributionType.areaBasedDesc', { defaultValue: 'Gider dairelerin metrekarelerine göre dağıtılır (metrekare bilgisi gerekli)' })
                            }
                        </p>
                    </div>
                )}
                
                {/* Info message for site-wide expenses */}
                {expenseScope === 'site' && (
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-ds-warning-light/20 to-ds-in-indigo-500/20 dark:from-ds-warning-dark/20 dark:to-ds-in-indigo-500/20 border-2 border-ds-warning-light/30 dark:border-ds-warning-dark/30 shadow-lg shadow-ds-warning-light/10 dark:shadow-ds-warning-dark/10 backdrop-blur-sm">
                            <div className="flex-shrink-0 p-2 rounded-full bg-ds-warning-light/20 dark:bg-ds-warning-dark/20">
                                <Info className="w-5 h-5 text-ds-warning-light dark:text-ds-warning-dark" />
                            </div>
                            <p className="text-sm font-medium text-ds-secondary-light dark:text-ds-secondary-dark leading-relaxed">
                                {t('payments.modals.addExpense.distributionType.siteWideInfo', { defaultValue: 'Site geneli giderler otomatik olarak eşit dağıtılır' })}
                            </p>
                        </div>
                    </div>
                )}

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
