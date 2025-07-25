# Date Display Fix

## Problem

Tasks were showing dates that were one day off from what was expected. For example:

- Task due date set to July 27
- Task displaying as July 26

## Root Cause

The issue was caused by timezone handling when parsing dates from the API:

1. **API Response**: The API returns dates as ISO strings (e.g., `"2025-07-27T00:00:00.000Z"`)
2. **Parsing Issue**: Using `new Date(dateString)` parses ISO strings as UTC time
3. **Display Issue**: When converting back to local time for display, the date could shift by one day depending on the user's timezone

## Solution

Created a `parseLocalDate` utility function that ensures dates are always parsed in the local timezone:

### Key Changes

1. **New Utility Function**: `src/utils/time/parseLocalDate.ts`

   - Extracts the date part (YYYY-MM-DD) from ISO strings
   - Parses dates using local timezone constructors
   - Handles both string and Date object inputs

2. **Updated Components**:
   - `Task.tsx`: Uses `parseLocalDate` for displaying due dates
   - `Board.tsx`: Uses `parseLocalDate` for date sorting
   - `verifyDTicketProps.ts`: Uses `parseLocalDate` for converting API responses

### Technical Details

```typescript
// ❌ BEFORE: Could cause timezone issues
const displayDate = new Date(apiDateString); // Parsed as UTC
formatMonthDay(displayDate); // Could be off by one day

// ✅ AFTER: Always uses local timezone
const displayDate = parseLocalDate(apiDateString); // Parsed in local timezone
formatMonthDay(displayDate); // Correct date display
```

### How It Works

The `parseLocalDate` function:

1. **For ISO strings**: Extracts just the date part (`"2025-07-27"`)
2. **Parses in local timezone**: Uses `new Date(year, month-1, day)`
3. **For Date objects**: Normalizes to ensure local timezone interpretation
4. **Consistent output**: Always returns a Date object representing the correct day in local timezone

## Verification

All existing tests pass, and the date display now correctly shows:

- July 27 task → displays as "Jul 27"
- No more off-by-one day errors
- Consistent behavior across all timezones

## Files Modified

- `src/utils/time/parseLocalDate.ts` (new)
- `src/utils/index.ts` (export added)
- `src/components/board/Task.tsx` (date display)
- `src/pages/board/Board.tsx` (date sorting)
- `src/utils/tasks/verifyDTicketProps.ts` (API response parsing)
