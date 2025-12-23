import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Filter } from 'lucide-react';
import { BookingsHeader } from './components_bookings/header';
import { FacilityList } from './components_bookings/facilities';
import { BookingTable, CalendarView, ViewToggle } from './components_bookings/bookings';
import { BookingModal, BookingConfirmationModal, FacilityModal, RejectionModal } from './components_bookings/modals';
import { useBookingsState, useBookingsActions, useBookingsModals, useBookingsFilters } from '@/hooks/bookings';
import type { Facility } from '@/types/bookings.types';

export const BookingsPage = () => {
  const { t } = useTranslation();
  const {
    facilities,
    setFacilities,
    bookings,
    setBookings,
    isLoading,
    viewMode,
    setViewMode,
    calendarWeekStart,
    setCalendarWeekStart,
  } = useBookingsState();

  const {
    handleApproveBooking,
    handleRejectClick,
    confirmRejection,
    handleFinalizeBooking,
    handleDeleteFacility,
    handleSaveFacility,
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
    activeTab,
    setActiveTab,
    searchTerm,
    setSearchTerm,
    filteredBookings,
    currentPage,
    setCurrentPage,
    paginatedBookings,
    totalPages,
  } = useBookingsFilters(bookings, viewMode);

  const [facilityForm, setFacilityForm] = useState<Partial<Facility>>({
    id: '',
    name: '',
    image: '',
    status: 'open',
    hours: '',
    capacity: 0,
    requiresBooking: false,
    pricePerHour: 0,
  });

  const getFacilityName = (id: string): string => {
    return facilities.find(f => f.id === id)?.name || t('bookings.facilities.title');
  };

  const handleOpenAddFacility = () => {
    setFacilityForm({
      name: '',
      image: '',
      status: 'open',
      hours: '',
      capacity: 10,
      requiresBooking: false,
      pricePerHour: 0,
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

  const handleDeleteFacilityClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    handleDeleteFacility(
      id,
      setFacilities,
      activeTab,
      setActiveTab,
      t('bookings.modals.deleteFacility.message')
    );
  };

  const handleInitiateBooking = () => {
    if (!newBooking.facilityId || !newBooking.residentName || !newBooking.date || !newBooking.startTime || !newBooking.endTime) {
      alert(t('bookings.modals.booking.validation'));
      return;
    }
    closeBookingModal();
    openBookingConfirmation();
  };

  const handleSaveFacilityClick = () => {
    handleSaveFacility(
      facilityForm,
      isEditingFacility,
      facilities,
      setFacilities,
      closeFacilityModal
    );
  };

  const handleConfirmRejection = () => {
    confirmRejection(
      rejectingId,
      rejectionReason,
      setBookings,
      setRejectingId
    );
    setRejectionReason('');
  };

  const handleFinalizeBookingClick = () => {
    handleFinalizeBooking(newBooking, setBookings, setNewBooking);
    closeBookingConfirmation();
  };

  return (
    <div className="flex flex-col h-full bg-ds-background-light dark:bg-ds-background-dark overflow-hidden relative">
      <BookingsHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onOpenFacilityModal={handleOpenAddFacility}
        onOpenBookingModal={openBookingModal}
      />

      <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
        <div className="max-w-7xl mx-auto space-y-8 pb-20">
          {/* Facilities Cards */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-ds-primary-light dark:text-ds-primary-dark">
                {t('bookings.facilities.title')}
              </h2>
              <button 
                onClick={() => setActiveTab('all')} 
                className="text-sm text-ds-in-sky-500 hover:text-ds-in-sky-400"
              >
                {t('bookings.facilities.showAll')}
              </button>
            </div>
            
            <FacilityList
              facilities={facilities}
              bookings={bookings}
              activeTab={activeTab}
              isLoading={isLoading}
              onFacilityClick={(facilityId) => setActiveTab(activeTab === facilityId ? 'all' : facilityId)}
              onFacilityEdit={handleOpenEditFacility}
            />
          </section>

          {/* Bookings Section */}
          <section className="bg-ds-card-light dark:bg-ds-card-dark border border-ds-border-light dark:border-ds-border-dark rounded-2xl overflow-hidden shadow-xl min-h-[500px] flex flex-col">
            {/* Section Header */}
            <div className="p-6 border-b border-ds-border-light dark:border-ds-border-dark flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-ds-primary-light dark:text-ds-primary-dark">
                  {activeTab === 'all' 
                    ? t('bookings.bookings.allBookings') 
                    : t('bookings.bookings.facilitySchedule', { name: getFacilityName(activeTab) })
                  }
                </h2>
                <span className="px-2 py-0.5 bg-ds-background-light dark:bg-ds-background-dark text-ds-muted-light dark:text-ds-muted-dark rounded-full text-xs font-medium">
                  {filteredBookings.length}
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <ViewToggle viewMode={viewMode} onViewChange={setViewMode} />
                
                <div className="h-6 w-px bg-ds-border-light dark:bg-ds-border-dark"></div>

                <button className="p-2 text-ds-muted-light dark:text-ds-muted-dark hover:text-ds-primary-light dark:hover:text-ds-primary-dark hover:bg-ds-background-light dark:hover:bg-ds-background-dark rounded-lg transition-colors">
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden flex flex-col">
              {viewMode === 'list' ? (
                <div className="p-6">
                  <BookingTable
                    bookings={paginatedBookings}
                    facilities={facilities}
                    isLoading={isLoading}
                    currentPage={currentPage}
                    totalItems={filteredBookings.length}
                    onPageChange={setCurrentPage}
                    onApprove={(id) => handleApproveBooking(id, setBookings)}
                    onReject={(id) => {
                      handleRejectClick(id, setRejectingId);
                    }}
                  />
                </div>
              ) : (
                <div className="p-6">
                  <CalendarView
                    bookings={filteredBookings}
                    facilities={facilities}
                    calendarWeekStart={calendarWeekStart}
                    isLoading={isLoading}
                  />
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Modals */}
      <BookingModal
        isOpen={showBookingModal}
        onClose={closeBookingModal}
        newBooking={newBooking}
        onBookingChange={setNewBooking}
        facilities={facilities}
        onSubmit={handleInitiateBooking}
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
        onConfirm={handleFinalizeBookingClick}
      />

      <FacilityModal
        isOpen={showFacilityModal}
        onClose={closeFacilityModal}
        facilityForm={facilityForm}
        onFacilityChange={setFacilityForm}
        isEditing={isEditingFacility}
        onSave={handleSaveFacilityClick}
      />

      <RejectionModal
        isOpen={!!rejectingId}
        onClose={() => setRejectingId(null)}
        rejectionReason={rejectionReason}
        onReasonChange={setRejectionReason}
        onConfirm={handleConfirmRejection}
      />
    </div>
  );
};

