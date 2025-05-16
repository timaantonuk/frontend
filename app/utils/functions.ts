import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

// Format date to month and year (e.g., "February, 2025")
export const formatMonthYear = (date: Date) => format(date, 'LLLL, yyyy', { locale: ru });

// Get two-letter weekday label (e.g., "пн", "вт")
export const getWeekdayLabel = (date: Date) => format(date, 'EE', { locale: ru }).slice(0, 2);
