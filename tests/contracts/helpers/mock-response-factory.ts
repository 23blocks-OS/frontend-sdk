import { jsonApiResponse, jsonApiListResponse, generateId } from '@23blocks/testing';

/**
 * Create a minimal valid JSON:API single-resource response.
 * Works with `decodeOne()` from jsonapi-codec.
 */
export function singleResponse(type: string = 'resource') {
  return jsonApiResponse(type, { status: 'active' } as any, generateId());
}

/**
 * Create a minimal valid JSON:API list response.
 * Works with `decodePageResult()` from jsonapi-codec.
 */
export function listResponse(type: string = 'resource', count: number = 1) {
  const items = Array.from({ length: count }, () => ({
    id: generateId(),
    attributes: { status: 'active' } as any,
  }));
  return jsonApiListResponse(type, items, { total: count, page: 1, perPage: count });
}

/**
 * Create a plain JSON response (non-JSON:API) for services that don't use jsonapi-codec.
 * Used by CRM sync, application forms sendOtp, and similar endpoints.
 */
export function plainResponse(data: Record<string, unknown> = {}) {
  return {
    success: true,
    synced_at: new Date().toISOString(),
    ...data,
  };
}

/**
 * Create a batch result response for CRM sync batch operations.
 */
export function batchResponse() {
  return {
    total: 0,
    synced: 0,
    failed: 0,
    results: [],
  };
}

/**
 * Response for form set match endpoint.
 */
export function matchResponse() {
  return { data: [] };
}

/**
 * Response for application form sendOtp.
 */
export function sendOtpResponse() {
  return {
    message: 'OTP sent',
    masked_email: 'j***@example.com',
    expires_in: 300,
    sent_count: 1,
  };
}

/**
 * Response for appointment report summary.
 */
export function summaryResponse() {
  return {
    total_count: 0,
    confirmed_count: 0,
    cancelled_count: 0,
    pending_count: 0,
  };
}

/**
 * Response for CRM connection/status endpoints.
 */
export function crmStatusResponse() {
  return {
    connected: true,
    provider: 'test',
    last_sync_at: new Date().toISOString(),
    pending_count: 0,
    failed_count: 0,
    next_sync_at: new Date().toISOString(),
  };
}
