'use client';

import { useState, useMemo, useRef } from 'react';
import {
  addDays,
  startOfWeek,
  format,
  isSameDay,
  startOfMonth,
  isSameMonth,
  addMonths,
  addWeeks,
  isToday,
} from 'date-fns';
import { ru } from 'date-fns/locale';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion, useAnimation } from 'framer-motion';

// Component props type
type DiaryCalendarProps = {
  events?: Record<string, boolean>;
  onDateSelect?: (date: Date) => void;
};

function DiaryCalendar({ events = {}, onDateSelect }: DiaryCalendarProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewDate, setViewDate] = useState(new Date());
  const [isExpanded, setIsExpanded] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  // Format date to month and year (e.g., "февраль 2025")
  const formatMonthYear = (date: Date) => {
    return format(date, 'LLLL yyyy', { locale: ru });
  };

  // Get two-letter weekday label (e.g., "пн", "вт")
  const getWeekdayLabel = (date: Date) => {
    const weekdayLabel = format(date, 'EE', { locale: ru }).toLowerCase();

    if (weekdayLabel === 'суб') {
      return weekdayLabel.slice(0, 1) + weekdayLabel.slice(2);
    } else {
      return weekdayLabel.slice(0, 2);
    }
  };

  // Memoized calculations for current week
  const weekDays = useMemo(() => {
    const weekStart = startOfWeek(viewDate, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  }, [viewDate]);

  // Memoized calculations for current month with exactly 5 rows (35 days)
  const monthDays = useMemo(() => {
    // Start from the first day of the month's week
    const firstDayOfMonth = startOfMonth(viewDate);
    const startDay = startOfWeek(firstDayOfMonth, { weekStartsOn: 1 });

    // Generate exactly 35 days (5 rows × 7 columns)
    return Array.from({ length: 35 }, (_, i) => addDays(startDay, i));
  }, [viewDate]);

  // Weekday headers (only calculated once)
  const weekdayHeaders = useMemo(() => {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => {
      const day = addDays(weekStart, i);
      return getWeekdayLabel(day);
    });
  }, []);

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
  };

  // Handle swipe gestures
  const handleDragEnd = (e: any, { offset }: any) => {
    if (offset.x < -50) {
      navigateToNext();
      controls.start({ x: 0 });
    } else if (offset.x > 50) {
      navigateToPrevious();
      controls.start({ x: 0 });
    } else {
      controls.start({ x: 0 });
    }
  };

  // Day cell component for week view
  const WeekDayCell = ({ day }: { day: Date }) => {
    const dayNumber = format(day, 'd');
    const isSelected = isSameDay(selectedDate, day);
    const isCurrentDay = isToday(day);

    return (
      <div
        onClick={() => handleSelectedDayClick(day)}
        className={`
          flex-1 relative flex items-center justify-center cursor-pointer transition-all
          ${isSelected ? 'bg-green-200 rounded-xl' : ''}
          ${isCurrentDay && !isSelected ? 'font-bold' : ''}
        }
          h-14
        `}
      >
        {events[format(day, 'yyyy-MM-dd')] && (
          <div className="absolute bottom-2 left-1/2 -translate-1/2 w-1 h-1 bg-green-700 rounded-full" />
        )}
        <div className="text-center text-lg">{dayNumber}</div>
      </div>
    );
  };

  // Day cell component for month view
  const MonthDayCell = ({ day }: { day: Date }) => {
    const dayNumber = format(day, 'd');
    const isSelected = isSameDay(selectedDate, day);
    const isCurrentMonth = isSameMonth(day, viewDate);
    const isCurrentDay = isToday(day);

    return (
      <div
        onClick={() => handleSelectedDayClick(day)}
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
          <div className="absolute bottom-0.5 left-1/2 -translate-1/2 w-1 h-1 bg-red-700 rounded-full" />
        )}
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
        ref={calendarRef}
        layout="preserve-aspect"
        initial={false}
        transition={{
          layout: { duration: 0.4, type: 'spring', bounce: 0 },
          height: { duration: 0.4 },
        }}
        className="flex flex-col w-full rounded-2xl bg-white px-4 py-3 relative z-10 overflow-hidden shadow-md"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={navigateToPrevious}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Предыдущий период"
          >
            <ChevronLeft size={20} />
          </button>

          <motion.div onClick={handleMonthClick} className="flex gap-1 items-center cursor-pointer">
            <p className="font-semibold text-lg">{monthAndYearToDisplay}</p>
            <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown size={15} />
            </motion.div>
          </motion.div>

          <button
            onClick={navigateToNext}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Следующий период"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Calendar View */}
        <motion.div
          layout
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.1}
          onDragEnd={handleDragEnd}
          animate={controls}
          className="w-full"
        >
          <AnimatePresence mode="wait">
            {isExpanded ? (
              <motion.div
                key="month"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                {/* Weekday headers */}
                <div className="grid grid-cols-7 mb-2 text-center text-sm text-gray-500">
                  {weekdayHeaders.map((day, index) => (
                    <div key={index}>{day}</div>
                  ))}
                </div>

                {/* Month grid */}
                <div className="grid grid-cols-7 gap-1">
                  {monthDays.map(day => (
                    <MonthDayCell key={day.toISOString()} day={day} />
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="week"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                {/* Weekday headers */}
                <div className="flex w-full mb-2 text-center text-sm text-gray-500">
                  {weekdayHeaders.map((day, index) => (
                    <div key={index} className="flex-1">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Week row */}
                <div className="flex w-full">
                  {weekDays.map(day => (
                    <WeekDayCell key={day.toISOString()} day={day} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </>
  );
}

export default DiaryCalendar;
