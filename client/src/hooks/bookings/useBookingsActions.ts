import { useCallback } from 'react';
import type { Facility, Booking } from '@/types/bookings.types';
import { getTodayString } from '@/constants/bookings';

export interface UseBookingsActionsReturn {
  handleApproveBooking: (id: string, setBookings: React.Dispatch<React.SetStateAction<Booking[]>>) => void;
  handleRejectClick: (id: string, setRejectingId: React.Dispatch<React.SetStateAction<string | null>>) => void;
  confirmRejection: (
    rejectingId: string | null,
    rejectionReason: string,
    setBookings: React.Dispatch<React.SetStateAction<Booking[]>>,
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
    setBookings: React.Dispatch<React.SetStateAction<Booking[]>>,
    setNewBooking: React.Dispatch<React.SetStateAction<{
      facilityId: string;
      residentName: string;
      unit: string;
      date: string;
      startTime: string;
      endTime: string;
      note: string;
    }>>
  ) => void;
  handleDeleteFacility: (
    id: string,
    setFacilities: React.Dispatch<React.SetStateAction<Facility[]>>,
    activeTab: string,
    setActiveTab: React.Dispatch<React.SetStateAction<string>>
  ) => void;
  handleSaveFacility: (
    facilityForm: Partial<Facility>,
    isEditingFacility: boolean,
    facilities: Facility[],
    setFacilities: React.Dispatch<React.SetStateAction<Facility[]>>,
    setShowFacilityModal: React.Dispatch<React.SetStateAction<boolean>>
  ) => void;
}

export const useBookingsActions = (): UseBookingsActionsReturn => {
  const handleApproveBooking = useCallback((
    id: string,
    setBookings: React.Dispatch<React.SetStateAction<Booking[]>>
  ) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'confirmed' as const } : b));
  }, []);

  const handleRejectClick = useCallback((
    id: string,
    setRejectingId: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    setRejectingId(id);
  }, []);

  const confirmRejection = useCallback((
    rejectingId: string | null,
    rejectionReason: string,
    setBookings: React.Dispatch<React.SetStateAction<Booking[]>>,
    setRejectingId: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    if (!rejectingId) return;
    setBookings(prev => prev.map(b => 
      b.id === rejectingId 
        ? { ...b, status: 'cancelled' as const, rejectionReason } 
        : b
    ));
    setRejectingId(null);
  }, []);

  const handleFinalizeBooking = useCallback((
    newBooking: {
      facilityId: string;
      residentName: string;
      unit: string;
      date: string;
      startTime: string;
      endTime: string;
      note: string;
    },
    setBookings: React.Dispatch<React.SetStateAction<Booking[]>>,
    setNewBooking: React.Dispatch<React.SetStateAction<{
      facilityId: string;
      residentName: string;
      unit: string;
      date: string;
      startTime: string;
      endTime: string;
      note: string;
    }>>
  ) => {
    const booking: Booking = {
      id: `b-${Date.now()}`,
      facilityId: newBooking.facilityId,
      residentName: newBooking.residentName,
      unit: newBooking.unit,
      date: newBooking.date,
      startTime: newBooking.startTime,
      endTime: newBooking.endTime,
      status: 'pending',
      note: newBooking.note
    };
    setBookings(prev => [booking, ...prev]);
    setNewBooking({ 
      facilityId: '', 
      residentName: '', 
      unit: '', 
      date: '', 
      startTime: '', 
      endTime: '', 
      note: '' 
    });
  }, []);

  const handleDeleteFacility = useCallback((
    id: string,
    setFacilities: React.Dispatch<React.SetStateAction<Facility[]>>,
    activeTab: string,
    setActiveTab: React.Dispatch<React.SetStateAction<string>>,
    confirmMessage: string
  ) => {
    if (window.confirm(confirmMessage)) {
      setFacilities(prev => prev.filter(f => f.id !== id));
      if (activeTab === id) setActiveTab('all');
    }
  }, []);

  const handleSaveFacility = useCallback((
    facilityForm: Partial<Facility>,
    isEditingFacility: boolean,
    facilities: Facility[],
    setFacilities: React.Dispatch<React.SetStateAction<Facility[]>>,
    setShowFacilityModal: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    if (!facilityForm.name) return;

    if (isEditingFacility && facilityForm.id) {
      setFacilities(prev => prev.map(f => 
        f.id === facilityForm.id ? { ...f, ...facilityForm } as Facility : f
      ));
    } else {
      const newFacility: Facility = {
        id: `f-${Date.now()}`,
        name: facilityForm.name || 'Yeni Tesis',
        image: facilityForm.image || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
        status: facilityForm.status || 'open',
        hours: facilityForm.hours || '09:00 - 18:00',
        capacity: facilityForm.capacity || 10,
        requiresBooking: facilityForm.requiresBooking || false,
        pricePerHour: facilityForm.pricePerHour || 0
      };
      setFacilities(prev => [...prev, newFacility]);
    }
    setShowFacilityModal(false);
  }, []);

  return {
    handleApproveBooking,
    handleRejectClick,
    confirmRejection,
    handleFinalizeBooking,
    handleDeleteFacility,
    handleSaveFacility,
  };
};

