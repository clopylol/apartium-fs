import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { FacilityCard } from '../facility-card';
import type { Facility, Booking } from '@/types/bookings.types';
import { AddFacilityCard } from './AddFacilityCard';
import { FacilityCardSkeleton } from './FacilityCardSkeleton';
import { EmptyState } from '@/components/shared/empty-state/EmptyState';
import { Building2 } from 'lucide-react';

interface FacilityListProps {
  facilities: Facility[];
  bookings: Booking[];
  activeTab: string;
  isLoading: boolean;
  onFacilityClick: (facilityId: string) => void;
  onFacilityEdit: (e: React.MouseEvent, facility: Facility) => void;
  onAddFacility?: () => void;
  showAddCard?: boolean;
}

export const FacilityList: FC<FacilityListProps> = ({
  facilities,
  bookings,
  activeTab,
  isLoading,
  onFacilityClick,
  onFacilityEdit,
  onAddFacility,
  showAddCard = false,
}) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
          <FacilityCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (facilities.length === 0) {
    // Check if this is a search result empty state or initial empty state
    // For now, we'll assume if showAddCard is true, it's likely the main list
    // But better to check if it's filtered. 
    // Since we don't pass 'isFiltered' prop, we'll use a generic "No Facilities" state
    // If showAddCard is explicitly passed and true, we can show the add button in empty state too?

    return (
      <div className="py-12">
        <EmptyState
          icon={Building2}
          title={t('bookings.facilities.emptyState.title', 'Tesis Bulunamadı')}
          description={t('bookings.facilities.emptyState.description', 'Henüz eklenmiş bir sosyal tesis yok veya aramanızla eşleşen bir sonuç bulunamadı.')}
          actionLabel={showAddCard ? t('bookings.facilities.addFacility', 'Tesis Ekle') : undefined}
          onAction={showAddCard ? onAddFacility : undefined}
        />
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
      {showAddCard && onAddFacility && (
        <AddFacilityCard onClick={onAddFacility} />
      )}
    </div>
  );
};

