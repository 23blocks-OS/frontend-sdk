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
  get(urlId: string): Promise<ApplicationForm>;
  submit(urlId: string, data: ApplicationFormSubmission): Promise<ApplicationFormResponse>;
  draft(urlId: string, data: ApplicationFormDraft): Promise<ApplicationFormResponse>;
  sendOtp(urlId: string): Promise<SendOtpResponse>;
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
        responses: data.data,
      });
      return decodeOne(response, applicationFormResponseMapper);
    },

    async draft(urlId: string, data: ApplicationFormDraft): Promise<ApplicationFormResponse> {
      const response = await transport.put<unknown>(`/${urlId}/forms/public`, {
        responses: data.data,
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
