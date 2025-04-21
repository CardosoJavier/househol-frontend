export function formatMonthDay(date: Date) : string {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}