import { formatMonthDay } from "./formatMonthDay";

export function getCurrentWeek(): string {
    
    const today = new Date();
    const currentWeekDay = today.getDay();

    // Calculate start of week
    // Get current day and subtract days needed for start of week (sunday)
    const weekStart = new Date();
    weekStart.setDate(today.getDate() - currentWeekDay);

    // Calculate end of week
    // Get current day and add days needed for end of week (saturday)
    const endWeek = new Date();
    endWeek.setDate(today.getDate() + (6 - today.getDay()))

    return `${formatMonthDay(weekStart) + " - " + formatMonthDay(endWeek)}`
}