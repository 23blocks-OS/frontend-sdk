import type { Transport } from '@23blocks/contracts';
import { decodeOne } from '@23blocks/jsonapi-codec';
import type {
  PublicForm,
  PublicFormSubmission,
  PublicFormDraft,
  PublicFormResponse,
} from '../types/public-form';
import { publicFormMapper, publicFormResponseMapper } from '../mappers/public-form.mapper';

export interface PublicFormsService {
  get(urlId: string): Promise<PublicForm>;
  submit(urlId: string, data: PublicFormSubmission): Promise<PublicFormResponse>;
  draft(urlId: string, data: PublicFormDraft): Promise<PublicFormResponse>;
}

export function createPublicFormsService(transport: Transport, _config: { appId: string }): PublicFormsService {
  return {
    async get(urlId: string): Promise<PublicForm> {
      const response = await transport.get<unknown>(`/${urlId}/forms/public`);
      return decodeOne(response, publicFormMapper);
    },

    async submit(urlId: string, data: PublicFormSubmission): Promise<PublicFormResponse> {
      const response = await transport.post<unknown>(`/${urlId}/forms/public`, {
        form_submission: {
          data: data.data,
          payload: data.payload,
        },
      });
      return decodeOne(response, publicFormResponseMapper);
    },

    async draft(urlId: string, data: PublicFormDraft): Promise<PublicFormResponse> {
      const response = await transport.put<unknown>(`/${urlId}/forms/public`, {
        form_draft: {
          data: data.data,
          payload: data.payload,
        },
      });
      return decodeOne(response, publicFormResponseMapper);
    },
  };
}
