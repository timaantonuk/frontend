'use client';

import type React from 'react';
import { createContext, useContext, useReducer, type ReactNode } from 'react';
import { addMonths, addWeeks, format, isSameMonth, startOfWeek } from 'date-fns';

// Types
type CalendarView = 'week' | 'month';

export type CalendarEvent = {
  id: string;
  date: string; // Format: "yyyy-MM-dd"
  title?: string;
};

type CalendarState = {
  selectedDate: Date;
  viewDate: Date;
  view: CalendarView;
  isExpanded: boolean;
  events: Record<string, boolean>;
  direction: number; // -1 for left, 1 for right, 0 for initial
  isAnimating: boolean;
  isVisible: boolean; // For initial appearance animation
};

type CalendarAction =
  | { type: 'SELECT_DATE'; payload: Date }
  | { type: 'PREVIOUS_PERIOD' }
  | { type: 'NEXT_PERIOD' }
  | { type: 'TOGGLE_EXPANDED' }
  | { type: 'SET_EVENTS'; payload: Record<string, boolean> }
  | { type: 'ANIMATION_COMPLETE' }
  | { type: 'SHOW_CALENDAR' };

// Initial state
const initialState: CalendarState = {
  selectedDate: new Date(),
  viewDate: new Date(),
  view: 'week',
  isExpanded: false,
  events: {},
  direction: 0,
  isAnimating: false,
  isVisible: false,
};

// Reducer
function calendarReducer(state: CalendarState, action: CalendarAction): CalendarState {
  switch (action.type) {
    case 'SELECT_DATE':
      // When selecting a date in month view
      if (state.isExpanded) {
        // Always use the exact date that was selected
        const selectedDate = action.payload;

        // If the selected date is from a different month than the current view
        if (!isSameMonth(selectedDate, state.viewDate)) {
          // Update the viewDate to the selected date's month
          return {
            ...state,
            selectedDate,
            viewDate: selectedDate,
            isExpanded: false, // Collapse to week view
          };
        }

        // If it's in the same month, use the start of the week
        const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });

        return {
          ...state,
          selectedDate,
          viewDate: weekStart,
          isExpanded: false, // Collapse to week view
        };
      }

      return {
        ...state,
        selectedDate: action.payload,
      };
    case 'PREVIOUS_PERIOD':
      // Prevent action during animation
      if (state.isAnimating) return state;

      return {
        ...state,
        direction: -1,
        isAnimating: true,
        viewDate: state.isExpanded ? addMonths(state.viewDate, -1) : addWeeks(state.viewDate, -1),
      };
    case 'NEXT_PERIOD':
      // Prevent action during animation
      if (state.isAnimating) return state;

      return {
        ...state,
        direction: 1,
        isAnimating: true,
        viewDate: state.isExpanded ? addMonths(state.viewDate, 1) : addWeeks(state.viewDate, 1),
      };
    case 'TOGGLE_EXPANDED':
      return {
        ...state,
        isExpanded: !state.isExpanded,
      };
    case 'SET_EVENTS':
      return {
        ...state,
        events: action.payload,
      };
    case 'ANIMATION_COMPLETE':
      return {
        ...state,
        isAnimating: false,
      };
    case 'SHOW_CALENDAR':
      return {
        ...state,
        isVisible: true,
      };
    default:
      return state;
  }
}

// Context
type CalendarContextType = {
  state: CalendarState;
  dispatch: React.Dispatch<CalendarAction>;
  hasEvent: (date: Date) => boolean;
  onDateSelect?: (date: Date) => void;
};

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

// Provider
export function CalendarProvider({
  children,
  initialEvents = {},
  onDateSelect,
}: {
  children: ReactNode;
  initialEvents?: Record<string, boolean>;
  onDateSelect?: (date: Date) => void;
}) {
  const [state, dispatch] = useReducer(calendarReducer, {
    ...initialState,
    events: initialEvents,
  });

  // Helper function to check if a date has an event
  const hasEvent = (date: Date): boolean => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return !!state.events[dateKey];
  };

  return (
    <CalendarContext.Provider value={{ state, dispatch, hasEvent, onDateSelect }}>
      {children}
    </CalendarContext.Provider>
  );
}

// Hook
export function useCalendar() {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
}
