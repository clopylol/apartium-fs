import type { FC } from 'react';
import type { Booking, Facility } from '@/types/bookings.types';
import { getTodayString } from '@/constants/bookings';

interface CalendarViewProps {
  bookings: Booking[];
  facilities: Facility[];
  calendarWeekStart: Date;
  isLoading: boolean;
}

const timeSlots = Array.from({ length: 15 }, (_, i) => i + 8); // 08:00 to 22:00

const getWeekDates = (startDate: Date): Date[] => {
  const dates: Date[] = [];
  const day = startDate.getDay();
  const diff = startDate.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(startDate.setDate(diff));

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dates.push(d);
  }
  return dates;
};

const getFacilityName = (facilities: Facility[], id: string): string => {
  return facilities.find(f => f.id === id)?.name || 'Bilinmiyor';
};

const getBookingsForCell = (bookings: Booking[], date: Date, hour: number): Booking[] => {
  const dateStr = date.toISOString().split('T')[0];
  return bookings.filter(b => {
    if (b.status === 'cancelled') return false;
    const bDate = b.date;
    const bHour = parseInt(b.startTime.split(':')[0]);
    return bDate === dateStr && bHour === hour;
  });
};

export const CalendarView: FC<CalendarViewProps> = ({
  bookings,
  facilities,
  calendarWeekStart,
  isLoading,
}) => {
  const currentWeekDates = getWeekDates(new Date(calendarWeekStart));
  const today = getTodayString();

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex flex-col h-[600px] animate-pulse">
          <div className="flex border-b border-ds-border-light dark:border-ds-border-dark">
            <div className="w-16 shrink-0 border-r border-ds-border-light dark:border-ds-border-dark bg-ds-background-light/30 dark:bg-ds-background-dark/30 h-16"></div>
            {[1, 2, 3, 4, 5, 6, 7].map(i => (
              <div 
                key={i} 
                className="flex-1 border-r border-ds-border-light dark:border-ds-border-dark h-16 bg-ds-card-light/30 dark:bg-ds-card-dark/30 flex flex-col items-center justify-center gap-2"
              >
                <div className="h-3 w-10 bg-ds-border-light dark:bg-ds-border-dark rounded"></div>
                <div className="h-4 w-6 bg-ds-border-light dark:bg-ds-border-dark rounded"></div>
              </div>
            ))}
          </div>
          <div className="flex-1 relative overflow-hidden">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="flex border-b border-ds-border-light/50 dark:border-ds-border-dark/50 h-24">
                <div className="w-16 shrink-0 border-r border-ds-border-light dark:border-ds-border-dark bg-ds-background-light/20 dark:bg-ds-background-dark/20 flex items-center justify-center">
                  <div className="h-3 w-8 bg-ds-border-light dark:bg-ds-border-dark rounded"></div>
                </div>
                <div className="flex-1 bg-ds-card-light/10 dark:bg-ds-card-dark/10"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px]">
      {/* Calendar Header (Dates) */}
      <div className="flex border-b border-ds-border-light dark:border-ds-border-dark">
        <div className="w-16 shrink-0 border-r border-ds-border-light dark:border-ds-border-dark bg-ds-background-light/30 dark:bg-ds-background-dark/30"></div>
        {currentWeekDates.map((date, i) => {
          const dateStr = date.toISOString().split('T')[0];
          const isToday = dateStr === today;
          return (
            <div 
              key={i} 
              className={`flex-1 py-3 text-center border-r border-ds-border-light dark:border-ds-border-dark last:border-0 ${
                isToday ? 'bg-ds-in-sky-900/10' : ''
              }`}
            >
              <div className="text-xs text-ds-muted-light dark:text-ds-muted-dark font-medium uppercase">
                {date.toLocaleDateString('tr-TR', { weekday: 'short' })}
              </div>
              <div className={`text-sm font-bold mt-1 ${
                isToday ? 'text-ds-in-sky-500' : 'text-ds-primary-light dark:text-ds-primary-dark'
              }`}>
                {date.getDate()}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Calendar Body (Grid) */}
      <div className="flex-1 overflow-y-auto custom-scrollbar relative">
        {timeSlots.map(hour => (
          <div key={hour} className="flex min-h-[60px] border-b border-ds-border-light/50 dark:border-ds-border-dark/50">
            <div className="w-16 shrink-0 border-r border-ds-border-light dark:border-ds-border-dark flex items-start justify-center pt-2 text-xs text-ds-muted-light dark:text-ds-muted-dark bg-ds-background-light/20 dark:bg-ds-background-dark/20">
              {String(hour).padStart(2, '0')}:00
            </div>
            {currentWeekDates.map((date, i) => (
              <div key={i} className="flex-1 border-r border-ds-border-light/30 dark:border-ds-border-dark/30 last:border-0 relative">
                {getBookingsForCell(bookings, date, hour).map(booking => {
                  const startHour = parseInt(booking.startTime.split(':')[0]);
                  const endHour = parseInt(booking.endTime.split(':')[0]);
                  const duration = endHour - startHour || 1;
                  
                  const statusClass = booking.status === 'confirmed' 
                    ? 'bg-ds-in-success-600/20 border-ds-in-success-600/50 text-ds-in-success-100' 
                    : booking.status === 'pending'
                    ? 'bg-ds-in-warning-600/20 border-ds-in-warning-600/50 text-ds-in-warning-100'
                    : 'bg-ds-card-light dark:bg-ds-card-dark';
                  
                  return (
                    <div 
                      key={booking.id}
                      className={`absolute left-1 right-1 rounded-md p-1.5 text-[10px] border shadow-sm cursor-pointer hover:brightness-110 transition-all z-10 ${statusClass}`}
                      style={{
                        top: '2px',
                        height: `${duration * 60 - 4}px`
                      }}
                      title={`${booking.residentName} - ${booking.note || ''}`}
                    >
                      <div className="font-bold truncate">
                        {booking.startTime} - {getFacilityName(facilities, booking.facilityId)}
                      </div>
                      <div className="truncate opacity-80">{booking.residentName}</div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

