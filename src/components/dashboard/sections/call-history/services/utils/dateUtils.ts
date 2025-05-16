/**
 * Utility functions for date and timestamp handling
 */

/**
 * Parse a date safely, returning a valid date string
 * @param dateValue The date to parse
 * @returns A valid date string or current date if invalid
 */
export const safelyParseDate = (dateValue: any): string => {
  if (!dateValue) return new Date().toLocaleDateString();
  
  try {
    const date = new Date(dateValue);
    // Check if the resulting date is valid
    if (isNaN(date.getTime())) {
      console.warn('Invalid date value:', dateValue);
      return new Date().toLocaleDateString();
    }
    return date.toLocaleDateString();
  } catch (e) {
    console.warn('Error parsing date:', dateValue);
    return new Date().toLocaleDateString();
  }
};

/**
 * Process timestamp from API data
 * @param timestamp Timestamp in milliseconds or ISO string
 * @returns Formatted date and time
 */
export const processTimestamp = (timestamp: string | number | undefined): { date: string, time: string } => {
  // If no timestamp, return current date/time
  if (!timestamp) {
    console.log('Missing timestamp, using current date/time');
    return formatTimestamp(Date.now());
  }
  
  console.log('Processing timestamp:', timestamp, typeof timestamp);
  
  try {
    // If it's a number as string (typical API response)
    if (typeof timestamp === 'string' && /^\d+$/.test(timestamp)) {
      return formatTimestamp(parseInt(timestamp, 10));
    }
    
    // If it's already a number
    if (typeof timestamp === 'number') {
      return formatTimestamp(timestamp);
    }
    
    // Otherwise try to parse as a date string
    const dateObj = new Date(timestamp);
    if (!isNaN(dateObj.getTime())) {
      return formatTimestamp(dateObj.getTime());
    }
    
    console.warn('Could not parse timestamp:', timestamp);
    return { date: new Date().toLocaleDateString(), time: new Date().toLocaleTimeString() };
  } catch (e) {
    console.error('Error processing timestamp:', e, timestamp);
    return { date: new Date().toLocaleDateString(), time: new Date().toLocaleTimeString() };
  }
};

// Import the utility function from the main utils
import { formatTimestamp } from '@/lib/utils';
