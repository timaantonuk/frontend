'use client';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCalendar } from '@/app/contexts/calendar-context';

export function CalendarHeader() {
  const { state, dispatch } = useCalendar();
  const { viewDate, isExpanded, isAnimating } = state;

  const formatMonthYear = (date: Date) => {
    return format(date, 'LLLL yyyy', { locale: ru });
  };

  const handlePrevious = () => {
    if (!isAnimating) {
      dispatch({ type: 'PREVIOUS_PERIOD' });
    }
  };

  const handleNext = () => {
    if (!isAnimating) {
      dispatch({ type: 'NEXT_PERIOD' });
    }
  };

  const handleToggleView = () => {
    dispatch({ type: 'TOGGLE_EXPANDED' });
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <button
        onClick={handlePrevious}
        className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Предыдущий период"
        disabled={isAnimating}
      >
        <ChevronLeft size={20} />
      </button>

      <div onClick={handleToggleView} className="flex gap-1 items-center cursor-pointer">
        <p className="font-semibold text-lg">{formatMonthYear(viewDate)}</p>
        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={15} />
        </motion.div>
      </div>

      <button
        onClick={handleNext}
        className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Следующий период"
        disabled={isAnimating}
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
