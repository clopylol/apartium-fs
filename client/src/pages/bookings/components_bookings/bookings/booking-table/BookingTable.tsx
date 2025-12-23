import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar } from 'lucide-react';
import { BookingRow } from '../booking-row';
import { BookingRowSkeleton } from '../../skeletons';
import { PaginationControls } from '@/pages/payments/components_payments/pagination';
import type { Booking, Facility } from '@/types/bookings.types';
import { ITEMS_PER_PAGE } from '@/constants/bookings';

interface BookingTableProps {
  bookings: Booking[];
  facilities: Facility[];
  isLoading: boolean;
  currentPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

const getFacilityName = (facilities: Facility[], id: string): string => {
  return facilities.find(f => f.id === id)?.name || 'Bilinmiyor';
};

const getFacilityImage = (facilities: Facility[], id: string): string => {
  return facilities.find(f => f.id === id)?.image || '';
};

export const BookingTable: FC<BookingTableProps> = ({
  bookings,
  facilities,
  isLoading,
  currentPage,
  totalItems,
  onPageChange,
  onApprove,
  onReject,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-ds-border-light dark:border-ds-border-dark bg-ds-background-light/30 dark:bg-ds-background-dark/30 text-xs uppercase text-ds-muted-light dark:text-ds-muted-dark font-semibold tracking-wider">
              <th className="px-6 py-4">{t('bookings.bookings.columns.facility')}</th>
              <th className="px-6 py-4">{t('bookings.bookings.columns.resident')}</th>
              <th className="px-6 py-4">{t('bookings.bookings.columns.dateTime')}</th>
              <th className="px-6 py-4">{t('bookings.bookings.columns.notes')}</th>
              <th className="px-6 py-4">{t('bookings.bookings.columns.status')}</th>
              <th className="px-6 py-4 text-right">{t('bookings.bookings.columns.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ds-border-light/50 dark:divide-ds-border-dark/50">
            {isLoading ? (
              <>
                <BookingRowSkeleton />
                <BookingRowSkeleton />
                <BookingRowSkeleton />
                <BookingRowSkeleton />
                <BookingRowSkeleton />
              </>
            ) : (
              <>
                {bookings.length > 0 ? (
                  bookings.map(booking => (
                    <BookingRow
                      key={booking.id}
                      booking={booking}
                      facilityName={getFacilityName(facilities, booking.facilityId)}
                      facilityImage={getFacilityImage(facilities, booking.facilityId)}
                      onApprove={onApprove}
                      onReject={onReject}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-ds-muted-light dark:text-ds-muted-dark">
                      <Calendar className="w-10 h-10 mx-auto mb-3 opacity-20" />
                      <p>{t('bookings.bookings.noRecords')}</p>
                    </td>
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>
      
      {!isLoading && (
        <PaginationControls 
          totalItems={totalItems}
          itemsPerPage={ITEMS_PER_PAGE}
          currentPage={currentPage}
          onPageChange={onPageChange}
        />
      )}
    </>
  );
};

