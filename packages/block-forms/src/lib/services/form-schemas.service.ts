import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  FormSchema,
  CreateFormSchemaRequest,
  UpdateFormSchemaRequest,
  ListFormSchemasParams,
} from '../types/form-schema';
import { formSchemaMapper } from '../mappers/form-schema.mapper';

export interface FormSchemasService {
  list(params?: ListFormSchemasParams): Promise<PageResult<FormSchema>>;
  get(uniqueId: string): Promise<FormSchema>;
  create(data: CreateFormSchemaRequest): Promise<FormSchema>;
  update(uniqueId: string, data: UpdateFormSchemaRequest): Promise<FormSchema>;
  delete(uniqueId: string): Promise<void>;
  getLatestVersion(formUniqueId: string): Promise<FormSchema>;
}

export function createFormSchemasService(transport: Transport, _config: { appId: string }): FormSchemasService {
  return {
    async list(params?: ListFormSchemasParams): Promise<PageResult<FormSchema>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.formUniqueId) queryParams['form_unique_id'] = params.formUniqueId;
      if (params?.status) queryParams['status'] = params.status;
      if (params?.version) queryParams['version'] = String(params.version);
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/form_schemas', { params: queryParams });
      return decodePageResult(response, formSchemaMapper);
    },

    async get(uniqueId: string): Promise<FormSchema> {
      const response = await transport.get<unknown>(`/form_schemas/${uniqueId}`);
      return decodeOne(response, formSchemaMapper);
    },

    async create(data: CreateFormSchemaRequest): Promise<FormSchema> {
      const response = await transport.post<unknown>('/form_schemas', {
        form_schema: {
            form_unique_id: data.formUniqueId,
            code: data.code,
            name: data.name,
            description: data.description,
            version: data.version,
            schema: data.schema,
            ui_schema: data.uiSchema,
            payload: data.payload,
          },
      });
      return decodeOne(response, formSchemaMapper);
    },

    async update(uniqueId: string, data: UpdateFormSchemaRequest): Promise<FormSchema> {
      const response = await transport.put<unknown>(`/form_schemas/${uniqueId}`, {
        form_schema: {
            name: data.name,
            description: data.description,
            schema: data.schema,
            ui_schema: data.uiSchema,
            enabled: data.enabled,
            status: data.status,
            payload: data.payload,
          },
      });
      return decodeOne(response, formSchemaMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/form_schemas/${uniqueId}`);
    },

    async getLatestVersion(formUniqueId: string): Promise<FormSchema> {
      const response = await transport.get<unknown>(`/forms/${formUniqueId}/schemas/latest`);
      return decodeOne(response, formSchemaMapper);
    },
  };
}
