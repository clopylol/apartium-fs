import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BookingsHeader } from './components_bookings/header/BookingsHeader';
import { FacilityList } from './components_bookings/facilities/facility-list/FacilityList';
import { BookingTable } from './components_bookings/bookings/booking-table/BookingTable';
import { CalendarView } from './components_bookings/bookings/calendar-view/CalendarView';
import { ViewToggle } from './components_bookings/bookings/view-toggle/ViewToggle';
import { BookingModal } from './components_bookings/modals/booking-modal/BookingModal';
import { BookingConfirmationModal } from './components_bookings/modals/booking-confirmation-modal/BookingConfirmationModal';
import { FacilityModal } from './components_bookings/modals/facility-modal/FacilityModal';
import { RejectionModal } from './components_bookings/modals/rejection-modal/RejectionModal';
import { useBookingsState } from '@/hooks/bookings/useBookingsState';
import { useBookingsActions } from '@/hooks/bookings/useBookingsActions';
import { useBookingsFilters } from '@/hooks/bookings/useBookingsFilters';
import { useBookingsModals } from '@/hooks/bookings/useBookingsModals';
import type { Facility } from '@/types/bookings.types';

export const BookingsPage = () => {
  const [activePageTab, setActivePageTab] = useState<'bookings' | 'facilities'>('bookings');

  const {
    facilities,
    bookings,
    sites,
    activeSiteId,
    setActiveSiteId,
    isLoading,
    viewMode,
    setViewMode,
    calendarWeekStart,
  } = useBookingsState();

  const {
    handleApproveBooking,
    handleRejectClick,
    confirmRejection,
    handleFinalizeBooking,
    handleSaveFacility,
    handleDeleteFacility,
  } = useBookingsActions();

  const {
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
  } = useBookingsModals();

  const {
    activeTab, // This is for filtering bookings by facility
    setActiveTab,
    searchTerm,
    setSearchTerm,
    filteredBookings,
    currentPage,
    setCurrentPage,
    paginatedBookings,
  } = useBookingsFilters(bookings, viewMode);

  // Initial form matching schema
  const [facilityForm, setFacilityForm] = useState<Partial<Facility>>({
    id: '',
    name: '',
    imageUrl: '',
    status: 'open',
    openTime: '',
    closeTime: '',
    isOpen24Hours: false,
    capacity: 10,
    requiresBooking: true,
    pricingType: 'free',
    price: 0,
  });

  const handleOpenAddFacility = () => {
    setFacilityForm({
      name: '',
      imageUrl: '',
      status: 'open',
      openTime: '',
      closeTime: '',
      isOpen24Hours: false,
      capacity: 10,
      requiresBooking: true,
      pricingType: 'free',
      price: 0,
      siteId: activeSiteId || undefined,
    });
    setIsEditingFacility(false);
    openFacilityModal();
  };

  const handleOpenEditFacility = (e: React.MouseEvent, facility: Facility) => {
    e.stopPropagation();
    setFacilityForm({ ...facility });
    setIsEditingFacility(true);
    openFacilityModal();
  };

  const onConfirmBooking = () => {
    handleFinalizeBooking(newBooking, setNewBooking);
    closeBookingConfirmation();
    closeBookingModal();
  };

  const onSaveFacility = () => {
    // If we have an activeSiteId, ensure it's part of the form if not already set
    const formToSave = {
      ...facilityForm,
      siteId: facilityForm.siteId || activeSiteId || undefined
    };
    handleSaveFacility(formToSave, isEditingFacility, (val) => {
      if (typeof val === 'boolean' && !val) closeFacilityModal();
    });
  };

  const onDeleteFacility = () => {
    if (facilityForm.id) {
      handleDeleteFacility(facilityForm.id, facilityForm.name || '', () => {
        closeFacilityModal();
        setIsEditingFacility(false);
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-ds-background-dark overflow-hidden">
      <BookingsHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onOpenBookingModal={openBookingModal}
        activeTab={activePageTab}
        onTabChange={setActivePageTab}
        sites={sites}
        activeSiteId={activeSiteId}
        onSiteChange={setActiveSiteId}
      />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex flex-col gap-6">
          {activePageTab === 'facilities' ? (
            // FACILITIES TAB CONTENT
            <div className="animate-in fade-in duration-300">
              <FacilityList
                facilities={facilities}
                bookings={bookings}
                activeTab="" // No active tab highlighting in this view
                isLoading={isLoading}
                onFacilityClick={(id) => {
                  // Optional: Open detail view or edit
                  const facility = facilities.find(f => f.id === id);
                  if (facility) {
                    setFacilityForm({ ...facility });
                    setIsEditingFacility(true);
                    openFacilityModal();
                  }
                }}
                onFacilityEdit={handleOpenEditFacility}
                showAddCard={true}
                onAddFacility={handleOpenAddFacility}
              />
            </div>
          ) : (
            // BOOKINGS TAB CONTENT
            <>
              {/* Facility Filter List (optional, keeps functionality) */}
              {viewMode === 'list' && (
                <div className="mb-2">
                  <FacilityList
                    facilities={facilities}
                    bookings={bookings}
                    activeTab={activeTab}
                    isLoading={isLoading}
                    onFacilityClick={(id) => setActiveTab(activeTab === id ? 'all' : id)}
                    onFacilityEdit={handleOpenEditFacility}
                  />
                </div>
              )}

              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ViewToggle viewMode={viewMode} onViewChange={setViewMode} />
                  </div>
                </div>

                {viewMode === 'list' ? (
                  <BookingTable
                    bookings={paginatedBookings}
                    facilities={facilities}
                    isLoading={isLoading}
                    currentPage={currentPage}
                    totalItems={filteredBookings.length}
                    onPageChange={setCurrentPage}
                    onApprove={(id) => handleApproveBooking(id)}
                    onReject={(id) => handleRejectClick(id, setRejectingId)}
                  />
                ) : (
                  <CalendarView
                    bookings={bookings}
                    facilities={facilities}
                    calendarWeekStart={calendarWeekStart}
                    isLoading={isLoading}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <BookingModal
        isOpen={showBookingModal}
        onClose={closeBookingModal}
        facilities={facilities}
        newBooking={newBooking}
        onBookingChange={setNewBooking}
        onSubmit={openBookingConfirmation}
      />

      <BookingConfirmationModal
        isOpen={showBookingConfirmation}
        onClose={closeBookingConfirmation}
        newBooking={newBooking}
        facilities={facilities}
        onEdit={() => {
          closeBookingConfirmation();
          openBookingModal();
        }}
        onConfirm={onConfirmBooking}
      />

      <FacilityModal
        isOpen={showFacilityModal}
        onClose={closeFacilityModal}
        facilityForm={facilityForm}
        onFacilityChange={setFacilityForm}
        isEditing={isEditingFacility}
        onSave={onSaveFacility}
        onDelete={onDeleteFacility}
      />

      <RejectionModal
        isOpen={!!rejectingId}
        onClose={() => setRejectingId(null)}
        onConfirm={() => confirmRejection(rejectingId, rejectionReason, setRejectingId)}
        rejectionReason={rejectionReason}
        onReasonChange={setRejectionReason}
      />
    </div>
  );
};
