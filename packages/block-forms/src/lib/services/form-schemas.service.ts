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
  /**
   * List all schemas for a form
   * @param formUniqueId - The unique identifier of the parent form
   * @param params - Optional filtering by status, version, and pagination
   * @returns Paginated result containing FormSchema items and metadata
   */
  list(formUniqueId: string, params?: ListFormSchemasParams): Promise<PageResult<FormSchema>>;

  /**
   * Get a specific schema
   * @param formUniqueId - The unique identifier of the parent form
   * @param schemaUniqueId - The unique identifier of the schema
   * @returns The matching FormSchema record
   */
  get(formUniqueId: string, schemaUniqueId: string): Promise<FormSchema>;

  /**
   * Create a new schema for a form
   * @param formUniqueId - The unique identifier of the parent form
   * @param data - Schema details including code, name, version, schema definition, and UI schema
   * @returns The newly created FormSchema record
   */
  create(formUniqueId: string, data: CreateFormSchemaRequest): Promise<FormSchema>;

  /**
   * Update a schema
   * @param formUniqueId - The unique identifier of the parent form
   * @param schemaUniqueId - The unique identifier of the schema to update
   * @param data - Fields to update such as name, schema definition, or UI schema
   * @returns The updated FormSchema record
   */
  update(formUniqueId: string, schemaUniqueId: string, data: UpdateFormSchemaRequest): Promise<FormSchema>;

  /**
   * Delete a schema
   * @param formUniqueId - The unique identifier of the parent form
   * @param schemaUniqueId - The unique identifier of the schema to delete
   * @returns Resolves when the schema has been deleted
   */
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
      if (params?.version) queryParams['version'] = String(params.version);
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

    async update(formUniqueId: string, schemaUniqueId: string, data: UpdateFormSchemaRequest): Promise<FormSchema> {
      const response = await transport.put<unknown>(`${basePath(formUniqueId)}/${schemaUniqueId}`, {
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

    async delete(formUniqueId: string, schemaUniqueId: string): Promise<void> {
      await transport.delete(`${basePath(formUniqueId)}/${schemaUniqueId}`);
    },
  };
}
