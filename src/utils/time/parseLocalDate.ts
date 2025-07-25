/**
 * Parses a date string in local timezone to avoid timezone shift issues.
 *
 * This function handles date strings that might come from APIs in ISO format
 * and ensures they are parsed in the local timezone rather than UTC,
 * preventing off-by-one day errors.
 *
 * @param dateInput - Date string (YYYY-MM-DD or ISO format) or Date object
 * @returns Date object parsed in local timezone
 */
export function parseLocalDate(dateInput: string | Date): Date {
  if (dateInput instanceof Date) {
    // If it's already a Date object, check if it might have timezone issues
    // by converting to string and parsing back in local timezone
    const dateStr = dateInput.toISOString().split("T")[0];
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day); // month is 0-indexed
  }

  // If it's an ISO string with time component, extract just the date part
  const dateStr = dateInput.split("T")[0];

  // Parse in local timezone
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day); // month is 0-indexed
}
