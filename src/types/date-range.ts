
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
