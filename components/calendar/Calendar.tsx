'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarHeader } from './CalendarHeader';
import { CalendarGrid } from './CalendarGrid';
import { SwipeDetector } from './SwipeDetector';
import { CalendarProvider, useCalendar } from '@/app/contexts/calendar-context';

type CalendarProps = {
  events?: Record<string, boolean>;
  onDateSelect?: (date: Date) => void;
  className?: string;
};

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

// Animation for expand/collapse
const expandVariants = {
  collapsed: { height: '10rem' },
  expanded: { height: '22rem' },
};

// Initial appearance animation
const appearanceVariants = {
  hidden: {
    opacity: 0,
    y: -20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1], // Custom cubic-bezier for a pleasant spring-like effect
    },
  },
};

function CalendarContent() {
  const { state, dispatch } = useCalendar();
  const { viewDate, isExpanded, direction, isAnimating, isVisible } = state;

  // Trigger initial appearance animation
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch({ type: 'SHOW_CALENDAR' });
    }, 100);

    return () => clearTimeout(timer);
  }, [dispatch]);

  // Handle animation completion
  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        dispatch({ type: 'ANIMATION_COMPLETE' });
      }, 500); // Increased animation duration

      return () => clearTimeout(timer);
    }
  }, [isAnimating, dispatch]);

  const handleSwipeLeft = () => {
    if (!isAnimating) {
      dispatch({ type: 'NEXT_PERIOD' });
    }
  };

  const handleSwipeRight = () => {
    if (!isAnimating) {
      dispatch({ type: 'PREVIOUS_PERIOD' });
    }
  };

  return (
    <>
      {/* Backdrop for expanded view */}
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

      {/* Calendar container with initial appearance animation */}
      <div className="relative w-full z-[20]">
        <motion.div
          variants={appearanceVariants}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
        >
          <motion.div
            variants={expandVariants}
            initial="collapsed"
            animate={isExpanded ? 'expanded' : 'collapsed'}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className={`
              flex flex-col w-full rounded-2xl bg-white px-4 py-3 shadow-md overflow-hidden
              ${isExpanded ? 'absolute top-0 left-0 right-0' : 'relative'}
            `}
          >
            <CalendarHeader />

            <div className="relative overflow-hidden flex-1">
              <SwipeDetector
                onSwipeLeft={handleSwipeLeft}
                onSwipeRight={handleSwipeRight}
                disabled={isAnimating}
              >
                <AnimatePresence initial={false} mode="sync" custom={direction}>
                  <motion.div
                    key={viewDate.toISOString() + (isExpanded ? '-month' : '-week')}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      duration: 0.5, // Slower animation
                      ease: 'easeInOut',
                    }}
                    className="w-full absolute left-0 right-0"
                  >
                    <CalendarGrid isMonthView={isExpanded} />
                  </motion.div>
                </AnimatePresence>
              </SwipeDetector>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}

export function Calendar({ events = {}, onDateSelect, className = '' }: CalendarProps) {
  return (
    <div className={className}>
      <CalendarProvider initialEvents={events} onDateSelect={onDateSelect}>
        <CalendarContent />
      </CalendarProvider>
    </div>
  );
}
