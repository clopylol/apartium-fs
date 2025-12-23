import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Settings, Lock } from 'lucide-react';
import { MONTHS } from '@/constants/payments';
import { ToggleSwitch } from '@/components/shared/inputs';
import { FormModal } from '@/components/shared/modals';

interface DuesGeneratorModalProps {
    isOpen: boolean;
    selectedMonth: string;
    selectedYear: string;
    onClose: () => void;
    onGenerate: (mode: 'single' | 'bulk', amount: number, bulkList?: { month: string; year: string; amount: number }[]) => void;
}

const isDateInPast = (month: string, year: string) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const targetYear = parseInt(year);
    const targetMonth = MONTHS.indexOf(month);

    if (targetYear < currentYear) return true;
    if (targetYear === currentYear && targetMonth < currentMonth) return true;
    return false;
};

export const DuesGeneratorModal: FC<DuesGeneratorModalProps> = ({ isOpen, selectedMonth, selectedYear, onClose, onGenerate }) => {
    const { t } = useTranslation();
    const [duesMode, setDuesMode] = useState<'single' | 'bulk'>('single');
    const [duesAmountInput, setDuesAmountInput] = useState<number>(1250);
    const [bulkDuesList, setBulkDuesList] = useState<{ month: string, year: string, amount: number }[]>([]);

    const isSelectedPeriodPast = isDateInPast(selectedMonth, selectedYear);

    useEffect(() => {
        if (isOpen) {
            const fullYearList = MONTHS.map(month => ({
                month: month,
                year: selectedYear,
                amount: 1250
            }));
            setBulkDuesList(fullYearList);
            setDuesAmountInput(1250);
        }
    }, [isOpen, selectedYear]);

    const handleApplyBulkAmount = () => {
        setBulkDuesList(prev => prev.map(item => ({ ...item, amount: duesAmountInput })));
    };

    const footer = (
        <div className="flex gap-3">
            <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl bg-ds-accent-light dark:bg-ds-accent-dark hover:bg-ds-card-light dark:hover:bg-ds-card-dark text-ds-secondary-light dark:text-ds-secondary-dark font-bold text-sm transition-colors border border-ds-border-light dark:border-ds-border-dark"
            >
                {t('payments.modals.dues.buttons.cancel')}
            </button>
            <button
                onClick={() => onGenerate(duesMode, duesAmountInput, bulkDuesList)}
                disabled={duesMode === 'single' && isSelectedPeriodPast}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-colors shadow-lg ${duesMode === 'single' && isSelectedPeriodPast
                        ? 'bg-ds-accent-dark text-ds-muted-light cursor-not-allowed'
                        : 'bg-ds-action hover:bg-ds-action-hover text-white shadow-ds-action/20'
                    }`}
            >
                {duesMode === 'single' ? t('payments.modals.dues.buttons.create') : t('payments.modals.dues.buttons.savePlan')}
            </button>
        </div>
    );

    return (
        <FormModal
            isOpen={isOpen}
            onClose={onClose}
            title={t('payments.modals.dues.title')}
            titleIcon={<Settings className="w-5 h-5" />}
            footer={footer}
            maxWidth={duesMode === 'bulk' ? '2xl' : 'md'}
            zIndex={50}
        >
            <div className="space-y-6">
                {/* Mode Switcher */}
                <ToggleSwitch
                    options={[
                        { value: 'single', label: t('payments.modals.dues.modes.single') },
                        { value: 'bulk', label: t('payments.modals.dues.modes.bulk') },
                    ]}
                    value={duesMode}
                    onChange={(mode) => setDuesMode(mode)}
                />

                {/* Mode 1: Single Month */}
                {duesMode === 'single' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                        {isSelectedPeriodPast ? (
                            <div className="bg-ds-destructive-light/10 border border-ds-destructive-light/20 rounded-xl p-6 text-center">
                                <Lock className="w-10 h-10 text-ds-destructive-light mx-auto mb-3 opacity-60" />
                                <h3 className="text-ds-destructive-light font-bold mb-1">{t('payments.modals.dues.locked.title')}</h3>
                                <p className="text-ds-muted-light text-sm">
                                    {t('payments.modals.dues.locked.message', { month: selectedMonth, year: selectedYear })}
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="bg-ds-in-indigo-light/10 border border-ds-in-indigo-light/20 rounded-xl p-4">
                                    <p className="text-sm text-ds-in-indigo-light">
                                        <span className="font-bold">{selectedMonth} {selectedYear}</span> {t('payments.modals.dues.info', { month: selectedMonth, year: selectedYear })}
                                    </p>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase text-ds-muted-light dark:text-ds-muted-dark tracking-wider">{t('payments.modals.dues.labels.amount')}</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ds-in-indigo-light font-bold">₺</span>
                                        <input
                                            type="number"
                                            value={duesAmountInput}
                                            onChange={(e) => setDuesAmountInput(parseInt(e.target.value))}
                                            className="w-full bg-ds-input-light dark:bg-ds-input-dark border border-ds-border-light dark:border-ds-border-dark rounded-xl pl-8 pr-3 py-3 text-sm text-ds-primary-light dark:text-ds-primary-dark focus:outline-none focus:border-ds-action transition-colors font-bold"
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* Mode 2: Bulk (12 Months) - Grid Layout */}
                {duesMode === 'bulk' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                        <div className="bg-ds-in-indigo-light/10 border-2 border-ds-in-indigo-light/20 p-4 rounded-xl flex items-end gap-4 shadow-lg shadow-ds-in-indigo-light/5">
                            <div className="flex-1 space-y-1.5">
                                <label className="text-[10px] font-bold uppercase text-ds-muted-light dark:text-ds-muted-dark tracking-wider">{t('payments.modals.dues.labels.defaultAmount')}</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ds-in-indigo-light font-bold">₺</span>
                                    <input
                                        type="number"
                                        value={duesAmountInput}
                                        onChange={(e) => setDuesAmountInput(parseInt(e.target.value))}
                                        className="w-full bg-ds-input-light dark:bg-ds-input-dark border border-ds-border-light dark:border-ds-border-dark rounded-xl pl-8 pr-3 py-2 text-sm text-ds-primary-light dark:text-ds-primary-dark focus:outline-none focus:border-ds-action transition-colors font-bold"
                                    />
                                </div>
                            </div>
                            <button
                                onClick={handleApplyBulkAmount}
                                className="px-4 py-2 bg-ds-action hover:bg-ds-action-hover text-white rounded-lg text-sm font-bold transition-all shadow-lg shadow-ds-action/20 hover:scale-105 mb-0.5"
                            >
                                {t('payments.modals.dues.buttons.applyToAll')}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto custom-scrollbar p-1">
                            {bulkDuesList.map((item, index) => {
                                const isLocked = isDateInPast(item.month, item.year);
                                return (
                                    <div key={`${item.month}-${item.year}`} className={`bg-ds-background-dark/50 border-2 rounded-xl p-4 flex flex-col gap-3 transition-all group ${isLocked
                                            ? 'opacity-50 grayscale border-ds-border-dark'
                                            : 'border-ds-border-dark hover:border-ds-in-indigo-light/50 hover:bg-ds-in-indigo-light/5 hover:shadow-lg hover:shadow-ds-in-indigo-light/10'
                                        }`}>
                                        <div className="flex justify-between items-center pb-2 border-b border-ds-border-dark group-hover:border-ds-in-indigo-light/30">
                                            <span className="font-bold text-ds-secondary-light text-sm">{item.month}</span>
                                            <span className="text-xs text-ds-muted-light font-medium bg-ds-in-indigo-light/20 text-ds-in-indigo-light px-2 py-0.5 rounded border border-ds-in-indigo-light/30">{item.year}</span>
                                            {isLocked && <Lock className="w-3 h-3 text-ds-destructive-light" />}
                                        </div>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ds-muted-light font-bold text-xs">₺</span>
                                            <input
                                                type="number"
                                                value={item.amount}
                                                disabled={isLocked}
                                                onChange={(e) => {
                                                    const newList = [...bulkDuesList];
                                                    newList[index].amount = parseInt(e.target.value);
                                                    setBulkDuesList(newList);
                                                }}
                                                className={`w-full bg-ds-input-light dark:bg-ds-input-dark border border-ds-border-light dark:border-ds-border-dark rounded-xl pl-6 pr-2 py-2 text-sm text-ds-primary-light dark:text-ds-primary-dark focus:outline-none focus:border-ds-action font-medium text-right transition-colors ${isLocked ? 'cursor-not-allowed opacity-50' : ''
                                                    }`}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </FormModal>
    );
};
