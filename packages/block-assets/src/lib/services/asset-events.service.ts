import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  AssetEvent,
  CreateAssetEventRequest,
  UpdateAssetEventRequest,
  ListAssetEventsParams,
} from '../types/asset-event';
import type {
  EventReportParams,
  EventReportSummary,
  EventReportList,
} from '../types/report';
import { assetEventMapper } from '../mappers/asset-event.mapper';

export interface AssetEventsService {
  list(assetUniqueId: string, params?: ListAssetEventsParams): Promise<PageResult<AssetEvent>>;
  get(assetUniqueId: string, eventUniqueId: string): Promise<AssetEvent>;
  create(assetUniqueId: string, data: CreateAssetEventRequest): Promise<AssetEvent>;
  update(assetUniqueId: string, eventUniqueId: string, data: UpdateAssetEventRequest): Promise<AssetEvent>;
  reportList(params: EventReportParams): Promise<EventReportList>;
  reportSummary(params: EventReportParams): Promise<EventReportSummary>;
}

export function createAssetEventsService(transport: Transport, _config: { appId: string }): AssetEventsService {
  return {
    async list(assetUniqueId: string, params?: ListAssetEventsParams): Promise<PageResult<AssetEvent>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.eventType) queryParams['event_type'] = params.eventType;
      if (params?.startDate) queryParams['start_date'] = params.startDate.toISOString();
      if (params?.endDate) queryParams['end_date'] = params.endDate.toISOString();
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>(`/assets/${assetUniqueId}/events`, { params: queryParams });
      return decodePageResult(response, assetEventMapper);
    },

    async get(assetUniqueId: string, eventUniqueId: string): Promise<AssetEvent> {
      const response = await transport.get<unknown>(`/assets/${assetUniqueId}/events/${eventUniqueId}`);
      return decodeOne(response, assetEventMapper);
    },

    async create(assetUniqueId: string, data: CreateAssetEventRequest): Promise<AssetEvent> {
      const response = await transport.post<unknown>(`/assets/${assetUniqueId}/events`, {
        event: {
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

    async update(assetUniqueId: string, eventUniqueId: string, data: UpdateAssetEventRequest): Promise<AssetEvent> {
      const response = await transport.put<unknown>(`/assets/${assetUniqueId}/events/${eventUniqueId}`, {
        event: {
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

    async reportList(params: EventReportParams): Promise<EventReportList> {
      const response = await transport.post<any>('/reports/events/list', {
        start_date: params.startDate,
        end_date: params.endDate,
        event_type: params.eventType,
        asset_unique_id: params.assetUniqueId,
        page: params.page,
        per_page: params.perPage,
      });
      return {
        events: (response.events || []).map((e: any) => ({
          uniqueId: e.unique_id,
          assetUniqueId: e.asset_unique_id,
          eventType: e.event_type,
          description: e.description,
          occurredAt: new Date(e.occurred_at),
        })),
        summary: {
          totalEvents: response.summary.total_events,
          eventsByType: response.summary.events_by_type,
          period: {
            startDate: new Date(response.summary.period.start_date),
            endDate: new Date(response.summary.period.end_date),
          },
        },
        meta: {
          totalCount: response.meta.total_count,
          page: response.meta.page,
          perPage: response.meta.per_page,
          totalPages: response.meta.total_pages,
        },
      };
    },

    async reportSummary(params: EventReportParams): Promise<EventReportSummary> {
      const response = await transport.post<any>('/reports/events/summary', {
        start_date: params.startDate,
        end_date: params.endDate,
        event_type: params.eventType,
        asset_unique_id: params.assetUniqueId,
      });
      return {
        totalEvents: response.total_events,
        eventsByType: response.events_by_type,
        period: {
          startDate: new Date(response.period.start_date),
          endDate: new Date(response.period.end_date),
        },
      };
    },
  };
}
