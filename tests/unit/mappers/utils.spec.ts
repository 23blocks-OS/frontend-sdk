import { describe, it, expect } from 'vitest';
import {
  parseString,
  parseDate,
  parseBoolean,
  parseStringArray,
  parseNumber,
} from '../../../packages/block-authentication/src/lib/mappers/utils';

describe('Mapper Utils', () => {
  describe('parseString', () => {
    it('should return string for valid string input', () => {
      expect(parseString('hello')).toBe('hello');
      expect(parseString('test value')).toBe('test value');
    });

    it('should return empty string for null or undefined', () => {
      expect(parseString(null)).toBe('');
      expect(parseString(undefined)).toBe('');
    });

    it('should return empty string for empty string', () => {
      expect(parseString('')).toBe('');
    });

    it('should convert numbers to strings', () => {
      expect(parseString(123)).toBe('123');
      expect(parseString(0)).toBe('0');
    });

    it('should convert booleans to strings', () => {
      expect(parseString(true)).toBe('true');
      expect(parseString(false)).toBe('false');
    });
  });

  describe('parseDate', () => {
    it('should parse ISO date strings', () => {
      const result = parseDate('2024-01-15T10:30:00Z');
      expect(result).toBeInstanceOf(Date);
      expect(result?.toISOString()).toBe('2024-01-15T10:30:00.000Z');
    });

    it('should return Date objects unchanged', () => {
      const date = new Date('2024-01-15');
      expect(parseDate(date)).toBe(date);
    });

    it('should parse timestamps', () => {
      const timestamp = 1705315800000; // 2024-01-15T10:30:00Z
      const result = parseDate(timestamp);
      expect(result).toBeInstanceOf(Date);
      expect(result?.getTime()).toBe(timestamp);
    });

    it('should return current date for null or undefined', () => {
      const before = Date.now();
      const resultNull = parseDate(null);
      const resultUndef = parseDate(undefined);
      const after = Date.now();
      expect(resultNull).toBeInstanceOf(Date);
      expect(resultNull.getTime()).toBeGreaterThanOrEqual(before);
      expect(resultNull.getTime()).toBeLessThanOrEqual(after);
      expect(resultUndef).toBeInstanceOf(Date);
    });

    it('should return current date for invalid date strings', () => {
      const before = Date.now();
      const result = parseDate('not a date');
      const after = Date.now();
      expect(result).toBeInstanceOf(Date);
      expect(result.getTime()).toBeGreaterThanOrEqual(before);
      expect(result.getTime()).toBeLessThanOrEqual(after);
      expect(parseDate('invalid')).toBeInstanceOf(Date);
    });

    it('should return current date for objects', () => {
      expect(parseDate({})).toBeInstanceOf(Date);
      expect(parseDate([])).toBeInstanceOf(Date);
    });
  });

  describe('parseBoolean', () => {
    it('should return true for truthy values', () => {
      expect(parseBoolean(true)).toBe(true);
      expect(parseBoolean('true')).toBe(true);
      expect(parseBoolean('1')).toBe(true);
      expect(parseBoolean(1)).toBe(true);
    });

    it('should return false for falsy values', () => {
      expect(parseBoolean(false)).toBe(false);
      expect(parseBoolean('false')).toBe(false);
      expect(parseBoolean('0')).toBe(false);
      expect(parseBoolean(0)).toBe(false);
      expect(parseBoolean(null)).toBe(false);
      expect(parseBoolean(undefined)).toBe(false);
    });

    it('should return false for other values', () => {
      expect(parseBoolean('yes')).toBe(false);
      expect(parseBoolean('no')).toBe(false);
      expect(parseBoolean({})).toBe(false);
    });
  });

  describe('parseStringArray', () => {
    it('should return array of strings', () => {
      expect(parseStringArray(['a', 'b', 'c'])).toEqual(['a', 'b', 'c']);
    });

    it('should convert non-string elements to strings', () => {
      expect(parseStringArray([1, 2, 3])).toEqual(['1', '2', '3']);
      expect(parseStringArray([true, false])).toEqual(['true', 'false']);
    });

    it('should return empty array for non-array input', () => {
      expect(parseStringArray(null)).toEqual([]);
      expect(parseStringArray(undefined)).toEqual([]);
      expect(parseStringArray('string')).toEqual([]);
      expect(parseStringArray(123)).toEqual([]);
    });

    it('should handle empty arrays', () => {
      expect(parseStringArray([])).toEqual([]);
    });
  });

  describe('parseNumber', () => {
    it('should parse number values', () => {
      expect(parseNumber(42)).toBe(42);
      expect(parseNumber(3.14)).toBe(3.14);
      expect(parseNumber(0)).toBe(0);
      expect(parseNumber(-10)).toBe(-10);
    });

    it('should parse numeric strings', () => {
      expect(parseNumber('42')).toBe(42);
      expect(parseNumber('3.14')).toBe(3.14);
      expect(parseNumber('-10')).toBe(-10);
    });

    it('should return 0 for null or undefined', () => {
      expect(parseNumber(null)).toBe(0);
      expect(parseNumber(undefined)).toBe(0);
    });

    it('should return 0 for non-numeric strings', () => {
      expect(parseNumber('not a number')).toBe(0);
      expect(parseNumber('abc')).toBe(0);
    });

    it('should handle edge cases', () => {
      // Number('') === 0, so empty string returns 0
      expect(parseNumber('')).toBe(0);
    });
  });
});
