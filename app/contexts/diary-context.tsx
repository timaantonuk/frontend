'use client';

import type React from 'react';

import { createContext, useContext, useReducer, type ReactNode } from 'react';
import { addMonths, addWeeks } from 'date-fns';

// Define the state type
type DiaryState = {
  selectedDate: Date;
  viewDate: Date;
  isExpanded: boolean;
  events: Record<string, boolean>;
  isNavigating: boolean;
  direction: number; // -1 for left, 1 for right
};

// Define action types
type DiaryAction =
  | { type: 'SELECT_DATE'; payload: Date }
  | { type: 'NAVIGATE_PREVIOUS' }
  | { type: 'NAVIGATE_NEXT' }
  | { type: 'TOGGLE_EXPANDED' }
  | { type: 'SET_EVENTS'; payload: Record<string, boolean> }
  | { type: 'RESET_NAVIGATION' }
  | { type: 'SET_DIRECTION'; payload: number };

// Create initial state
const initialState: DiaryState = {
  selectedDate: new Date(),
  viewDate: new Date(),
  isExpanded: false,
  events: {},
  isNavigating: false,
  direction: 0,
};

// Create reducer function
function diaryReducer(state: DiaryState, action: DiaryAction): DiaryState {
  switch (action.type) {
    case 'SELECT_DATE':
      return {
        ...state,
        selectedDate: action.payload,
        viewDate: action.payload,
      };
    case 'NAVIGATE_PREVIOUS':
      // Prevent multiple rapid transitions
      if (state.isNavigating) return state;
      return {
        ...state,
        isNavigating: true,
        direction: -1,
        viewDate: state.isExpanded ? addMonths(state.viewDate, -1) : addWeeks(state.viewDate, -1),
      };
    case 'NAVIGATE_NEXT':
      // Prevent multiple rapid transitions
      if (state.isNavigating) return state;
      return {
        ...state,
        isNavigating: true,
        direction: 1,
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
    case 'RESET_NAVIGATION':
      return {
        ...state,
        isNavigating: false,
      };
    case 'SET_DIRECTION':
      return {
        ...state,
        direction: action.payload,
      };
    default:
      return state;
  }
}

// Create context
type DiaryContextType = {
  state: DiaryState;
  dispatch: React.Dispatch<DiaryAction>;
  onDateSelect?: (date: Date) => void;
};

const DiaryContext = createContext<DiaryContextType | undefined>(undefined);

// Create provider component
export function DiaryProvider({
  children,
  initialEvents = {},
  onDateSelect,
}: {
  children: ReactNode;
  initialEvents?: Record<string, boolean>;
  onDateSelect?: (date: Date) => void;
}) {
  const [state, dispatch] = useReducer(diaryReducer, {
    ...initialState,
    events: initialEvents,
  });

  return (
    <DiaryContext.Provider value={{ state, dispatch, onDateSelect }}>
      {children}
    </DiaryContext.Provider>
  );
}

// Create custom hook for using the context
export function useDiary() {
  const context = useContext(DiaryContext);
  if (context === undefined) {
    throw new Error('useDiary must be used within a DiaryProvider');
  }
  return context;
}
