import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { FacilityCard } from '../facility-card';
import type { Facility, Booking } from '@/types/bookings.types';

interface FacilityListProps {
  facilities: Facility[];
  bookings: Booking[];
  activeTab: string;
  isLoading: boolean;
  onFacilityClick: (facilityId: string) => void;
  onFacilityEdit: (e: React.MouseEvent, facility: Facility) => void;
}

export const FacilityList: FC<FacilityListProps> = ({
  facilities,
  bookings,
  activeTab,
  isLoading,
  onFacilityClick,
  onFacilityEdit,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            className="relative overflow-hidden rounded-2xl border border-ds-border-light dark:border-ds-border-dark bg-ds-card-light dark:bg-ds-card-dark h-[320px] animate-pulse shadow-lg"
          >
            <div className="h-40 bg-ds-border-light dark:bg-ds-border-dark" />
            <div className="p-4 flex flex-col justify-between h-[160px]">
              <div className="space-y-3">
                <div className="h-6 w-3/4 bg-ds-border-light dark:bg-ds-border-dark rounded" />
                <div className="h-4 w-1/2 bg-ds-border-light dark:bg-ds-border-dark rounded" />
                <div className="h-4 w-1/3 bg-ds-border-light dark:bg-ds-border-dark rounded" />
              </div>
              <div className="pt-3 border-t border-ds-border-light dark:border-ds-border-dark flex justify-between items-center">
                <div className="h-4 w-16 bg-ds-border-light dark:bg-ds-border-dark rounded" />
                <div className="h-4 w-20 bg-ds-border-light dark:bg-ds-border-dark rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {facilities.map(facility => {
        const activeBookingsCount = bookings.filter(
          b => b.facilityId === facility.id && b.status === 'confirmed'
        ).length;

        return (
          <FacilityCard
            key={facility.id}
            facility={facility}
            isActive={activeTab === facility.id}
            activeBookingsCount={activeBookingsCount}
            onClick={() => onFacilityClick(facility.id)}
            onEdit={onFacilityEdit}
          />
        );
      })}
    </div>
  );
};

