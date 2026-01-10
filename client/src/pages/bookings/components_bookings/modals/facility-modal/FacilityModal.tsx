import { useState, useEffect, useMemo } from 'react';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Settings, Image as ImageIcon, Clock, Building2 } from 'lucide-react';
import { FormModal } from '@/components/shared/modals/form-modal';
import { ConfirmationModal } from '@/components/shared/modals/confirmation-modal/ConfirmationModal';
import { Button } from '@/components/shared/button';
import { SearchableSelect } from '@/components/shared/inputs/searchable-select';
import { ToggleSwitch, MultiSelect, Dropdown } from '@/components/shared/inputs';
import type { Facility, FacilityStatus, FacilityPricingType } from '@/types/bookings.types';
import type { Building, Site } from '@/types/residents.types';
import { useSites } from '@/hooks/residents/site/useSites';
import { useBuildings } from '@/hooks/residents/api/useResidentsData';
import {
  FACILITY_TYPES,
  PRICING_TYPES,
  TIME_OPTIONS,
  DEFAULT_OPEN_TIME,
  DEFAULT_CLOSE_TIME
} from '@/constants/facility.constants';

interface FacilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  facilityForm: Partial<Facility>;
  onFacilityChange: (facility: Partial<Facility>) => void;
  isEditing: boolean;
  onSave: () => void;
  onDelete?: () => void;
}

export const FacilityModal: FC<FacilityModalProps> = ({
  isOpen,
  onClose,
  facilityForm,
  onFacilityChange,
  isEditing,
  onSave,
  onDelete,
}) => {
  const { t } = useTranslation();

  // Fetch sites and buildings using hooks
  const { sites, isLoading: isLoadingSites } = useSites();
  const { data: buildingsData } = useBuildings();
  const allBuildings: Building[] = Array.isArray(buildingsData)
    ? buildingsData
    : (buildingsData as any)?.buildings || [];

  // Filter buildings by selected site
  const filteredBuildings = useMemo(() => {
    if (!facilityForm.siteId) return [];
    return allBuildings.filter((b: Building) => b.siteId === facilityForm.siteId);
  }, [allBuildings, facilityForm.siteId]);

  const [allBuildingsSelected, setAllBuildingsSelected] = useState(true);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedFacilityType, setSelectedFacilityType] = useState<string>('other');
  const [showCustomName, setShowCustomName] = useState(true);

  // Sync facility type selection with form name
  useEffect(() => {
    if (isEditing && facilityForm.name) {
      // Check if name matches any predefined type
      const matchingType = FACILITY_TYPES.find(ft =>
        t(ft.labelKey).toLowerCase() === facilityForm.name?.toLowerCase()
      );
      if (matchingType) {
        setSelectedFacilityType(matchingType.id);
        setShowCustomName(false);
      } else {
        setSelectedFacilityType('other');
        setShowCustomName(true);
      }
    }
  }, [isEditing, facilityForm.name, t]);

  // Handle facility type change
  const handleFacilityTypeChange = (typeId: string) => {
    setSelectedFacilityType(typeId);
    if (typeId === 'other') {
      setShowCustomName(true);
      onFacilityChange({ ...facilityForm, name: '' });
    } else {
      setShowCustomName(false);
      const type = FACILITY_TYPES.find(ft => ft.id === typeId);
      if (type) {
        onFacilityChange({ ...facilityForm, name: t(type.labelKey) });
      }
    }
  };

  // Handle pricing type change
  const handlePricingTypeChange = (pricingType: string) => {
    onFacilityChange({
      ...facilityForm,
      pricingType: pricingType as FacilityPricingType,
      price: pricingType === 'free' ? 0 : facilityForm.price
    });
  };

  // Handle 24h toggle
  const handle24HoursToggle = (checked: boolean) => {
    onFacilityChange({
      ...facilityForm,
      isOpen24Hours: checked,
      openTime: checked ? undefined : (facilityForm.openTime || DEFAULT_OPEN_TIME),
      closeTime: checked ? undefined : (facilityForm.closeTime || DEFAULT_CLOSE_TIME),
    });
  };

  const pricingType = PRICING_TYPES.find(pt => pt.id === facilityForm.pricingType);
  const showPriceInput = pricingType?.showPrice ?? false;

  const footer = (
    <div className="flex gap-3 w-full">
      {isEditing && (
        <Button
          onClick={() => setShowDeleteConfirmation(true)}
          variant="destructive"
        >
          {t('common.buttons.delete', 'Sil')}
        </Button>
      )}
      <Button
        onClick={onClose}
        variant="secondary"
        className="flex-1"
      >
        {t('bookings.modals.facility.buttons.cancel')}
      </Button>
      <Button
        onClick={onSave}
        className="bg-ds-action hover:bg-ds-action-hover shadow-lg shadow-ds-action/20 flex-1"
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
        {/* Site & Building Selection */}
        {sites.length > 0 && (
          <div className="space-y-3 p-4 bg-ds-background-light/50 dark:bg-ds-background-dark/50 rounded-xl border border-ds-border-light dark:border-ds-border-dark">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-ds-muted-light dark:text-ds-muted-dark" />
              <label className="text-xs font-medium text-ds-muted-light dark:text-ds-muted-dark uppercase">
                {t('bookings.modals.facility.labels.siteAndBuilding')}
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Site Selection */}
              <div className="space-y-1">
                <label className="text-xs text-ds-muted-light dark:text-ds-muted-dark">
                  {t('bookings.modals.facility.labels.site')}
                </label>
                <Dropdown
                  options={sites.map((s: Site) => ({ value: s.id, label: s.name }))}
                  value={facilityForm.siteId || ''}
                  onChange={(siteId) => {
                    onFacilityChange({ ...facilityForm, siteId, buildingIds: [] });
                    setAllBuildingsSelected(true);
                  }}
                  placeholder={t('bookings.modals.facility.placeholders.site')}
                  disabled={isLoadingSites}
                />
              </div>

              {/* All Buildings Toggle */}
              <div className="space-y-1">
                <label className="text-xs text-ds-muted-light dark:text-ds-muted-dark">
                  {t('bookings.modals.facility.labels.accessScope')}
                </label>
                <ToggleSwitch
                  options={[
                    { value: 'all', label: t('bookings.modals.facility.accessOptions.all') },
                    { value: 'specific', label: t('bookings.modals.facility.accessOptions.specific') },
                  ]}
                  value={allBuildingsSelected ? 'all' : 'specific'}
                  onChange={(val) => {
                    setAllBuildingsSelected(val === 'all');
                    if (val === 'all') {
                      onFacilityChange({ ...facilityForm, buildingIds: [] });
                    }
                  }}
                />
              </div>
            </div>

            {/* Building Multi-Select (shown when specific buildings are selected) */}
            {!allBuildingsSelected && filteredBuildings.length > 0 && (
              <div className="space-y-1">
                <label className="text-xs text-ds-muted-light dark:text-ds-muted-dark">
                  {t('bookings.modals.facility.labels.buildings')}
                </label>
                <MultiSelect
                  options={filteredBuildings.map((b: Building) => ({ value: b.id, label: b.name }))}
                  selectedValues={facilityForm.buildingIds || []}
                  onChange={(values) => onFacilityChange({ ...facilityForm, buildingIds: values })}
                  gridCols={2}
                />
                <p className="text-[10px] text-ds-muted-light dark:text-ds-muted-dark mt-1">
                  {t('bookings.modals.facility.labels.buildingsHint')}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Facility Type Selection */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-ds-muted-light dark:text-ds-muted-dark uppercase">
            {t('bookings.modals.facility.labels.facilityType')}
          </label>
          <SearchableSelect
            value={selectedFacilityType}
            onChange={handleFacilityTypeChange}
            options={FACILITY_TYPES.map(ft => ({
              id: ft.id,
              label: `${ft.defaultIcon} ${t(ft.labelKey)}`,
            }))}
            placeholder={t('bookings.modals.facility.placeholders.facilityType')}
          />
        </div>

        {/* Custom Name Input (shown when "Other" is selected) */}
        {showCustomName && (
          <div className="space-y-2">
            <label className="text-xs font-medium text-ds-muted-light dark:text-ds-muted-dark uppercase">
              {t('bookings.modals.facility.labels.customName')}
            </label>
            <input
              type="text"
              value={facilityForm.name || ''}
              onChange={(e) => onFacilityChange({ ...facilityForm, name: e.target.value })}
              className="w-full bg-ds-background-light dark:bg-ds-background-dark border border-ds-border-light dark:border-ds-border-dark rounded-lg px-3 py-2.5 text-ds-primary-light dark:text-ds-primary-dark focus:outline-none focus:ring-1 focus:ring-ds-ring-light dark:focus:ring-ds-ring-dark"
              placeholder={t('bookings.modals.facility.placeholders.customName')}
            />
          </div>
        )}

        {/* Image URL */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-ds-muted-light dark:text-ds-muted-dark uppercase">
            {t('bookings.modals.facility.labels.image')}
          </label>
          <div className="relative">
            <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ds-muted-light dark:text-ds-muted-dark" />
            <input
              type="text"
              value={facilityForm.imageUrl || ''}
              onChange={(e) => onFacilityChange({ ...facilityForm, imageUrl: e.target.value })}
              className="w-full bg-ds-background-light dark:bg-ds-background-dark border border-ds-border-light dark:border-ds-border-dark rounded-lg pl-10 pr-3 py-2.5 text-ds-primary-light dark:text-ds-primary-dark focus:outline-none focus:ring-1 focus:ring-ds-ring-light dark:focus:ring-ds-ring-dark"
              placeholder={t('bookings.modals.facility.placeholders.image')}
            />
          </div>
        </div>

        {/* Status & Capacity Row */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-ds-muted-light dark:text-ds-muted-dark uppercase">
              {t('bookings.modals.facility.labels.status')}
            </label>
            <ToggleSwitch
              options={[
                { value: 'open', label: t('bookings.modals.facility.statusOptions.open') },
                { value: 'closed', label: t('bookings.modals.facility.statusOptions.closed') },
                { value: 'maintenance', label: t('bookings.modals.facility.statusOptions.maintenance') },
              ]}
              value={facilityForm.status || 'open'}
              onChange={(status) => onFacilityChange({ ...facilityForm, status: status as FacilityStatus })}
            />
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

        {/* Working Hours Section */}
        <div className="space-y-3 p-4 bg-ds-background-light/50 dark:bg-ds-background-dark/50 rounded-xl border border-ds-border-light dark:border-ds-border-dark">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-ds-muted-light dark:text-ds-muted-dark" />
              <label className="text-xs font-medium text-ds-muted-light dark:text-ds-muted-dark uppercase">
                {t('bookings.modals.facility.labels.workingHours')}
              </label>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={facilityForm.isOpen24Hours || false}
                onChange={(e) => handle24HoursToggle(e.target.checked)}
                className="w-4 h-4 rounded border-ds-border-light dark:border-ds-border-dark bg-ds-background-light dark:bg-ds-background-dark text-ds-action accent-ds-action"
              />
              <span className="text-sm text-ds-primary-light dark:text-ds-primary-dark">
                {t('bookings.modals.facility.labels.open24Hours')}
              </span>
            </label>
          </div>

          {!facilityForm.isOpen24Hours && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-ds-muted-light dark:text-ds-muted-dark">
                  {t('bookings.modals.facility.labels.openTime')}
                </label>
                <SearchableSelect
                  value={facilityForm.openTime || DEFAULT_OPEN_TIME}
                  onChange={(value) => onFacilityChange({ ...facilityForm, openTime: value })}
                  options={TIME_OPTIONS.map(time => ({ id: time, label: time }))}
                  placeholder="08:00"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-ds-muted-light dark:text-ds-muted-dark">
                  {t('bookings.modals.facility.labels.closeTime')}
                </label>
                <SearchableSelect
                  value={facilityForm.closeTime || DEFAULT_CLOSE_TIME}
                  onChange={(value) => onFacilityChange({ ...facilityForm, closeTime: value })}
                  options={TIME_OPTIONS.map(time => ({ id: time, label: time }))}
                  placeholder="22:00"
                />
              </div>
            </div>
          )}
        </div>

        {/* Pricing Section */}
        <div className="space-y-3 p-4 bg-ds-background-light/50 dark:bg-ds-background-dark/50 rounded-xl border border-ds-border-light dark:border-ds-border-dark">
          <label className="text-xs font-medium text-ds-muted-light dark:text-ds-muted-dark uppercase">
            {t('bookings.modals.facility.labels.pricing')}
          </label>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-ds-muted-light dark:text-ds-muted-dark">
                {t('bookings.modals.facility.labels.pricingType')}
              </label>
              <SearchableSelect
                value={facilityForm.pricingType || 'free'}
                onChange={handlePricingTypeChange}
                options={PRICING_TYPES.map(pt => ({
                  id: pt.id,
                  label: t(pt.labelKey)
                }))}
                placeholder={t('bookings.modals.facility.placeholders.pricingType')}
              />
            </div>

            {showPriceInput && (
              <div className="space-y-1">
                <label className="text-xs text-ds-muted-light dark:text-ds-muted-dark">
                  {t('bookings.modals.facility.labels.price')} {pricingType && 'unit' in pricingType ? `(${pricingType.unit})` : ''}
                </label>
                <input
                  type="number"
                  value={facilityForm.price || 0}
                  onChange={(e) => onFacilityChange({ ...facilityForm, price: parseInt(e.target.value) || 0 })}
                  className="w-full bg-ds-background-light dark:bg-ds-background-dark border border-ds-border-light dark:border-ds-border-dark rounded-lg px-3 py-2.5 text-ds-primary-light dark:text-ds-primary-dark focus:outline-none focus:ring-1 focus:ring-ds-ring-light dark:focus:ring-ds-ring-dark"
                  placeholder="0"
                  min="0"
                />
              </div>
            )}
          </div>
        </div>

        {/* Requires Booking Toggle */}
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

      <ConfirmationModal
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={() => {
          onDelete?.();
          setShowDeleteConfirmation(false);
          onClose();
        }}
        title={t('bookings.modals.facility.delete.title', 'Tesisi Sil')}
        message={t('bookings.modals.facility.delete.message', '{{name}} tesisini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.', { name: facilityForm.name })}
        variant="danger"
        confirmText={t('common.buttons.delete', 'Sil')}
        cancelText={t('common.buttons.cancel', 'Vazgeç')}
      />
    </FormModal>
  );
};
