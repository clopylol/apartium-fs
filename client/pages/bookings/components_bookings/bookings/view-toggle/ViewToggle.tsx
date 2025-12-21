import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { LayoutList, CalendarDays } from 'lucide-react';

interface ViewToggleProps {
  viewMode: 'list' | 'calendar';
  onViewChange: (mode: 'list' | 'calendar') => void;
}

export const ViewToggle: FC<ViewToggleProps> = ({ viewMode, onViewChange }) => {
  const { t } = useTranslation();

  return (
    <div className="flex bg-ds-background-light dark:bg-ds-background-dark p-1 rounded-lg border border-ds-border-light dark:border-ds-border-dark">
      <button 
        onClick={() => onViewChange('list')}
        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-2 ${
          viewMode === 'list' 
            ? 'bg-ds-card-light dark:bg-ds-card-dark text-ds-primary-light dark:text-ds-primary-dark shadow-sm' 
            : 'text-ds-muted-light dark:text-ds-muted-dark hover:text-ds-primary-light dark:hover:text-ds-primary-dark'
        }`}
      >
        <LayoutList className="w-3.5 h-3.5" /> {t('bookings.bookings.viewModes.list')}
      </button>
      <button 
        onClick={() => onViewChange('calendar')}
        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-2 ${
          viewMode === 'calendar' 
            ? 'bg-ds-card-light dark:bg-ds-card-dark text-ds-primary-light dark:text-ds-primary-dark shadow-sm' 
            : 'text-ds-muted-light dark:text-ds-muted-dark hover:text-ds-primary-light dark:hover:text-ds-primary-dark'
        }`}
      >
        <CalendarDays className="w-3.5 h-3.5" /> {t('bookings.bookings.viewModes.calendar')}
      </button>
    </div>
  );
};

