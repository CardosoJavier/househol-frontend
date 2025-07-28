import { formatMonthDay } from "./formatMonthDay";

describe("formatMonthDay", () => {
  beforeAll(() => {
    // Mock toLocaleDateString to return consistent output
    const mockToLocaleDateString = jest.spyOn(
      Date.prototype,
      "toLocaleDateString"
    );
    mockToLocaleDateString.mockImplementation(function (this: Date) {
      const month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(
        this
      );
      const day = this.getDate();
      return `${month} ${day}`;
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("should format date to Month Day format", () => {
    const testDate = new Date("2024-01-15T00:00:00");
    expect(formatMonthDay(testDate)).toBe("Jan 15");
  });

  it("should handle single digit days", () => {
    const testDate = new Date("2024-01-05T00:00:00");
    expect(formatMonthDay(testDate)).toBe("Jan 5");
  });

  it("should handle different months", () => {
    const dates = [
      { input: new Date("2024-03-15T00:00:00"), expected: "Mar 15" },
      { input: new Date("2024-07-20T00:00:00"), expected: "Jul 20" },
      { input: new Date("2024-12-25T00:00:00"), expected: "Dec 25" },
    ];

    dates.forEach(({ input, expected }) => {
      expect(formatMonthDay(input)).toBe(expected);
    });
  });

  it("should handle year transitions", () => {
    const testDate = new Date("2024-12-31T00:00:00");
    expect(formatMonthDay(testDate)).toBe("Dec 31");

    const newYearDate = new Date("2025-01-01T00:00:00");
    expect(formatMonthDay(newYearDate)).toBe("Jan 1");
  });

  it("should handle leap year dates", () => {
    const leapYearDate = new Date("2024-02-29T00:00:00");
    expect(formatMonthDay(leapYearDate)).toBe("Feb 29");
  });

  it("should throw error for invalid date", () => {
    const invalidDate = new Date("invalid");
    expect(() => formatMonthDay(invalidDate)).toThrow("Invalid date");
  });
});
