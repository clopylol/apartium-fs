import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { PlusCircle, Download } from 'lucide-react';
import { Button } from '@/components/shared/button';
import { PeriodSelector } from '../period-selector';

interface PaymentsHeaderProps {
    selectedMonth: string;
    selectedYear: string;
    onMonthChange: (month: string) => void;
    onYearChange: (year: string) => void;
    showDuesButton: boolean;
    onGenerateDues: () => void;
    onExportReport: () => void;
}

export const PaymentsHeader: FC<PaymentsHeaderProps> = ({
    selectedMonth,
    selectedYear,
    onMonthChange,
    onYearChange,
    showDuesButton,
    onGenerateDues,
    onExportReport
}) => {
    const { t } = useTranslation();

    return (
        <header className="h-20 border-b border-ds-border-dark flex items-center justify-between px-8 bg-ds-background-dark shrink-0 z-20">
            <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold font-heading text-ds-secondary-light dark:text-ds-secondary-dark">{t('payments.header.title')}</h1>
            </div>

            <div className="flex items-center gap-4">
                <PeriodSelector
                    selectedMonth={selectedMonth}
                    selectedYear={selectedYear}
                    onMonthChange={onMonthChange}
                    onYearChange={onYearChange}
                />

                {showDuesButton && (
                    <Button
                        onClick={onGenerateDues}
                        leftIcon={<PlusCircle className="w-4 h-4" />}
                        className="bg-ds-in-indigo-light hover:bg-ds-in-indigo-dark shadow-lg shadow-ds-in-indigo-dark/20"
                    >
                        <span className="hidden lg:inline">{t('payments.header.generateDues')}</span>
                    </Button>
                )}

                <div className="h-8 w-px bg-ds-border-dark mx-2"></div>

                <Button
                    onClick={onExportReport}
                    variant="secondary"
                    leftIcon={<Download className="w-4 h-4" />}
                >
                    <span className="hidden lg:inline">{t('payments.header.exportReport')}</span>
                </Button>
            </div>
        </header>
    );
};
