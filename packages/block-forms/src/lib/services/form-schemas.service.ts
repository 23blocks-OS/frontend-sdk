import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  FormSchema,
  CreateFormSchemaRequest,
  UpdateFormSchemaRequest,
  ListFormSchemasParams,
} from '../types/form-schema.js';
import { formSchemaMapper } from '../mappers/form-schema.mapper.js';

export interface FormSchemasService {
  list(formUniqueId: string, params?: ListFormSchemasParams): Promise<PageResult<FormSchema>>;
  get(formUniqueId: string, schemaUniqueId: string): Promise<FormSchema>;
  create(formUniqueId: string, data: CreateFormSchemaRequest): Promise<FormSchema>;
  update(formUniqueId: string, schemaUniqueId: string, data: UpdateFormSchemaRequest): Promise<FormSchema>;
  delete(formUniqueId: string, schemaUniqueId: string): Promise<void>;
}

export function createFormSchemasService(transport: Transport, _config: { apiKey: string }): FormSchemasService {
  const basePath = (formId: string) => `/forms/${formId}/schemas`;

  return {
    async list(formUniqueId: string, params?: ListFormSchemasParams): Promise<PageResult<FormSchema>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>(`${basePath(formUniqueId)}/`, { params: queryParams });
      return decodePageResult(response, formSchemaMapper);
    },

    async get(formUniqueId: string, schemaUniqueId: string): Promise<FormSchema> {
      const response = await transport.get<unknown>(`${basePath(formUniqueId)}/${schemaUniqueId}`);
      return decodeOne(response, formSchemaMapper);
    },

    async create(formUniqueId: string, data: CreateFormSchemaRequest): Promise<FormSchema> {
      const response = await transport.post<unknown>(`${basePath(formUniqueId)}/`, {
        form_schema: {
          name: data.name,
          description: data.description,
          form_fields: data.formFields,
          datasource: data.datasource,
          payload: data.payload,
        },
      });
      return decodeOne(response, formSchemaMapper);
    },

    async update(formUniqueId: string, schemaUniqueId: string, data: UpdateFormSchemaRequest): Promise<FormSchema> {
      const response = await transport.put<unknown>(`${basePath(formUniqueId)}/${schemaUniqueId}`, {
        form_schema: {
          name: data.name,
          description: data.description,
          form_fields: data.formFields,
          datasource: data.datasource,
          enabled: data.enabled,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, formSchemaMapper);
    },

    async delete(formUniqueId: string, schemaUniqueId: string): Promise<void> {
      await transport.delete(`${basePath(formUniqueId)}/${schemaUniqueId}`);
    },
  };
}
