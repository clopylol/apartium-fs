import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Plus, Calendar, Building2 } from 'lucide-react';
import { Button } from '@/components/shared/button';
import { TabToggle } from '@/components/shared/navigation/tab-toggle';
import { SiteSelector } from '@/components/residents/site-selector';
import type { Site } from '@/types/residents.types';

interface BookingsHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onOpenBookingModal: () => void;
  activeTab: 'bookings' | 'facilities';
  onTabChange: (tab: 'bookings' | 'facilities') => void;
  sites: Site[];
  activeSiteId: string | null;
  onSiteChange: (siteId: string) => void;
}

export const BookingsHeader: FC<BookingsHeaderProps> = ({
  searchTerm,
  onSearchChange,
  onOpenBookingModal,
  activeTab,
  onTabChange,
  sites,
  activeSiteId,
  onSiteChange,
}) => {
  const { t } = useTranslation();

  return (
    <header className="h-20 border-b border-ds-border-light dark:border-ds-border-dark flex items-center justify-between px-8 bg-ds-background-light dark:bg-ds-background-dark shrink-0">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold font-heading text-ds-primary-light dark:text-ds-primary-dark">
          {t('bookings.header.title')}
        </h1>

        <SiteSelector
          sites={sites}
          activeSiteId={activeSiteId}
          onSiteChange={onSiteChange}
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ds-muted-light dark:text-ds-muted-dark" />
          <input
            type="text"
            placeholder={t('bookings.header.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="bg-ds-card-light dark:bg-ds-card-dark border border-ds-border-light dark:border-ds-border-dark rounded-xl pl-10 pr-4 py-2.5 text-sm text-ds-primary-light dark:text-ds-primary-dark focus:outline-none focus:ring-1 focus:ring-ds-ring-light dark:focus:ring-ds-ring-dark w-64 placeholder-ds-muted-light dark:placeholder-ds-muted-dark"
          />
        </div>

        <div className="h-8 w-px bg-ds-border-light dark:bg-ds-border-dark mx-2 hidden md:block"></div>

        <TabToggle
          items={[
            { id: 'bookings', label: t('bookings.header.tabs.bookings'), icon: <Calendar className="w-4 h-4" /> },
            { id: 'facilities', label: t('bookings.header.tabs.facilities'), icon: <Building2 className="w-4 h-4" /> },
          ]}
          activeTab={activeTab}
          onChange={onTabChange}
        />

        {activeTab === 'bookings' && (
          <Button
            onClick={onOpenBookingModal}
            leftIcon={<Plus className="w-4 h-4" />}
            className="bg-ds-action hover:bg-ds-action-hover shadow-lg shadow-ds-action/20"
          >
            {t('bookings.header.createBooking')}
          </Button>
        )}
      </div>
    </header>
  );
};

