import { type FC, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Building2, Home, User, MapPin, Clock, FileText } from 'lucide-react';
import { FormModal } from '@/components/shared/modals/form-modal';
import { Button } from '@/components/shared/button';
import { Dropdown } from '@/components/shared/inputs';
import type { Facility } from '@/types/bookings.types';
import type { NewBookingForm } from '@/hooks/bookings/useBookingsModals';
import type { Building, UnitWithResidents, ResidentWithVehicles, Site } from '@/types/residents.types';
import { useBuildingData, useBuildings } from '@/hooks/residents/api/useResidentsData';
import { useSites } from '@/hooks/residents/site/useSites';

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

  // Fetch Sites
  const { sites, isLoading: isLoadingSites } = useSites();

  // Buildings data
  const { data: buildingsData, isLoading: isLoadingBuildings } = useBuildings();
  const allBuildings = Array.isArray(buildingsData)
    ? buildingsData
    : (buildingsData as any)?.buildings || [];

  // Filter buildings by selected site
  const filteredBuildings = useMemo(() => {
    if (!newBooking.siteId) return [];
    return allBuildings.filter((b: Building) => b.siteId === newBooking.siteId);
  }, [allBuildings, newBooking.siteId]);

  // Selected building data (units & residents)
  const { data: buildingData, isLoading: isLoadingBuilding } = useBuildingData(
    newBooking.buildingId || null
  );

  const units: UnitWithResidents[] = buildingData?.units || [];
  const selectedUnit = units.find((u: UnitWithResidents) => u.id === newBooking.unitId);
  const residents: ResidentWithVehicles[] = selectedUnit?.residents || [];

  // Handlers for Drill-Down Selection
  const handleSiteChange = (id: string) => {
    onBookingChange({
      ...newBooking,
      siteId: id,
      buildingId: '',
      unitId: '',
      residentId: '',
      residentName: '',
      unit: ''
    });
  };

  const handleBuildingChange = (id: string) => {
    onBookingChange({
      ...newBooking,
      buildingId: id,
      unitId: '',
      residentId: '',
      residentName: '',
      unit: ''
    });
  };

  const handleUnitChange = (id: string) => {
    const unit = units.find(u => u.id === id);
    onBookingChange({
      ...newBooking,
      unitId: id,
      unit: unit?.number || '',
      residentId: '',
      residentName: ''
    });
  };

  const handleResidentChange = (id: string) => {
    const resident = residents.find(r => r.id === id);
    onBookingChange({
      ...newBooking,
      residentId: id,
      residentName: resident?.name || ''
    });
  };

  // Validation
  const isValid =
    newBooking.facilityId &&
    newBooking.residentName &&
    newBooking.unit &&
    newBooking.date &&
    newBooking.startTime &&
    newBooking.endTime;

  const handleInitiateBooking = () => {
    if (!isValid) return;
    onClose();
    onSubmit();
  };

  const footer = (
    <div className="flex gap-3 pt-4 border-t border-ds-border-light dark:border-ds-border-dark">
      <Button
        onClick={onClose}
        variant="ghost"
        className="flex-1"
      >
        {t('bookings.modals.booking.buttons.cancel')}
      </Button>
      <Button
        onClick={handleInitiateBooking}
        disabled={!isValid}
        className="bg-ds-in-sky-600 hover:bg-ds-in-sky-500 shadow-lg shadow-ds-in-sky-900/20 flex-1"
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
      maxWidth="lg"
      footer={footer}
    >
      <div className="space-y-6">
        {/* Facility & Location Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-ds-muted-light dark:text-ds-muted-dark uppercase flex items-center gap-1.5 ml-1">
              <Calendar className="w-3.5 h-3.5" />
              {t('bookings.modals.booking.labels.facility')}
            </label>
            <Dropdown
              value={newBooking.facilityId}
              onChange={(val) => onBookingChange({ ...newBooking, facilityId: val })}
              options={facilities
                .filter(f => f.requiresBooking && f.status !== 'closed')
                .map(f => ({ value: f.id, label: f.name }))
              }
              placeholder={t('bookings.modals.booking.placeholders.facility')}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-ds-muted-light dark:text-ds-muted-dark uppercase flex items-center gap-1.5 ml-1">
              <MapPin className="w-3.5 h-3.5" />
              {t('residents.common.site', 'Site')}
            </label>
            <Dropdown
              options={sites.map((s: Site) => ({ value: s.id, label: s.name }))}
              value={newBooking.siteId || ''}
              onChange={handleSiteChange}
              placeholder={t('residents.common.selectSite', 'Site Seçin')}
              disabled={isLoadingSites}
            />
          </div>
        </div>

        {/* Drill Down Structure */}
        <div className="bg-ds-background-light/50 dark:bg-ds-background-dark/50 p-4 rounded-xl border border-ds-border-light dark:border-ds-border-dark space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-ds-muted-light dark:text-ds-muted-dark uppercase flex items-center gap-1.5 ml-1">
                <Building2 className="w-3.5 h-3.5" />
                {t('residents.common.building', 'Bina')}
              </label>
              <Dropdown
                options={filteredBuildings.map((b: Building) => ({ value: b.id, label: b.name }))}
                value={newBooking.buildingId || ''}
                onChange={handleBuildingChange}
                placeholder={newBooking.siteId ? t('residents.common.selectBuilding', 'Bina Seçin') : '-'}
                disabled={!newBooking.siteId || isLoadingBuildings}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-ds-muted-light dark:text-ds-muted-dark uppercase flex items-center gap-1.5 ml-1">
                <Home className="w-3.5 h-3.5" />
                {t('bookings.modals.booking.labels.unit')}
              </label>
              <Dropdown
                options={units.map((u: UnitWithResidents) => ({ value: u.id, label: u.number }))}
                value={newBooking.unitId || ''}
                onChange={handleUnitChange}
                placeholder={newBooking.buildingId ? t('bookings.modals.booking.placeholders.unit') : '-'}
                disabled={!newBooking.buildingId || isLoadingBuilding}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-ds-muted-light dark:text-ds-muted-dark uppercase flex items-center gap-1.5 ml-1">
                <User className="w-3.5 h-3.5" />
                {t('bookings.modals.booking.labels.residentName')}
              </label>
              <Dropdown
                options={residents.map((r: ResidentWithVehicles) => ({ value: r.id, label: r.name }))}
                value={newBooking.residentId || ''}
                onChange={handleResidentChange}
                placeholder={newBooking.unitId ? t('bookings.modals.booking.placeholders.residentName') : '-'}
                disabled={!newBooking.unitId}
              />
            </div>
          </div>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-ds-muted-light dark:text-ds-muted-dark uppercase flex items-center gap-1.5 ml-1">
              <Clock className="w-3.5 h-3.5" />
              {t('bookings.modals.booking.labels.date')}
            </label>
            <input
              type="date"
              value={newBooking.date}
              onChange={(e) => onBookingChange({ ...newBooking, date: e.target.value })}
              className="w-full bg-ds-card-light dark:bg-ds-card-dark border border-ds-border-light dark:border-ds-border-dark rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ds-in-sky-500/20 focus:border-ds-in-sky-500 transition-all text-ds-primary-light dark:text-ds-secondary-dark [color-scheme:dark]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-ds-muted-light dark:text-ds-muted-dark uppercase flex items-center gap-1.5 ml-1">
              <Clock className="w-3.5 h-3.5" />
              {t('bookings.modals.booking.labels.startTime')}
            </label>
            <input
              type="time"
              value={newBooking.startTime}
              onChange={(e) => onBookingChange({ ...newBooking, startTime: e.target.value })}
              className="w-full bg-ds-card-light dark:bg-ds-card-dark border border-ds-border-light dark:border-ds-border-dark rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ds-in-sky-500/20 focus:border-ds-in-sky-500 transition-all text-ds-primary-light dark:text-ds-secondary-dark [color-scheme:dark]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-ds-muted-light dark:text-ds-muted-dark uppercase flex items-center gap-1.5 ml-1">
              <Clock className="w-3.5 h-3.5" />
              {t('bookings.modals.booking.labels.endTime')}
            </label>
            <input
              type="time"
              value={newBooking.endTime}
              onChange={(e) => onBookingChange({ ...newBooking, endTime: e.target.value })}
              className="w-full bg-ds-card-light dark:bg-ds-card-dark border border-ds-border-light dark:border-ds-border-dark rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ds-in-sky-500/20 focus:border-ds-in-sky-500 transition-all text-ds-primary-light dark:text-ds-secondary-dark [color-scheme:dark]"
            />
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-ds-muted-light dark:text-ds-muted-dark uppercase flex items-center gap-1.5 ml-1">
            <FileText className="w-3.5 h-3.5" />
            {t('bookings.modals.booking.labels.note')}
          </label>
          <textarea
            value={newBooking.note}
            onChange={(e) => onBookingChange({ ...newBooking, note: e.target.value })}
            className="w-full bg-ds-card-light dark:bg-ds-card-dark border border-ds-border-light dark:border-ds-border-dark rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ds-in-sky-500/20 focus:border-ds-in-sky-500 transition-all text-ds-primary-light dark:text-ds-secondary-dark placeholder:text-ds-muted-light/60 h-24 resize-none "
            placeholder={t('bookings.modals.booking.placeholders.note')}
          />
        </div>
      </div>
    </FormModal>
  );
};

