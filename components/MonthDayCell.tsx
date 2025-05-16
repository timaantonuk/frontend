'use client';

import type React from 'react';

import { format, isToday, isSameDay, isSameMonth } from 'date-fns';
import { useDiary } from '@/app/contexts/diary-context';

type MonthDayCellProps = {
  day: Date;
};

export default function MonthDayCell({ day }: MonthDayCellProps) {
  const { state, dispatch, onDateSelect } = useDiary();
  const { selectedDate, viewDate, events } = state;

  const dayNumber = format(day, 'd');
  const isSelected = isSameDay(selectedDate, day);
  const isCurrentMonth = isSameMonth(day, viewDate);
  const isCurrentDay = isToday(day);

  const handleSelectedDayClick = (e: React.MouseEvent) => {
    // Stop propagation to prevent triggering parent's events
    e.stopPropagation();
    dispatch({ type: 'SELECT_DATE', payload: day });
    if (onDateSelect) onDateSelect(day);
  };

  return (
    <div
      onClick={handleSelectedDayClick}
      className={`
        flex items-center relative justify-center cursor-pointer transition-all
        ${isSelected ? 'bg-green-200 rounded-sm' : ''}
        ${!isCurrentMonth ? 'text-gray-400' : ''}
        ${isCurrentDay && !isSelected ? 'font-bold' : ''}
        h-10
      `}
    >
      <div className="text-center">{dayNumber}</div>
      {events[format(day, 'yyyy-MM-dd')] && (
        <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-green-700 rounded-full" />
      )}
    </div>
  );
}
