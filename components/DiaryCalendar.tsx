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
import {
  AnimatePresence,
  motion,
  PanInfo,
  useAnimation,
  useMotionValue,
  useTransform,
} from 'framer-motion';

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
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-70, 0, 70], [0.04, 1, 0.04]);

  const formatMonthYear = (date: Date) => format(date, 'LLLL yyyy', { locale: ru });

  const getWeekdayLabel = (date: Date) => {
    const label = format(date, 'EE', { locale: ru }).toLowerCase();
    return label === 'суб' ? label.slice(0, 1) + label.slice(2) : label.slice(0, 2);
  };

  const weekDays = useMemo(() => {
    const weekStart = startOfWeek(viewDate, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  }, [viewDate]);

  const monthDays = useMemo(() => {
    const firstDay = startOfMonth(viewDate);
    const startDay = startOfWeek(firstDay, { weekStartsOn: 1 });
    return Array.from({ length: 35 }, (_, i) => addDays(startDay, i));
  }, [viewDate]);

  const weekdayHeaders = useMemo(() => {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => getWeekdayLabel(addDays(weekStart, i)));
  }, []);

  const monthAndYearToDisplay = formatMonthYear(viewDate);

  const navigateToPrevious = () => {
    setViewDate(prev => (isExpanded ? addMonths(prev, -1) : addWeeks(prev, -1)));
  };

  const navigateToNext = () => {
    setViewDate(prev => (isExpanded ? addMonths(prev, 1) : addWeeks(prev, 1)));
  };

  const handleMonthClick = () => setIsExpanded(prev => !prev);

  const handleSelectedDayClick = (day: Date) => {
    setSelectedDate(day);
    setViewDate(day);
    if (onDateSelect) onDateSelect(day);
  };

  const handleDragEnd = (e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x < -70) {
      navigateToNext();
    } else if (info.offset.x > 70) {
      navigateToPrevious();
    }
    controls.start({ x: 0 });
  };

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
          h-14
        `}
      >
        {events[format(day, 'yyyy-MM-dd')] && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-green-700 rounded-full" />
        )}
        <div className="text-center text-lg">{dayNumber}</div>
      </div>
    );
  };

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
          <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-red-700 rounded-full" />
        )}
      </div>
    );
  };

  return (
    <>
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

      <motion.div
        ref={calendarRef}
        className={`flex flex-col w-full rounded-2xl transition-all duration-700 bg-white px-4 py-3 relative z-10 overflow-hidden shadow-md h-[10rem] ${
          isExpanded ? 'h-[20rem]' : ''
        }`}
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
          style={{ x, opacity }}
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
                <div className="grid grid-cols-7 mb-2 text-center text-sm text-gray-500">
                  {weekdayHeaders.map((day, index) => (
                    <div key={index}>{day}</div>
                  ))}
                </div>

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
                <div className="flex w-full mb-2 text-center text-sm text-gray-500">
                  {weekdayHeaders.map((day, index) => (
                    <div key={index} className="flex-1">
                      {day}
                    </div>
                  ))}
                </div>

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
