import { type FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, Info, Settings, ArrowRight, Users, DollarSign } from 'lucide-react';
import type { Facility, FacilityStatus } from '@/types/bookings.types';


interface FacilityCardProps {
  facility: Facility;
  isActive: boolean;
  activeBookingsCount: number;
  onClick: () => void;
  onEdit: (e: React.MouseEvent, facility: Facility) => void;
}

const getStatusColor = (status: FacilityStatus): string => {
  switch (status) {
    case 'open':
      return 'bg-ds-in-success-500/20 text-ds-in-success-500 border-ds-in-success-500/20';
    case 'closed':
      return 'bg-ds-in-destructive-500/20 text-ds-in-destructive-500 border-ds-in-destructive-500/20';
    case 'maintenance':
      return 'bg-ds-in-warning-500/20 text-ds-in-warning-500 border-ds-in-warning-500/20';
    default:
      return 'bg-ds-muted-light/20 dark:bg-ds-muted-dark/20 text-ds-muted-light dark:text-ds-muted-dark border-ds-muted-light/20 dark:border-ds-muted-dark/20';
  }
};

const getStatusText = (status: FacilityStatus, t: (key: string) => string): string => {
  switch (status) {
    case 'open': return t('bookings.facilities.status.open');
    case 'closed': return t('bookings.facilities.status.closed');
    case 'maintenance': return t('bookings.facilities.status.maintenance');
    default: return status;
  }
};

export const FacilityCard: FC<FacilityCardProps> = ({
  facility,
  isActive,
  activeBookingsCount,
  onClick,
  onEdit,
}) => {
  const { t } = useTranslation();
  const [imgSrc, setImgSrc] = useState(
    facility.imageUrl ||
    `https://loremflickr.com/640/480/${encodeURIComponent(facility.name.replace(/\s+/g, ','))}?lock=${facility.id}`
  );

  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 cursor-pointer ${isActive
        ? 'border-ds-action ring-1 ring-ds-action/50 shadow-2xl shadow-ds-action/10'
        : 'border-ds-border-light dark:border-ds-border-dark hover:border-ds-muted-light dark:hover:border-ds-muted-dark hover:shadow-xl'
        } bg-ds-card-light dark:bg-ds-card-dark`}
    >
      {/* Image Background */}
      <div className="h-40 w-full overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-t from-ds-background-dark via-ds-background-dark/60 to-transparent z-10" />
        <img
          src={imgSrc}
          onError={() => setImgSrc(`https://picsum.photos/seed/${facility.id}/640/480`)}
          alt={facility.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Status Badge */}
        <div className="absolute top-3 left-3 z-20">
          <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider border backdrop-blur-md shadow-sm ${getStatusColor(facility.status)}`}>
            {getStatusText(facility.status, t)}
          </span>
        </div>

        {/* Settings Button */}
        <div className="absolute top-3 right-3 z-20">
          <button
            onClick={(e) => onEdit(e, facility)}
            className="p-2 bg-ds-background-dark/40 hover:bg-ds-action backdrop-blur-md text-white rounded-lg transition-colors border border-white/10 shadow-lg"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* Info Badges (Bottom Overlay) */}
        <div className="absolute bottom-3 left-3 right-3 z-20 flex justify-between items-end">
          <div className="flex gap-2">
            <div className="flex items-center gap-1 text-[10px] font-bold bg-black/40 backdrop-blur-sm px-2 py-1 rounded-md text-white border border-white/10">
              <Users className="w-3 h-3 text-ds-in-sky-400" />
              {facility.capacity}
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold bg-black/40 backdrop-blur-sm px-2 py-1 rounded-md text-white border border-white/10">
              <DollarSign className="w-3 h-3 text-ds-in-success-400" />
              {facility.pricingType !== 'free' ? `${facility.price}${t('bookings.facilities.perHour')}` : t('bookings.facilities.free')}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 relative">
        <h3 className="text-ds-primary-light dark:text-ds-primary-dark font-bold text-lg mb-1 truncate">
          {facility.name}
        </h3>
        <div className="flex items-center gap-2 text-xs text-ds-muted-light dark:text-ds-muted-dark mt-2">
          <Clock className="w-3.5 h-3.5" />
          <span>{facility.hours}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-ds-muted-light dark:text-ds-muted-dark mt-1">
          <Info className="w-3.5 h-3.5" />
          <span>{facility.requiresBooking ? t('bookings.facilities.requiresBooking') : t('bookings.facilities.freeEntry')}</span>
        </div>

        {facility.requiresBooking && (
          <div className="mt-4 pt-3 border-t border-ds-border-light dark:border-ds-border-dark flex justify-between items-center">
            <span className="text-xs font-medium text-ds-muted-light dark:text-ds-muted-dark">
              {t('bookings.facilities.active')}: {activeBookingsCount}
            </span>
            <span className="text-xs font-bold text-ds-in-sky-500 group-hover:text-ds-in-sky-400 transition-colors flex items-center gap-1">
              {t('bookings.facilities.schedule')} <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

