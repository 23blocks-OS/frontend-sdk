import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  FormSchemaVersion,
  CreateFormSchemaVersionRequest,
  UpdateFormSchemaVersionRequest,
  ListFormSchemaVersionsParams,
} from '../types/form-schema-version';
import { formSchemaVersionMapper } from '../mappers/form-schema-version.mapper';

export interface FormSchemaVersionsService {
  /**
   * List all versions for a form schema
   */
  list(
    formUniqueId: string,
    schemaUniqueId: string,
    params?: ListFormSchemaVersionsParams
  ): Promise<PageResult<FormSchemaVersion>>;

  /**
   * Get a specific version
   */
  get(
    formUniqueId: string,
    schemaUniqueId: string,
    versionUniqueId: string
  ): Promise<FormSchemaVersion>;

  /**
   * Create a new version for a schema
   */
  create(
    formUniqueId: string,
    schemaUniqueId: string,
    data: CreateFormSchemaVersionRequest
  ): Promise<FormSchemaVersion>;

  /**
   * Update a version
   */
  update(
    formUniqueId: string,
    schemaUniqueId: string,
    versionUniqueId: string,
    data: UpdateFormSchemaVersionRequest
  ): Promise<FormSchemaVersion>;

  /**
   * Publish a version (makes it the active version)
   */
  publish(
    formUniqueId: string,
    schemaUniqueId: string,
    versionUniqueId: string
  ): Promise<FormSchemaVersion>;

  /**
   * Delete a version
   */
  delete(
    formUniqueId: string,
    schemaUniqueId: string,
    versionUniqueId: string
  ): Promise<void>;
}

export function createFormSchemaVersionsService(
  transport: Transport,
  _config: { appId: string }
): FormSchemaVersionsService {
  const basePath = (formId: string, schemaId: string) =>
    `/forms/${formId}/schemas/${schemaId}/versions`;

  return {
    async list(
      formUniqueId: string,
      schemaUniqueId: string,
      params?: ListFormSchemaVersionsParams
    ): Promise<PageResult<FormSchemaVersion>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.sortBy)
        queryParams['sort'] =
          params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>(
        `${basePath(formUniqueId, schemaUniqueId)}/`,
        { params: queryParams }
      );
      return decodePageResult(response, formSchemaVersionMapper);
    },

    async get(
      formUniqueId: string,
      schemaUniqueId: string,
      versionUniqueId: string
    ): Promise<FormSchemaVersion> {
      const response = await transport.get<unknown>(
        `${basePath(formUniqueId, schemaUniqueId)}/${versionUniqueId}`
      );
      return decodeOne(response, formSchemaVersionMapper);
    },

    async create(
      formUniqueId: string,
      schemaUniqueId: string,
      data: CreateFormSchemaVersionRequest
    ): Promise<FormSchemaVersion> {
      const response = await transport.post<unknown>(
        `${basePath(formUniqueId, schemaUniqueId)}/`,
        {
          form_schema_version: {
            schema: data.schema,
            ui_schema: data.uiSchema,
            payload: data.payload,
          },
        }
      );
      return decodeOne(response, formSchemaVersionMapper);
    },

    async update(
      formUniqueId: string,
      schemaUniqueId: string,
      versionUniqueId: string,
      data: UpdateFormSchemaVersionRequest
    ): Promise<FormSchemaVersion> {
      const response = await transport.put<unknown>(
        `${basePath(formUniqueId, schemaUniqueId)}/${versionUniqueId}`,
        {
          form_schema_version: {
            schema: data.schema,
            ui_schema: data.uiSchema,
            status: data.status,
            payload: data.payload,
          },
        }
      );
      return decodeOne(response, formSchemaVersionMapper);
    },

    async publish(
      formUniqueId: string,
      schemaUniqueId: string,
      versionUniqueId: string
    ): Promise<FormSchemaVersion> {
      const response = await transport.post<unknown>(
        `${basePath(formUniqueId, schemaUniqueId)}/${versionUniqueId}/publish`,
        {}
      );
      return decodeOne(response, formSchemaVersionMapper);
    },

    async delete(
      formUniqueId: string,
      schemaUniqueId: string,
      versionUniqueId: string
    ): Promise<void> {
      await transport.delete(
        `${basePath(formUniqueId, schemaUniqueId)}/${versionUniqueId}`
      );
    },
  };
}
