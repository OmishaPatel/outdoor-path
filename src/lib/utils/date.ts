// ============================================
// Date Formatting Utilities
// Uses date-fns for consistent date/time formatting
// ============================================

import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns';

/**
 * Format event date for full display
 * @example "Saturday, June 15, 2026"
 */
export function formatEventDate(dateString: string): string {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return 'Invalid date';
    return format(date, 'EEEE, MMMM d, yyyy');
  } catch (error) {
    return 'Invalid date';
  }
}

/**
 * Format event date (short version)
 * @example "Jun 15, 2026"
 */
export function formatEventDateShort(dateString: string): string {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return 'Invalid date';
    return format(date, 'MMM d, yyyy');
  } catch (error) {
    return 'Invalid date';
  }
}

/**
 * Format time for display
 * @param timeString - Time in format "HH:MM:SS"
 * @example "9:00 AM"
 */
export function formatEventTime(timeString: string): string {
  try {
    // Create a date object with a dummy date and the provided time
    const date = new Date(`2000-01-01T${timeString}`);
    if (!isValid(date)) return 'Invalid time';
    return format(date, 'h:mm a');
  } catch (error) {
    return 'Invalid time';
  }
}

/**
 * Format time range for display
 * @example "9:00 AM - 2:00 PM"
 */
export function formatTimeRange(startTime: string, endTime?: string): string {
  const start = formatEventTime(startTime);
  if (!endTime) return start;
  const end = formatEventTime(endTime);
  return `${start} - ${end}`;
}

/**
 * Format relative time
 * @param dateString - ISO date string
 * @param prefix - Optional prefix (e.g., "Joined")
 * @example "Joined 2 hours ago"
 */
export function formatRelativeTime(dateString: string, prefix = ''): string {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return 'Invalid date';
    const relative = formatDistanceToNow(date, { addSuffix: true });
    return prefix ? `${prefix} ${relative}` : relative;
  } catch (error) {
    return 'Invalid date';
  }
}

/**
 * Check if event is in the past
 */
export function isEventPast(eventDate: string, endTime: string): boolean {
  try {
    const eventEnd = new Date(`${eventDate}T${endTime}`);
    return eventEnd < new Date();
  } catch (error) {
    return false;
  }
}

/**
 * Check if event is today
 */
export function isEventToday(eventDate: string): boolean {
  try {
    const event = parseISO(eventDate);
    const today = new Date();
    return format(event, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
  } catch (error) {
    return false;
  }
}
