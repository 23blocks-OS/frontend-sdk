import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  FormInstance,
  CreateFormInstanceRequest,
  UpdateFormInstanceRequest,
  ListFormInstancesParams,
} from '../types/form-instance.js';
import { formInstanceMapper } from '../mappers/form-instance.mapper.js';

export interface FormInstancesService {
  /**
   * List all instances for a form
   * @param formUniqueId - The unique identifier of the parent form
   * @param params - Optional filtering by schema, user, status, and pagination
   * @returns Paginated result containing FormInstance items and metadata
   */
  list(formUniqueId: string, params?: ListFormInstancesParams): Promise<PageResult<FormInstance>>;

  /**
   * Get a specific form instance
   * @param formUniqueId - The unique identifier of the parent form
   * @param uniqueId - The unique identifier of the form instance
   * @returns The matching FormInstance record
   */
  get(formUniqueId: string, uniqueId: string): Promise<FormInstance>;

  /**
   * Create a new form instance
   * @param formUniqueId - The unique identifier of the parent form
   * @param data - Instance details including schema reference, user, and initial data
   * @returns The newly created FormInstance record
   */
  create(formUniqueId: string, data: CreateFormInstanceRequest): Promise<FormInstance>;

  /**
   * Update a form instance
   * @param formUniqueId - The unique identifier of the parent form
   * @param uniqueId - The unique identifier of the form instance to update
   * @param data - Fields to update such as form data, status, or payload
   * @returns The updated FormInstance record
   */
  update(formUniqueId: string, uniqueId: string, data: UpdateFormInstanceRequest): Promise<FormInstance>;

  /**
   * Delete a form instance
   * @param formUniqueId - The unique identifier of the parent form
   * @param uniqueId - The unique identifier of the form instance to delete
   * @returns Resolves when the instance has been deleted
   */
  delete(formUniqueId: string, uniqueId: string): Promise<void>;

  /**
   * Start a form instance (begin filling)
   * @param formUniqueId - The unique identifier of the parent form
   * @param uniqueId - The unique identifier of the form instance to start
   * @returns The updated FormInstance record with started status
   */
  start(formUniqueId: string, uniqueId: string): Promise<FormInstance>;

  /**
   * Submit a form instance
   * @param formUniqueId - The unique identifier of the parent form
   * @param uniqueId - The unique identifier of the form instance to submit
   * @returns The updated FormInstance record with submitted status
   */
  submit(formUniqueId: string, uniqueId: string): Promise<FormInstance>;

  /**
   * Cancel a form instance
   * @param formUniqueId - The unique identifier of the parent form
   * @param uniqueId - The unique identifier of the form instance to cancel
   * @returns The updated FormInstance record with cancelled status
   */
  cancel(formUniqueId: string, uniqueId: string): Promise<FormInstance>;

  /**
   * Resend magic link for a form instance
   * @param formUniqueId - The unique identifier of the parent form
   * @param uniqueId - The unique identifier of the form instance
   * @returns Resolves when the magic link email has been sent
   */
  resendMagicLink(formUniqueId: string, uniqueId: string): Promise<void>;
}

export function createFormInstancesService(transport: Transport, _config: { apiKey: string }): FormInstancesService {
  const basePath = (formId: string) => `/forms/${formId}/instances`;

  return {
    async list(formUniqueId: string, params?: ListFormInstancesParams): Promise<PageResult<FormInstance>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.formSchemaUniqueId) queryParams['form_schema_unique_id'] = params.formSchemaUniqueId;
      if (params?.userUniqueId) queryParams['user_unique_id'] = params.userUniqueId;
      if (params?.status) queryParams['status'] = params.status;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>(`${basePath(formUniqueId)}/`, { params: queryParams });
      return decodePageResult(response, formInstanceMapper);
    },

    async get(formUniqueId: string, uniqueId: string): Promise<FormInstance> {
      const response = await transport.get<unknown>(`${basePath(formUniqueId)}/${uniqueId}`);
      return decodeOne(response, formInstanceMapper);
    },

    async create(formUniqueId: string, data: CreateFormInstanceRequest): Promise<FormInstance> {
      const response = await transport.post<unknown>(`${basePath(formUniqueId)}/`, {
        app_form_instance: {
          form_schema_unique_id: data.formSchemaUniqueId,
          form_schema_version: data.formSchemaVersion,
          user_unique_id: data.userUniqueId,
          data: data.data,
          payload: data.payload,
        },
      });
      return decodeOne(response, formInstanceMapper);
    },

    async update(formUniqueId: string, uniqueId: string, data: UpdateFormInstanceRequest): Promise<FormInstance> {
      const response = await transport.put<unknown>(`${basePath(formUniqueId)}/${uniqueId}`, {
        app_form_instance: {
          data: data.data,
          enabled: data.enabled,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, formInstanceMapper);
    },

    async delete(formUniqueId: string, uniqueId: string): Promise<void> {
      await transport.delete(`${basePath(formUniqueId)}/${uniqueId}`);
    },

    async start(formUniqueId: string, uniqueId: string): Promise<FormInstance> {
      const response = await transport.post<unknown>(`${basePath(formUniqueId)}/${uniqueId}/start`, {});
      return decodeOne(response, formInstanceMapper);
    },

    async submit(formUniqueId: string, uniqueId: string): Promise<FormInstance> {
      const response = await transport.post<unknown>(`${basePath(formUniqueId)}/${uniqueId}/submit`, {});
      return decodeOne(response, formInstanceMapper);
    },

    async cancel(formUniqueId: string, uniqueId: string): Promise<FormInstance> {
      const response = await transport.post<unknown>(`${basePath(formUniqueId)}/${uniqueId}/cancel`, {});
      return decodeOne(response, formInstanceMapper);
    },

    async resendMagicLink(formUniqueId: string, uniqueId: string): Promise<void> {
      await transport.post<unknown>(`${basePath(formUniqueId)}/${uniqueId}/resend_magic_link`, {});
    },
  };
}
