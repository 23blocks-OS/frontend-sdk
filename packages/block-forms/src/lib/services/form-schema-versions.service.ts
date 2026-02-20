import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  FormSchemaVersion,
  CreateFormSchemaVersionRequest,
  UpdateFormSchemaVersionRequest,
  ListFormSchemaVersionsParams,
} from '../types/form-schema-version.js';
import { formSchemaVersionMapper } from '../mappers/form-schema-version.mapper.js';

export interface FormSchemaVersionsService {
  /**
   * List all versions for a form schema
   * @param formUniqueId - The unique identifier of the parent form
   * @param schemaUniqueId - The unique identifier of the form schema
   * @param params - Optional filtering by status and pagination
   * @returns Paginated result containing FormSchemaVersion items and metadata
   */
  list(
    formUniqueId: string,
    schemaUniqueId: string,
    params?: ListFormSchemaVersionsParams
  ): Promise<PageResult<FormSchemaVersion>>;

  /**
   * Get a specific version
   * @param formUniqueId - The unique identifier of the parent form
   * @param schemaUniqueId - The unique identifier of the form schema
   * @param versionUniqueId - The unique identifier of the version
   * @returns The matching FormSchemaVersion record
   */
  get(
    formUniqueId: string,
    schemaUniqueId: string,
    versionUniqueId: string
  ): Promise<FormSchemaVersion>;

  /**
   * Create a new version for a schema
   * @param formUniqueId - The unique identifier of the parent form
   * @param schemaUniqueId - The unique identifier of the form schema
   * @param data - Version details including schema definition and UI schema
   * @returns The newly created FormSchemaVersion record
   */
  create(
    formUniqueId: string,
    schemaUniqueId: string,
    data: CreateFormSchemaVersionRequest
  ): Promise<FormSchemaVersion>;

  /**
   * Update a version
   * @param formUniqueId - The unique identifier of the parent form
   * @param schemaUniqueId - The unique identifier of the form schema
   * @param versionUniqueId - The unique identifier of the version to update
   * @param data - Fields to update such as schema, UI schema, or status
   * @returns The updated FormSchemaVersion record
   */
  update(
    formUniqueId: string,
    schemaUniqueId: string,
    versionUniqueId: string,
    data: UpdateFormSchemaVersionRequest
  ): Promise<FormSchemaVersion>;

  /**
   * Publish a version (makes it the active version)
   * @param formUniqueId - The unique identifier of the parent form
   * @param schemaUniqueId - The unique identifier of the form schema
   * @param versionUniqueId - The unique identifier of the version to publish
   * @returns The updated FormSchemaVersion record with published status
   * @note Publishing a version makes it the active version for the schema
   */
  publish(
    formUniqueId: string,
    schemaUniqueId: string,
    versionUniqueId: string
  ): Promise<FormSchemaVersion>;

  /**
   * Delete a version
   * @param formUniqueId - The unique identifier of the parent form
   * @param schemaUniqueId - The unique identifier of the form schema
   * @param versionUniqueId - The unique identifier of the version to delete
   * @returns Resolves when the version has been deleted
   */
  delete(
    formUniqueId: string,
    schemaUniqueId: string,
    versionUniqueId: string
  ): Promise<void>;
}

export function createFormSchemaVersionsService(
  transport: Transport,
  _config: { apiKey: string }
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
