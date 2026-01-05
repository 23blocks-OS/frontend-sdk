import type { Transport } from '@23blocks/contracts';
import { decodeOne } from '@23blocks/jsonapi-codec';
import type {
  ApplicationForm,
  ApplicationFormSubmission,
  ApplicationFormDraft,
  ApplicationFormResponse,
} from '../types/application-form';
import { applicationFormMapper, applicationFormResponseMapper } from '../mappers/application-form.mapper';

export interface ApplicationFormsService {
  get(urlId: string): Promise<ApplicationForm>;
  submit(urlId: string, data: ApplicationFormSubmission): Promise<ApplicationFormResponse>;
  draft(urlId: string, data: ApplicationFormDraft): Promise<ApplicationFormResponse>;
}

export function createApplicationFormsService(transport: Transport, _config: { appId: string }): ApplicationFormsService {
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
  };
}
