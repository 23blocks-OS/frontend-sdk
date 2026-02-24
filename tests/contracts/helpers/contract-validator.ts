import type { RecordedRequest } from '@23blocks/testing';

/**
 * Assert that the request used the expected HTTP method.
 * Also enforces the global rule: PATCH is never allowed.
 */
export function assertCorrectMethod(
  request: RecordedRequest,
  expectedMethod: string,
  label: string
): void {
  if (request.method === 'PATCH') {
    throw new Error(
      `[${label}] PATCH is globally forbidden. Got PATCH ${request.path}`
    );
  }
  if (request.method !== expectedMethod) {
    throw new Error(
      `[${label}] Expected ${expectedMethod} but got ${request.method} ${request.path}`
    );
  }
}

/**
 * Assert that the request path matches the expected pattern.
 * The pattern uses `:param` placeholders that match any non-slash segment.
 * Trailing slashes are normalized before comparison.
 */
export function assertCorrectPath(
  request: RecordedRequest,
  pathPattern: string,
  label: string
): void {
  // Normalize both: strip trailing slashes, then compare
  const normalize = (p: string) => p.replace(/\/+$/, '') || '/';
  const normalizedPath = normalize(request.path);
  const normalizedPattern = normalize(pathPattern);

  const regexStr = normalizedPattern
    .replace(/:[a-zA-Z_]+/g, '[^/]+')
    .replace(/\//g, '\\/');
  const regex = new RegExp(`^${regexStr}$`);

  if (!regex.test(normalizedPath)) {
    throw new Error(
      `[${label}] Path "${request.path}" does not match pattern "${pathPattern}"`
    );
  }
}

/**
 * Assert that the request body wraps fields under the expected root key.
 * For `rootKey: null`, the body should NOT be nested (fields at top level).
 * Skips check for empty bodies (action endpoints).
 */
export function assertCorrectRootKey(
  request: RecordedRequest,
  expectedRootKey: string | null,
  label: string
): void {
  const body = request.body as Record<string, unknown> | undefined;
  if (!body || Object.keys(body).length === 0) return;

  if (expectedRootKey === null) {
    // Fields should be at top level, NOT nested under a key that looks like a root key
    return;
  }

  const topLevelKeys = Object.keys(body);
  if (!topLevelKeys.includes(expectedRootKey)) {
    throw new Error(
      `[${label}] Expected root key "${expectedRootKey}" but got keys: [${topLevelKeys.join(', ')}]`
    );
  }
}

/**
 * Assert that no fields were sent that aren't in the allowed list.
 * Checks under the root key if one is specified, or at top level if rootKey is null.
 */
export function assertNoInventedFields(
  request: RecordedRequest,
  allowedFields: string[],
  rootKey: string | null,
  label: string
): void {
  const body = request.body as Record<string, unknown> | undefined;
  if (!body || Object.keys(body).length === 0) return;

  const fieldsObj = rootKey !== null
    ? (body[rootKey] as Record<string, unknown> | undefined)
    : body;

  if (!fieldsObj) return;

  const sentFields = Object.keys(fieldsObj);
  const allowed = new Set(allowedFields);
  const invented = sentFields.filter((f) => !allowed.has(f));

  if (invented.length > 0) {
    throw new Error(
      `[${label}] Invented fields not in contract: [${invented.join(', ')}]`
    );
  }
}

/**
 * Assert that all field names in the request body use snake_case.
 * Catches camelCase leaking into API requests.
 * Checks under the root key if one is specified, or at top level if rootKey is null.
 */
export function assertSnakeCaseFields(
  request: RecordedRequest,
  rootKey: string | null,
  label: string
): void {
  const body = request.body as Record<string, unknown> | undefined;
  if (!body || Object.keys(body).length === 0) return;

  const fieldsObj = rootKey !== null
    ? (body[rootKey] as Record<string, unknown> | undefined)
    : body;

  if (!fieldsObj) return;

  const camelCaseRegex = /[a-z][A-Z]/;
  const camelCaseFields = Object.keys(fieldsObj).filter((f) =>
    camelCaseRegex.test(f)
  );

  if (camelCaseFields.length > 0) {
    throw new Error(
      `[${label}] camelCase fields leaking into API request: [${camelCaseFields.join(', ')}]`
    );
  }
}

/**
 * Assert that zero PATCH requests were made across all recorded history.
 */
export function assertNoPatchRequests(
  allRequests: RecordedRequest[]
): void {
  const patchRequests = allRequests.filter((r) => r.method === 'PATCH');
  if (patchRequests.length > 0) {
    const paths = patchRequests.map((r) => r.path).join(', ');
    throw new Error(
      `Found ${patchRequests.length} PATCH request(s): [${paths}]. PATCH is globally forbidden.`
    );
  }
}
