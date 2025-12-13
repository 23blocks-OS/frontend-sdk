import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Form,
  CreateFormRequest,
  UpdateFormRequest,
  ListFormsParams,
} from '../types/form';
import { formMapper } from '../mappers/form.mapper';

export interface FormsService {
  list(params?: ListFormsParams): Promise<PageResult<Form>>;
  get(uniqueId: string): Promise<Form>;
  create(data: CreateFormRequest): Promise<Form>;
  update(uniqueId: string, data: UpdateFormRequest): Promise<Form>;
  delete(uniqueId: string): Promise<void>;
}

export function createFormsService(transport: Transport, _config: { appId: string }): FormsService {
  return {
    async list(params?: ListFormsParams): Promise<PageResult<Form>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.formType) queryParams['form_type'] = params.formType;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/forms', { params: queryParams });
      return decodePageResult(response, formMapper);
    },

    async get(uniqueId: string): Promise<Form> {
      const response = await transport.get<unknown>(`/forms/${uniqueId}`);
      return decodeOne(response, formMapper);
    },

    async create(data: CreateFormRequest): Promise<Form> {
      const response = await transport.post<unknown>('/forms', {
        data: {
          type: 'Form',
          attributes: {
            code: data.code,
            name: data.name,
            description: data.description,
            form_type: data.formType,
            payload: data.payload,
          },
        },
      });
      return decodeOne(response, formMapper);
    },

    async update(uniqueId: string, data: UpdateFormRequest): Promise<Form> {
      const response = await transport.put<unknown>(`/forms/${uniqueId}`, {
        data: {
          type: 'Form',
          attributes: {
            name: data.name,
            description: data.description,
            form_type: data.formType,
            enabled: data.enabled,
            status: data.status,
            payload: data.payload,
          },
        },
      });
      return decodeOne(response, formMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/forms/${uniqueId}`);
    },
  };
}
