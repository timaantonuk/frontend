'use client';

import { useState, useMemo } from 'react';
import {
  addDays,
  startOfWeek,
  format,
  isSameDay,
  startOfMonth,
  endOfMonth,
  endOfWeek,
  isSameMonth,
  addMonths,
  addWeeks,
} from 'date-fns';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { formatMonthYear, getWeekdayLabel } from '@/app/utils/functions';

// Component props type
type DiaryCalendarProps = {
  events?: Record<string, boolean>;
  onDateSelect?: (date: Date) => void;
};

function DiaryCalendar({ events = {}, onDateSelect }: DiaryCalendarProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewDate, setViewDate] = useState(new Date());
  const [isExpanded, setIsExpanded] = useState(false);

  // Memoized calculations for current week
  const weekDays = useMemo(() => {
    const weekStart = startOfWeek(viewDate, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  }, [viewDate]);

  // Memoized calculations for current month
  const monthDays = useMemo(() => {
    const startDay = startOfWeek(startOfMonth(viewDate), { weekStartsOn: 1 });
    const endDay = endOfWeek(endOfMonth(viewDate), { weekStartsOn: 1 });

    const days = [];
    let current = startDay;

    while (current <= endDay) {
      days.push(current);
      current = addDays(current, 1);
    }

    return days;
  }, [viewDate]);

  // Month and year to display
  const monthAndYearToDisplay = formatMonthYear(viewDate);

  // Navigation handlers
  const navigateToPrevious = () => {
    if (isExpanded) {
      setViewDate(prev => addMonths(prev, -1));
    } else {
      setViewDate(prev => addWeeks(prev, -1));
    }
  };

  const navigateToNext = () => {
    if (isExpanded) {
      setViewDate(prev => addMonths(prev, 1));
    } else {
      setViewDate(prev => addWeeks(prev, 1));
    }
  };

  // Event handlers
  const handleMonthClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSelectedDayClick = (day: Date) => {
    setSelectedDate(day);
    setViewDate(day); // Update month when selecting a date
    if (onDateSelect) onDateSelect(day);

    // Close expanded view after selecting a date
    if (isExpanded) setIsExpanded(false);
  };

  // Day cell component
  const DayCell = ({ day, isMonth = false }: { day: Date; isMonth?: boolean }) => {
    const dayLabel = getWeekdayLabel(day);
    const dayNumber = format(day, 'd');
    const isSelected = isSameDay(selectedDate, day);
    const isCurrentMonth = isSameMonth(day, viewDate);

    return (
      <div
        onClick={() => handleSelectedDayClick(day)}
        className={`
        flex flex-col items-center justify-center gap-1 p-1 rounded-md cursor-pointer transition-colors
        ${isSelected ? 'bg-red-400 text-white' : 'bg-white'}
        ${isMonth && !isCurrentMonth ? 'opacity-40' : ''}
        ${isMonth ? '' : 'flex-1'}
        h-14
      `}
      >
        <time dateTime={day.toISOString()} className="text-xs font-medium">
          {dayLabel}
        </time>
        <time dateTime={day.toISOString()} className="text-sm">
          {dayNumber}
        </time>
        {events[format(day, 'yyyy-MM-dd')] && <div className=" w-1 h-1 bg-blue-500 rounded-full" />}
      </div>
    );
  };

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black z-[1]"
            onClick={() => setIsExpanded(false)}
          />
        )}
      </AnimatePresence>

      {/* Calendar Container */}
      <motion.div
        layout="preserve-aspect"
        initial={false}
        transition={{
          layout: { duration: 0.3, type: 'spring', bounce: 0 },
          height: { duration: 0.3 },
        }}
        className="flex flex-col gap-4 w-full rounded-2xl bg-green-300 px-4 py-3 relative z-10 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={navigateToPrevious}
            className="p-1 rounded-full hover:bg-green-400 transition-colors"
            aria-label="Предыдущий период"
          >
            <ChevronLeft size={20} />
          </button>

          <motion.div onClick={handleMonthClick} className="flex gap-1 items-center cursor-pointer">
            <p className="font-semibold">{monthAndYearToDisplay}</p>
            <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown size={15} />
            </motion.div>
          </motion.div>

          <button
            onClick={navigateToNext}
            className="p-1 rounded-full hover:bg-green-400 transition-colors"
            aria-label="Следующий период"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Calendar View */}
        <motion.div layout transition={{ duration: 0.3 }} className="w-full">
          <AnimatePresence mode="wait">
            {isExpanded ? (
              <motion.div
                key="month"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-7 gap-2"
              >
                {monthDays.map(day => (
                  <DayCell key={day.toISOString()} day={day} isMonth />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="week"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex w-full gap-2"
              >
                {weekDays.map(day => (
                  <DayCell key={day.toISOString()} day={day} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </>
  );
}

export default DiaryCalendar;
