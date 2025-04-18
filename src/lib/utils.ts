
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format number with comma separators
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Format date to locale string
export function formatDate(date: Date | string | null, options?: Intl.DateTimeFormatOptions): string {
  if (!date) return 'N/A';
  
  try {
    const parsedDate = typeof date === 'string' ? new Date(date) : date;
    
    // Check if date is valid
    if (isNaN(parsedDate.getTime())) {
      return 'Invalid date';
    }
    
    return parsedDate.toLocaleDateString(undefined, options);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
}

// Format time to locale string
export function formatTime(date: Date | string | null, options?: Intl.DateTimeFormatOptions): string {
  if (!date) return 'N/A';
  
  try {
    const parsedDate = typeof date === 'string' ? new Date(date) : date;
    
    // Check if date is valid
    if (isNaN(parsedDate.getTime())) {
      return 'Invalid time';
    }
    
    return parsedDate.toLocaleTimeString(undefined, options);
  } catch (error) {
    console.error('Error formatting time:', error);
    return 'Invalid time';
  }
}

// Format date and time together
export function formatDateTime(date: Date | string | null, options?: Intl.DateTimeFormatOptions): string {
  if (!date) return 'N/A';
  
  try {
    const parsedDate = typeof date === 'string' ? new Date(date) : date;
    
    // Check if date is valid
    if (isNaN(parsedDate.getTime())) {
      return 'Invalid datetime';
    }
    
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    
    return parsedDate.toLocaleString(undefined, options || defaultOptions);
  } catch (error) {
    console.error('Error formatting datetime:', error);
    return 'Invalid datetime';
  }
}

// Check if a date is valid
export function isValidDate(date: Date | string | null): boolean {
  if (!date) return false;
  
  try {
    const parsedDate = typeof date === 'string' ? new Date(date) : date;
    return !isNaN(parsedDate.getTime());
  } catch (error) {
    return false;
  }
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

// Format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Generate avatar initials
export function getInitials(name: string): string {
  if (!name) return '';
  
  const names = name.split(' ');
  
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }
  
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
}

// Debounce function for search inputs, etc.
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(later, wait);
  };
}
