export function formatMonthDay(date: Date): string {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
        throw new Error('Invalid date');
    }
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}