import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, CheckCircle, X, MoreVertical } from 'lucide-react';
import type { Booking, BookingStatus } from '@/types/bookings.types';

interface BookingRowProps {
  booking: Booking;
  facilityName: string;
  facilityImage: string;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

const getStatusColor = (status: BookingStatus): string => {
  switch(status) {
    case 'confirmed': 
      return 'text-ds-in-success-500 bg-ds-in-success-500/10 border-ds-in-success-500/20';
    case 'pending': 
      return 'text-ds-in-warning-500 bg-ds-in-warning-500/10 border-ds-in-warning-500/20';
    case 'cancelled': 
      return 'text-ds-muted-light dark:text-ds-muted-dark bg-ds-card-light dark:bg-ds-card-dark border-ds-border-light dark:border-ds-border-dark';
    default: 
      return 'text-ds-muted-light dark:text-ds-muted-dark';
  }
};

const getStatusText = (status: BookingStatus, t: (key: string) => string): string => {
  switch(status) {
    case 'confirmed': return t('bookings.bookings.status.confirmed');
    case 'pending': return t('bookings.bookings.status.pending');
    case 'cancelled': return t('bookings.bookings.status.cancelled');
    default: return status;
  }
};

export const BookingRow: FC<BookingRowProps> = ({
  booking,
  facilityName,
  facilityImage,
  onApprove,
  onReject,
}) => {
  const { t } = useTranslation();

  return (
    <tr className="hover:bg-ds-background-light/30 dark:hover:bg-ds-background-dark/30 transition-colors group">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-ds-border-light dark:bg-ds-border-dark shrink-0">
            <img 
              src={facilityImage} 
              className="w-full h-full object-cover opacity-80" 
              alt={facilityName} 
            />
          </div>
          <div>
            <p className="font-medium text-ds-primary-light dark:text-ds-primary-dark text-sm">
              {facilityName}
            </p>
            <p className="text-xs text-ds-muted-light dark:text-ds-muted-dark">ID: {booking.id}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm font-medium text-ds-secondary-light dark:text-ds-secondary-dark">
          {booking.residentName}
        </div>
        <div className="text-xs text-ds-muted-light dark:text-ds-muted-dark">{booking.unit}</div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-ds-secondary-light dark:text-ds-secondary-dark">
          <Calendar className="w-3.5 h-3.5 text-ds-muted-light dark:text-ds-muted-dark" />
          {booking.date}
        </div>
        <div className="flex items-center gap-2 text-xs text-ds-muted-light dark:text-ds-muted-dark mt-1">
          <Clock className="w-3.5 h-3.5" />
          {booking.startTime} - {booking.endTime}
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-ds-muted-light dark:text-ds-muted-dark max-w-[150px] truncate">
        {booking.note || '-'}
        {booking.status === 'cancelled' && booking.rejectionReason && (
          <span className="block text-ds-in-destructive-500 text-xs mt-1">
            {t('bookings.bookings.rejectionReason', { reason: booking.rejectionReason })}
          </span>
        )}
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
          {getStatusText(booking.status, t)}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-2">
          {booking.status === 'pending' ? (
            <>
              <button 
                onClick={() => onApprove(booking.id)}
                className="p-1.5 bg-ds-in-success-500/10 text-ds-in-success-500 hover:bg-ds-in-success-500/20 rounded-lg transition-colors border border-ds-in-success-500/20"
                title="Onayla"
              >
                <CheckCircle className="w-4 h-4" />
              </button>
              <button 
                onClick={() => onReject(booking.id)}
                className="p-1.5 bg-ds-in-destructive-500/10 text-ds-in-destructive-500 hover:bg-ds-in-destructive-500/20 rounded-lg transition-colors border border-ds-in-destructive-500/20"
                title="Reddet"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button className="p-1.5 text-ds-muted-light dark:text-ds-muted-dark hover:bg-ds-background-light dark:hover:bg-ds-background-dark hover:text-ds-primary-light dark:hover:text-ds-primary-dark rounded-lg transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

