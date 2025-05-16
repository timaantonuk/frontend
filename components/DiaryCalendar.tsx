'use client';

import type React from 'react';

import { useRef, useMemo, useEffect, useState, useCallback } from 'react';
import { addDays, startOfWeek, format, startOfMonth } from 'date-fns';
import { ru } from 'date-fns/locale';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import WeekDayCell from '@/components/WeekDayCell';

import MonthDayCell from '@/components/MonthDayCell';
import { DiaryProvider, useDiary } from '@/app/contexts/diary-context';

type DiaryCalendarProps = {
  events?: Record<string, boolean>;
  onDateSelect?: (date: Date) => void;
};

const ANIMATION_DURATION = 0.3;

// Animation variants
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
  }),
};

function DiaryCalendarContent() {
  const { state, dispatch } = useDiary();
  const { viewDate, isExpanded, direction } = state;
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const calendarRef = useRef<HTMLDivElement>(null);

  // Minimum swipe distance (in px) to trigger navigation
  const minSwipeDistance = 50;

  const formatMonthYear = (date: Date) => format(date, 'LLLL yyyy', { locale: ru });

  const getWeekdayLabel = (date: Date) => {
    const label = format(date, 'EE', { locale: ru }).toLowerCase();
    return label === 'суб' ? label.slice(0, 1) + label.slice(2) : label.slice(0, 2);
  };

  // Generate calendar data for current view
  const currentWeekDays = useMemo(() => {
    const weekStart = startOfWeek(viewDate, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  }, [viewDate]);

  const currentMonthDays = useMemo(() => {
    const firstDay = startOfMonth(viewDate);
    const startDay = startOfWeek(firstDay, { weekStartsOn: 1 });
    return Array.from({ length: 35 }, (_, i) => addDays(startDay, i));
  }, [viewDate]);

  // Generate weekday headers (static)
  const weekdayHeaders = useMemo(() => {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => getWeekdayLabel(addDays(weekStart, i)));
  }, []);

  const monthAndYearToDisplay = formatMonthYear(viewDate);

  const navigateToPrevious = useCallback(() => {
    if (!state.isNavigating) {
      dispatch({ type: 'NAVIGATE_PREVIOUS' });
    }
  }, [dispatch, state.isNavigating]);

  const navigateToNext = useCallback(() => {
    if (!state.isNavigating) {
      dispatch({ type: 'NAVIGATE_NEXT' });
    }
  }, [dispatch, state.isNavigating]);

  const handleMonthClick = () => {
    dispatch({ type: 'TOGGLE_EXPANDED' });
  };

  // Touch event handlers for swipe detection
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      navigateToNext();
    } else if (isRightSwipe) {
      navigateToPrevious();
    }
  };

  // Mouse event handlers for swipe detection
  const [mouseDown, setMouseDown] = useState<number | null>(null);
  const [mouseUp, setMouseUp] = useState<number | null>(null);

  const onMouseDown = (e: React.MouseEvent) => {
    setMouseUp(null);
    setMouseDown(e.clientX);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (mouseDown === null) return;
    setMouseUp(e.clientX);
  };

  const onMouseUp = () => {
    if (!mouseDown || !mouseUp) return;

    const distance = mouseDown - mouseUp;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      navigateToNext();
    } else if (isRightSwipe) {
      navigateToPrevious();
    }

    setMouseDown(null);
    setMouseUp(null);
  };

  useEffect(() => {
    // Reset navigation state after animation completes
    if (state.isNavigating) {
      const timer = setTimeout(() => {
        dispatch({ type: 'RESET_NAVIGATION' });
      }, ANIMATION_DURATION * 1000);

      return () => clearTimeout(timer);
    }
  }, [state.isNavigating, dispatch]);

  // Create calendar content based on view mode
  const renderCalendarContent = () => {
    if (isExpanded) {
      return (
        <div className="w-full">
          <div className="grid grid-cols-7 mb-2 text-center text-sm text-gray-500">
            {weekdayHeaders.map((day, index) => (
              <div key={index}>{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {currentMonthDays.map(day => (
              <MonthDayCell key={day.toISOString()} day={day} />
            ))}
          </div>
        </div>
      );
    } else {
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
            {currentWeekDays.map(day => (
              <WeekDayCell key={day.toISOString()} day={day} />
            ))}
          </div>
        </div>
      );
    }
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
            className="fixed inset-0 bg-black z-[10]"
            onClick={() => dispatch({ type: 'TOGGLE_EXPANDED' })}
          />
        )}
      </AnimatePresence>

      {/* 👇 Relative wrapper keeps absolute calendar aligned */}
      <div className="relative w-full z-[20]">
        <div
          ref={calendarRef}
          className={`
            flex flex-col w-full rounded-2xl bg-white px-4 py-3 shadow-md overflow-hidden transition-all duration-700
            ${isExpanded ? 'absolute top-0 left-0 right-0 h-[22rem]' : 'relative h-[10rem]'}
          `}
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

            <div onClick={handleMonthClick} className="flex gap-1 items-center cursor-pointer">
              <p className="font-semibold text-lg">{monthAndYearToDisplay}</p>
              <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown size={15} />
              </motion.div>
            </div>

            <button
              onClick={navigateToNext}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Следующий период"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Calendar View with Swipe Animation */}
          <div
            className="relative overflow-hidden"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
          >
            <AnimatePresence initial={false} mode="sync" custom={direction}>
              <motion.div
                key={viewDate.toISOString()}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  duration: ANIMATION_DURATION,
                  ease: 'easeInOut',
                }}
                className="w-full"
              >
                {renderCalendarContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}

function DiaryCalendar({ events = {}, onDateSelect }: DiaryCalendarProps) {
  return (
    <DiaryProvider initialEvents={events} onDateSelect={onDateSelect}>
      <DiaryCalendarContent />
    </DiaryProvider>
  );
}

export default DiaryCalendar;
