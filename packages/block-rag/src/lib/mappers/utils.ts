/**
 * Parse a string value, returning null for empty/undefined
 */
export function parseString(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }
  const str = String(value);
  return str.length > 0 ? str : '';
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
