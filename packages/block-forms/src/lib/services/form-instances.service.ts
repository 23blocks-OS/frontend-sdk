import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  FormInstance,
  CreateFormInstanceRequest,
  UpdateFormInstanceRequest,
  SubmitFormInstanceRequest,
  ListFormInstancesParams,
} from '../types/form-instance';
import { formInstanceMapper } from '../mappers/form-instance.mapper';

export interface FormInstancesService {
  list(params?: ListFormInstancesParams): Promise<PageResult<FormInstance>>;
  get(uniqueId: string): Promise<FormInstance>;
  create(data: CreateFormInstanceRequest): Promise<FormInstance>;
  update(uniqueId: string, data: UpdateFormInstanceRequest): Promise<FormInstance>;
  delete(uniqueId: string): Promise<void>;
  submit(data: SubmitFormInstanceRequest): Promise<FormInstance>;
  listByUser(userUniqueId: string, params?: ListFormInstancesParams): Promise<PageResult<FormInstance>>;
  listBySchema(formSchemaUniqueId: string, params?: ListFormInstancesParams): Promise<PageResult<FormInstance>>;
}

export function createFormInstancesService(transport: Transport, _config: { appId: string }): FormInstancesService {
  return {
    async list(params?: ListFormInstancesParams): Promise<PageResult<FormInstance>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.formSchemaUniqueId) queryParams['form_schema_unique_id'] = params.formSchemaUniqueId;
      if (params?.userUniqueId) queryParams['user_unique_id'] = params.userUniqueId;
      if (params?.status) queryParams['status'] = params.status;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/form_instances', { params: queryParams });
      return decodePageResult(response, formInstanceMapper);
    },

    async get(uniqueId: string): Promise<FormInstance> {
      const response = await transport.get<unknown>(`/form_instances/${uniqueId}`);
      return decodeOne(response, formInstanceMapper);
    },

    async create(data: CreateFormInstanceRequest): Promise<FormInstance> {
      const response = await transport.post<unknown>('/form_instances', {
        form_instance: {
            form_schema_unique_id: data.formSchemaUniqueId,
            form_schema_version: data.formSchemaVersion,
            user_unique_id: data.userUniqueId,
            data: data.data,
            payload: data.payload,
          },
      });
      return decodeOne(response, formInstanceMapper);
    },

    async update(uniqueId: string, data: UpdateFormInstanceRequest): Promise<FormInstance> {
      const response = await transport.put<unknown>(`/form_instances/${uniqueId}`, {
        form_instance: {
            data: data.data,
            enabled: data.enabled,
            status: data.status,
            payload: data.payload,
          },
      });
      return decodeOne(response, formInstanceMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/form_instances/${uniqueId}`);
    },

    async submit(data: SubmitFormInstanceRequest): Promise<FormInstance> {
      const response = await transport.post<unknown>('/form_instances/submit', {
        form_instance: {
            form_schema_unique_id: data.formSchemaUniqueId,
            form_schema_version: data.formSchemaVersion,
            data: data.data,
            payload: data.payload,
          },
      });
      return decodeOne(response, formInstanceMapper);
    },

    async listByUser(userUniqueId: string, params?: ListFormInstancesParams): Promise<PageResult<FormInstance>> {
      const queryParams: Record<string, string> = { user_unique_id: userUniqueId };
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.formSchemaUniqueId) queryParams['form_schema_unique_id'] = params.formSchemaUniqueId;
      if (params?.status) queryParams['status'] = params.status;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>(`/users/${userUniqueId}/form_instances`, { params: queryParams });
      return decodePageResult(response, formInstanceMapper);
    },

    async listBySchema(formSchemaUniqueId: string, params?: ListFormInstancesParams): Promise<PageResult<FormInstance>> {
      const queryParams: Record<string, string> = { form_schema_unique_id: formSchemaUniqueId };
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.userUniqueId) queryParams['user_unique_id'] = params.userUniqueId;
      if (params?.status) queryParams['status'] = params.status;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>(`/form_schemas/${formSchemaUniqueId}/instances`, { params: queryParams });
      return decodePageResult(response, formInstanceMapper);
    },
  };
}
