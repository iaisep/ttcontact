import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date to a string representation based on locale
 * @param date Date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date | number | string): string {
  // Handle different input types
  let dateObj: Date;
  
  try {
    if (!date) {
      console.warn('Null or undefined date input');
      return "Unknown date";
    }
    
    if (typeof date === "number") {
      // Handle timestamp in milliseconds
      dateObj = new Date(date);
    } else if (typeof date === "string") {
      // Check if it's already a formatted date string (e.g. "Jan 1, 2023")
      if (date.includes(',') && /[a-zA-Z]/.test(date)) {
        return date; // Already formatted, return as is
      }
      
      // Try to parse the string as a date
      if (date.match(/^\d+$/)) {
        // If it's just a numeric string, treat as timestamp
        dateObj = new Date(parseInt(date, 10));
      } else {
        // Otherwise parse as date string
        dateObj = new Date(date);
      }
    } else {
      dateObj = date;
    }
    
    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      console.warn("Invalid date format:", date);
      return "Invalid date";
    }
    
    // Format the date based on locale
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(dateObj);
  } catch (error) {
    console.error("Error formatting date:", error, date);
    return "Unknown date";
  }
}

/**
 * Format a timestamp to a date and time string
 * @param timestamp Timestamp in milliseconds
 * @returns Object with formatted date and time strings
 */
export function formatTimestamp(timestamp: number | string): { date: string; time: string } {
  try {
    // Handle null/undefined
    if (!timestamp) {
      console.warn("Null or undefined timestamp");
      return { date: "Unknown date", time: "00:00" };
    }
    
    // Convert string to number if needed
    const ts = typeof timestamp === "string" ? parseInt(timestamp, 10) : timestamp;
    
    // Check for NaN after conversion
    if (isNaN(ts)) {
      console.warn("Invalid timestamp (NaN):", timestamp);
      return { date: "Unknown date", time: "00:00" };
    }
    
    const date = new Date(ts);
    
    // Validate date
    if (isNaN(date.getTime())) {
      console.warn("Invalid timestamp (invalid Date):", timestamp);
      return { date: "Unknown date", time: "00:00" };
    }

    return {
      date: new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "numeric",
        day: "numeric"
      }).format(date),
      time: new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      }).format(date)
    };
  } catch (error) {
    console.error("Error formatting timestamp:", error, timestamp);
    return { date: "Unknown date", time: "00:00" };
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

// Add the formatDuration utility function
export function formatDuration(duration: string | number): string {
  const durationInSeconds = typeof duration === "string" 
    ? parseInt(duration, 10) 
    : duration;
  
  if (isNaN(durationInSeconds)) {
    return "00:00";
  }
  
  const minutes = Math.floor(durationInSeconds / 60);
  const seconds = durationInSeconds % 60;
  
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

// Deep merge function for objects (used to combine translation files)
export function mergeDeep(target: any, ...sources: any[]): any {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
}

function isObject(item: any): boolean {
  return (item && typeof item === 'object' && !Array.isArray(item));
}
