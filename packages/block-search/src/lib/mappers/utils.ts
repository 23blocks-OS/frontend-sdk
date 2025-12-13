/**
 * Parse a string value, returning null for empty/undefined
 */
export function parseString(value: unknown): string | null {
  if (value === null || value === undefined) {
    return null;
  }
  const str = String(value);
  return str.length > 0 ? str : null;
}

/**
 * Parse a date value
 */
export function parseDate(value: unknown): Date | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (value instanceof Date) {
    return value;
  }

  if (typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  }

  return null;
}

/**
 * Parse a boolean value
 */
export function parseBoolean(value: unknown): boolean {
  if (typeof value === 'boolean') {
    return value;
  }
  if (value === 'true' || value === '1' || value === 1) {
    return true;
  }
  return false;
}

/**
 * Parse an array of strings
 */
export function parseStringArray(value: unknown): string[] | null {
  if (value === null || value === undefined) {
    return null;
  }
  if (Array.isArray(value)) {
    return value.map(String);
  }
  return null;
}

/**
 * Parse a number value
 */
export function parseNumber(value: unknown): number {
  if (value === null || value === undefined) {
    return 0;
  }
  const num = Number(value);
  return isNaN(num) ? 0 : num;
}
