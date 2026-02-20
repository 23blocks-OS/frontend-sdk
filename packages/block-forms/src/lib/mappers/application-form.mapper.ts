import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { ApplicationForm, ApplicationFormResponse, VerificationStatus, SendOtpResponse } from '../types/application-form.js';
import { parseString, parseDate, parseStatus, parseBoolean, parseNumber } from './utils.js';

/**
 * Parse verification status from API response
 */
function parseVerificationStatus(value: unknown): VerificationStatus | undefined {
  const status = parseString(value);
  if (status === 'pending' || status === 'verified') {
    return status;
  }
  return undefined;
}

export const applicationFormMapper: ResourceMapper<ApplicationForm> = {
  type: 'public_form',
  map: (resource) => ({
    id: resource.id,
    uniqueId: resource.id,
    formUniqueId: parseString(resource.attributes['form_unique_id']) ?? '',
    title: parseString(resource.attributes['title']),
    description: parseString(resource.attributes['description']),
    schema: (resource.attributes['schema'] as Record<string, unknown>) ?? {},
    uiSchema: resource.attributes['ui_schema'] as Record<string, unknown> | undefined,
    settings: resource.attributes['settings'] as Record<string, unknown> | undefined,
    status: parseStatus(resource.attributes['status']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    createdAt: parseDate(resource.attributes['created_at']),
    updatedAt: parseDate(resource.attributes['updated_at']),
    // OTP Verification fields
    verificationStatus: parseVerificationStatus(resource.attributes['verification_status']),
    assignedToName: parseString(resource.attributes['assigned_to_name']),
    maskedEmail: parseString(resource.attributes['masked_email']),
    otpSent: resource.attributes['otp_sent'] !== undefined
      ? parseBoolean(resource.attributes['otp_sent'])
      : undefined,
    formName: parseString(resource.attributes['form_name']),
  }),
};

/**
 * Map send-otp response (non-JSON:API format)
 */
export function mapSendOtpResponse(response: Record<string, unknown>): SendOtpResponse {
  return {
    message: parseString(response['message']) ?? '',
    maskedEmail: parseString(response['masked_email']) ?? '',
    expiresIn: parseNumber(response['expires_in']),
    sentCount: parseNumber(response['sent_count']),
  };
}

export const applicationFormResponseMapper: ResourceMapper<ApplicationFormResponse> = {
  type: 'form_response',
  map: (resource) => ({
    id: resource.id,
    uniqueId: resource.id,
    formUniqueId: parseString(resource.attributes['form_unique_id']) ?? '',
    data: (resource.attributes['data'] as Record<string, unknown>) ?? {},
    status: parseStatus(resource.attributes['status']),
    submittedAt: parseDate(resource.attributes['submitted_at']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    createdAt: parseDate(resource.attributes['created_at']),
    updatedAt: parseDate(resource.attributes['updated_at']),
  }),
};
