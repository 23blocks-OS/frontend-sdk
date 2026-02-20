import type { Transport } from '@23blocks/contracts';
import { decodeOne } from '@23blocks/jsonapi-codec';
import type {
  ApplicationForm,
  ApplicationFormSubmission,
  ApplicationFormDraft,
  ApplicationFormResponse,
  SendOtpResponse,
  VerifyOtpRequest,
} from '../types/application-form.js';
import { applicationFormMapper, applicationFormResponseMapper, mapSendOtpResponse } from '../mappers/application-form.mapper.js';

export interface ApplicationFormsService {
  /**
   * Get public form via magic link
   * If OTP verification is required, returns form with verificationStatus: 'pending'
   * and limited fields (no schema/uiSchema until verified)
   * @param urlId - The magic link URL identifier for the form
   * @returns The ApplicationForm record (may have limited fields if OTP is pending)
   */
  get(urlId: string): Promise<ApplicationForm>;

  /**
   * Submit a completed form
   * Requires OTP verification if form has OTP enabled
   * @param urlId - The magic link URL identifier for the form
   * @param data - The form submission data and optional payload
   * @returns The ApplicationFormResponse confirming the submission
   */
  submit(urlId: string, data: ApplicationFormSubmission): Promise<ApplicationFormResponse>;

  /**
   * Save form as draft
   * Requires OTP verification if form has OTP enabled
   * @param urlId - The magic link URL identifier for the form
   * @param data - The partial form data and optional payload to save
   * @returns The ApplicationFormResponse confirming the draft was saved
   */
  draft(urlId: string, data: ApplicationFormDraft): Promise<ApplicationFormResponse>;

  /**
   * Send OTP verification code to user's email
   * @param urlId - The magic link URL identifier for the form
   * @returns Response indicating OTP was sent, including expiration details
   * @throws Error with code RATE_LIMITED if called too frequently (60s cooldown)
   * @throws Error with code ALREADY_VERIFIED if form is already verified
   * @throws Error with code OTP_NOT_REQUIRED if form doesn't require OTP
   */
  sendOtp(urlId: string): Promise<SendOtpResponse>;

  /**
   * Verify OTP code and get full form access
   * On success, returns full form with schema and fields
   * @param urlId - The magic link URL identifier for the form
   * @param data - The verification code to validate
   * @returns The full ApplicationForm record with schema and fields unlocked
   * @throws Error with code INVALID_CODE if code is wrong (includes attemptsRemaining)
   * @throws Error with code CODE_EXPIRED if code has expired (10 min lifetime)
   * @throws Error with code ATTEMPTS_EXCEEDED if max attempts (5) reached
   */
  verifyOtp(urlId: string, data: VerifyOtpRequest): Promise<ApplicationForm>;
}

export function createApplicationFormsService(transport: Transport, _config: { apiKey: string }): ApplicationFormsService {
  return {
    async get(urlId: string): Promise<ApplicationForm> {
      const response = await transport.get<unknown>(`/${urlId}/forms/public`);
      return decodeOne(response, applicationFormMapper);
    },

    async submit(urlId: string, data: ApplicationFormSubmission): Promise<ApplicationFormResponse> {
      const response = await transport.post<unknown>(`/${urlId}/forms/public`, {
        form_submission: {
          data: data.data,
          payload: data.payload,
        },
      });
      return decodeOne(response, applicationFormResponseMapper);
    },

    async draft(urlId: string, data: ApplicationFormDraft): Promise<ApplicationFormResponse> {
      const response = await transport.put<unknown>(`/${urlId}/forms/public`, {
        form_draft: {
          data: data.data,
          payload: data.payload,
        },
      });
      return decodeOne(response, applicationFormResponseMapper);
    },

    async sendOtp(urlId: string): Promise<SendOtpResponse> {
      const response = await transport.post<Record<string, unknown>>(`/${urlId}/forms/public/send-otp`, {});
      return mapSendOtpResponse(response);
    },

    async verifyOtp(urlId: string, data: VerifyOtpRequest): Promise<ApplicationForm> {
      const response = await transport.post<unknown>(`/${urlId}/forms/public/verify-otp`, {
        code: data.code,
      });
      return decodeOne(response, applicationFormMapper);
    },
  };
}
