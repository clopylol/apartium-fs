import { useCallback } from 'react';
import type { Facility } from '@/types/bookings.types';
import { useBookingsMutations } from './useBookingsMutations';
import { useAuth } from '@/contexts/auth/useAuth';

export interface UseBookingsActionsReturn {
  handleApproveBooking: (id: string) => void;
  handleRejectClick: (id: string, setRejectingId: React.Dispatch<React.SetStateAction<string | null>>) => void;
  confirmRejection: (
    rejectingId: string | null,
    rejectionReason: string,
    setRejectingId: React.Dispatch<React.SetStateAction<string | null>>
  ) => void;
  handleFinalizeBooking: (
    newBooking: {
      facilityId: string;
      residentName: string;
      unit: string;
      date: string;
      startTime: string;
      endTime: string;
      note: string;
    },
    setNewBooking: React.Dispatch<React.SetStateAction<any>>
  ) => void;
  handleDeleteFacility: (
    id: string,
    name: string,
    onSuccess?: () => void
  ) => void;
  handleSaveFacility: (
    facilityForm: Partial<Facility>,
    isEditingFacility: boolean,
    setShowFacilityModal: React.Dispatch<React.SetStateAction<boolean>>
  ) => void;
}

export const useBookingsActions = (): UseBookingsActionsReturn => {
  const { user } = useAuth();
  const { createFacility, updateFacility, deleteFacility, createBooking, updateBookingStatus } = useBookingsMutations();

  const handleApproveBooking = useCallback((id: string) => {
    updateBookingStatus.mutate({ id, status: 'confirmed' });
  }, [updateBookingStatus]);

  const handleRejectClick = useCallback((
    id: string,
    setRejectingId: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    setRejectingId(id);
  }, []);

  const confirmRejection = useCallback((
    rejectingId: string | null,
    rejectionReason: string,
    setRejectingId: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    if (!rejectingId) return;
    updateBookingStatus.mutate({ id: rejectingId, status: 'cancelled', rejectionReason });
    setRejectingId(null);
  }, [updateBookingStatus]);

  const handleFinalizeBooking = useCallback((
    newBookingData: {
      facilityId: string;
      residentName: string;
      unit: string;
      date: string;
      startTime: string;
      endTime: string;
      note: string;
      // Optional fields from new modal
      siteId?: string;
      buildingId?: string;
      unitId?: string;
      residentId?: string;
    },
    setNewBooking: React.Dispatch<React.SetStateAction<any>>
  ) => {
    // Construct payload
    const payload = {
      facilityId: newBookingData.facilityId,
      residentName: newBookingData.residentName,
      unit: newBookingData.unit,
      startTime: newBookingData.startTime,
      endTime: newBookingData.endTime,
      note: newBookingData.note,
      bookingDate: newBookingData.date, // Backend expects bookingDate
      unitId: newBookingData.unitId || '', // Use the ID if available
      residentId: newBookingData.residentId || user?.id, // Use form residentId if available (admin mode), else fallback
      // Helper fields (might be ignored by backend but good for context if allowed)
      siteId: newBookingData.siteId,
      buildingId: newBookingData.buildingId,
    };

    createBooking.mutate(payload, {
      onSuccess: () => {
        setNewBooking({
          facilityId: '',
          residentName: '',
          unit: '',
          date: '',
          startTime: '',
          endTime: '',
          note: '',
          siteId: '',
          buildingId: '',
          unitId: '',
          residentId: '',
        });
      }
    });
  }, [createBooking, user?.id]);

  const handleDeleteFacility = useCallback((
    id: string,
    name: string,
    onSuccess?: () => void
  ) => {
    deleteFacility.mutate({ id, name }, {
      onSuccess: () => {
        onSuccess?.();
      }
    });
  }, [deleteFacility]);

  const handleSaveFacility = useCallback((
    facilityForm: Partial<Facility>,
    isEditingFacility: boolean,
    setShowFacilityModal: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    if (!facilityForm.name) return;

    // Clean up the data before sending - remove deprecated/client-only fields
    const cleanedData = {
      name: facilityForm.name,
      siteId: facilityForm.siteId || user?.siteId,
      imageUrl: facilityForm.imageUrl || null,
      status: facilityForm.status || 'open',
      openTime: facilityForm.openTime || null,
      closeTime: facilityForm.closeTime || null,
      isOpen24Hours: facilityForm.isOpen24Hours ?? false,
      capacity: facilityForm.capacity ?? 10,
      requiresBooking: facilityForm.requiresBooking ?? true,
      pricingType: facilityForm.pricingType || 'free',
      price: String(facilityForm.price ?? 0),
    };

    if (isEditingFacility && facilityForm.id) {
      updateFacility.mutate({
        id: facilityForm.id,
        data: cleanedData
      }, {
        onSuccess: () => setShowFacilityModal(false)
      });
    } else {
      createFacility.mutate(cleanedData, {
        onSuccess: () => setShowFacilityModal(false)
      });
    }
  }, [createFacility, updateFacility, user?.siteId]);

  return {
    handleApproveBooking,
    handleRejectClick,
    confirmRejection,
    handleFinalizeBooking,
    handleDeleteFacility,
    handleSaveFacility,
  };
};
