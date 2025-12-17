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

    it('should return null for null or undefined', () => {
      expect(parseString(null)).toBeNull();
      expect(parseString(undefined)).toBeNull();
    });

    it('should return null for empty string', () => {
      expect(parseString('')).toBeNull();
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

    it('should return null for null or undefined', () => {
      expect(parseDate(null)).toBeNull();
      expect(parseDate(undefined)).toBeNull();
    });

    it('should return null for invalid date strings', () => {
      expect(parseDate('not a date')).toBeNull();
      expect(parseDate('invalid')).toBeNull();
    });

    it('should return null for objects', () => {
      expect(parseDate({})).toBeNull();
      expect(parseDate([])).toBeNull();
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

    it('should return null for null or undefined', () => {
      expect(parseNumber(null)).toBeNull();
      expect(parseNumber(undefined)).toBeNull();
    });

    it('should return null for non-numeric strings', () => {
      expect(parseNumber('not a number')).toBeNull();
      expect(parseNumber('abc')).toBeNull();
    });

    it('should handle edge cases', () => {
      // Number('') === 0, so empty string returns 0 (not null)
      expect(parseNumber('')).toBe(0);
    });
  });
});
