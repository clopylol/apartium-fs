import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle, Settings, User, Calendar, ArrowRight, Info, Edit2 } from 'lucide-react';
import { FormModal } from '@/components/shared/modals/form-modal';
import { Button } from '@/components/shared/button';
import type { Facility } from '@/types/bookings.types';
import type { NewBookingForm } from '@/hooks/bookings/useBookingsModals';

interface BookingConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  newBooking: NewBookingForm;
  facilities: Facility[];
  onEdit: () => void;
  onConfirm: () => void;
}

const getFacilityName = (facilities: Facility[], id: string): string => {
  return facilities?.find(f => f.id === id)?.name || 'Bilinmiyor';
};

export const BookingConfirmationModal: FC<BookingConfirmationModalProps> = ({
  isOpen,
  onClose,
  newBooking,
  facilities,
  onEdit,
  onConfirm,
}) => {
  const { t } = useTranslation();

  const footer = (
    <div className="flex gap-3">
      <Button
        onClick={onEdit}
        variant="secondary"
        leftIcon={<Edit2 className="w-3.5 h-3.5" />}
        fullWidth
      >
        {t('bookings.modals.confirmation.buttons.edit')}
      </Button>
      <Button
        onClick={onConfirm}
        leftIcon={<CheckCircle className="w-4 h-4" />}
        fullWidth
        className="bg-ds-in-success-600 hover:bg-ds-in-success-500 shadow-lg shadow-ds-in-success-900/20"
      >
        {t('bookings.modals.confirmation.buttons.confirm')}
      </Button>
    </div>
  );

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={t('bookings.modals.confirmation.title')}
      titleIcon={<CheckCircle className="w-5 h-5 text-ds-in-success-500" />}
      maxWidth="sm"
      footer={footer}
    >
      <div className="space-y-6">
        <div className="bg-ds-background-light dark:bg-ds-background-dark rounded-xl p-4 border border-ds-border-light dark:border-ds-border-dark space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-ds-in-sky-500/10 flex items-center justify-center shrink-0">
              <Settings className="w-5 h-5 text-ds-in-sky-400" />
            </div>
            <div>
              <p className="text-xs text-ds-muted-light dark:text-ds-muted-dark font-medium uppercase">
                {t('bookings.modals.confirmation.labels.facility')}
              </p>
              <p className="text-ds-primary-light dark:text-ds-primary-dark font-medium">
                {getFacilityName(facilities, newBooking.facilityId)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-ds-in-indigo-500/10 flex items-center justify-center shrink-0">
              <User className="w-5 h-5 text-ds-in-indigo-400" />
            </div>
            <div>
              <p className="text-xs text-ds-muted-light dark:text-ds-muted-dark font-medium uppercase">
                {t('bookings.modals.confirmation.labels.resident')}
              </p>
              <p className="text-ds-primary-light dark:text-ds-primary-dark font-medium">
                {newBooking.residentName} <span className="text-ds-muted-light dark:text-ds-muted-dark text-sm">({newBooking.unit})</span>
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-ds-in-orange-500/10 flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5 text-ds-in-orange-400" />
            </div>
            <div>
              <p className="text-xs text-ds-muted-light dark:text-ds-muted-dark font-medium uppercase">
                {t('bookings.modals.confirmation.labels.time')}
              </p>
              <p className="text-ds-primary-light dark:text-ds-primary-dark font-medium">{newBooking.date}</p>
              <p className="text-sm text-ds-muted-light dark:text-ds-muted-dark flex items-center gap-1">
                {newBooking.startTime} <ArrowRight className="w-3 h-3" /> {newBooking.endTime}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 bg-ds-in-sky-500/5 border border-ds-in-sky-500/10 rounded-lg">
          <Info className="w-5 h-5 text-ds-in-sky-400 shrink-0" />
          <p className="text-xs text-ds-in-sky-300">
            {t('bookings.modals.confirmation.info')}
          </p>
        </div>
      </div>
    </FormModal>
  );
};

