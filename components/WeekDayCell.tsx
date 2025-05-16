'use client';

import type React from 'react';

import { format, isToday, isSameDay } from 'date-fns';
import { useDiary } from '@/app/contexts/diary-context';

type WeekDayCellProps = {
  day: Date;
};

export default function WeekDayCell({ day }: WeekDayCellProps) {
  const { state, dispatch, onDateSelect } = useDiary();
  const { selectedDate, events } = state;

  const dayNumber = format(day, 'd');
  const isSelected = isSameDay(selectedDate, day);
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
        flex-1 relative flex items-center justify-center cursor-pointer transition-all
        ${isSelected ? 'bg-green-200 rounded-xl' : ''}
        ${isCurrentDay && !isSelected ? 'font-bold' : ''}
        h-14
      `}
    >
      {events[format(day, 'yyyy-MM-dd')] && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-green-700 rounded-full" />
      )}
      <div className="text-center text-lg">{dayNumber}</div>
    </div>
  );
}
