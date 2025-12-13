/**
 * Parse a string value, returning undefined for empty/undefined
 */
export function parseString(value: unknown): string | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }
  const str = String(value);
  return str.length > 0 ? str : undefined;
}

/**
 * Parse a date value
 */
export function parseDate(value: unknown): Date | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }

  if (value instanceof Date) {
    return value;
  }

  if (typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value);
    return isNaN(date.getTime()) ? undefined : date;
  }

  return undefined;
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
export function parseStringArray(value: unknown): string[] | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }
  if (Array.isArray(value)) {
    return value.map(String);
  }
  return undefined;
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

/**
 * Parse an optional number value
 */
export function parseOptionalNumber(value: unknown): number | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }
  const num = Number(value);
  return isNaN(num) ? undefined : num;
}

/**
 * Parse entity status
 */
export function parseStatus(value: unknown): 'active' | 'inactive' | 'pending' | 'archived' | 'deleted' {
  const status = parseString(value);
  if (status === 'active' || status === 'inactive' || status === 'pending' || status === 'archived' || status === 'deleted') {
    return status;
  }
  return 'active';
}

/**
 * Parse enrollment status
 */
export function parseEnrollmentStatus(value: unknown): 'enrolled' | 'in_progress' | 'completed' | 'dropped' {
  const status = parseString(value);
  if (status === 'enrolled' || status === 'in_progress' || status === 'completed' || status === 'dropped') {
    return status;
  }
  return 'enrolled';
}

/**
 * Parse submission status
 */
export function parseSubmissionStatus(value: unknown): 'submitted' | 'grading' | 'graded' {
  const status = parseString(value);
  if (status === 'submitted' || status === 'grading' || status === 'graded') {
    return status;
  }
  return 'submitted';
}

/**
 * Parse lesson content type
 */
export function parseLessonContentType(value: unknown): 'video' | 'text' | 'quiz' | undefined {
  const contentType = parseString(value);
  if (contentType === 'video' || contentType === 'text' || contentType === 'quiz') {
    return contentType;
  }
  return undefined;
}
