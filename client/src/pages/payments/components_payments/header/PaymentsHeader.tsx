import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { PlusCircle, Download, Building2 } from 'lucide-react';
import { Button } from '@/components/shared/button';
import { PeriodSelector } from '../period-selector';
import { SiteSelector } from '@/components/residents/site-selector/SiteSelector';
import type { Site, Building } from '@/types/residents.types';

interface PaymentsHeaderProps {
    selectedMonth: string;
    selectedYear: string;
    onMonthChange: (month: string) => void;
    onYearChange: (year: string) => void;
    showDuesButton: boolean;
    onGenerateDues: () => void;
    onExportReport: () => void;
    // Site and Building selectors
    sites: Site[];
    activeSiteId: string | null;
    onSiteChange: (siteId: string) => void;
    buildings: Building[];
    activeBuildingId: string | null;
    onBuildingChange: (buildingId: string | null) => void;
}

export const PaymentsHeader: FC<PaymentsHeaderProps> = ({
    selectedMonth,
    selectedYear,
    onMonthChange,
    onYearChange,
    showDuesButton,
    onGenerateDues,
    onExportReport,
    sites,
    activeSiteId,
    onSiteChange,
    buildings,
    activeBuildingId,
    onBuildingChange,
}) => {
    const { t } = useTranslation();

    return (
        <header className="h-20 border-b border-ds-border-dark flex items-center justify-between px-8 bg-ds-background-dark shrink-0 z-20">
            <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold font-heading text-ds-secondary-light dark:text-ds-secondary-dark">{t('payments.header.title')}</h1>
                
                {/* Site Selector */}
                <SiteSelector
                    sites={sites}
                    activeSiteId={activeSiteId}
                    onSiteChange={onSiteChange}
                />

                {/* Building Selector */}
                {buildings.length > 0 && (
                    <div className="relative">
                        <select
                            value={activeBuildingId || ""}
                            onChange={(e) => onBuildingChange(e.target.value || null)}
                            className="appearance-none flex items-center gap-2 pl-10 pr-10 py-2 bg-ds-card-light dark:bg-ds-card-dark text-ds-secondary-light dark:text-ds-secondary-dark rounded-lg border border-ds-border-light dark:border-ds-border-dark hover:border-ds-primary-light dark:hover:border-ds-primary-dark transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-ds-primary-light dark:focus:ring-ds-primary-dark text-sm font-medium"
                        >
                            <option value="">Tüm Bloklar</option>
                            {buildings.map((building) => (
                                <option key={building.id} value={building.id}>
                                    {building.name}
                                </option>
                            ))}
                        </select>

                        {/* Dropdown Icon */}
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg
                                className="w-5 h-5 text-ds-muted-light dark:text-ds-muted-dark"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </div>

                        {/* Building Icon */}
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <Building2 className="w-5 h-5 text-ds-primary-light dark:text-ds-primary-dark" />
                        </div>
                    </div>
                )}
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
