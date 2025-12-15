import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Subscriber,
  CreateSubscriberRequest,
  UpdateSubscriberRequest,
  ListSubscribersParams,
} from '../types/subscriber';
import { subscriberMapper } from '../mappers/subscriber.mapper';

export interface SubscribersService {
  list(params?: ListSubscribersParams): Promise<PageResult<Subscriber>>;
  get(uniqueId: string): Promise<Subscriber>;
  create(data: CreateSubscriberRequest): Promise<Subscriber>;
  update(uniqueId: string, data: UpdateSubscriberRequest): Promise<Subscriber>;
  delete(uniqueId: string): Promise<void>;
}

export function createSubscribersService(transport: Transport, _config: { appId: string }): SubscribersService {
  return {
    async list(params?: ListSubscribersParams): Promise<PageResult<Subscriber>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.source) queryParams['source'] = params.source;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/subscribers', { params: queryParams });
      return decodePageResult(response, subscriberMapper);
    },

    async get(uniqueId: string): Promise<Subscriber> {
      const response = await transport.get<unknown>(`/subscribers/${uniqueId}`);
      return decodeOne(response, subscriberMapper);
    },

    async create(data: CreateSubscriberRequest): Promise<Subscriber> {
      const response = await transport.post<unknown>('/subscribers', {
        subscriber: {
          email: data.email,
          first_name: data.firstName,
          last_name: data.lastName,
          phone: data.phone,
          source: data.source,
          source_id: data.sourceId,
          payload: data.payload,
          tags: data.tags,
        },
      });
      return decodeOne(response, subscriberMapper);
    },

    async update(uniqueId: string, data: UpdateSubscriberRequest): Promise<Subscriber> {
      const response = await transport.put<unknown>(`/subscribers/${uniqueId}`, {
        subscriber: {
          email: data.email,
          first_name: data.firstName,
          last_name: data.lastName,
          phone: data.phone,
          source: data.source,
          enabled: data.enabled,
          status: data.status,
          payload: data.payload,
          tags: data.tags,
        },
      });
      return decodeOne(response, subscriberMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/subscribers/${uniqueId}`);
    },
  };
}
