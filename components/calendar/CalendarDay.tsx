'use client';

import type React from 'react';
import { format, isToday, isSameDay, isSameMonth } from 'date-fns';
import { useCalendar } from '@/app/contexts/calendar-context';
import { motion } from 'framer-motion';

type CalendarDayProps = {
  date: Date;
  isMonthView?: boolean;
};

// Animation for day selection
const selectedDayVariants = {
  initial: { scale: 0.9 },
  selected: {
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 15,
    },
  },
};

export function CalendarDay({ date, isMonthView = false }: CalendarDayProps) {
  const { state, dispatch, hasEvent, onDateSelect } = useCalendar();
  const { selectedDate, viewDate } = state;

  const dayNumber = format(date, 'd');
  const isSelected = isSameDay(selectedDate, date);
  const isCurrentMonth = isSameMonth(date, viewDate);
  const isCurrentDay = isToday(date);
  const hasEventMark = hasEvent(date);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering parent's events
    dispatch({ type: 'SELECT_DATE', payload: date });
    if (onDateSelect) onDateSelect(date);
  };

  if (isMonthView) {
    return (
      <motion.div
        onClick={handleClick}
        animate={isSelected ? 'selected' : 'initial'}
        variants={selectedDayVariants}
        className={`
          flex items-center relative justify-center cursor-pointer transition-all
          ${isSelected ? 'bg-green-200 rounded-sm' : ''}
          ${!isCurrentMonth ? 'text-gray-400 hover:bg-gray-100' : 'hover:bg-gray-100'}
          ${isCurrentDay && !isSelected ? 'font-bold' : ''}
          h-10
        `}
      >
        <div className="text-center">{dayNumber}</div>
        {hasEventMark && (
          <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-green-700 rounded-full" />
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      onClick={handleClick}
      animate={isSelected ? 'selected' : 'initial'}
      variants={selectedDayVariants}
      className={`
        flex-1 relative flex items-center justify-center cursor-pointer transition-all
        ${isSelected ? 'bg-green-200 rounded-xl' : ''}
        ${isCurrentDay && !isSelected ? 'font-bold' : ''}
        h-14
      `}
    >
      <div className="text-center text-lg">{dayNumber}</div>
      {hasEventMark && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-green-700 rounded-full" />
      )}
    </motion.div>
  );
}
