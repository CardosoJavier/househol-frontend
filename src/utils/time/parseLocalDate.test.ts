import { parseLocalDate } from './parseLocalDate';

describe('parseLocalDate', () => {
  beforeAll(() => {
    // Set timezone to a known value for consistent testing
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-15T12:00:00Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('handling string inputs', () => {
    it('should parse YYYY-MM-DD format correctly', () => {
      const result = parseLocalDate('2024-01-15');
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(0); // January is 0
      expect(result.getDate()).toBe(15);
    });

    it('should parse ISO format with time component', () => {
      const result = parseLocalDate('2024-01-15T14:30:00Z');
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(0);
      expect(result.getDate()).toBe(15);
    });

    it('should handle different months correctly', () => {
      const result = parseLocalDate('2024-12-31');
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(11); // December is 11
      expect(result.getDate()).toBe(31);
    });

    it('should handle leap year dates', () => {
      const result = parseLocalDate('2024-02-29');
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(1); // February is 1
      expect(result.getDate()).toBe(29);
    });
  });

  describe('handling Date object inputs', () => {
    it('should throw error for invalid Date object', () => {
      const invalidDate = new Date('invalid');
      expect(() => parseLocalDate(invalidDate)).toThrow('Invalid date format');
    });

    it('should handle Date object input', () => {
      const inputDate = new Date('2024-01-15T00:00:00Z');
      const result = parseLocalDate(inputDate);
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(0);
      expect(result.getDate()).toBe(15);
    });

    it('should preserve local date when parsing Date object with timezone offset', () => {
      const inputDate = new Date('2024-01-15T23:59:59Z');
      const result = parseLocalDate(inputDate);
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(0);
      expect(result.getDate()).toBe(15);
    });
  });

  describe('error handling', () => {
    it('should throw error for invalid date string format', () => {
      const invalidInputs = [
        'invalid-date',
        '',
        '2024/01/01',
        'Jan 1, 2024',
        'not a date',
        '2024-1',
        '2024'
      ];
      invalidInputs.forEach(input => {
        expect(() => parseLocalDate(input)).toThrow();
      });
    });

    it('should throw error for invalid month', () => {
      const invalidMonths = [
        '2024-13-01', // Month > 12
        '2024-00-01', // Month < 1
        '2024-0-01',  // Invalid format
        '2024--01'    // Missing month
      ];
      invalidMonths.forEach(date => {
        expect(() => parseLocalDate(date)).toThrow('Invalid date format');
      });
    });

    it('should throw error for invalid day', () => {
      const invalidDays = [
        '2024-04-31', // April has 30 days
        '2024-06-31', // June has 30 days
        '2024-09-31', // September has 30 days
        '2024-11-31', // November has 30 days
        '2024-02-30', // February never has 30 days
        '2023-02-29', // Not a leap year
        '2024-01-32', // No month has 32 days
        '2024-01-00', // Day cannot be 0
        '2024-01-'    // Missing day
      ];
      invalidDays.forEach(date => {
        expect(() => parseLocalDate(date)).toThrow('Invalid date format');
      });
    });
  });

  describe('timezone handling', () => {
    it('should handle dates near timezone boundaries', () => {
      // Test with a date string that might be affected by timezone conversion
      const result = parseLocalDate('2024-01-01T00:00:00Z');
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(0);
      expect(result.getDate()).toBe(1);
    });

    it('should maintain consistent date regardless of local time', () => {
      const morning = parseLocalDate('2024-06-15T06:00:00Z');
      const evening = parseLocalDate('2024-06-15T18:00:00Z');
      
      expect(morning.getFullYear()).toBe(2024);
      expect(morning.getMonth()).toBe(5); // June is 5
      expect(morning.getDate()).toBe(15);
      
      expect(evening.getFullYear()).toBe(2024);
      expect(evening.getMonth()).toBe(5);
      expect(evening.getDate()).toBe(15);
    });
  });
});