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
  list(formUniqueId: string, params?: ListFormInstancesParams): Promise<PageResult<FormInstance>>;
  get(formUniqueId: string, uniqueId: string): Promise<FormInstance>;
  create(formUniqueId: string, data: CreateFormInstanceRequest): Promise<FormInstance>;
  update(formUniqueId: string, uniqueId: string, data: UpdateFormInstanceRequest): Promise<FormInstance>;
  delete(formUniqueId: string, uniqueId: string): Promise<void>;
  start(formUniqueId: string, uniqueId: string): Promise<FormInstance>;
  submit(formUniqueId: string, uniqueId: string): Promise<FormInstance>;
  cancel(formUniqueId: string, uniqueId: string): Promise<FormInstance>;
  resendMagicLink(formUniqueId: string, uniqueId: string): Promise<void>;
}

export function createFormInstancesService(transport: Transport, _config: { apiKey: string }): FormInstancesService {
  const basePath = (formId: string) => `/forms/${formId}/instances`;

  return {
    async list(formUniqueId: string, params?: ListFormInstancesParams): Promise<PageResult<FormInstance>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
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
          assigned_to_unique_id: data.assignedToUniqueId,
          assigned_to_email: data.assignedToEmail,
          assigned_to_name: data.assignedToName,
          assigned_by_name: data.assignedByName,
          expires_at: data.expiresAt instanceof Date ? data.expiresAt.toISOString() : data.expiresAt,
          responses: data.responses,
          metadata: data.metadata,
        },
      });
      return decodeOne(response, formInstanceMapper);
    },

    async update(formUniqueId: string, uniqueId: string, data: UpdateFormInstanceRequest): Promise<FormInstance> {
      const response = await transport.put<unknown>(`${basePath(formUniqueId)}/${uniqueId}`, {
        app_form_instance: {
          assigned_to_unique_id: data.assignedToUniqueId,
          assigned_to_email: data.assignedToEmail,
          assigned_to_name: data.assignedToName,
          assigned_by_name: data.assignedByName,
          expires_at: data.expiresAt instanceof Date ? data.expiresAt.toISOString() : data.expiresAt,
          responses: data.responses,
          metadata: data.metadata,
          status: data.status,
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
