/**
 * RFC 4122 UUID format validation.
 *
 * The 23blocks backend stores `unique_id` fields as PostgreSQL UUID type and
 * rejects non-UUID values with 400 Bad Request. The SDK validates these
 * client-side so consumers fail fast with a clear error instead of receiving
 * an opaque database error.
 *
 * Accepts UUIDs in canonical form with hyphens: `xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx`
 * where M is the version (1-5) and N is the variant (8, 9, a, or b).
 *
 * For consumers who need non-UUID identifiers (slugs, codes, external system
 * IDs), the backend exposes `reference`, `source_id`, and `source_alias`
 * fields on most resources — not `unique_id`.
 */
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isUuid(value: unknown): value is string {
  return typeof value === 'string' && UUID_REGEX.test(value);
}

/**
 * Validates that a value is a valid RFC 4122 UUID. Throws with a clear,
 * actionable error message if not. Use at SDK method entry points where the
 * value is forwarded to an endpoint whose backing column is a PostgreSQL UUID.
 *
 * @param value - The value to validate
 * @param fieldName - Name of the field for the error message (e.g., `'uniqueId'`, `'contextUniqueId'`)
 * @throws {TypeError} If the value is not a valid UUID
 */
export function assertUuid(value: unknown, fieldName: string): asserts value is string {
  if (!isUuid(value)) {
    throw new TypeError(
      `[@23blocks] ${fieldName} must be a valid RFC 4122 UUID. ` +
        `Example: "550e8400-e29b-41d4-a716-446655440000". ` +
        `Received: ${JSON.stringify(value)}. ` +
        `For non-UUID identifiers, use fields like reference, source_id, or source_alias.`,
    );
  }
}
