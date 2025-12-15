import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  AssetEvent,
  CreateAssetEventRequest,
  UpdateAssetEventRequest,
  ListAssetEventsParams,
} from '../types/asset-event';
import { assetEventMapper } from '../mappers/asset-event.mapper';

export interface AssetEventsService {
  list(params?: ListAssetEventsParams): Promise<PageResult<AssetEvent>>;
  get(uniqueId: string): Promise<AssetEvent>;
  create(data: CreateAssetEventRequest): Promise<AssetEvent>;
  update(uniqueId: string, data: UpdateAssetEventRequest): Promise<AssetEvent>;
  delete(uniqueId: string): Promise<void>;
  listByAsset(assetUniqueId: string, params?: ListAssetEventsParams): Promise<PageResult<AssetEvent>>;
}

export function createAssetEventsService(transport: Transport, _config: { appId: string }): AssetEventsService {
  return {
    async list(params?: ListAssetEventsParams): Promise<PageResult<AssetEvent>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.eventType) queryParams['event_type'] = params.eventType;
      if (params?.assetUniqueId) queryParams['asset_unique_id'] = params.assetUniqueId;
      if (params?.performedByUniqueId) queryParams['performed_by_unique_id'] = params.performedByUniqueId;
      if (params?.startDate) queryParams['start_date'] = params.startDate.toISOString();
      if (params?.endDate) queryParams['end_date'] = params.endDate.toISOString();
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/asset_events', { params: queryParams });
      return decodePageResult(response, assetEventMapper);
    },

    async get(uniqueId: string): Promise<AssetEvent> {
      const response = await transport.get<unknown>(`/asset_events/${uniqueId}`);
      return decodeOne(response, assetEventMapper);
    },

    async create(data: CreateAssetEventRequest): Promise<AssetEvent> {
      const response = await transport.post<unknown>('/asset_events', {
        asset_event: {
            asset_unique_id: data.assetUniqueId,
            event_type: data.eventType,
            event_date: data.eventDate.toISOString(),
            description: data.description,
            performed_by_unique_id: data.performedByUniqueId,
            cost: data.cost,
            notes: data.notes,
            payload: data.payload,
          },
      });
      return decodeOne(response, assetEventMapper);
    },

    async update(uniqueId: string, data: UpdateAssetEventRequest): Promise<AssetEvent> {
      const response = await transport.put<unknown>(`/asset_events/${uniqueId}`, {
        asset_event: {
            event_type: data.eventType,
            event_date: data.eventDate?.toISOString(),
            description: data.description,
            performed_by_unique_id: data.performedByUniqueId,
            cost: data.cost,
            notes: data.notes,
            enabled: data.enabled,
            status: data.status,
            payload: data.payload,
          },
      });
      return decodeOne(response, assetEventMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/asset_events/${uniqueId}`);
    },

    async listByAsset(assetUniqueId: string, params?: ListAssetEventsParams): Promise<PageResult<AssetEvent>> {
      const queryParams: Record<string, string> = {
        asset_unique_id: assetUniqueId,
      };
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.eventType) queryParams['event_type'] = params.eventType;
      if (params?.startDate) queryParams['start_date'] = params.startDate.toISOString();
      if (params?.endDate) queryParams['end_date'] = params.endDate.toISOString();
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/asset_events', { params: queryParams });
      return decodePageResult(response, assetEventMapper);
    },
  };
}
