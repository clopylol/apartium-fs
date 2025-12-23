import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar } from 'lucide-react';
import { FormModal } from '@/components/shared/modals/form-modal';
import { Button } from '@/components/shared/button';
import type { Facility } from '@/types/bookings.types';
import type { NewBookingForm } from '@/hooks/bookings/useBookingsModals';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  newBooking: NewBookingForm;
  onBookingChange: (booking: NewBookingForm) => void;
  facilities: Facility[];
  onSubmit: () => void;
}

export const BookingModal: FC<BookingModalProps> = ({
  isOpen,
  onClose,
  newBooking,
  onBookingChange,
  facilities,
  onSubmit,
}) => {
  const { t } = useTranslation();

  const handleInitiateBooking = () => {
    if (!newBooking.facilityId || !newBooking.residentName || !newBooking.date || !newBooking.startTime || !newBooking.endTime) {
      alert(t('bookings.modals.booking.validation'));
      return;
    }
    onClose();
    onSubmit();
  };

  const footer = (
    <div className="flex gap-3">
      <Button
        onClick={onClose}
        variant="secondary"
        fullWidth
      >
        {t('bookings.modals.booking.buttons.cancel')}
      </Button>
      <Button
        onClick={handleInitiateBooking}
        fullWidth
        className="bg-ds-action hover:bg-ds-action-hover shadow-lg shadow-ds-action/20"
      >
        {t('bookings.modals.booking.buttons.create')}
      </Button>
    </div>
  );

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={t('bookings.modals.booking.title')}
      titleIcon={<Calendar className="w-5 h-5 text-ds-in-sky-500" />}
      maxWidth="md"
      footer={footer}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-medium text-ds-muted-light dark:text-ds-muted-dark uppercase">
            {t('bookings.modals.booking.labels.facility')}
          </label>
          <select 
            value={newBooking.facilityId}
            onChange={(e) => onBookingChange({ ...newBooking, facilityId: e.target.value })}
            className="w-full bg-ds-background-light dark:bg-ds-background-dark border border-ds-border-light dark:border-ds-border-dark rounded-lg px-3 py-2.5 text-ds-primary-light dark:text-ds-primary-dark focus:outline-none focus:ring-1 focus:ring-ds-ring-light dark:focus:ring-ds-ring-dark appearance-none cursor-pointer"
          >
            <option value="">{t('bookings.modals.booking.placeholders.facility')}</option>
            {facilities.filter(f => f.requiresBooking && f.status !== 'closed').map(f => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-ds-muted-light dark:text-ds-muted-dark uppercase">
              {t('bookings.modals.booking.labels.residentName')}
            </label>
            <input 
              type="text" 
              value={newBooking.residentName}
              onChange={(e) => onBookingChange({ ...newBooking, residentName: e.target.value })}
              className="w-full bg-ds-background-light dark:bg-ds-background-dark border border-ds-border-light dark:border-ds-border-dark rounded-lg px-3 py-2.5 text-ds-primary-light dark:text-ds-primary-dark focus:outline-none focus:ring-1 focus:ring-ds-ring-light dark:focus:ring-ds-ring-dark"
              placeholder={t('bookings.modals.booking.placeholders.residentName')}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-ds-muted-light dark:text-ds-muted-dark uppercase">
              {t('bookings.modals.booking.labels.unit')}
            </label>
            <input 
              type="text" 
              value={newBooking.unit}
              onChange={(e) => onBookingChange({ ...newBooking, unit: e.target.value })}
              className="w-full bg-ds-background-light dark:bg-ds-background-dark border border-ds-border-light dark:border-ds-border-dark rounded-lg px-3 py-2.5 text-ds-primary-light dark:text-ds-primary-dark focus:outline-none focus:ring-1 focus:ring-ds-ring-light dark:focus:ring-ds-ring-dark"
              placeholder={t('bookings.modals.booking.placeholders.unit')}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-ds-muted-light dark:text-ds-muted-dark uppercase">
            {t('bookings.modals.booking.labels.date')}
          </label>
          <input 
            type="date" 
            value={newBooking.date}
            onChange={(e) => onBookingChange({ ...newBooking, date: e.target.value })}
            className="w-full bg-ds-background-light dark:bg-ds-background-dark border border-ds-border-light dark:border-ds-border-dark rounded-lg px-3 py-2.5 text-ds-primary-light dark:text-ds-primary-dark focus:outline-none focus:ring-1 focus:ring-ds-ring-light dark:focus:ring-ds-ring-dark [color-scheme:dark]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-ds-muted-light dark:text-ds-muted-dark uppercase">
              {t('bookings.modals.booking.labels.startTime')}
            </label>
            <input 
              type="time" 
              value={newBooking.startTime}
              onChange={(e) => onBookingChange({ ...newBooking, startTime: e.target.value })}
              className="w-full bg-ds-background-light dark:bg-ds-background-dark border border-ds-border-light dark:border-ds-border-dark rounded-lg px-3 py-2.5 text-ds-primary-light dark:text-ds-primary-dark focus:outline-none focus:ring-1 focus:ring-ds-ring-light dark:focus:ring-ds-ring-dark [color-scheme:dark]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-ds-muted-light dark:text-ds-muted-dark uppercase">
              {t('bookings.modals.booking.labels.endTime')}
            </label>
            <input 
              type="time" 
              value={newBooking.endTime}
              onChange={(e) => onBookingChange({ ...newBooking, endTime: e.target.value })}
              className="w-full bg-ds-background-light dark:bg-ds-background-dark border border-ds-border-light dark:border-ds-border-dark rounded-lg px-3 py-2.5 text-ds-primary-light dark:text-ds-primary-dark focus:outline-none focus:ring-1 focus:ring-ds-ring-light dark:focus:ring-ds-ring-dark [color-scheme:dark]"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-ds-muted-light dark:text-ds-muted-dark uppercase">
            {t('bookings.modals.booking.labels.note')}
          </label>
          <textarea 
            value={newBooking.note}
            onChange={(e) => onBookingChange({ ...newBooking, note: e.target.value })}
            className="w-full bg-ds-background-light dark:bg-ds-background-dark border border-ds-border-light dark:border-ds-border-dark rounded-lg px-3 py-2.5 text-ds-primary-light dark:text-ds-primary-dark focus:outline-none focus:ring-1 focus:ring-ds-ring-light dark:focus:ring-ds-ring-dark h-20 resize-none"
            placeholder={t('bookings.modals.booking.placeholders.note')}
          />
        </div>
      </div>
    </FormModal>
  );
};

