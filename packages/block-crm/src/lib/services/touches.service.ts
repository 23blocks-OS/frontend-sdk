import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Touch,
  CreateTouchRequest,
  UpdateTouchRequest,
  ListTouchesParams,
} from '../types/touch';
import { touchMapper } from '../mappers/touch.mapper';

export interface TouchesService {
  list(params?: ListTouchesParams): Promise<PageResult<Touch>>;
  get(uniqueId: string): Promise<Touch>;
  create(data: CreateTouchRequest): Promise<Touch>;
  update(uniqueId: string, data: UpdateTouchRequest): Promise<Touch>;
  delete(uniqueId: string): Promise<void>;
}

export function createTouchesService(transport: Transport, _config: { appId: string }): TouchesService {
  return {
    async list(params?: ListTouchesParams): Promise<PageResult<Touch>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.contactUniqueId) queryParams['contact_unique_id'] = params.contactUniqueId;
      if (params?.userUniqueId) queryParams['user_unique_id'] = params.userUniqueId;
      if (params?.touchType) queryParams['touch_type'] = params.touchType;
      if (params?.channel) queryParams['channel'] = params.channel;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/touches', { params: queryParams });
      return decodePageResult(response, touchMapper);
    },

    async get(uniqueId: string): Promise<Touch> {
      const response = await transport.get<unknown>(`/touches/${uniqueId}`);
      return decodeOne(response, touchMapper);
    },

    async create(data: CreateTouchRequest): Promise<Touch> {
      const response = await transport.post<unknown>('/touches', {
        touch: {
          contact_unique_id: data.contactUniqueId,
          user_unique_id: data.userUniqueId,
          touch_type: data.touchType,
          channel: data.channel,
          subject: data.subject,
          notes: data.notes,
          touched_at: data.touchedAt?.toISOString(),
          payload: data.payload,
        },
      });
      return decodeOne(response, touchMapper);
    },

    async update(uniqueId: string, data: UpdateTouchRequest): Promise<Touch> {
      const response = await transport.put<unknown>(`/touches/${uniqueId}`, {
        touch: {
          touch_type: data.touchType,
          channel: data.channel,
          subject: data.subject,
          notes: data.notes,
          touched_at: data.touchedAt?.toISOString(),
          enabled: data.enabled,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, touchMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/touches/${uniqueId}`);
    },
  };
}
