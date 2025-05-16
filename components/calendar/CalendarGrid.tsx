'use client';

import { useMemo } from 'react';
import { startOfWeek, startOfMonth, addDays, format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { CalendarDay } from './CalendarDay';
import { useCalendar } from '@/app/contexts/calendar-context';

type CalendarGridProps = {
  isMonthView?: boolean;
};

export function CalendarGrid({ isMonthView = false }: CalendarGridProps) {
  const { state } = useCalendar();
  const { viewDate } = state;

  // Get weekday headers
  const weekdayHeaders = useMemo(() => {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => {
      const day = addDays(weekStart, i);
      const label = format(day, 'EE', { locale: ru }).toLowerCase();
      // Handle special case for Saturday in Russian
      return label === 'суб' ? label.slice(0, 1) + label.slice(2) : label.slice(0, 2);
    });
  }, []);

  // Generate days for week view
  const weekDays = useMemo(() => {
    const weekStart = startOfWeek(viewDate, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  }, [viewDate]);

  // Generate days for month view
  const monthDays = useMemo(() => {
    const monthStart = startOfMonth(viewDate);
    const startDay = startOfWeek(monthStart, { weekStartsOn: 1 });
    return Array.from({ length: 42 }, (_, i) => addDays(startDay, i));
  }, [viewDate]);

  if (isMonthView) {
    return (
      <div className="w-full">
        <div className="grid grid-cols-7 mb-2 text-center text-sm text-gray-500">
          {weekdayHeaders.map((day, index) => (
            <div key={index}>{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {monthDays.map(day => (
            <CalendarDay key={day.toISOString()} date={day} isMonthView={true} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex w-full mb-2 text-center text-sm text-gray-500">
        {weekdayHeaders.map((day, index) => (
          <div key={index} className="flex-1">
            {day}
          </div>
        ))}
      </div>
      <div className="flex w-full">
        {weekDays.map(day => (
          <CalendarDay key={day.toISOString()} date={day} />
        ))}
      </div>
    </div>
  );
}
