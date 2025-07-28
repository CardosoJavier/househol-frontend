/**
 * Parses a date string in local timezone to avoid timezone shift issues.
 *
 * This function handles date strings that might come from APIs in ISO format
 * and ensures they are parsed in the local timezone rather than UTC,
 * preventing off-by-one day errors.
 *
 * @param dateInput - Date string (YYYY-MM-DD or ISO format) or Date object
 * @returns Date object parsed in local timezone
 * @throws Error if the date is invalid
 */
export function parseLocalDate(dateInput: string | Date): Date {
  try {
    if (dateInput instanceof Date) {
      // If it's already a Date object, check if it might have timezone issues
      // by converting to string and parsing back in local timezone
      if (isNaN(dateInput.getTime())) {
        throw new Error('Invalid date object');
      }
      const dateStr = dateInput.toISOString().split("T")[0];
      const [year, month, day] = dateStr.split("-").map(Number);
      const result = new Date(year, month - 1, day); // month is 0-indexed
      
      // Validate the resulting date
      if (result.getMonth() !== month - 1 || result.getDate() !== day) {
        throw new Error('Invalid date components');
      }
      return result;
    }

    // If it's an ISO string with time component, extract just the date part
    const dateStr = dateInput.split("T")[0];
    const [year, month, day] = dateStr.split("-").map(Number);

    if (!year || !month || !day || month < 1 || month > 12) {
      throw new Error('Invalid date format');
    }

    const result = new Date(year, month - 1, day); // month is 0-indexed

    // Validate the resulting date by checking if the components match
    // This will catch invalid days (e.g., April 31)
    if (result.getMonth() !== month - 1 || result.getDate() !== day) {
      throw new Error('Invalid date components');
    }

    return result;
  } catch (error) {
    throw new Error('Invalid date format');
  }
}
