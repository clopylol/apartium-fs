import { useState, useCallback } from 'react';

export interface NewBookingForm {
  facilityId: string;
  residentName: string;
  unit: string;
  date: string;
  startTime: string;
  endTime: string;
  note: string;
}

export interface UseBookingsModalsReturn {
  showBookingModal: boolean;
  openBookingModal: () => void;
  closeBookingModal: () => void;
  showBookingConfirmation: boolean;
  openBookingConfirmation: () => void;
  closeBookingConfirmation: () => void;
  showFacilityModal: boolean;
  openFacilityModal: () => void;
  closeFacilityModal: () => void;
  isEditingFacility: boolean;
  setIsEditingFacility: React.Dispatch<React.SetStateAction<boolean>>;
  newBooking: NewBookingForm;
  setNewBooking: React.Dispatch<React.SetStateAction<NewBookingForm>>;
  rejectingId: string | null;
  setRejectingId: React.Dispatch<React.SetStateAction<string | null>>;
  rejectionReason: string;
  setRejectionReason: React.Dispatch<React.SetStateAction<string>>;
}

export const useBookingsModals = (): UseBookingsModalsReturn => {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showBookingConfirmation, setShowBookingConfirmation] = useState(false);
  const [showFacilityModal, setShowFacilityModal] = useState(false);
  const [isEditingFacility, setIsEditingFacility] = useState(false);
  const [newBooking, setNewBooking] = useState<NewBookingForm>({
    facilityId: '',
    residentName: '',
    unit: '',
    date: '',
    startTime: '',
    endTime: '',
    note: ''
  });
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const openBookingModal = useCallback(() => {
    setShowBookingModal(true);
  }, []);

  const closeBookingModal = useCallback(() => {
    setShowBookingModal(false);
  }, []);

  const openBookingConfirmation = useCallback(() => {
    setShowBookingConfirmation(true);
  }, []);

  const closeBookingConfirmation = useCallback(() => {
    setShowBookingConfirmation(false);
  }, []);

  const openFacilityModal = useCallback(() => {
    setShowFacilityModal(true);
  }, []);

  const closeFacilityModal = useCallback(() => {
    setShowFacilityModal(false);
  }, []);

  return {
    showBookingModal,
    openBookingModal,
    closeBookingModal,
    showBookingConfirmation,
    openBookingConfirmation,
    closeBookingConfirmation,
    showFacilityModal,
    openFacilityModal,
    closeFacilityModal,
    isEditingFacility,
    setIsEditingFacility,
    newBooking,
    setNewBooking,
    rejectingId,
    setRejectingId,
    rejectionReason,
    setRejectionReason,
  };
};

