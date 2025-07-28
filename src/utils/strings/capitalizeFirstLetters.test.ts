import capitalizeFirstLetter from './capitalizeFirstLetters';

describe('capitalizeFirstLetter', () => {
  it('should capitalize the first letter of a string', () => {
    expect(capitalizeFirstLetter('hello')).toBe('Hello');
    expect(capitalizeFirstLetter('world')).toBe('World');
  });

  it('should handle empty string', () => {
    expect(capitalizeFirstLetter('')).toBe('');
  });

  it('should handle null or undefined', () => {
    expect(capitalizeFirstLetter(null as unknown as string)).toBe(null);
    expect(capitalizeFirstLetter(undefined as unknown as string)).toBe(undefined);
  });

  it('should handle single character', () => {
    expect(capitalizeFirstLetter('a')).toBe('A');
  });

  it('should not modify already capitalized string', () => {
    expect(capitalizeFirstLetter('Hello')).toBe('Hello');
  });

  it('should handle string with numbers', () => {
    expect(capitalizeFirstLetter('123abc')).toBe('123abc');
  });

  it('should handle string with special characters', () => {
    expect(capitalizeFirstLetter('@test')).toBe('@test');
  });
});