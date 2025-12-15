import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  FormSet,
  CreateFormSetRequest,
  UpdateFormSetRequest,
  ListFormSetsParams,
} from '../types/form-set';
import { formSetMapper } from '../mappers/form-set.mapper';

export interface FormSetsService {
  list(params?: ListFormSetsParams): Promise<PageResult<FormSet>>;
  get(uniqueId: string): Promise<FormSet>;
  create(data: CreateFormSetRequest): Promise<FormSet>;
  update(uniqueId: string, data: UpdateFormSetRequest): Promise<FormSet>;
  delete(uniqueId: string): Promise<void>;
}

export function createFormSetsService(transport: Transport, _config: { appId: string }): FormSetsService {
  return {
    async list(params?: ListFormSetsParams): Promise<PageResult<FormSet>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/form_sets', { params: queryParams });
      return decodePageResult(response, formSetMapper);
    },

    async get(uniqueId: string): Promise<FormSet> {
      const response = await transport.get<unknown>(`/form_sets/${uniqueId}`);
      return decodeOne(response, formSetMapper);
    },

    async create(data: CreateFormSetRequest): Promise<FormSet> {
      const response = await transport.post<unknown>('/form_sets', {
        form_set: {
            code: data.code,
            name: data.name,
            description: data.description,
            forms: data.forms,
            payload: data.payload,
          },
      });
      return decodeOne(response, formSetMapper);
    },

    async update(uniqueId: string, data: UpdateFormSetRequest): Promise<FormSet> {
      const response = await transport.put<unknown>(`/form_sets/${uniqueId}`, {
        form_set: {
            name: data.name,
            description: data.description,
            forms: data.forms,
            enabled: data.enabled,
            status: data.status,
            payload: data.payload,
          },
      });
      return decodeOne(response, formSetMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/form_sets/${uniqueId}`);
    },
  };
}
