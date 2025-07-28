import { getCurrentWeek } from './monthTime';
import { formatMonthDay } from './formatMonthDay';

jest.mock('./formatMonthDay');

describe('getCurrentWeek', () => {
  const mockFormatMonthDay = formatMonthDay as jest.MockedFunction<typeof formatMonthDay>;

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset to a known date: Monday, January 15, 2024
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-15'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return the correct week range for a Monday', () => {
    mockFormatMonthDay
      .mockReturnValueOnce('Jan 14') // Sunday
      .mockReturnValueOnce('Jan 20'); // Saturday

    expect(getCurrentWeek()).toBe('Jan 14 - Jan 20');
    expect(mockFormatMonthDay).toHaveBeenCalledTimes(2);
  });

  it('should handle week spanning different months', () => {
    // Set date to Tuesday, January 30, 2024
    jest.setSystemTime(new Date('2024-01-30'));

    mockFormatMonthDay
      .mockReturnValueOnce('Jan 28') // Sunday
      .mockReturnValueOnce('Feb 3'); // Saturday

    expect(getCurrentWeek()).toBe('Jan 28 - Feb 3');
  });

  it('should handle week spanning different years', () => {
    // Set date to Monday, December 30, 2024
    jest.setSystemTime(new Date('2024-12-30'));

    mockFormatMonthDay
      .mockReturnValueOnce('Dec 29') // Sunday
      .mockReturnValueOnce('Jan 4'); // Saturday

    expect(getCurrentWeek()).toBe('Dec 29 - Jan 4');
  });

  it('should handle Sunday as first day of week', () => {
    // Set date to Sunday, January 14, 2024
    jest.setSystemTime(new Date('2024-01-14'));

    mockFormatMonthDay
      .mockReturnValueOnce('Jan 14') // Sunday
      .mockReturnValueOnce('Jan 20'); // Saturday

    expect(getCurrentWeek()).toBe('Jan 14 - Jan 20');
  });

  it('should handle Saturday as last day of week', () => {
    // Set date to Saturday, January 20, 2024
    jest.setSystemTime(new Date('2024-01-20'));

    mockFormatMonthDay
      .mockReturnValueOnce('Jan 14') // Sunday
      .mockReturnValueOnce('Jan 20'); // Saturday

    expect(getCurrentWeek()).toBe('Jan 14 - Jan 20');
  });
});