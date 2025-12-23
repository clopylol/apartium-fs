import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Settings, Image as ImageIcon } from 'lucide-react';
import { FormModal } from '@/components/shared/modals/form-modal';
import { Button } from '@/components/shared/button';
import type { Facility, FacilityStatus } from '@/types/bookings.types';

interface FacilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  facilityForm: Partial<Facility>;
  onFacilityChange: (facility: Partial<Facility>) => void;
  isEditing: boolean;
  onSave: () => void;
}

export const FacilityModal: FC<FacilityModalProps> = ({
  isOpen,
  onClose,
  facilityForm,
  onFacilityChange,
  isEditing,
  onSave,
}) => {
  const { t } = useTranslation();

  const footer = (
    <div className="flex gap-3">
      <Button
        onClick={onClose}
        variant="secondary"
        fullWidth
      >
        {t('bookings.modals.facility.buttons.cancel')}
      </Button>
      <Button
        onClick={onSave}
        fullWidth
        className="bg-ds-action hover:bg-ds-action-hover shadow-lg shadow-ds-action/20"
      >
        {t('bookings.modals.facility.buttons.save')}
      </Button>
    </div>
  );

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? t('bookings.modals.facility.title.edit') : t('bookings.modals.facility.title.add')}
      titleIcon={<Settings className="w-5 h-5 text-ds-in-sky-500" />}
      maxWidth="lg"
      footer={footer}
    >
      <div className="space-y-5">
        <div className="space-y-2">
          <label className="text-xs font-medium text-ds-muted-light dark:text-ds-muted-dark uppercase">
            {t('bookings.modals.facility.labels.name')}
          </label>
          <input 
            type="text" 
            value={facilityForm.name || ''}
            onChange={(e) => onFacilityChange({ ...facilityForm, name: e.target.value })}
            className="w-full bg-ds-background-light dark:bg-ds-background-dark border border-ds-border-light dark:border-ds-border-dark rounded-lg px-3 py-2.5 text-ds-primary-light dark:text-ds-primary-dark focus:outline-none focus:ring-1 focus:ring-ds-ring-light dark:focus:ring-ds-ring-dark"
            placeholder={t('bookings.modals.facility.placeholders.name')}
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-ds-muted-light dark:text-ds-muted-dark uppercase">
            {t('bookings.modals.facility.labels.image')}
          </label>
          <div className="relative">
            <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ds-muted-light dark:text-ds-muted-dark" />
            <input 
              type="text" 
              value={facilityForm.image || ''}
              onChange={(e) => onFacilityChange({ ...facilityForm, image: e.target.value })}
              className="w-full bg-ds-background-light dark:bg-ds-background-dark border border-ds-border-light dark:border-ds-border-dark rounded-lg pl-10 pr-3 py-2.5 text-ds-primary-light dark:text-ds-primary-dark focus:outline-none focus:ring-1 focus:ring-ds-ring-light dark:focus:ring-ds-ring-dark"
              placeholder={t('bookings.modals.facility.placeholders.image')}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-ds-muted-light dark:text-ds-muted-dark uppercase">
              {t('bookings.modals.facility.labels.status')}
            </label>
            <select 
              value={facilityForm.status || 'open'}
              onChange={(e) => onFacilityChange({ ...facilityForm, status: e.target.value as FacilityStatus })}
              className="w-full bg-ds-background-light dark:bg-ds-background-dark border border-ds-border-light dark:border-ds-border-dark rounded-lg px-3 py-2.5 text-ds-primary-light dark:text-ds-primary-dark focus:outline-none focus:ring-1 focus:ring-ds-ring-light dark:focus:ring-ds-ring-dark appearance-none cursor-pointer"
            >
              <option value="open">{t('bookings.modals.facility.statusOptions.open')}</option>
              <option value="closed">{t('bookings.modals.facility.statusOptions.closed')}</option>
              <option value="maintenance">{t('bookings.modals.facility.statusOptions.maintenance')}</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-ds-muted-light dark:text-ds-muted-dark uppercase">
              {t('bookings.modals.facility.labels.capacity')}
            </label>
            <input 
              type="number" 
              value={facilityForm.capacity || 0}
              onChange={(e) => onFacilityChange({ ...facilityForm, capacity: parseInt(e.target.value) || 0 })}
              className="w-full bg-ds-background-light dark:bg-ds-background-dark border border-ds-border-light dark:border-ds-border-dark rounded-lg px-3 py-2.5 text-ds-primary-light dark:text-ds-primary-dark focus:outline-none focus:ring-1 focus:ring-ds-ring-light dark:focus:ring-ds-ring-dark"
              placeholder={t('bookings.modals.facility.placeholders.capacity')}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-ds-muted-light dark:text-ds-muted-dark uppercase">
              {t('bookings.modals.facility.labels.hours')}
            </label>
            <input 
              type="text" 
              value={facilityForm.hours || ''}
              onChange={(e) => onFacilityChange({ ...facilityForm, hours: e.target.value })}
              className="w-full bg-ds-background-light dark:bg-ds-background-dark border border-ds-border-light dark:border-ds-border-dark rounded-lg px-3 py-2.5 text-ds-primary-light dark:text-ds-primary-dark focus:outline-none focus:ring-1 focus:ring-ds-ring-light dark:focus:ring-ds-ring-dark"
              placeholder={t('bookings.modals.facility.placeholders.hours')}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-ds-muted-light dark:text-ds-muted-dark uppercase">
              {t('bookings.modals.facility.labels.pricePerHour')}
            </label>
            <input 
              type="number" 
              value={facilityForm.pricePerHour || 0}
              onChange={(e) => onFacilityChange({ ...facilityForm, pricePerHour: parseInt(e.target.value) || 0 })}
              className="w-full bg-ds-background-light dark:bg-ds-background-dark border border-ds-border-light dark:border-ds-border-dark rounded-lg px-3 py-2.5 text-ds-primary-light dark:text-ds-primary-dark focus:outline-none focus:ring-1 focus:ring-ds-ring-light dark:focus:ring-ds-ring-dark"
              placeholder={t('bookings.modals.facility.placeholders.pricePerHour')}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-ds-background-light/50 dark:bg-ds-background-dark/50 rounded-xl border border-ds-border-light dark:border-ds-border-dark">
          <input 
            type="checkbox" 
            id="requiresBooking"
            checked={facilityForm.requiresBooking || false}
            onChange={(e) => onFacilityChange({ ...facilityForm, requiresBooking: e.target.checked })}
            className="w-5 h-5 rounded border-ds-border-light dark:border-ds-border-dark bg-ds-background-light dark:bg-ds-background-dark text-ds-action focus:ring-offset-ds-background-light dark:focus:ring-offset-ds-background-dark accent-ds-action"
          />
          <label htmlFor="requiresBooking" className="text-sm font-medium text-ds-primary-light dark:text-ds-primary-dark cursor-pointer">
            {t('bookings.modals.facility.labels.requiresBooking')}
          </label>
        </div>
      </div>
    </FormModal>
  );
};

