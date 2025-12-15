import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  BusyBlock,
  CreateBusyBlockRequest,
  ListBusyBlocksParams,
} from '../types/busy-block';
import { busyBlockMapper } from '../mappers/busy-block.mapper';

export interface BusyBlocksService {
  list(userUniqueId: string, params?: ListBusyBlocksParams): Promise<PageResult<BusyBlock>>;
  create(userUniqueId: string, data: CreateBusyBlockRequest): Promise<BusyBlock>;
  delete(userUniqueId: string, id: string): Promise<void>;
}

export function createBusyBlocksService(transport: Transport, _config: { appId: string }): BusyBlocksService {
  return {
    async list(userUniqueId: string, params?: ListBusyBlocksParams): Promise<PageResult<BusyBlock>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.startTime) queryParams['start_time'] = params.startTime.toISOString();
      if (params?.endTime) queryParams['end_time'] = params.endTime.toISOString();
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>(`/users/${userUniqueId}/busy_blocks`, { params: queryParams });
      return decodePageResult(response, busyBlockMapper);
    },

    async create(userUniqueId: string, data: CreateBusyBlockRequest): Promise<BusyBlock> {
      const response = await transport.post<unknown>(`/users/${userUniqueId}/busy_blocks`, {
        busy_block: {
          title: data.title,
          description: data.description,
          start_time: data.startTime.toISOString(),
          end_time: data.endTime.toISOString(),
          all_day: data.allDay,
          recurring: data.recurring,
          recurrence_rule: data.recurrenceRule,
          payload: data.payload,
        },
      });
      return decodeOne(response, busyBlockMapper);
    },

    async delete(userUniqueId: string, id: string): Promise<void> {
      await transport.delete(`/users/${userUniqueId}/busy_blocks/${id}`);
    },
  };
}
