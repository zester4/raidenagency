
export interface DateRange {
  from: Date;
  to?: Date;
}

// Validate a DateRange object
export function isValidDateRange(range: DateRange | undefined): boolean {
  if (!range) return false;
  if (!range.from || isNaN(range.from.getTime())) return false;
  if (range.to && isNaN(range.to.getTime())) return false;
  return true;
}

// Create empty date range
export function createEmptyDateRange(): DateRange {
  return {
    from: new Date(),
  };
}

// Create date range from start and end dates
export function createDateRange(from: Date | string | null, to?: Date | string | null): DateRange | undefined {
  if (!from) return undefined;
  
  try {
    const fromDate = typeof from === 'string' ? new Date(from) : from;
    
    if (isNaN(fromDate.getTime())) return undefined;
    
    if (!to) return { from: fromDate };
    
    const toDate = typeof to === 'string' ? new Date(to) : to;
    
    if (isNaN(toDate.getTime())) return { from: fromDate };
    
    return { from: fromDate, to: toDate };
  } catch (error) {
    console.error('Error creating date range:', error);
    return undefined;
  }
}
