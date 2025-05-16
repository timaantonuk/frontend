'use client';

import type React from 'react';
import { createContext, useContext, useReducer, type ReactNode } from 'react';
import { addMonths, addWeeks, format } from 'date-fns';

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
};

type CalendarAction =
  | { type: 'SELECT_DATE'; payload: Date }
  | { type: 'PREVIOUS_PERIOD' }
  | { type: 'NEXT_PERIOD' }
  | { type: 'TOGGLE_EXPANDED' }
  | { type: 'SET_EVENTS'; payload: Record<string, boolean> }
  | { type: 'ANIMATION_COMPLETE' };

// Initial state
const initialState: CalendarState = {
  selectedDate: new Date(),
  viewDate: new Date(),
  view: 'week',
  isExpanded: false,
  events: {},
  direction: 0,
  isAnimating: false,
};

// Reducer
function calendarReducer(state: CalendarState, action: CalendarAction): CalendarState {
  switch (action.type) {
    case 'SELECT_DATE':
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
